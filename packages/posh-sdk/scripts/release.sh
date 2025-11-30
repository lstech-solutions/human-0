#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the release type (patch, minor, major)
RELEASE_TYPE=${1:-patch}

if [[ ! "$RELEASE_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo -e "${RED}Error: Invalid release type. Use: patch, minor, or major${NC}"
  exit 1
fi

echo -e "${YELLOW}🚀 Starting PoSH SDK release process...${NC}"

# Ensure we're in the posh-sdk directory
cd "$(dirname "$0")/.."

# Check if working directory is clean
if [[ -n $(git status -s) ]]; then
  echo -e "${RED}Error: Working directory is not clean. Commit or stash changes first.${NC}"
  exit 1
fi

# Ensure we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo -e "${RED}Error: Must be on main branch to release. Current branch: $CURRENT_BRANCH${NC}"
  exit 1
fi

# Pull latest changes
echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
git pull origin main

# Run tests
echo -e "${YELLOW}🧪 Running tests...${NC}"
pnpm run test

# Run linter
echo -e "${YELLOW}🔍 Running linter...${NC}"
pnpm run lint

# Build
echo -e "${YELLOW}🔨 Building package...${NC}"
pnpm run build

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}Current version: $CURRENT_VERSION${NC}"

# Bump version
echo -e "${YELLOW}📦 Bumping $RELEASE_TYPE version...${NC}"
npm version $RELEASE_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}New version: $NEW_VERSION${NC}"

# Update CHANGELOG
echo -e "${YELLOW}📝 Don't forget to update CHANGELOG.md!${NC}"
echo -e "${YELLOW}Press Enter when ready to continue...${NC}"
read

# Commit changes
echo -e "${YELLOW}💾 Committing version bump...${NC}"
git add package.json CHANGELOG.md
git commit -m "chore(posh-sdk): release v$NEW_VERSION"

# Create and push tag
echo -e "${YELLOW}🏷️  Creating tag posh-sdk-v$NEW_VERSION...${NC}"
git tag "posh-sdk-v$NEW_VERSION" -m "Release @human-0/posh-sdk v$NEW_VERSION"

# Push changes and tag
echo -e "${YELLOW}⬆️  Pushing to GitHub...${NC}"
git push origin main
git push origin "posh-sdk-v$NEW_VERSION"

echo -e "${GREEN}✅ Release process complete!${NC}"
echo -e "${GREEN}🎉 CI will now build and publish v$NEW_VERSION to npm${NC}"
echo -e "${GREEN}📦 Track progress: https://github.com/lstech-solutions/human-0.com/actions${NC}"
