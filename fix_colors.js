const fs = require('fs');
const paths = [
  'src/app/(protected)/dashboard/page.tsx',
  'src/app/(protected)/customers/customers-client.tsx',
  'src/components/searchable-customers-table.tsx',
  'src/app/(protected)/products/products-client.tsx',
  'src/app/(protected)/users/users-client.tsx',
  'src/app/(protected)/account/page.tsx'
];

paths.forEach(p => {
  if (!fs.existsSync(p)) {
    console.log("Not found:", p);
    return;
  }
  let content = fs.readFileSync(p, 'utf8');
  
  // Replace dark variants with just their dark values for text
  content = content.replace(/text-gray-900\s+dark:text-white/g, 'text-white');
  content = content.replace(/text-gray-900\s+dark:text-purple-100/g, 'text-purple-100');
  content = content.replace(/text-gray-800\s+dark:text-white/g, 'text-white');
  content = content.replace(/text-gray-800\s+dark:text-gray-200/g, 'text-gray-200');
  content = content.replace(/text-gray-700\s+dark:text-gray-300/g, 'text-gray-300');
  content = content.replace(/text-gray-700\s+dark:text-gray-400/g, 'text-gray-300');
  content = content.replace(/text-gray-700\s+dark:text-white/g, 'text-white');
  content = content.replace(/text-gray-600\s+dark:text-gray-300/g, 'text-gray-300');
  content = content.replace(/text-gray-600\s+dark:text-gray-400/g, 'text-gray-400');
  content = content.replace(/text-gray-500\s+dark:text-gray-400/g, 'text-gray-400');
  content = content.replace(/text-purple-800\s+dark:text-purple-200/g, 'text-purple-200');
  content = content.replace(/text-purple-800\s+dark:text-purple-300/g, 'text-purple-300');
  content = content.replace(/text-purple-700\s+dark:text-purple-300/g, 'text-purple-300');
  content = content.replace(/text-purple-700\s+dark:text-purple-200/g, 'text-purple-200');
  content = content.replace(/text-purple-600\s+dark:text-purple-400/g, 'text-purple-400');

  // Any remaining dark text that might be unreadable
  content = content.replace(/\btext-gray-900\b/g, 'text-white');
  content = content.replace(/\btext-gray-800\b/g, 'text-gray-200');
  content = content.replace(/\btext-gray-700\b/g, 'text-gray-300');
  content = content.replace(/\btext-gray-600\b/g, 'text-gray-300');
  content = content.replace(/\btext-black\b/g, 'text-white');

  // Optional: simplify backgrounds for a cleaner dark UI
  content = content.replace(/bg-white\s+dark:bg-gray-800\/50/g, 'bg-gray-900/60');
  content = content.replace(/bg-white\s+dark:bg-gray-900\/50/g, 'bg-gray-900/60');
  content = content.replace(/bg-gray-50\s+dark:bg-gray-900/g, 'bg-gray-900');
  content = content.replace(/bg-gray-50\s+dark:bg-gray-800/g, 'bg-gray-800');
  content = content.replace(/bg-gray-50\s+dark:bg-gray-700\/50/g, 'bg-gray-800');

  // Clean up any double spaces that might have been created
  // REMOVED

  fs.writeFileSync(p, content);
  console.log("Updated:", p);
});
