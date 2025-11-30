#!/bin/bash

# Quick NPM Authentication Checker

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "Checking NPM authentication..."
echo ""

if npm whoami > /dev/null 2>&1; then
    USERNAME=$(npm whoami)
    echo -e "${GREEN}✓ Authenticated as: ${USERNAME}${NC}"
    echo ""
    echo "You're ready to publish!"
    echo "Run: ./scripts/verify-and-publish.sh"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Not authenticated${NC}"
    echo ""
    echo "To authenticate, choose one method:"
    echo ""
    echo -e "${YELLOW}Method 1: Interactive Login (Recommended)${NC}"
    echo "  npm login"
    echo ""
    echo -e "${YELLOW}Method 2: Use Access Token${NC}"
    echo "  1. Go to: https://www.npmjs.com/settings/[username]/tokens"
    echo "  2. Click 'Generate New Token'"
    echo "  3. Choose 'Automation' type"
    echo "  4. Copy the token"
    echo "  5. Run: echo '//registry.npmjs.org/:_authToken=YOUR_TOKEN' > ~/.npmrc"
    echo ""
    echo "After authenticating, run this script again to verify."
    echo ""
    exit 1
fi
