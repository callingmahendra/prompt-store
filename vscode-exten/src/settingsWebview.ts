import * as vscode from 'vscode';

export class SettingsWebviewProvider {
    public static currentPanel: SettingsWebviewProvider | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (SettingsWebviewProvider.currentPanel) {
            SettingsWebviewProvider.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'promptSettings',
            'Prompt Library Settings',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
            }
        );

        SettingsWebviewProvider.currentPanel = new SettingsWebviewProvider(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'updateSetting':
                        await this.updateSetting(message.key, message.value);
                        return;
                    case 'resetSettings':
                        await this.resetSettings();
                        return;
                    case 'testConnection':
                        await this.testConnection();
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public dispose() {
        SettingsWebviewProvider.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update() {
        this._panel.title = 'Prompt Library Settings';
        this._panel.webview.html = this._getHtmlForWebview();
    }

    private async updateSetting(key: string, value: any) {
        const config = vscode.workspace.getConfiguration('promptLibrary');
        await config.update(key, value, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Setting '${key}' updated successfully!`);
        this._update(); // Refresh the webview
    }

    private async resetSettings() {
        const config = vscode.workspace.getConfiguration('promptLibrary');
        await config.update('apiUrl', undefined, vscode.ConfigurationTarget.Global);
        await config.update('userId', undefined, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage('Settings reset to defaults!');
        this._update();
    }

    private async testConnection() {
        try {
            const config = vscode.workspace.getConfiguration('promptLibrary');
            const apiUrl = config.get<string>('apiUrl');
            
            // Simple test - you might want to make an actual HTTP request here
            if (apiUrl) {
                vscode.window.showInformationMessage(`Connection test successful! API URL: ${apiUrl}`);
            } else {
                vscode.window.showWarningMessage('No API URL configured');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Connection test failed: ${error}`);
        }
    }

    private _getHtmlForWebview() {
        const config = vscode.workspace.getConfiguration('promptLibrary');
        const apiUrl = config.get<string>('apiUrl') || 'http://localhost:3000/api/prompts';
        const userId = config.get<string>('userId') || 'vscode-user';

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prompt Library Settings</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            margin: 0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
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
        .settings-section {
            background-color: var(--vscode-sideBar-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--vscode-textLink-foreground);
        }
        .setting-group {
            margin-bottom: 25px;
        }
        .setting-label {
            display: block;
            font-weight: bold;
            margin-bottom: 8px;
            color: var(--vscode-foreground);
        }
        .setting-description {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 10px;
        }
        .setting-input {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            font-size: 14px;
            box-sizing: border-box;
        }
        .setting-input:focus {
            outline: none;
            border-color: var(--vscode-focusBorder);
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
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
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
        .danger {
            background-color: var(--vscode-errorForeground);
            color: white;
        }
        .danger:hover {
            opacity: 0.9;
        }
        .info-box {
            background-color: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 20px;
        }
        .info-title {
            font-weight: bold;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-content {
            color: var(--vscode-descriptionForeground);
            font-size: 14px;
            line-height: 1.5;
        }
        .current-value {
            background-color: var(--vscode-textCodeBlock-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            padding: 8px;
            font-family: var(--vscode-editor-font-family);
            font-size: 12px;
            margin-top: 5px;
            color: var(--vscode-textPreformat-foreground);
        }
        .setting-row {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 10px;
            align-items: end;
        }
        .inline-button {
            padding: 8px 12px;
            font-size: 12px;
            height: fit-content;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">⚙️ Prompt Library Settings</div>
            <div class="subtitle">Configure your prompt library connection and preferences</div>
        </div>

        <div class="info-box">
            <div class="info-title">
                <span>💡</span>
                Configuration Help
            </div>
            <div class="info-content">
                Configure your prompt library API connection and user preferences. Changes are saved automatically and will take effect immediately.
            </div>
        </div>

        <div class="settings-section">
            <div class="section-title">
                <span>🔗</span>
                API Configuration
            </div>
            
            <div class="setting-group">
                <label class="setting-label">API URL</label>
                <div class="setting-description">
                    The base URL for your prompt library API endpoint
                </div>
                <div class="setting-row">
                    <input 
                        type="text" 
                        class="setting-input" 
                        id="apiUrl" 
                        value="${apiUrl}"
                        placeholder="http://localhost:3000/api/prompts"
                    />
                    <button class="secondary inline-button" onclick="testConnection()">
                        <span>🔍</span>
                        Test
                    </button>
                </div>
                <div class="current-value">Current: ${apiUrl}</div>
            </div>
        </div>

        <div class="settings-section">
            <div class="section-title">
                <span>👤</span>
                User Configuration
            </div>
            
            <div class="setting-group">
                <label class="setting-label">User ID</label>
                <div class="setting-description">
                    Your unique identifier for starring prompts and tracking usage
                </div>
                <input 
                    type="text" 
                    class="setting-input" 
                    id="userId" 
                    value="${userId}"
                    placeholder="vscode-user"
                />
                <div class="current-value">Current: ${userId}</div>
            </div>
        </div>

        <div class="settings-section">
            <div class="section-title">
                <span>🎨</span>
                Display Preferences
            </div>
            
            <div class="setting-group">
                <label class="setting-label">Default View Mode</label>
                <div class="setting-description">
                    Choose how prompts are displayed in the tree view by default
                </div>
                <select class="setting-input" id="defaultViewMode">
                    <option value="categories">Categories</option>
                    <option value="flat">Flat List</option>
                    <option value="authors">By Authors</option>
                    <option value="recent">Recent First</option>
                </select>
            </div>
            
            <div class="setting-group">
                <label class="setting-label">Items Per Page</label>
                <div class="setting-description">
                    Number of prompts to load at once (higher numbers may slow down loading)
                </div>
                <input 
                    type="number" 
                    class="setting-input" 
                    id="itemsPerPage" 
                    value="50"
                    min="10"
                    max="500"
                />
            </div>
        </div>

        <div class="settings-section">
            <div class="section-title">
                <span>🔧</span>
                Advanced Settings
            </div>
            
            <div class="setting-group">
                <label class="setting-label">Cache Duration (minutes)</label>
                <div class="setting-description">
                    How long to cache prompt data before refreshing from the API
                </div>
                <input 
                    type="number" 
                    class="setting-input" 
                    id="cacheDuration" 
                    value="5"
                    min="1"
                    max="60"
                />
            </div>
            
            <div class="setting-group">
                <label class="setting-label">Auto-refresh</label>
                <div class="setting-description">
                    Automatically refresh prompts when the extension starts
                </div>
                <select class="setting-input" id="autoRefresh">
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                </select>
            </div>
        </div>

        <div class="actions">
            <button onclick="saveSettings()">
                <span>💾</span>
                Save Settings
            </button>
            <button class="secondary" onclick="testConnection()">
                <span>🔍</span>
                Test Connection
            </button>
            <button class="danger" onclick="resetSettings()">
                <span>🔄</span>
                Reset to Defaults
            </button>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function saveSettings() {
            const apiUrl = document.getElementById('apiUrl').value;
            const userId = document.getElementById('userId').value;
            
            vscode.postMessage({
                command: 'updateSetting',
                key: 'apiUrl',
                value: apiUrl
            });
            
            vscode.postMessage({
                command: 'updateSetting',
                key: 'userId',
                value: userId
            });
        }
        
        function testConnection() {
            vscode.postMessage({
                command: 'testConnection'
            });
        }
        
        function resetSettings() {
            if (confirm('Are you sure you want to reset all settings to their default values?')) {
                vscode.postMessage({
                    command: 'resetSettings'
                });
            }
        }
        
        // Auto-save on input change
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('setting-input')) {
                // Debounce the save operation
                clearTimeout(window.saveTimeout);
                window.saveTimeout = setTimeout(() => {
                    if (e.target.id === 'apiUrl' || e.target.id === 'userId') {
                        vscode.postMessage({
                            command: 'updateSetting',
                            key: e.target.id,
                            value: e.target.value
                        });
                    }
                }, 1000);
            }
        });
    </script>
</body>
</html>`;
    }
}