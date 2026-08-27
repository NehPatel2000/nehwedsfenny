#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const SRC = path.join('src','components','GaneshIcon.tsx');
const OUT_DIR = 'public';
const OUT = path.join(OUT_DIR,'ganesh.svg');

async function run(){
  const src = await fs.readFile(SRC,'utf8');
  const start = src.indexOf('<svg');
  const end = src.lastIndexOf('</svg>');
  if(start === -1 || end === -1){
    console.error('SVG tag not found in', SRC);
    process.exit(1);
  }
  let svg = src.slice(start, end + 6);

  // Remove React-style <style>{`...`}</style> blocks
  svg = svg.replace(/<style>\{`[\s\S]*?`\}<\/style>/g, '');

  // Replace JSX className with class
  svg = svg.replace(/className=/g, 'class=');

  // Replace occurrences of currentColor with a baked favicon color
  svg = svg.replace(/currentColor/g, '#990000');

  // Remove any remaining JSX expressions like {color} or {...}
  svg = svg.replace(/\{[^}]*\}/g, '');

  // Ensure xmlns exists
  if(!/xmlns=/.test(svg)){
    svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(OUT, '<?xml version="1.0" encoding="UTF-8"?>\n' + svg, 'utf8');
  console.log('Wrote', OUT);
}

run().catch(err=>{ console.error(err); process.exit(1); });
