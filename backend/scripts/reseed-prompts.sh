#!/bin/bash

# Script to re-seed the database with prompts from the prompts folder
# This will clear existing prompts and reload them from the markdown files

echo "🔄 Re-seeding database with prompts from prompts folder..."

# Navigate to backend directory
cd "$(dirname "$0")/.."

# Run the seeding script
npm run seed-prompts

echo "✅ Database re-seeding completed!"