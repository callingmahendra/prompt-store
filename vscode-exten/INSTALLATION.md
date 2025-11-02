# Installation and Troubleshooting Guide

## Installation Steps

1. **Install the Extension**
   ```bash
   code --install-extension axiom-prompts-0.0.2.vsix
   ```
   
   Or manually:
   - Open VS Code
   - Go to Extensions view (`Ctrl+Shift+X`)
   - Click "..." menu → "Install from VSIX..."
   - Select `axiom-prompts-0.0.2.vsix`

2. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   
   The server should start on `http://localhost:3000`

3. **Verify Installation**
   - Look for "Axiom Prompts" in the Explorer sidebar
   - Try the keyboard shortcut `Ctrl+Shift+Alt+P` (Mac: `Cmd+Shift+Alt+P`)
   - Check the Activity Bar for the book icon

## Troubleshooting

### Extension Not Showing

1. **Check Extension is Installed**
   - Go to Extensions view (`Ctrl+Shift+X`)
   - Search for "Axiom Prompts"
   - Ensure it's enabled

2. **Reload VS Code**
   - Press `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
   - Type "Developer: Reload Window"
   - Press Enter

3. **Check Activity Bar**
   - Look for the book icon in the Activity Bar (left side)
   - Click it to open the Axiom Prompts view

### No Prompts Showing

1. **Verify Backend is Running**
   ```bash
   curl http://localhost:3000/api/prompts
   ```
   Should return JSON with prompts

2. **Check Extension Settings**
   - Go to Settings (`Ctrl+,`)
   - Search for "promptLibrary"
   - Verify `promptLibrary.apiUrl` is set to `http://localhost:3000/api/prompts`

3. **Check Developer Console**
   - Press `Ctrl+Shift+P` → "Developer: Toggle Developer Tools"
   - Look for any error messages in the Console tab

### Backend Issues

1. **Start Backend Server**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Check Database**
   ```bash
   cd backend
   npm run seed-prompts
   ```

3. **Verify API Response**
   ```bash
   curl -v http://localhost:3000/api/prompts
   ```

## Configuration

### Extension Settings

- `promptLibrary.apiUrl`: API endpoint (default: `http://localhost:3000/api/prompts`)
- `promptLibrary.userId`: User ID for starring prompts (default: `vscode-user`)
- `promptLibrary.defaultViewMode`: View mode (default: `categories`)
- `promptLibrary.autoRefresh`: Auto-refresh on startup (default: `false`)

### Keyboard Shortcuts

- `Ctrl+Shift+Alt+P` - Show Axiom Prompts
- `Ctrl+Shift+Alt+F` - Search Prompts  
- `Ctrl+Shift+Alt+Q` - Quick Search
- `Ctrl+Shift+Alt+O` - Show Overview Dashboard

## Support

If you're still having issues:

1. Check the VS Code Developer Console for errors
2. Verify the backend server is running and accessible
3. Try reloading the VS Code window
4. Reinstall the extension if necessary