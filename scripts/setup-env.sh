#!/bin/bash
# EMA of BC Platform - Environment Setup Helper
# This script helps configure environment variables for development and production

set -e

echo "🚀 EMA of BC Platform - Environment Setup"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists"
    read -p "Overwrite? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env.local"
        exit 0
    fi
fi

echo ""
echo "📋 Supabase Configuration"
echo "========================"
echo "Get these from https://supabase.com → Project Settings → API"
echo ""

read -p "Enter Supabase Project URL (https://[project-id].supabase.co): " SUPABASE_URL
read -p "Enter Supabase Anon Key: " SUPABASE_ANON_KEY
read -p "Enter Supabase Service Role Key: " SUPABASE_SERVICE_ROLE_KEY

echo ""
echo "💳 Stripe Configuration (Test Mode)"
echo "===================================="
echo "Get these from https://stripe.com/test/keys"
echo ""

read -p "Enter Stripe Secret Key (sk_test_...): " STRIPE_SECRET_KEY
read -p "Enter Stripe Publishable Key (pk_test_...): " STRIPE_PUBLISHABLE_KEY
read -p "Enter Stripe Webhook Secret (whsec_...): " STRIPE_WEBHOOK_SECRET

echo ""
echo "🤖 xAI Grok API Configuration"
echo "=============================="
echo "Get your API key from https://console.x.ai"
echo ""

read -p "Enter xAI API Key: " XAI_API_KEY

echo ""
echo "📧 Resend Email Configuration"
echo "============================="
echo "Get your API key from https://resend.com/api-keys"
echo ""

read -p "Enter Resend API Key: " RESEND_API_KEY

echo ""
echo "🌐 Application Configuration"
echo "==========================="
read -p "Enter Site URL (http://localhost:3000 for dev, https://yourdomain.com for prod): " SITE_URL

# Create .env.local
cat > .env.local << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

# Stripe (Test Mode)
STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET

# xAI Grok API
XAI_API_KEY=$XAI_API_KEY
XAI_MODEL=grok-latest

# Resend Email Service
RESEND_API_KEY=$RESEND_API_KEY

# Application
NEXT_PUBLIC_SITE_URL=$SITE_URL
EOF

echo ""
echo "✅ Environment configuration saved to .env.local"
echo ""
echo "⚠️  IMPORTANT:"
echo "  - Never commit .env.local to git"
echo "  - Keep .env.local secure and backed up"
echo "  - For production, use environment variables in deployment platform"
echo ""
echo "Next steps:"
echo "  1. npm install"
echo "  2. npm run seed (if using Supabase)"
echo "  3. npm run dev"
echo ""
