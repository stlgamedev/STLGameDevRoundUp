#!/usr/bin/env node

/**
 * Post-build HTML processor - Replaces ALL emoji with Noto Emoji SVG img tags
 * Runs AFTER Hugo builds, processes html files
 * Handles all Unicode emoji including combined/ZWJ sequences
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const EMOJI_DIR = path.join(__dirname, '..', 'static', 'emoji');

/**
 * Convert emoji to Noto Emoji filename
 */
function emojiToFilename(emoji) {
  const codePoints = [];
  for (let i = 0; i < emoji.length; i++) {
    const codePoint = emoji.codePointAt(i);
    if (codePoint > 0xFFFF) i++;
    codePoints.push(codePoint.toString(16).toLowerCase());
  }
  return `emoji_u${codePoints.join('_')}.svg`;
}

/**
 * Check if emoji SVG exists (try with and without _fe0f)
 */
function getSvgFilename(emoji) {
  const filename = emojiToFilename(emoji);
  
  if (fs.existsSync(path.join(EMOJI_DIR, filename))) {
    return filename;
  }
  
  // Try without _fe0f (Noto doesn't include variation selectors)
  const withoutFe0f = filename.replace(/_fe0f/g, '');
  if (fs.existsSync(path.join(EMOJI_DIR, withoutFe0f))) {
    return withoutFe0f;
  }
  
  return filename; // Return original even if not found
}

/**
 * Replace all emoji in HTML with img tags
 */
function replaceEmojis(html) {
  // Comprehensive emoji regex - matches ALL Unicode emoji
  const emojiRegex = /([\u2600-\u27BF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]|\uD83E[\uDD00-\uDDFF]|[\u2300-\u23FF]|[\u2B50]|[\uD83C][\uDDE6-\uDDFF]{2})(\uFE0F)?(\u200D([\u2600-\u27BF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]|\uD83E[\uDD00-\uDDFF])(\uFE0F)?)*/g;
  
  let count = 0;
  
  const result = html.replace(emojiRegex, (match) => {
    // Skip if emoji is already inside an img tag
    const beforeMatch = html.substring(0, html.indexOf(match));
    const lastImgTag = beforeMatch.lastIndexOf('<img');
    const lastImgClose = beforeMatch.lastIndexOf('>');
    if (lastImgTag > lastImgClose) {
      return match; // Inside an img tag, skip
    }
    
    const filename = getSvgFilename(match);
    const escapedEmoji = match
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    
    count++;
    return `<img class="emoji" alt="${escapedEmoji}" src="/emoji/${filename}">`;
  });
  
  return { html: result, count };
}

/**
 * Process a single HTML file
 */
function processHtmlFile(filepath) {
  const html = fs.readFileSync(filepath, 'utf8');
  const { html: processed, count } = replaceEmojis(html);
  
  if (count > 0) {
    fs.writeFileSync(filepath, processed, 'utf8');
    return count;
  }
  
  return 0;
}

/**
 * Main function
 */
function main() {
  console.log('🔄 Post-processing HTML files for emoji...\n');
  
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`❌ Public directory not found: ${PUBLIC_DIR}`);
    console.error('   Run hugo build first!');
    process.exit(1);
  }
  
  // Find all HTML files
  const htmlFiles = glob.sync('**/*.html', { cwd: PUBLIC_DIR });
  
  if (htmlFiles.length === 0) {
    console.log('No HTML files found in public directory.');
    return;
  }
  
  console.log(`Found ${htmlFiles.length} HTML files to process`);
  
  let totalEmoji = 0;
  let filesWithEmoji = 0;
  
  htmlFiles.forEach(file => {
    const filepath = path.join(PUBLIC_DIR, file);
    const count = processHtmlFile(filepath);
    if (count > 0) {
      filesWithEmoji++;
      totalEmoji += count;
      console.log(`  ✅ ${file} (${count} emoji)`);
    }
  });
  
  console.log(`\n✨ Done! Processed ${totalEmoji} emoji across ${filesWithEmoji} files`);
}

main();
