#!/usr/bin/env node
/**
 * Post-build script to add .js extensions to relative imports in compiled JS files
 */
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function addJsExtensions(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await addJsExtensions(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      let content = await readFile(fullPath, 'utf-8');
      
      // Add .js to relative imports that don't already have it
      // Match: from './path' or from "../path" but not from 'package-name'
      const regex = /from\s+(['"])(\.\.?\/[^'"]+?)(?<!\.js)\1/g;
      content = content.replace(regex, "from $1$2.js$1");
      
      await writeFile(fullPath, content);
    }
  }
}

const distDir = join(process.cwd(), 'dist');
addJsExtensions(distDir)
  .then(() => console.log('✓ Added .js extensions to imports'))
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
