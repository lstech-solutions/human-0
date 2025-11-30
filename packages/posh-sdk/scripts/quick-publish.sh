#!/bin/bash

# Quick Publish Script - Publishes current version to npm
# Use this when you've already bumped the version

set -e

echo "🚀 Quick Publish to npm"
echo "======================"
echo ""

# Load NPM token
if [ -f ".env" ]; then
  export $(grep NPM_ACCESS_TOKEN .env | xargs)
fi

# Get current version
VERSION=$(node -p "require('./package.json').version")
echo "📦 Publishing @human-0/posh-sdk@$VERSION"
echo ""

# Run pre-publish checks
echo "🧪 Running tests..."
npm test

echo ""
echo "🔨 Building..."
npm run build

echo ""
echo "📤 Publishing to npm..."
npm publish --access public

echo ""
echo "✅ Successfully published!"
echo ""
echo "🔗 View at: https://www.npmjs.com/package/@human-0/posh-sdk"
echo "📦 Install with: npm install @human-0/posh-sdk@$VERSION"
