#!/bin/bash

# PoSH SDK Publishing Script
# This script automates the publishing process

set -e  # Exit on error

echo "🚀 PoSH SDK Publishing Script"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Run this script from packages/posh-sdk/"
  exit 1
fi

# Check for clean git status
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Error: Git working directory is not clean"
  echo "Please commit or stash your changes first"
  git status --short
  exit 1
fi

# Load NPM token from .env
if [ -f ".env" ]; then
  export $(grep NPM_ACCESS_TOKEN .env | xargs)
else
  echo "❌ Error: .env file not found"
  exit 1
fi

if [ -z "$NPM_ACCESS_TOKEN" ]; then
  echo "❌ Error: NPM_ACCESS_TOKEN not found in .env"
  exit 1
fi

echo "✅ Environment check passed"
echo ""

# Run tests
echo "🧪 Running tests..."
npm test
echo "✅ Tests passed"
echo ""

# Run type checking
echo "🔍 Type checking..."
npm run typecheck
echo "✅ Type check passed"
echo ""

# Build
echo "🔨 Building..."
npm run build
echo "✅ Build successful"
echo ""

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: $CURRENT_VERSION"
echo ""

# Ask for version bump type
echo "Select version bump type:"
echo "1) Patch (bug fixes) - $CURRENT_VERSION → $(npm version patch --no-git-tag-version --dry-run | tail -1)"
echo "2) Minor (new features) - $CURRENT_VERSION → $(npm version minor --no-git-tag-version --dry-run | tail -1)"
echo "3) Major (breaking changes) - $CURRENT_VERSION → $(npm version major --no-git-tag-version --dry-run | tail -1)"
echo "4) Custom version"
echo "5) Skip version bump (publish current version)"
echo ""

read -p "Enter choice (1-5): " choice

case $choice in
  1)
    echo "📝 Bumping patch version..."
    npm version patch -m "chore: release v%s"
    ;;
  2)
    echo "📝 Bumping minor version..."
    npm version minor -m "chore: release v%s"
    ;;
  3)
    echo "📝 Bumping major version..."
    npm version major -m "chore: release v%s"
    ;;
  4)
    read -p "Enter custom version (e.g., 0.2.0-beta.1): " custom_version
    npm version $custom_version -m "chore: release v%s"
    ;;
  5)
    echo "⏭️  Skipping version bump"
    ;;
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

NEW_VERSION=$(node -p "require('./package.json').version")
echo "✅ Version: $NEW_VERSION"
echo ""

# Confirm publication
read -p "🚀 Publish @human-0/posh-sdk@$NEW_VERSION to npm? (y/n): " confirm

if [ "$confirm" != "y" ]; then
  echo "❌ Publication cancelled"
  exit 1
fi

# Publish to npm
echo "📤 Publishing to npm..."
npm publish --access public

echo ""
echo "✅ Successfully published @human-0/posh-sdk@$NEW_VERSION"
echo ""

# Push git tags
if [ "$choice" != "5" ]; then
  echo "📤 Pushing git tags..."
  git push && git push --tags
  echo "✅ Git tags pushed"
fi

echo ""
echo "🎉 Publication complete!"
echo ""
echo "Verify at: https://www.npmjs.com/package/@human-0/posh-sdk"
echo "Install with: npm install @human-0/posh-sdk@$NEW_VERSION"
