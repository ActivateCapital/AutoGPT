#!/bin/bash
# CreAI Database Migration Script for Railway
# Run this after deploying to Railway to set up the database

set -e

echo "🚀 CreAI Database Migration Script"
echo "===================================="
echo ""

# Check if we're in Railway environment
if [ -z "$RAILWAY_ENVIRONMENT" ]; then
    echo "⚠️  Warning: RAILWAY_ENVIRONMENT not set. Are you running this locally?"
    echo "   This script is designed to run in Railway environment."
    echo ""
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo "   Please ensure PostgreSQL is added to your Railway project"
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Navigate to the database package
echo "📁 Navigating to database package..."
cd packages/db || exit 1

echo "✅ Found packages/db directory"
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo "✅ Prisma Client generated"
echo ""

# Push database schema
echo "📊 Pushing database schema..."
npx prisma db push

echo "✅ Database schema pushed successfully"
echo ""

# Optional: Seed database with templates (uncomment if you have seed script)
# echo "🌱 Seeding database..."
# npx prisma db seed
# echo "✅ Database seeded"
# echo ""

echo "🎉 Database migration completed successfully!"
echo ""
echo "Next steps:"
echo "1. Verify your app is running at your Railway URL"
echo "2. Test authentication flow"
echo "3. Create a test agent"
echo "4. Set up Stripe webhook"
echo ""
