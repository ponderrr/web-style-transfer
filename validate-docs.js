const fs = require('fs');
const content = fs.readFileSync('docs/CLAUDE.md', 'utf8');

// Check for required elements
const hasStack =
  content.includes('stack') || content.includes('Node.js') || content.includes('TypeScript');
const hasFileInputs = content.includes('Required File Inputs');
const hasStepByStep = content.includes('Step-by-Step Tasks');
const hasDonts = content.includes("'Do Not' Rules");
const hasOutputs =
  content.includes('Expected Outputs') &&
  (content.includes('Storybook') || content.includes('storybook'));
const hasFailureHandling = content.includes('Error Handling') || content.includes('failure');

console.log('=== CLAUDE.md Quality Review Results ===');
console.log('✅ Stack:', hasStack);
console.log('✅ File Inputs:', hasFileInputs);
console.log('✅ Step-by-Step Tasks:', hasStepByStep);
console.log('✅ Do Not Rules:', hasDonts);
console.log('✅ Outputs (Storybook/Tests):', hasOutputs);
console.log('✅ Failure Handling:', hasFailureHandling);
console.log('');
console.log(
  '🎯 CLAUDE.md Status:',
  hasStack && hasFileInputs && hasStepByStep && hasDonts && hasOutputs && hasFailureHandling
    ? 'PASS ✅'
    : 'FAIL ❌'
);

// Clean up
fs.unlinkSync('validate-docs.js');
