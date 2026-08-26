export {
  analytical_thinking_quiz,
  analytical_thinking_logic,
  analytical_thinking_analogy,
  analytical_thinking_logic_grid,
  analytical_thinking_symbol_chain,
  analytical_thinking_series,
  analytical_thinking_reading
} from './analytical_thinking';

export { civil_servant_rules_quiz } from './civil_servant_rules';

// OCSC previously reused the legacy police English bank. Keep the subject
// empty until it receives its own purpose-built question sets.
export const english_quiz: QuizItem[] = [];
import type { QuizItem } from '@/lib/course-types';
