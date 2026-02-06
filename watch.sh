#!/bin/bash

echo "🎨 Starting SCSS watcher..."
echo "Watching for changes in *.scss files..."
echo "Press Ctrl+C to stop"
echo ""

# Use sass from PATH (e.g. brew install sass/sass/sass) or fall back to npx
if command -v sass &>/dev/null; then
  sass --watch styles.scss:styles.css --style=expanded --source-map
elif command -v npx &>/dev/null; then
  npx sass --watch styles.scss:styles.css --style=expanded --source-map
else
  echo "❌ No Sass compiler found. Install one of:"
  echo "   • Node.js (for npx sass): https://nodejs.org"
  echo "   • Dart Sass standalone:   brew install sass/sass/sass"
  exit 1
fi