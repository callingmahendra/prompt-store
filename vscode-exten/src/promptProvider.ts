import * as vscode from 'vscode';
import { PromptService, Prompt } from './promptService';

export class PromptProvider implements vscode.TreeDataProvider<PromptItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<PromptItem | undefined | null | void> = new vscode.EventEmitter<PromptItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<PromptItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private promptService: PromptService) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: PromptItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: PromptItem): Promise<PromptItem[]> {
        if (!element) {
            // Root level - show categories or all prompts
            const prompts = await this.promptService.getPrompts();
            return prompts.map(prompt => new PromptItem(
                prompt.title,
                prompt.description,
                vscode.TreeItemCollapsibleState.None,
                prompt,
                {
                    command: 'promptLibrary.viewPrompt',
                    title: 'View Prompt Details',
                    arguments: [{ prompt }]
                }
            ));
        }
        return [];
    }
}

export class PromptItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly tooltip: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly prompt?: Prompt,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.tooltip = tooltip;
        this.description = prompt?.tags.slice(0, 2).join(', ') || '';
        
        if (prompt) {
            this.contextValue = 'prompt';
            this.iconPath = new vscode.ThemeIcon('file-text');
        }
    }
}