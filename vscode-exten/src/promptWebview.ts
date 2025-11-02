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
            async message => {
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
                    case 'starPrompt':
                        // Import PromptService dynamically
                        import('./promptService').then(async ({ PromptService }) => {
                            const service = new PromptService();
                            const starred = await service.starPrompt(message.promptId);
                            vscode.window.showInformationMessage(starred ? 'Prompt starred!' : 'Prompt unstarred!');
                        });
                        return;
                    case 'sharePrompt':
                        const shareText = `Check out this prompt: "${message.prompt.title}" by ${message.prompt.author}`;
                        vscode.env.clipboard.writeText(shareText);
                        vscode.window.showInformationMessage('Prompt info copied to clipboard for sharing!');
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
        const ratingStars = '⭐'.repeat(Math.floor(prompt.rating)) + '☆'.repeat(5 - Math.floor(prompt.rating));
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prompt Details</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            padding: 0;
            margin: 0;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            line-height: 1.6;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, var(--vscode-sideBar-background), var(--vscode-panel-background));
            border: 1px solid var(--vscode-panel-border);
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 15px;
            color: var(--vscode-textLink-foreground);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .title-icon {
            font-size: 24px;
        }
        .description {
            font-size: 16px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 20px;
            font-style: italic;
        }
        .meta-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px;
            background-color: var(--vscode-input-background);
            border-radius: 6px;
            border: 1px solid var(--vscode-input-border);
        }
        .meta-icon {
            font-size: 16px;
        }
        .meta-label {
            font-weight: bold;
            margin-right: 5px;
        }
        .rating {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .rating-stars {
            font-size: 18px;
        }
        .rating-number {
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
        }
        .tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 15px;
        }
        .tag {
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        .tag:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .content-section {
            background-color: var(--vscode-sideBar-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 12px;
            margin-bottom: 30px;
            overflow: hidden;
        }
        .content-header {
            background-color: var(--vscode-panel-background);
            padding: 15px 20px;
            border-bottom: 1px solid var(--vscode-panel-border);
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .content {
            padding: 20px;
            background-color: var(--vscode-textCodeBlock-background);
            white-space: pre-wrap;
            font-family: var(--vscode-editor-font-family);
            font-size: 14px;
            line-height: 1.5;
            border-radius: 0 0 12px 12px;
            max-height: 400px;
            overflow-y: auto;
        }
        .actions {
            display: flex;
            gap: 12px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
            transform: translateY(-1px);
        }
        .secondary {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        .secondary:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
        .stats-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }
        .stat-card {
            background-color: var(--vscode-sideBar-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
            display: block;
        }
        .stat-label {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-top: 5px;
        }
        .usage-info {
            background-color: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }
        .usage-title {
            font-weight: bold;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .scrollbar {
            scrollbar-width: thin;
            scrollbar-color: var(--vscode-scrollbarSlider-background) var(--vscode-scrollbarSlider-hoverBackground);
        }
        .scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .scrollbar::-webkit-scrollbar-track {
            background: var(--vscode-scrollbarSlider-hoverBackground);
        }
        .scrollbar::-webkit-scrollbar-thumb {
            background: var(--vscode-scrollbarSlider-background);
            border-radius: 4px;
        }
        .scrollbar::-webkit-scrollbar-thumb:hover {
            background: var(--vscode-scrollbarSlider-activeBackground);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">
                <span class="title-icon">📝</span>
                ${prompt.title}
            </div>
            <div class="description">${prompt.description}</div>
            
            <div class="meta-grid">
                <div class="meta-item">
                    <span class="meta-icon">👤</span>
                    <span class="meta-label">Author:</span>
                    <span>${prompt.author}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">📅</span>
                    <span class="meta-label">Date:</span>
                    <span>${new Date(prompt.date).toLocaleDateString()}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">⭐</span>
                    <span class="meta-label">Rating:</span>
                    <div class="rating">
                        <span class="rating-stars">${ratingStars}</span>
                        <span class="rating-number">${prompt.rating}/5</span>
                    </div>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">📊</span>
                    <span class="meta-label">Usage:</span>
                    <span>${prompt.usageCount || 0} times</span>
                </div>
            </div>
            
            <div class="tags">
                ${prompt.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
            </div>
        </div>

        <div class="stats-section">
            <div class="stat-card">
                <span class="stat-number">${prompt.stars?.length || 0}</span>
                <div class="stat-label">Stars</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">${prompt.comments?.length || 0}</span>
                <div class="stat-label">Comments</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">${prompt.content.length}</span>
                <div class="stat-label">Characters</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">${prompt.content.split('\\n').length}</span>
                <div class="stat-label">Lines</div>
            </div>
        </div>

        <div class="usage-info">
            <div class="usage-title">
                <span>💡</span>
                Usage Instructions
            </div>
            <p>Click "Send to Chat" to use this prompt in your current conversation, or "Copy to Clipboard" to paste it elsewhere. The usage counter will be automatically incremented when you use this prompt.</p>
        </div>
        
        <div class="content-section">
            <div class="content-header">
                <span>📄</span>
                Prompt Content
            </div>
            <div class="content scrollbar">${prompt.content}</div>
        </div>
        
        <div class="actions">
            <button onclick="sendToChat()">
                <span>💬</span>
                Send to Chat
            </button>
            <button class="secondary" onclick="copyPrompt()">
                <span>📋</span>
                Copy to Clipboard
            </button>
            <button class="secondary" onclick="starPrompt()">
                <span>⭐</span>
                ${prompt.stars?.length ? 'Starred' : 'Star Prompt'}
            </button>
            <button class="secondary" onclick="sharePrompt()">
                <span>🔗</span>
                Share
            </button>
        </div>
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
        
        function starPrompt() {
            vscode.postMessage({
                command: 'starPrompt',
                promptId: '${prompt.id}'
            });
        }
        
        function sharePrompt() {
            vscode.postMessage({
                command: 'sharePrompt',
                prompt: ${JSON.stringify(prompt)}
            });
        }
    </script>
</body>
</html>`;
    }
}