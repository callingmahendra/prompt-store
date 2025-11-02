# Axiom Prompts

Comprehensive prompt management with advanced search, analytics, and chat integration for Visual Studio Code.

## Features

- **Prompt Library**: Browse and manage your AI prompts in a dedicated sidebar
- **Advanced Search**: Find prompts by title, content, tags, or author
- **Quick Access**: Use keyboard shortcuts to quickly access your prompts
- **Analytics**: Track usage and performance of your prompts
- **Chat Integration**: Send prompts directly to your AI chat interface

## Keyboard Shortcuts

- `Ctrl+Shift+Alt+P` (Mac: `Cmd+Shift+Alt+P`) - Show Axiom Prompts
- `Ctrl+Shift+Alt+F` (Mac: `Cmd+Shift+Alt+F`) - Search Prompts
- `Ctrl+Shift+Alt+Q` (Mac: `Cmd+Shift+Alt+Q`) - Quick Search
- `Ctrl+Shift+Alt+O` (Mac: `Cmd+Shift+Alt+O`) - Show Overview Dashboard

## Configuration

Configure the extension through VS Code settings:

- `promptLibrary.apiUrl`: URL of the prompt library API
- `promptLibrary.userId`: User ID for starring prompts
- `promptLibrary.defaultViewMode`: Default view mode for the prompt library
- `promptLibrary.itemsPerPage`: Number of prompts to load at once
- `promptLibrary.cacheDuration`: Cache duration in minutes
- `promptLibrary.autoRefresh`: Automatically refresh prompts on startup

## Requirements

- Visual Studio Code 1.90.0 or higher
- Access to a prompt library API server

## Installation

1. Download the `.vsix` file
2. Open VS Code
3. Go to Extensions view (`Ctrl+Shift+X`)
4. Click the "..." menu and select "Install from VSIX..."
5. Select the downloaded `.vsix` file

## License

MIT License - see [LICENSE](LICENSE) file for details.