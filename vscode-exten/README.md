# 📚 Axiom Prompts Extension

A comprehensive VS Code extension that provides seamless access to your prompt library with advanced features for browsing, searching, and managing prompts directly within your editor.

## ✨ Features

### 🎯 Core Functionality
- **Tree View Integration**: Browse prompts in the VS Code sidebar with multiple view modes
- **Advanced Search**: Powerful search capabilities with filtering by title, content, tags, and authors
- **Chat Integration**: Send prompts directly to VS Code chat with one click
- **Quick Actions**: Copy, star, and share prompts effortlessly

### 📊 Enhanced UI Components
- **Dashboard Overview**: Comprehensive statistics and analytics about your prompt library
- **Detailed Prompt View**: Rich webview with syntax highlighting and metadata
- **Settings Panel**: Easy configuration of API endpoints and preferences
- **Analytics Dashboard**: Detailed insights into prompt usage and library statistics

### 🔍 Smart Organization
- **Multiple View Modes**: 
  - Categories (grouped by tags)
  - Flat list (alphabetical)
  - By authors (grouped by creator)
  - Recent first (chronological)
- **Tag-based Browsing**: Explore prompts by categories and topics
- **Author Filtering**: Find prompts by specific authors
- **Usage Tracking**: Monitor which prompts are most popular

### ⚡ Quick Access
- **Keyboard Shortcuts**: Fast access to all major functions
- **Status Bar Integration**: Quick access to overview from status bar
- **Command Palette**: All commands available via Ctrl+Shift+P
- **Context Menus**: Right-click actions in tree view

## 🚀 Getting Started

### Installation
1. Package the extension: `vsce package`
2. Install the generated `.vsix` file in VS Code
3. The Axiom Prompts icon will appear in your Activity Bar

### First Time Setup
1. Click the Axiom Prompts icon in the Activity Bar
2. Click the settings gear icon to configure your API endpoint
3. Set your API URL (default: `http://localhost:3000/api/prompts`)
4. Set your User ID for personalization features

## 📖 Usage Guide

### Basic Operations
- **Browse Prompts**: Click the Axiom Prompts icon in the Activity Bar
- **Quick Search**: Use `Ctrl+Alt+F` (or `Cmd+Alt+F` on Mac) for instant search
- **View Overview**: Use `Ctrl+Alt+O` (or `Cmd+Alt+O` on Mac) to open the dashboard
- **Change View**: Click the view mode icon in the tree view header

### Working with Prompts
1. **View Details**: Click any prompt to open detailed view
2. **Copy to Clipboard**: Use the copy button or right-click menu
3. **Send to Chat**: Click the chat icon to use in VS Code chat
4. **Star Favorites**: Click the star icon to bookmark prompts

### Advanced Features
- **Search by Category**: Use the search interface to filter by tags
- **Browse by Author**: Group and filter prompts by their creators
- **View Analytics**: Access detailed statistics about your library
- **Export Data**: Export analytics data as CSV

## 🎮 Commands & Shortcuts

### Keyboard Shortcuts
| Shortcut | Command | Description |
|----------|---------|-------------|
| `Ctrl+Shift+P` | Show Prompts | Open prompt picker |
| `Ctrl+Alt+P` | Show Prompts | Alternative prompt picker |
| `Ctrl+Shift+F` | Search Prompts | Advanced search interface |
| `Ctrl+Alt+F` | Quick Search | Fast search with auto-complete |
| `Ctrl+Alt+O` | Show Overview | Open dashboard |

### Available Commands
- `Axiom Prompts: Show Prompts` - Opens the quick picker
- `Axiom Prompts: Show Overview Dashboard` - Opens the analytics dashboard
- `Axiom Prompts: Search Prompts` - Advanced search interface
- `Axiom Prompts: Quick Search` - Fast search functionality
- `Axiom Prompts: Browse by Tag` - Filter prompts by tags
- `Axiom Prompts: Browse by Author` - Filter prompts by authors
- `Axiom Prompts: Change View Mode` - Switch between view modes
- `Axiom Prompts: Open Settings` - Configure extension settings
- `Axiom Prompts: Show Analytics` - View detailed statistics

## ⚙️ Configuration

### Settings
Access settings via the gear icon in the tree view or through VS Code settings:

```json
{
  "promptLibrary.apiUrl": "http://localhost:3000/api/prompts",
  "promptLibrary.userId": "your-user-id",
  "promptLibrary.defaultViewMode": "categories",
  "promptLibrary.itemsPerPage": 50,
  "promptLibrary.cacheDuration": 5,
  "promptLibrary.autoRefresh": true
}
```

### API Configuration
- **API URL**: Your prompt library backend endpoint
- **User ID**: Unique identifier for personalization features
- **Cache Duration**: How long to cache data (in minutes)
- **Auto Refresh**: Automatically refresh on startup

### Display Preferences
- **Default View Mode**: How prompts are organized in the tree
- **Items Per Page**: Number of prompts to load at once

## 🔧 Development

### Prerequisites
- Node.js 16+
- VS Code 1.90.0+
- TypeScript 4.9+

### Setup
```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Package extension
vsce package
```

### Testing
1. Press `F5` to open Extension Development Host
2. Test all features in the development environment
3. Check console for any errors or warnings

## 🏗️ Architecture

### Core Components
- **PromptProvider**: Tree view data provider with multiple view modes
- **PromptService**: API communication and data management
- **WebviewProviders**: Rich UI components (Overview, Settings, Analytics)
- **SearchIntegration**: Advanced search and filtering capabilities
- **ChatIntegration**: VS Code chat system integration

### File Structure
```
src/
├── extension.ts          # Main extension entry point
├── promptProvider.ts     # Tree view provider
├── promptService.ts      # API service layer
├── promptWebview.ts      # Detailed prompt view
├── overviewWebview.ts    # Dashboard overview
├── settingsWebview.ts    # Configuration panel
├── analyticsWebview.ts   # Statistics dashboard
├── searchIntegration.ts  # Search functionality
└── chatIntegration.ts    # Chat system integration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Issues & Support

If you encounter any issues or have feature requests, please:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Include VS Code version and extension version
4. Provide steps to reproduce any bugs

## 🎉 Changelog

### Version 0.0.2 (Enhanced UI)
- ✨ Added dashboard overview with statistics
- ✨ Enhanced tree view with multiple view modes
- ✨ Added settings panel for configuration
- ✨ Implemented analytics dashboard
- ✨ Improved search with advanced filtering
- ✨ Added keyboard shortcuts for all major functions
- ✨ Enhanced webview with better styling
- ✨ Added usage tracking and analytics
- 🐛 Fixed various UI and performance issues

### Version 0.0.1 (Initial Release)
- 🎉 Initial release with basic functionality
- 📚 Tree view for browsing prompts
- 🔍 Basic search capabilities
- 💬 Chat integration
- ⭐ Star/favorite functionality