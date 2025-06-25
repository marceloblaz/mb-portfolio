#!/bin/bash

echo "🎨 Starting SCSS watcher..."
echo "Watching for changes in *.scss files..."
echo "Press Ctrl+C to stop"
echo ""

# Watch for changes in SCSS files and recompile automatically
npx sass --watch styles.scss:styles.css --style=expanded --source-map 