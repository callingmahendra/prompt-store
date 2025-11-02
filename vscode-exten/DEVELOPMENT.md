# VS Code Extension Development Guide

## Project Structure

```
vscode-exten/
├── src/
│   ├── extension.ts          # Main extension entry point
│   ├── promptProvider.ts     # Tree view provider for sidebar
│   ├── promptService.ts      # API service for backend communication
│   ├── promptWebview.ts      # Webview for detailed prompt viewing
│   └── config.ts            # Configuration management
├── .vscode/
│   ├── launch.json          # Debug configuration
│   └── tasks.json           # Build tasks
├── package.json             # Extension manifest
├── tsconfig.json           # TypeScript configuration
└── README.md               # User documentation
```

## Features Implemented

1. **Sidebar Integration**: Prompts appear in VS Code sidebar
2. **Quick Picker**: Command palette integration for fast prompt access
3. **Context Menus**: Right-click actions on prompts
4. **Webview Details**: Rich prompt viewing with syntax highlighting
5. **Configuration**: Customizable API URL and user settings
6. **Actions**: Insert, copy, star, and refresh prompts

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Compile TypeScript:
   ```bash
   npm run compile
   ```

3. Debug the extension:
   - Open this folder in VS Code
   - Press F5 to launch Extension Development Host
   - Test the extension in the new window

## API Integration

The extension connects to your prompt library backend at:
- Default: `http://localhost:3000/api/prompts`
- Configurable via VS Code settings

## Commands Available

- `Prompt Library: Show Prompts` - Quick picker for prompt selection
- `Prompt Library: Insert Prompt` - Insert selected prompt into editor
- `Prompt Library: Star Prompt` - Toggle star status
- `Prompt Library: Copy Prompt` - Copy to clipboard
- `Prompt Library: Refresh` - Reload prompts from API
- `Prompt Library: View Prompt Details` - Open detailed webview

## Configuration Options

```json
{
  "promptLibrary.apiUrl": "http://localhost:3000/api/prompts",
  "promptLibrary.userId": "vscode-user"
}
```

## Packaging for Distribution

1. Install vsce globally:
   ```bash
   npm install -g vsce
   ```

2. Package the extension:
   ```bash
   vsce package
   ```

3. Install the generated `.vsix` file in VS Code

## Testing

Make sure your backend server is running on `http://localhost:3000` before testing the extension.