import { getPabKnowledgeData } from './src/courses/pab/knowledge-loader.ts';

try {
  console.log('Testing getPabKnowledgeData("ministry_act")...');
  const data = getPabKnowledgeData('ministry_act');
  console.log('Result:', data ? `Success! Title: ${data.title}` : 'Failed to parse (returned null)');
} catch (err) {
  console.error('Error during execution:', err);
}
