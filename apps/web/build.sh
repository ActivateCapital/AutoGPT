#!/bin/bash
# Build script for Render deployment

set -e # Exit on error

echo "🚀 Starting CreAI Web build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run Next.js build
echo "🔨 Building Next.js app..."
npm run build

echo "✅ Build complete!"
