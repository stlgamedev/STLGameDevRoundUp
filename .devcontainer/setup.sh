#!/bin/sh
set -e

echo "🚀 Setting up STL Game Dev RoundUp development environment..."

# Install system dependencies
echo "📦 Installing system packages..."
sudo apk add --no-cache hugo nodejs npm

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Install sass-embedded globally for Hugo
echo "📦 Installing Dart Sass..."
sudo npm install -g sass-embedded

# Copy Bootstrap JavaScript files to assets
echo "📋 Copying Bootstrap files to assets..."
cp node_modules/bootstrap/dist/js/bootstrap.bundle.min.js assets/js/
cp node_modules/bootstrap/dist/js/bootstrap.bundle.js assets/js/

# Update PATH in .bashrc if not already done
if ! grep -q 'export PATH="/usr/local/bin:$PATH"' ~/.bashrc; then
    echo "🔧 Updating PATH in .bashrc..."
    echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.bashrc
fi

echo "✅ Setup complete! You can now run 'hugo server' to start the development server."
