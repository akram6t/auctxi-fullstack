import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = {
  admin: ['Dashboard', 'Auctions', 'Teams', 'Players', 'Users', 'Payments', 'Reports', 'Settings'],
  manager: ['Dashboard', 'Auctions', 'Players', 'Payments', 'Reports'],
  client: ['Dashboard', 'Auctions', 'Players', 'Payments', 'Profile'],
  auth: ['Signup']
};

const baseDir = path.join(__dirname, '../src/pages');

Object.entries(pages).forEach(([role, pageNames]) => {
  pageNames.forEach(page => {
    const dir = path.join(baseDir, role, page);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const content = `import React from 'react';

const ${page} = () => {
  return (
    <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-800 p-6">
      <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">${role.charAt(0).toUpperCase() + role.slice(1)} ${page}</h2>
      <p className="text-secondary-600 dark:text-secondary-400">
        This is the ${page} page for the ${role} role. More details and features will be implemented here.
      </p>
    </div>
  );
};

export default ${page};
`;
    fs.writeFileSync(path.join(dir, `${page}.jsx`), content);
  });
});

console.log('Pages generated successfully!');
