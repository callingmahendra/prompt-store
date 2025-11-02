import * as vscode from 'vscode';
import { PromptService } from './promptService';

export class ChatIntegration {
    private static promptService = new PromptService();
    
    /**
     * Send a prompt directly to the chat interface
     */
    static async sendPromptToChat(prompt: any): Promise<void> {
        try {
            // Track usage when prompt is sent to chat
            await this.promptService.trackUsage(prompt.id);
            
            // Method 1: Try to use available chat commands
            await this.sendToChatAPI(prompt);
        } catch (error) {
            console.log('Primary method failed, using fallback:', error);
            // Method 2: Fallback to opening chat and copying to clipboard
            await this.sendToChatFallback(prompt);
        }
    }

    /**
     * Primary method: Use available VSCode chat commands
     */
    private static async sendToChatAPI(prompt: any): Promise<void> {
        // Copy prompt to clipboard first
        await vscode.env.clipboard.writeText(prompt.content);
        
        // Try different chat commands in order of preference
        const chatCommands = [
            'github.copilot.chat.focus',
            'workbench.panel.chat.view.copilot.focus',
            'workbench.view.extension.github-copilot-chat',
            'workbench.panel.chat.focus'
        ];

        let chatOpened = false;
        for (const command of chatCommands) {
            try {
                await vscode.commands.executeCommand(command);
                chatOpened = true;
                break;
            } catch (error) {
                console.log(`Command ${command} failed:`, error);
                continue;
            }
        }

        if (!chatOpened) {
            throw new Error('Could not open chat interface');
        }

        // Wait for the chat to open and focus
        await new Promise(resolve => setTimeout(resolve, 300));

        // Try to paste the content
        try {
            await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
            vscode.window.showInformationMessage(
                `Prompt "${prompt.title}" pasted into chat. Press Enter to send.`
            );
        } catch (pasteError) {
            // If paste fails, just show the message
            vscode.window.showInformationMessage(
                `Chat opened. Prompt "${prompt.title}" is in clipboard - paste it manually (Cmd/Ctrl+V).`
            );
        }
    }

    /**
     * Fallback method: Copy to clipboard and open chat with instructions
     */
    private static async sendToChatFallback(prompt: any): Promise<void> {
        // Copy the prompt content to clipboard
        await vscode.env.clipboard.writeText(prompt.content);
        
        // Show instructions to user
        const action = await vscode.window.showInformationMessage(
            `Prompt "${prompt.title}" copied to clipboard. Open GitHub Copilot Chat and paste it.`,
            'Open Chat',
            'Got it'
        );

        if (action === 'Open Chat') {
            // Try to open any available chat interface
            try {
                await vscode.commands.executeCommand('github.copilot.chat.focus');
            } catch {
                try {
                    await vscode.commands.executeCommand('workbench.panel.chat.focus');
                } catch {
                    vscode.window.showWarningMessage('Could not open chat automatically. Please open it manually.');
                }
            }
        }
    }

    /**
     * Enhanced prompt selection with chat integration
     */
    static async showPromptQuickPick(prompts: any[], title?: string): Promise<void> {
        const items = prompts.map(prompt => ({
            label: `$(book) ${prompt.title}`,
            description: prompt.description,
            detail: `Tags: ${prompt.tags.join(', ')} | Author: ${prompt.author}`,
            prompt: prompt,
            buttons: [
                {
                    iconPath: new vscode.ThemeIcon('comment-discussion'),
                    tooltip: 'Send to Chat'
                },
                {
                    iconPath: new vscode.ThemeIcon('copy'),
                    tooltip: 'Copy to Clipboard'
                }
            ]
        }));

        const quickPick = vscode.window.createQuickPick();
        quickPick.items = items;
        quickPick.placeholder = title || 'Select a prompt and choose an action';
        quickPick.matchOnDescription = true;
        quickPick.matchOnDetail = true;

        quickPick.onDidTriggerItemButton(async (e) => {
            const prompt = (e.item as any).prompt;
            const buttonIndex = (e.item as any).buttons.indexOf(e.button);
            
            quickPick.hide();
            
            switch (buttonIndex) {
                case 0: // Send to Chat
                    await this.sendPromptToChat(prompt);
                    break;
                case 1: // Copy to Clipboard
                    await this.promptService.trackUsage(prompt.id);
                    await vscode.env.clipboard.writeText(prompt.content);
                    vscode.window.showInformationMessage('Prompt copied to clipboard!');
                    break;
            }
        });

        quickPick.onDidAccept(async () => {
            const selected = quickPick.selectedItems[0] as any;
            if (selected) {
                quickPick.hide();
                
                const action = await vscode.window.showQuickPick([
                    { label: '$(comment-discussion) Send to Chat', action: 'chat' },
                    { label: '$(copy) Copy to Clipboard', action: 'copy' }
                ], {
                    placeHolder: 'What would you like to do with this prompt?'
                });

                if (action) {
                    switch (action.action) {
                        case 'chat':
                            await this.sendPromptToChat(selected.prompt);
                            break;
                        case 'copy':
                            await this.promptService.trackUsage(selected.prompt.id);
                            await vscode.env.clipboard.writeText(selected.prompt.content);
                            vscode.window.showInformationMessage('Prompt copied to clipboard!');
                            break;
                    }
                }
            }
        });

        quickPick.show();
    }


}