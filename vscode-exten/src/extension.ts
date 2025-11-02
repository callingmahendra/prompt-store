import * as vscode from 'vscode';
import { PromptProvider } from './promptProvider';
import { PromptService } from './promptService';
import { PromptWebviewProvider } from './promptWebview';
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



    const starPromptCommand = vscode.commands.registerCommand('promptLibrary.starPrompt', async (promptItem: any) => {
        const starred = await promptService.starPrompt(promptItem.prompt.id);
        vscode.window.showInformationMessage(starred ? 'Prompt starred!' : 'Prompt unstarred!');
        promptProvider.refresh();
    });

    const copyPromptCommand = vscode.commands.registerCommand('promptLibrary.copyPrompt', (promptItem: any) => {
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
        await ChatIntegration.sendPromptToChat(promptItem.prompt);
    });

    const searchPromptsCommand = vscode.commands.registerCommand('promptLibrary.searchPrompts', async () => {
        await SearchIntegration.showSearchInterface(promptService, context.extensionUri);
    });

    // Note: Advanced chat integrations (variables, participants) require newer VSCode API
    // They will be available when VSCode updates its chat API to stable

    context.subscriptions.push(
        showPromptsCommand, 
        starPromptCommand, 
        copyPromptCommand, 
        refreshPromptsCommand,
        viewPromptCommand,
        sendToChatCommand,
        searchPromptsCommand
    );
}



export function deactivate() {}