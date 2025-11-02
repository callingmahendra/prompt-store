#!/bin/bash

echo "Installing dependencies..."
npm install

echo "Compiling TypeScript..."
npm run compile

echo "VS Code Extension is ready!"
echo ""
echo "To test the extension:"
echo "1. Open this folder in VS Code"
echo "2. Press F5 to launch Extension Development Host"
echo "3. In the new window, you'll see the Prompt Library in the sidebar"
echo ""
echo "To package for distribution:"
echo "1. Install vsce: npm install -g vsce"
echo "2. Package: vsce package"
echo "3. Install the generated .vsix file"