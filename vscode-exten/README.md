# Prompt Library VS Code Extension

A VS Code extension that allows you to access and use prompts directly in your IDE.

## Features

- Browse prompts in the sidebar
- Quick search and insert prompts using Command Palette
- Insert prompts directly into your active editor
- Star your favorite prompts
- View prompt details including tags, author, and ratings

## Usage

1. **View Prompts**: Click on the Prompt Library icon in the Activity Bar
2. **Quick Access**: Use `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the prompt picker
3. **Insert Prompt**: Click on any prompt in the sidebar or select from the quick picker to insert it into your active editor

## Commands

- `Prompt Library: Show Prompts` - Opens the quick picker to search and select prompts
- `Prompt Library: Insert Prompt` - Inserts a selected prompt into the active editor

## Configuration

The extension connects to your local prompt library backend at `http://localhost:3000/api/prompts` by default.

## Installation

1. Package the extension: `vsce package`
2. Install the generated `.vsix` file in VS Code

## Development

1. Install dependencies: `npm install`
2. Compile TypeScript: `npm run compile`
3. Press F5 to open a new Extension Development Host window