import * as vscode from 'vscode';
import { PromptProvider } from './promptProvider';
import { PromptService } from './promptService';
import { PromptWebviewProvider } from './promptWebview';

export function activate(context: vscode.ExtensionContext) {
    const promptService = new PromptService();
    const promptProvider = new PromptProvider(promptService);

    // Register tree data provider
    vscode.window.registerTreeDataProvider('promptLibrary', promptProvider);

    // Register commands
    const showPromptsCommand = vscode.commands.registerCommand('promptLibrary.showPrompts', async () => {
        const prompts = await promptService.getPrompts();
        const items = prompts.map(prompt => ({
            label: prompt.title,
            description: prompt.description,
            detail: `Tags: ${prompt.tags.join(', ')} | Author: ${prompt.author}`,
            prompt: prompt
        }));

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select a prompt to insert',
            matchOnDescription: true,
            matchOnDetail: true
        });

        if (selected) {
            insertPromptToEditor(selected.prompt.content);
        }
    });

    const insertPromptCommand = vscode.commands.registerCommand('promptLibrary.insertPrompt', (prompt: any) => {
        insertPromptToEditor(prompt.content);
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

    context.subscriptions.push(
        showPromptsCommand, 
        insertPromptCommand, 
        starPromptCommand, 
        copyPromptCommand, 
        refreshPromptsCommand,
        viewPromptCommand
    );
}

function insertPromptToEditor(content: string) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const position = editor.selection.active;
        editor.edit(editBuilder => {
            editBuilder.insert(position, content);
        });
        vscode.window.showInformationMessage('Prompt inserted successfully!');
    } else {
        vscode.window.showErrorMessage('No active editor found');
    }
}

export function deactivate() {}