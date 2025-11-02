import * as vscode from 'vscode';
import { PromptService, Prompt } from './promptService';

export class AnalyticsWebviewProvider {
    public static currentPanel: AnalyticsWebviewProvider | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri, promptService: PromptService) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (AnalyticsWebviewProvider.currentPanel) {
            AnalyticsWebviewProvider.currentPanel._panel.reveal(column);
            AnalyticsWebviewProvider.currentPanel._update(promptService);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'promptAnalytics',
            'Prompt Library Analytics',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
            }
        );

        AnalyticsWebviewProvider.currentPanel = new AnalyticsWebviewProvider(panel, extensionUri, promptService);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, promptService: PromptService) {
        this._panel = panel;
        this._update(promptService);

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'refreshData':
                        this._update(promptService);
                        return;
                    case 'exportData':
                        await this.exportAnalytics(promptService);
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public dispose() {
        AnalyticsWebviewProvider.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private async _update(promptService: PromptService) {
        this._panel.title = 'Prompt Library Analytics';
        this._panel.webview.html = await this._getHtmlForWebview(promptService);
    }

    private async exportAnalytics(promptService: PromptService) {
        try {
            const prompts = await promptService.getPrompts();
            const analytics = this.generateAnalytics(prompts);
            
            const csvContent = this.convertToCSV(analytics);
            await vscode.env.clipboard.writeText(csvContent);
            vscode.window.showInformationMessage('Analytics data copied to clipboard as CSV!');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to export analytics: ${error}`);
        }
    }

    private convertToCSV(analytics: any): string {
        const headers = ['Metric', 'Value'];
        const rows = [
            ['Total Prompts', analytics.totalPrompts],
            ['Total Authors', analytics.totalAuthors],
            ['Total Tags', analytics.totalTags],
            ['Average Rating', analytics.averageRating.toFixed(2)],
            ['Total Usage Count', analytics.totalUsage],
            ['Most Popular Tag', analytics.mostPopularTag?.tag || 'N/A'],
            ['Most Productive Author', analytics.mostProductiveAuthor?.author || 'N/A'],
            ['Highest Rated Prompt', analytics.highestRatedPrompt?.title || 'N/A']
        ];

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    private async _getHtmlForWebview(promptService: PromptService) {
        const prompts = await promptService.getPrompts();
        const analytics = this.generateAnalytics(prompts);

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prompt Library Analytics</title>
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
        .analytics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .analytics-card {
            background-color: var(--vscode-sideBar-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 20px;
        }
        .card-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .metric-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        .metric-item:last-child {
            border-bottom: none;
        }
        .metric-label {
            color: var(--vscode-descriptionForeground);
        }
        .metric-value {
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
        }
        .chart-container {
            height: 200px;
            display: flex;
            align-items: end;
            justify-content: space-around;
            padding: 20px 0;
            border-top: 1px solid var(--vscode-panel-border);
            margin-top: 20px;
        }
        .chart-bar {
            background-color: var(--vscode-textLink-foreground);
            width: 40px;
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
        .top-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .top-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        .top-item:last-child {
            border-bottom: none;
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
    </style>
</head>
<body>
    <div class="header">
        <div class="title">📊 Prompt Library Analytics</div>
    </div>

    <div class="analytics-grid">
        <!-- Overview Metrics -->
        <div class="analytics-card">
            <div class="card-title">
                <span>📈</span>
                Overview Metrics
            </div>
            <div class="metric-item">
                <span class="metric-label">Total Prompts</span>
                <span class="metric-value">${analytics.totalPrompts}</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Total Authors</span>
                <span class="metric-value">${analytics.totalAuthors}</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Total Tags</span>
                <span class="metric-value">${analytics.totalTags}</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Average Rating</span>
                <span class="metric-value">${analytics.averageRating.toFixed(1)}/5</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Total Usage</span>
                <span class="metric-value">${analytics.totalUsage}</span>
            </div>
        </div>

        <!-- Quality Metrics -->
        <div class="analytics-card">
            <div class="card-title">
                <span>⭐</span>
                Quality Metrics
            </div>
            <div class="metric-item">
                <span class="metric-label">High Rated (4+ stars)</span>
                <span class="metric-value">${analytics.highRatedCount}</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Medium Rated (2-4 stars)</span>
                <span class="metric-value">${analytics.mediumRatedCount}</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Low Rated (<2 stars)</span>
                <span class="metric-value">${analytics.lowRatedCount}</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Most Starred</span>
                <span class="metric-value">${analytics.mostStarredPrompt?.title || 'N/A'}</span>
            </div>
        </div>

        <!-- Top Authors -->
        <div class="analytics-card">
            <div class="card-title">
                <span>👤</span>
                Top Authors
            </div>
            <ul class="top-list">
                ${analytics.topAuthors.slice(0, 5).map(author => `
                    <li class="top-item">
                        <span>${author.author}</span>
                        <span class="metric-value">${author.count} prompts</span>
                    </li>
                `).join('')}
            </ul>
        </div>

        <!-- Popular Tags -->
        <div class="analytics-card">
            <div class="card-title">
                <span>🏷️</span>
                Popular Tags
            </div>
            <ul class="top-list">
                ${analytics.popularTags.slice(0, 5).map(tag => `
                    <li class="top-item">
                        <span>#${tag.tag}</span>
                        <span class="metric-value">${tag.count} uses</span>
                    </li>
                `).join('')}
            </ul>
        </div>

        <!-- Usage Trends -->
        <div class="analytics-card">
            <div class="card-title">
                <span>📊</span>
                Usage Distribution
            </div>
            <div class="chart-container">
                ${analytics.usageDistribution.map(item => `
                    <div class="chart-bar" style="height: ${(item.count / analytics.maxUsage) * 150}px">
                        <div class="chart-value">${item.count}</div>
                        <div class="chart-label">${item.range}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Content Analysis -->
        <div class="analytics-card">
            <div class="card-title">
                <span>📝</span>
                Content Analysis
            </div>
            <div class="metric-item">
                <span class="metric-label">Average Content Length</span>
                <span class="metric-value">${analytics.averageContentLength} chars</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Longest Prompt</span>
                <span class="metric-value">${analytics.longestPrompt?.title || 'N/A'}</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Shortest Prompt</span>
                <span class="metric-value">${analytics.shortestPrompt?.title || 'N/A'}</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Most Tagged Prompt</span>
                <span class="metric-value">${analytics.mostTaggedPrompt?.title || 'N/A'}</span>
            </div>
        </div>
    </div>

    <div class="actions">
        <button onclick="refreshData()">🔄 Refresh Data</button>
        <button class="secondary" onclick="exportData()">📊 Export CSV</button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function refreshData() {
            vscode.postMessage({ command: 'refreshData' });
        }
        
        function exportData() {
            vscode.postMessage({ command: 'exportData' });
        }
    </script>
</body>
</html>`;
    }

    private generateAnalytics(prompts: Prompt[]) {
        const totalPrompts = prompts.length;
        const totalAuthors = new Set(prompts.map(p => p.author)).size;
        const allTags = prompts.flatMap(p => p.tags);
        const totalTags = new Set(allTags).size;
        const averageRating = prompts.reduce((sum, p) => sum + p.rating, 0) / totalPrompts || 0;
        const totalUsage = prompts.reduce((sum, p) => sum + (p.usageCount || 0), 0);

        // Quality metrics
        const highRatedCount = prompts.filter(p => p.rating >= 4).length;
        const mediumRatedCount = prompts.filter(p => p.rating >= 2 && p.rating < 4).length;
        const lowRatedCount = prompts.filter(p => p.rating < 2).length;

        // Top authors
        const authorCounts = new Map<string, number>();
        prompts.forEach(p => {
            authorCounts.set(p.author, (authorCounts.get(p.author) || 0) + 1);
        });
        const topAuthors = Array.from(authorCounts.entries())
            .map(([author, count]) => ({ author, count }))
            .sort((a, b) => b.count - a.count);

        // Popular tags
        const tagCounts = new Map<string, number>();
        allTags.forEach(tag => {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
        const popularTags = Array.from(tagCounts.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count);

        // Usage distribution
        const usageRanges = [
            { range: '0', min: 0, max: 0 },
            { range: '1-5', min: 1, max: 5 },
            { range: '6-10', min: 6, max: 10 },
            { range: '11-20', min: 11, max: 20 },
            { range: '21+', min: 21, max: Infinity }
        ];

        const usageDistribution = usageRanges.map(range => ({
            range: range.range,
            count: prompts.filter(p => {
                const usage = p.usageCount || 0;
                return usage >= range.min && usage <= range.max;
            }).length
        }));

        const maxUsage = Math.max(...usageDistribution.map(u => u.count));

        // Content analysis
        const averageContentLength = prompts.reduce((sum, p) => sum + p.content.length, 0) / totalPrompts || 0;
        const longestPrompt = prompts.reduce((longest, current) => 
            current.content.length > longest.content.length ? current : longest, prompts[0]);
        const shortestPrompt = prompts.reduce((shortest, current) => 
            current.content.length < shortest.content.length ? current : shortest, prompts[0]);
        const mostTaggedPrompt = prompts.reduce((mostTagged, current) => 
            current.tags.length > mostTagged.tags.length ? current : mostTagged, prompts[0]);

        // Most starred prompt
        const mostStarredPrompt = prompts.reduce((mostStarred, current) => 
            (current.stars?.length || 0) > (mostStarred.stars?.length || 0) ? current : mostStarred, prompts[0]);

        return {
            totalPrompts,
            totalAuthors,
            totalTags,
            averageRating,
            totalUsage,
            highRatedCount,
            mediumRatedCount,
            lowRatedCount,
            topAuthors,
            popularTags,
            usageDistribution,
            maxUsage,
            averageContentLength,
            longestPrompt,
            shortestPrompt,
            mostTaggedPrompt,
            mostStarredPrompt,
            mostPopularTag: popularTags[0],
            mostProductiveAuthor: topAuthors[0],
            highestRatedPrompt: prompts.reduce((highest, current) => 
                current.rating > highest.rating ? current : highest, prompts[0])
        };
    }
}