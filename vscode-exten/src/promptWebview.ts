import * as vscode from 'vscode';
import { Prompt } from './promptService';

export class PromptWebviewProvider {
    public static currentPanel: PromptWebviewProvider | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri, prompt: Prompt) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (PromptWebviewProvider.currentPanel) {
            PromptWebviewProvider.currentPanel._panel.reveal(column);
            PromptWebviewProvider.currentPanel._update(prompt);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'promptDetail',
            `Prompt: ${prompt.title}`,
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
            }
        );

        PromptWebviewProvider.currentPanel = new PromptWebviewProvider(panel, extensionUri, prompt);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, prompt: Prompt) {
        this._panel = panel;
        this._update(prompt);

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'sendToChat':
                        // Import ChatIntegration dynamically to avoid circular dependency
                        import('./chatIntegration').then(({ ChatIntegration }) => {
                            ChatIntegration.sendPromptToChat(message.prompt);
                        });
                        return;
                    case 'copyPrompt':
                        vscode.env.clipboard.writeText(message.content);
                        vscode.window.showInformationMessage('Prompt copied to clipboard!');
                        return;
                }
            },
            null,
            this._disposables
        );
    }



    public dispose() {
        PromptWebviewProvider.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update(prompt: Prompt) {
        this._panel.title = `Prompt: ${prompt.title}`;
        this._panel.webview.html = this._getHtmlForWebview(prompt);
    }

    private _getHtmlForWebview(prompt: Prompt) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prompt Details</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
        }
        .header {
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .meta {
            display: flex;
            gap: 20px;
            margin-bottom: 10px;
            color: var(--vscode-descriptionForeground);
        }
        .tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 10px;
        }
        .tag {
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
        .content {
            background-color: var(--vscode-textCodeBlock-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            padding: 16px;
            margin: 20px 0;
            white-space: pre-wrap;
            font-family: var(--vscode-editor-font-family);
        }
        .actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .secondary {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        .secondary:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${prompt.title}</div>
        <div class="meta">
            <span>👤 ${prompt.author}</span>
            <span>📅 ${new Date(prompt.date).toLocaleDateString()}</span>
            <span>⭐ ${prompt.stars?.length || 0}</span>
            <span>💬 ${prompt.comments?.length || 0}</span>
        </div>
        <div class="tags">
            ${prompt.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <p>${prompt.description}</p>
    </div>
    
    <div class="content">${prompt.content}</div>
    
    <div class="actions">
        <button onclick="sendToChat()">💬 Send to Chat</button>
        <button class="secondary" onclick="copyPrompt()">📋 Copy to Clipboard</button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function sendToChat() {
            vscode.postMessage({
                command: 'sendToChat',
                prompt: ${JSON.stringify(prompt)}
            });
        }
        
        function copyPrompt() {
            vscode.postMessage({
                command: 'copyPrompt',
                content: ${JSON.stringify(prompt.content)}
            });
        }
    </script>
</body>
</html>`;
    }
}