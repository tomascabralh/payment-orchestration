#!/bin/sh

# Install dependencies
npm install
cd src/astro && npm install

# Generate Prisma client
cd ../.. && npx prisma generate

# Start the application
cd src/astro && npm run dev -- --host 0.0.0.0 