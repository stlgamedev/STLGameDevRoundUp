#!/bin/sh
# Build script for STL Game Dev RoundUp
# This runs Hugo and then post-processes emoji to SVG

# Ensure sass is in PATH for Hugo's Dart Sass
export PATH=/usr/local/bin:$PATH

echo "🔨 Building site with Hugo..."
hugo

echo ""
echo "🎨 Post-processing emoji..."
node scripts/postprocess-emoji.js
