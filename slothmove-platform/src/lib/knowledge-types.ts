export type KnowledgeStatMap = {
  chapters?: number;
  parts?: number;
  vocab?: number;
  quiz?: number;
};

export type KnowledgeCard = {
  icon?: string;
  title?: string;
  content?: string;
  color?: string;
};

export type KnowledgeTableRow = string[];

export type KnowledgeTimelineStep = {
  step?: string;
  title?: string;
  badge?: string;
  badgeColor?: string;
  desc?: string;
};

export type KnowledgeBlock = {
  type: string;
  color?: string;
  title?: string;
  content?: string;
  text?: string;
  cards?: KnowledgeCard[];
  headers?: string[];
  rows?: KnowledgeTableRow[];
  items?: string[];
  steps?: KnowledgeTimelineStep[];
};

export type KnowledgeSection = {
  navIcon?: string;
  navLabel?: string;
  icon?: string;
  title?: string;
  description?: string;
  blocks?: KnowledgeBlock[];
};

export type VocabularyTerm = {
  term: string;
  eng?: string;
  def?: string;
};

export type VocabularyGroup = {
  icon?: string;
  groupTitle?: string;
  category?: string;
  terms?: VocabularyTerm[];
};

export type CourseKnowledgeData = {
  id: string;
  title: string;
  titleShort?: string;
  emoji?: string;
  subtitle?: string;
  badgeLabel?: string;
  stats?: KnowledgeStatMap;
  knowledgeSections?: KnowledgeSection[];
  vocabularyGroups?: VocabularyGroup[];
  tips?: string[];
  related?: string[];
};
