import { getSupabaseServer } from './supabase-server';

export type ExamSetData = {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number | null;
  total_questions: number;
};

export type ExamQuestionData = {
  id: string;
  position: number;
  category: string;
  prompt: string;
  choices: string[];
  media: {
    src?: string;
    alt?: string;
    choiceImages?: Array<{
      src: string;
      alt: string;
    }>;
  } | null;
  correctChoiceIndex: number;
  explanation: string;
  tip: string | null;
};

export type ExamBundle = {
  examSet: ExamSetData;
  questions: ExamQuestionData[];
};

export type CatalogExamSet = {
  id: string;
  title: string;
  description: string | null;
  access_type: 'free' | 'paid';
  duration_minutes: number | null;
  total_questions: number;
  product_id: string | null;
  price: number;
  metadata?: { catalog_order?: number } | null;
};

export async function getPublishedExamCatalog(
  courseId: string,
  subjectId: string
): Promise<CatalogExamSet[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('exam_sets')
    .select('id,title,description,access_type,duration_minutes,total_questions,product_id,metadata,products(price)')
    .eq('course_id', courseId)
    .eq('subject_id', subjectId)
    .eq('is_published', true)
    .order('created_at');

  if (error) throw new Error(`Unable to load exam catalog: ${error.message}`);
  return (data ?? []).map((examSet) => ({
    ...examSet,
    price: Array.isArray(examSet.products)
      ? Number(examSet.products[0]?.price ?? 0)
      : Number((examSet.products as { price?: number } | null)?.price ?? 0)
  })).sort((left, right) => {
    const leftOrder = left.metadata?.catalog_order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.metadata?.catalog_order ?? Number.MAX_SAFE_INTEGER;
    const leftSetNumber = Number(left.title.match(/ชุดที่\s*(\d+)/)?.[1] ?? Number.MAX_SAFE_INTEGER);
    const rightSetNumber = Number(right.title.match(/ชุดที่\s*(\d+)/)?.[1] ?? Number.MAX_SAFE_INTEGER);
    return leftOrder - rightOrder || leftSetNumber - rightSetNumber || left.id.localeCompare(right.id);
  }) as CatalogExamSet[];
}

export type ExamAccessSummary = CatalogExamSet & { canAccess: boolean };

export async function getExamAccessSummary(examSetId: string): Promise<ExamAccessSummary | null> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('exam_sets')
    .select('id,title,description,access_type,duration_minutes,total_questions,product_id,products(price)')
    .eq('id', examSetId)
    .eq('is_published', true)
    .maybeSingle();

  if (error) throw new Error(`Unable to load exam access: ${error.message}`);
  if (!data) return null;

  const { data: canAccess, error: accessError } = await supabase.rpc('can_access_exam_set', {
    target_exam_set_id: examSetId
  });
  if (accessError) throw new Error(`Unable to check exam access: ${accessError.message}`);

  const product = Array.isArray(data.products) ? data.products[0] : data.products;
  return {
    ...data,
    price: Number((product as { price?: number } | null)?.price ?? 0),
    canAccess: Boolean(canAccess)
  } as ExamAccessSummary;
}

export async function getPublishedExamBundle(examSetId: string): Promise<ExamBundle | null> {
  const supabase = await getSupabaseServer();

  const [examResponse, mappingsResponse] = await Promise.all([
    supabase
      .from('exam_sets')
      .select('id,title,description,duration_minutes,total_questions')
      .eq('id', examSetId)
      .eq('is_published', true)
      .single(),
    supabase
      .from('exam_set_questions')
      .select('question_id,position')
      .eq('exam_set_id', examSetId)
      .order('position')
  ]);

  if (examResponse.error) throw new Error(`Unable to load exam set ${examSetId}: ${examResponse.error.message}`);
  if (!examResponse.data) return null;
  if (mappingsResponse.error) throw new Error(`Unable to load exam mappings ${examSetId}: ${mappingsResponse.error.message}`);
  if (!mappingsResponse.data?.length) return null;

  const questionIds = mappingsResponse.data.map((mapping) => mapping.question_id);
  const [questionResponse, solutionResponse] = await Promise.all([
    supabase
      .from('questions')
      .select('id,category,prompt,choices,media')
      .in('id', questionIds),
    supabase
      .from('question_solutions')
      .select('question_id,correct_choice_index,explanation,tip')
      .in('question_id', questionIds)
  ]);

  if (questionResponse.error) throw new Error(`Unable to load exam questions ${examSetId}: ${questionResponse.error.message}`);
  if (solutionResponse.error) throw new Error(`Unable to load exam solutions ${examSetId}: ${solutionResponse.error.message}`);

  const questionById = new Map((questionResponse.data ?? []).map((question) => [question.id, question]));
  const solutionById = new Map((solutionResponse.data ?? []).map((solution) => [solution.question_id, solution]));
  const questions = mappingsResponse.data.flatMap((mapping) => {
    const question = questionById.get(mapping.question_id);
    const solution = solutionById.get(mapping.question_id);
    if (!question || !solution || !Array.isArray(question.choices)) return [];

    return [{
      id: question.id,
      position: mapping.position,
      category: question.category,
      prompt: question.prompt,
      choices: question.choices.map(String),
      media: question.media && typeof question.media === 'object' ? question.media : null,
      correctChoiceIndex: solution.correct_choice_index,
      explanation: solution.explanation,
      tip: solution.tip
    } satisfies ExamQuestionData];
  });

  if (questions.length !== mappingsResponse.data.length) {
    throw new Error(`Incomplete exam bundle ${examSetId}: expected ${mappingsResponse.data.length}, received ${questions.length}`);
  }
  return { examSet: examResponse.data as ExamSetData, questions };
}
