# Chat Integration Features

Your Prompt Library extension now includes direct integration with GitHub Copilot Chat and other VSCode chat interfaces.

## New Features

### 1. Send to Chat Button
- Each prompt in the tree view now has a "Send to Chat" button (💬 icon)
- Click it to automatically copy the prompt and open the chat interface

### 2. Enhanced Quick Pick
When you use `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to show prompts, you now get:
- Interactive buttons on each prompt item
- Quick actions: Send to Chat, Copy to Clipboard
- Improved visual design with icons

### 3. Advanced Search Functionality
- **Search All Fields**: Search across title, description, content, author, and tags
- **Targeted Search**: Search by specific fields (title, tags, content, author)
- **Browse by Tag**: Select from available tags to filter prompts
- **Browse by Author**: Select from available authors to see their prompts
- **Search Results Interface**: Interactive results with action buttons

### 3. Multiple Chat Integration Methods
The extension tries multiple approaches to integrate with chat:

1. **Direct Integration**: Attempts to use VSCode's chat commands
2. **Clipboard + Auto-paste**: Copies prompt and tries to paste it in chat
3. **Fallback**: Copies to clipboard with instructions for manual pasting

### 4. Supported Chat Interfaces
- GitHub Copilot Chat
- VSCode built-in chat panel
- Other chat extensions that use standard VSCode commands

## How to Use

### From Tree View
1. Browse your prompts in the Prompt Library panel
2. Click the 💬 "Send to Chat" icon next to any prompt
3. The chat interface opens with your prompt ready to send

### From Quick Pick
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P`)
2. Either:
   - Click the 💬 button on any prompt item, OR
   - Select a prompt and choose "Send to Chat" from the action menu

### From Command Palette
1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "Prompt Library: Send to Chat"
3. Select your prompt and it will be sent to chat

### Search Functionality
1. **Quick Search**: Press `Ctrl+Shift+F` (or `Cmd+Shift+F`) for instant search
2. **Advanced Search**: Use "Prompt Library: Search Prompts" from command palette
3. **Browse Mode**: Select "Browse by Tag" or "Browse by Author" for organized browsing
4. **Search Types**:
   - Search all fields (default)
   - Search by title only
   - Search by tags only
   - Search by content only
   - Search by author only

## Keyboard Shortcuts
- `Ctrl+Shift+P` / `Cmd+Shift+P`: Show prompt library (existing)
- `Ctrl+Alt+P` / `Cmd+Alt+P`: Quick access to prompt library (new)
- `Ctrl+Shift+F` / `Cmd+Shift+F`: Search prompts (new)

## Troubleshooting

If the chat integration doesn't work automatically:
1. The prompt will be copied to your clipboard
2. Manually open GitHub Copilot Chat
3. Paste the prompt with `Ctrl+V` / `Cmd+V`
4. Press Enter to send

## Future Enhancements
When VSCode's Chat API becomes stable, we'll add:
- Chat variables (use `@prompts` in chat)
- Chat participants for interactive prompt browsing
- Direct message sending without clipboard