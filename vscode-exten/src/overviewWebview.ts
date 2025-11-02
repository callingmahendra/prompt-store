import * as vscode from 'vscode';
import { PromptService, Prompt } from './promptService';

export class OverviewWebviewProvider {
    public static currentPanel: OverviewWebviewProvider | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri, promptService: PromptService) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (OverviewWebviewProvider.currentPanel) {
            OverviewWebviewProvider.currentPanel._panel.reveal(column);
            OverviewWebviewProvider.currentPanel._update(promptService);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'promptOverview',
            'Prompt Library Overview',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
            }
        );

        OverviewWebviewProvider.currentPanel = new OverviewWebviewProvider(panel, extensionUri, promptService);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, promptService: PromptService) {
        this._panel = panel;
        this._update(promptService);

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'searchPrompts':
                        vscode.commands.executeCommand('promptLibrary.searchPrompts');
                        return;
                    case 'refreshData':
                        this._update(promptService);
                        return;
                    case 'viewPrompt':
                        const prompt = await promptService.getPrompt(message.promptId);
                        if (prompt) {
                            vscode.commands.executeCommand('promptLibrary.viewPrompt', { prompt });
                        }
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public dispose() {
        OverviewWebviewProvider.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private async _update(promptService: PromptService) {
        this._panel.title = 'Prompt Library Overview';
        this._panel.webview.html = await this._getHtmlForWebview(promptService);
    }

    private async _getHtmlForWebview(promptService: PromptService) {
        const prompts = await promptService.getPrompts();
        const stats = this.calculateStats(prompts);
        const recentPrompts = prompts
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
        const topRatedPrompts = prompts
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prompt Library Overview</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            margin: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid var(--vscode-panel-border);
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
            color: var(--vscode-textLink-foreground);
        }
        .subtitle {
            color: var(--vscode-descriptionForeground);
            font-size: 16px;
        }
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background-color: var(--vscode-sideBar-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: bold;
        }
        .card-icon {
            margin-right: 10px;
            font-size: 20px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        .stat-item {
            text-align: center;
            padding: 15px;
            background-color: var(--vscode-input-background);
            border-radius: 6px;
            border: 1px solid var(--vscode-input-border);
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
        .prompt-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .prompt-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            margin-bottom: 8px;
            background-color: var(--vscode-input-background);
            border-radius: 4px;
            border: 1px solid var(--vscode-input-border);
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .prompt-item:hover {
            background-color: var(--vscode-list-hoverBackground);
        }
        .prompt-info {
            flex: 1;
        }
        .prompt-title {
            font-weight: bold;
            margin-bottom: 4px;
        }
        .prompt-meta {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }
        .prompt-rating {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .tag-cloud {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .tag {
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            cursor: pointer;
        }
        .tag:hover {
            opacity: 0.8;
        }
        .actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            justify-content: center;
        }
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
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
        .chart-container {
            height: 200px;
            display: flex;
            align-items: end;
            justify-content: space-around;
            padding: 20px 0;
            border-top: 1px solid var(--vscode-panel-border);
        }
        .chart-bar {
            background-color: var(--vscode-textLink-foreground);
            width: 30px;
            border-radius: 4px 4px 0 0;
            position: relative;
            transition: all 0.3s ease;
        }
        .chart-bar:hover {
            opacity: 0.8;
        }
        .chart-label {
            position: absolute;
            bottom: -25px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            color: var(--vscode-descriptionForeground);
            white-space: nowrap;
        }
        .chart-value {
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            color: var(--vscode-foreground);
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">📚 Prompt Library Dashboard</div>
        <div class="subtitle">Your comprehensive prompt management center</div>
    </div>

    <div class="dashboard">
        <!-- Statistics Card -->
        <div class="card">
            <div class="card-header">
                <span class="card-icon">📊</span>
                Library Statistics
            </div>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-number">${stats.totalPrompts}</span>
                    <div class="stat-label">Total Prompts</div>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${stats.totalAuthors}</span>
                    <div class="stat-label">Authors</div>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${stats.totalTags}</span>
                    <div class="stat-label">Unique Tags</div>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${stats.averageRating.toFixed(1)}</span>
                    <div class="stat-label">Avg Rating</div>
                </div>
            </div>
        </div>

        <!-- Recent Prompts Card -->
        <div class="card">
            <div class="card-header">
                <span class="card-icon">🕒</span>
                Recent Prompts
            </div>
            <ul class="prompt-list">
                ${recentPrompts.map(prompt => `
                    <li class="prompt-item" onclick="viewPrompt('${prompt.id}')">
                        <div class="prompt-info">
                            <div class="prompt-title">${prompt.title}</div>
                            <div class="prompt-meta">${prompt.author} • ${new Date(prompt.date).toLocaleDateString()}</div>
                        </div>
                        <div class="prompt-rating">
                            <span>⭐</span>
                            <span>${prompt.rating}</span>
                        </div>
                    </li>
                `).join('')}
            </ul>
        </div>

        <!-- Top Rated Prompts Card -->
        <div class="card">
            <div class="card-header">
                <span class="card-icon">⭐</span>
                Top Rated Prompts
            </div>
            <ul class="prompt-list">
                ${topRatedPrompts.map(prompt => `
                    <li class="prompt-item" onclick="viewPrompt('${prompt.id}')">
                        <div class="prompt-info">
                            <div class="prompt-title">${prompt.title}</div>
                            <div class="prompt-meta">${prompt.author}</div>
                        </div>
                        <div class="prompt-rating">
                            <span>⭐</span>
                            <span>${prompt.rating}</span>
                        </div>
                    </li>
                `).join('')}
            </ul>
        </div>

        <!-- Popular Tags Card -->
        <div class="card">
            <div class="card-header">
                <span class="card-icon">🏷️</span>
                Popular Tags
            </div>
            <div class="tag-cloud">
                ${stats.popularTags.map(tag => `
                    <span class="tag" onclick="searchByTag('${tag.tag}')">${tag.tag} (${tag.count})</span>
                `).join('')}
            </div>
        </div>

        <!-- Category Distribution Chart -->
        <div class="card">
            <div class="card-header">
                <span class="card-icon">📈</span>
                Category Distribution
            </div>
            <div class="chart-container">
                ${stats.categoryDistribution.slice(0, 8).map(cat => `
                    <div class="chart-bar" style="height: ${(cat.count / stats.maxCategoryCount) * 150}px">
                        <div class="chart-value">${cat.count}</div>
                        <div class="chart-label">${cat.category}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Quick Actions Card -->
        <div class="card">
            <div class="card-header">
                <span class="card-icon">⚡</span>
                Quick Actions
            </div>
            <div class="actions">
                <button onclick="searchPrompts()">🔍 Search Prompts</button>
                <button class="secondary" onclick="refreshData()">🔄 Refresh Data</button>
            </div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function searchPrompts() {
            vscode.postMessage({ command: 'searchPrompts' });
        }
        
        function refreshData() {
            vscode.postMessage({ command: 'refreshData' });
        }
        
        function viewPrompt(promptId) {
            vscode.postMessage({ command: 'viewPrompt', promptId: promptId });
        }
        
        function searchByTag(tag) {
            // This would trigger a search for the specific tag
            vscode.postMessage({ command: 'searchPrompts', query: tag, searchBy: 'tags' });
        }
    </script>
</body>
</html>`;
    }

    private calculateStats(prompts: Prompt[]) {
        const totalPrompts = prompts.length;
        const totalAuthors = new Set(prompts.map(p => p.author)).size;
        const allTags = prompts.flatMap(p => p.tags);
        const totalTags = new Set(allTags).size;
        const averageRating = prompts.reduce((sum, p) => sum + p.rating, 0) / totalPrompts || 0;

        // Calculate tag frequency
        const tagCounts = new Map<string, number>();
        allTags.forEach(tag => {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });

        const popularTags = Array.from(tagCounts.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Calculate category distribution (using first tag as category)
        const categoryCounts = new Map<string, number>();
        prompts.forEach(prompt => {
            const category = prompt.tags[0] || 'Uncategorized';
            categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
        });

        const categoryDistribution = Array.from(categoryCounts.entries())
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count);

        const maxCategoryCount = Math.max(...categoryDistribution.map(c => c.count));

        return {
            totalPrompts,
            totalAuthors,
            totalTags,
            averageRating,
            popularTags,
            categoryDistribution,
            maxCategoryCount
        };
    }
}