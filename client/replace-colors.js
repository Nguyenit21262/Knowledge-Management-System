import { replaceInFileSync } from 'replace-in-file';

const options = {
  files: 'src/**/*.{js,jsx,css}',
  from: [
    /#fbf1dd/g, // bg-amber-100 equivalent for tags/badges
    /#f0e3c8/g, // hover bg-amber-200 equivalent
    /#faf6eb/g, // admin search input bg
    /#f6f1eb/g, // login main bg
    /#faf6f1/g, // login card bg
    /#e6ddd1/g, // login card border
    /#7e6f63/g, // login text-slate-500 equivalent
    /#8b7c6f/g, // login text-slate-400 equivalent
    /#0f2245/g, // login text-slate-900 equivalent (dark blue though, might keep or change to standard slate-900)
    /#243b72/g, // primary button (dark blue)
    /#1d315d/g, // primary button hover
    /#f59e0b/g, // text amber-500
    /#d97706/g, // document active border
    /#1b2e5c/g, // admin sidebar bg
    /#37508b/g, // admin sidebar active/hover
    /#253b6e/g, // solid blue 
    /bg-amber-/g,
    /text-amber-/g,
    /border-\[#f59e0b\]/g
  ],
  to: [
    '#e0e7ff', // indigo-100 for tags/badges
    '#c7d2fe', // indigo-200 hover 
    '#ffffff', // admin search input bg -> white
    '#f6f9ff', // main bg match theme
    '#ffffff', // login card bg
    '#e2e8f0', // login card border (slate-200)
    '#64748b', // text-slate-500
    '#94a3b8', // text-slate-400
    '#0f172a', // text-slate-900
    '#3b82f6', // primary button (blue-500)
    '#2563eb', // primary button hover (blue-600)
    '#3b82f6', // text blue-500
    '#2563eb', // active border
    '#0f172a', // admin sidebar bg (slate-900)
    '#1e293b', // admin sidebar active/hover
    '#3b82f6', // solid blue
    'bg-blue-', // replace amber utilities
    'text-blue-', // replace amber utilities
    'border-blue-500'
  ],
};

try {
  const results = replaceInFileSync(options);
  console.log('Replacement results:', results.filter(r => r.hasChanged).map(r => r.file));
}
catch (error) {
  console.error('Error occurred:', error);
}
