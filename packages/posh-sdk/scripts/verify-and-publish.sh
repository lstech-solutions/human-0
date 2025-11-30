#!/bin/bash

# NPM Verification and Publishing Script
# This script verifies authentication and package readiness before publishing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}NPM Package Verification & Publishing${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Check if authenticated
echo -e "${YELLOW}Step 1: Checking NPM authentication...${NC}"
if npm whoami > /dev/null 2>&1; then
    USERNAME=$(npm whoami)
    echo -e "${GREEN}✓ Authenticated as: ${USERNAME}${NC}"
else
    echo -e "${RED}✗ Not authenticated with NPM${NC}"
    echo ""
    echo "Please authenticate first using one of these methods:"
    echo ""
    echo "Method 1: Interactive login"
    echo "  npm login"
    echo ""
    echo "Method 2: Use an access token"
    echo "  1. Create token at: https://www.npmjs.com/settings/[username]/tokens"
    echo "  2. Choose 'Automation' type with publish permissions"
    echo "  3. Run: echo '//registry.npmjs.org/:_authToken=YOUR_TOKEN' > ~/.npmrc"
    echo ""
    exit 1
fi

echo ""

# Step 2: Check package name availability
echo -e "${YELLOW}Step 2: Checking package name availability...${NC}"
PACKAGE_NAME=$(node -p "require('./package.json').name")
echo "Package name: ${PACKAGE_NAME}"

if npm view "${PACKAGE_NAME}" > /dev/null 2>&1; then
    echo -e "${RED}✗ Package '${PACKAGE_NAME}' already exists on NPM${NC}"
    echo ""
    echo "This package is already published. To update it:"
    echo "  1. Bump the version: npm version patch|minor|major"
    echo "  2. Run this script again"
    echo ""
    exit 1
else
    echo -e "${GREEN}✓ Package name '${PACKAGE_NAME}' is available${NC}"
fi

echo ""

# Step 3: Verify package.json
echo -e "${YELLOW}Step 3: Verifying package.json...${NC}"

# Check required fields
REQUIRED_FIELDS=("name" "version" "description" "main" "types")
MISSING_FIELDS=()

for field in "${REQUIRED_FIELDS[@]}"; do
    if ! node -p "require('./package.json').${field}" > /dev/null 2>&1; then
        MISSING_FIELDS+=("$field")
    fi
done

if [ ${#MISSING_FIELDS[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ All required fields present${NC}"
    
    # Display package info
    VERSION=$(node -p "require('./package.json').version")
    DESCRIPTION=$(node -p "require('./package.json').description")
    echo "  Name: ${PACKAGE_NAME}"
    echo "  Version: ${VERSION}"
    echo "  Description: ${DESCRIPTION}"
else
    echo -e "${RED}✗ Missing required fields: ${MISSING_FIELDS[*]}${NC}"
    exit 1
fi

echo ""

# Step 4: Run tests
echo -e "${YELLOW}Step 4: Running tests...${NC}"
if npm test > /dev/null 2>&1; then
    echo -e "${GREEN}✓ All tests passed${NC}"
else
    echo -e "${RED}✗ Tests failed${NC}"
    echo "Fix test failures before publishing"
    exit 1
fi

echo ""

# Step 5: Build package
echo -e "${YELLOW}Step 5: Building package...${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

echo ""

# Step 6: Check dist directory
echo -e "${YELLOW}Step 6: Verifying build output...${NC}"
if [ -d "dist" ]; then
    FILE_COUNT=$(find dist -type f | wc -l)
    echo -e "${GREEN}✓ Build output exists (${FILE_COUNT} files)${NC}"
else
    echo -e "${RED}✗ No dist directory found${NC}"
    exit 1
fi

echo ""

# Step 7: Create tarball for inspection
echo -e "${YELLOW}Step 7: Creating package tarball...${NC}"
TARBALL=$(npm pack 2>&1 | tail -1)
if [ -f "${TARBALL}" ]; then
    SIZE=$(du -h "${TARBALL}" | cut -f1)
    echo -e "${GREEN}✓ Tarball created: ${TARBALL} (${SIZE})${NC}"
    
    # Show what will be published
    echo ""
    echo "Files that will be published:"
    tar -tzf "${TARBALL}" | head -20
    
    FILE_COUNT=$(tar -tzf "${TARBALL}" | wc -l)
    if [ ${FILE_COUNT} -gt 20 ]; then
        echo "... and $((FILE_COUNT - 20)) more files"
    fi
else
    echo -e "${RED}✗ Failed to create tarball${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ All checks passed!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 8: Confirm and publish
echo -e "${YELLOW}Ready to publish ${PACKAGE_NAME}@${VERSION}${NC}"
echo ""
read -p "Do you want to publish now? (yes/no): " CONFIRM

if [ "${CONFIRM}" = "yes" ] || [ "${CONFIRM}" = "y" ]; then
    echo ""
    echo -e "${YELLOW}Publishing to NPM...${NC}"
    
    if npm publish --access public; then
        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}✓ Successfully published!${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo "Package URL: https://www.npmjs.com/package/${PACKAGE_NAME}"
        echo ""
        echo "Users can now install with:"
        echo "  npm install ${PACKAGE_NAME}"
        echo ""
        
        # Clean up tarball
        rm -f "${TARBALL}"
    else
        echo ""
        echo -e "${RED}✗ Publishing failed${NC}"
        echo "Check the error message above for details"
        exit 1
    fi
else
    echo ""
    echo "Publishing cancelled."
    echo "The tarball ${TARBALL} has been created for inspection."
    echo "Run 'npm publish --access public' when ready."
    echo ""
fi
