import * as vscode from 'vscode';
import { PromptProvider } from './promptProvider';
import { PromptService } from './promptService';
import { PromptWebviewProvider } from './promptWebview';
import { OverviewWebviewProvider } from './overviewWebview';
import { SettingsWebviewProvider } from './settingsWebview';
import { AnalyticsWebviewProvider } from './analyticsWebview';
import { ChatIntegration } from './chatIntegration';
import { SearchIntegration } from './searchIntegration';

export function activate(context: vscode.ExtensionContext) {
    const promptService = new PromptService();
    const promptProvider = new PromptProvider(promptService);

    // Register tree data provider
    vscode.window.registerTreeDataProvider('promptLibrary', promptProvider);

    // Register commands
    const showPromptsCommand = vscode.commands.registerCommand('promptLibrary.showPrompts', async () => {
        const prompts = await promptService.getPrompts();
        await ChatIntegration.showPromptQuickPick(prompts);
    });

    const showOverviewCommand = vscode.commands.registerCommand('promptLibrary.showOverview', () => {
        OverviewWebviewProvider.createOrShow(context.extensionUri, promptService);
    });

    const showSettingsCommand = vscode.commands.registerCommand('promptLibrary.showSettings', () => {
        SettingsWebviewProvider.createOrShow(context.extensionUri);
    });

    const showAnalyticsCommand = vscode.commands.registerCommand('promptLibrary.showAnalytics', () => {
        AnalyticsWebviewProvider.createOrShow(context.extensionUri, promptService);
    });

    const changeViewModeCommand = vscode.commands.registerCommand('promptLibrary.changeViewMode', async () => {
        const viewMode = await vscode.window.showQuickPick([
            { label: '📁 Categories', description: 'Group prompts by tags', value: 'categories' },
            { label: '📄 Flat List', description: 'Show all prompts in a simple list', value: 'flat' },
            { label: '👤 By Authors', description: 'Group prompts by author', value: 'authors' },
            { label: '🕒 Recent First', description: 'Show most recent prompts first', value: 'recent' }
        ], {
            placeHolder: 'Select view mode for prompt library'
        });

        if (viewMode) {
            promptProvider.setViewMode(viewMode.value as any);
        }
    });

    const starPromptCommand = vscode.commands.registerCommand('promptLibrary.starPrompt', async (promptItem: any) => {
        const starred = await promptService.starPrompt(promptItem.prompt.id);
        vscode.window.showInformationMessage(starred ? 'Prompt starred!' : 'Prompt unstarred!');
        promptProvider.refresh();
    });

    const copyPromptCommand = vscode.commands.registerCommand('promptLibrary.copyPrompt', async (promptItem: any) => {
        await promptService.trackUsage(promptItem.prompt.id);
        vscode.env.clipboard.writeText(promptItem.prompt.content);
        vscode.window.showInformationMessage('Prompt copied to clipboard!');
    });

    const refreshPromptsCommand = vscode.commands.registerCommand('promptLibrary.refreshPrompts', () => {
        promptProvider.refresh();
        vscode.window.showInformationMessage('Prompts refreshed!');
    });

    const viewPromptCommand = vscode.commands.registerCommand('promptLibrary.viewPrompt', (promptItem: any) => {
        PromptWebviewProvider.createOrShow(context.extensionUri, promptItem.prompt);
    });

    const sendToChatCommand = vscode.commands.registerCommand('promptLibrary.sendToChat', async (promptItem: any) => {
        await promptService.trackUsage(promptItem.prompt.id);
        await ChatIntegration.sendPromptToChat(promptItem.prompt);
    });

    const searchPromptsCommand = vscode.commands.registerCommand('promptLibrary.searchPrompts', async () => {
        await SearchIntegration.showSearchInterface(promptService, context.extensionUri);
    });

    const quickSearchCommand = vscode.commands.registerCommand('promptLibrary.quickSearch', async () => {
        await SearchIntegration.quickSearch(promptService);
    });

    const browseByTagCommand = vscode.commands.registerCommand('promptLibrary.browseByTag', async () => {
        const tags = await promptService.getAllTags();
        const selectedTag = await vscode.window.showQuickPick(
            tags.map(tag => ({ label: `#${tag}`, value: tag })),
            { placeHolder: 'Select a tag to browse' }
        );
        
        if (selectedTag) {
            const prompts = await promptService.getPromptsByTag(selectedTag.value);
            await ChatIntegration.showPromptQuickPick(prompts);
        }
    });

    const browseByAuthorCommand = vscode.commands.registerCommand('promptLibrary.browseByAuthor', async () => {
        const authors = await promptService.getAllAuthors();
        const selectedAuthor = await vscode.window.showQuickPick(
            authors.map(author => ({ label: `👤 ${author}`, value: author })),
            { placeHolder: 'Select an author to browse' }
        );
        
        if (selectedAuthor) {
            const prompts = await promptService.getPromptsByAuthor(selectedAuthor.value);
            await ChatIntegration.showPromptQuickPick(prompts);
        }
    });

    // Status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'promptLibrary.showOverview';
    statusBarItem.text = '$(book) Prompts';
    statusBarItem.tooltip = 'Open Prompt Library Overview';
    statusBarItem.show();

    // Auto-refresh on startup
    const config = vscode.workspace.getConfiguration('promptLibrary');
    if (config.get('autoRefresh', true)) {
        promptProvider.refresh();
    }

    context.subscriptions.push(
        showPromptsCommand,
        showOverviewCommand,
        showSettingsCommand,
        showAnalyticsCommand,
        changeViewModeCommand,
        starPromptCommand, 
        copyPromptCommand, 
        refreshPromptsCommand,
        viewPromptCommand,
        sendToChatCommand,
        searchPromptsCommand,
        quickSearchCommand,
        browseByTagCommand,
        browseByAuthorCommand,
        statusBarItem
    );
}



export function deactivate() {}