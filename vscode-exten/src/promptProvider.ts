import * as vscode from 'vscode';
import { PromptService, Prompt } from './promptService';

export class PromptProvider implements vscode.TreeDataProvider<PromptItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<PromptItem | undefined | null | void> = new vscode.EventEmitter<PromptItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<PromptItem | undefined | null | void> = this._onDidChangeTreeData.event;
    private viewMode: 'categories' | 'flat' | 'authors' | 'recent' = 'categories';

    constructor(private promptService: PromptService) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    setViewMode(mode: 'categories' | 'flat' | 'authors' | 'recent'): void {
        this.viewMode = mode;
        this.refresh();
    }

    getTreeItem(element: PromptItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: PromptItem): Promise<PromptItem[]> {
        if (!element) {
            return this.getRootItems();
        }

        if (element.contextValue === 'category') {
            return this.getCategoryChildren(element);
        }

        if (element.contextValue === 'author') {
            return this.getAuthorChildren(element);
        }

        return [];
    }

    private async getRootItems(): Promise<PromptItem[]> {
        const prompts = await this.promptService.getPrompts();
        
        switch (this.viewMode) {
            case 'categories':
                return this.getCategorizedView(prompts);
            case 'authors':
                return this.getAuthorView(prompts);
            case 'recent':
                return this.getRecentView(prompts);
            case 'flat':
            default:
                return this.getFlatView(prompts);
        }
    }

    private getCategorizedView(prompts: Prompt[]): PromptItem[] {
        const categories = new Map<string, Prompt[]>();
        
        // Group prompts by their primary tag
        prompts.forEach(prompt => {
            const primaryTag = prompt.tags[0] || 'Uncategorized';
            if (!categories.has(primaryTag)) {
                categories.set(primaryTag, []);
            }
            categories.get(primaryTag)!.push(prompt);
        });

        const categoryItems: PromptItem[] = [];
        
        // Add overview item
        categoryItems.push(new PromptItem(
            `📊 Overview (${prompts.length} prompts)`,
            'View library statistics and overview',
            vscode.TreeItemCollapsibleState.None,
            undefined,
            {
                command: 'promptLibrary.showOverview',
                title: 'Show Overview',
                arguments: []
            },
            'overview'
        ));

        // Add category items
        Array.from(categories.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([category, categoryPrompts]) => {
                categoryItems.push(new PromptItem(
                    `📁 ${category} (${categoryPrompts.length})`,
                    `${categoryPrompts.length} prompts in ${category}`,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    undefined,
                    undefined,
                    'category',
                    category
                ));
            });

        return categoryItems;
    }

    private getAuthorView(prompts: Prompt[]): PromptItem[] {
        const authors = new Map<string, Prompt[]>();
        
        prompts.forEach(prompt => {
            if (!authors.has(prompt.author)) {
                authors.set(prompt.author, []);
            }
            authors.get(prompt.author)!.push(prompt);
        });

        return Array.from(authors.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([author, authorPrompts]) => new PromptItem(
                `👤 ${author} (${authorPrompts.length})`,
                `${authorPrompts.length} prompts by ${author}`,
                vscode.TreeItemCollapsibleState.Collapsed,
                undefined,
                undefined,
                'author',
                author
            ));
    }

    private getRecentView(prompts: Prompt[]): PromptItem[] {
        return prompts
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 20)
            .map(prompt => new PromptItem(
                `🕒 ${prompt.title}`,
                `${prompt.description} • ${new Date(prompt.date).toLocaleDateString()}`,
                vscode.TreeItemCollapsibleState.None,
                prompt,
                {
                    command: 'promptLibrary.viewPrompt',
                    title: 'View Prompt Details',
                    arguments: [{ prompt }]
                }
            ));
    }

    private getFlatView(prompts: Prompt[]): PromptItem[] {
        return prompts
            .sort((a, b) => a.title.localeCompare(b.title))
            .map(prompt => new PromptItem(
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

    private async getCategoryChildren(categoryItem: PromptItem): Promise<PromptItem[]> {
        const prompts = await this.promptService.getPrompts();
        const categoryPrompts = prompts.filter(prompt => 
            (categoryItem.metadata && prompt.tags.includes(categoryItem.metadata)) || 
            (categoryItem.metadata === 'Uncategorized' && prompt.tags.length === 0)
        );

        return categoryPrompts.map(prompt => new PromptItem(
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

    private async getAuthorChildren(authorItem: PromptItem): Promise<PromptItem[]> {
        const prompts = await this.promptService.getPrompts();
        const authorPrompts = prompts.filter(prompt => authorItem.metadata && prompt.author === authorItem.metadata);

        return authorPrompts.map(prompt => new PromptItem(
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
}

export class PromptItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly tooltip: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly prompt?: Prompt,
        public readonly command?: vscode.Command,
        public readonly contextValue?: string,
        public readonly metadata?: string
    ) {
        super(label, collapsibleState);
        this.tooltip = tooltip;
        this.contextValue = contextValue || (prompt ? 'prompt' : undefined);
        this.metadata = metadata;
        
        if (prompt) {
            this.description = prompt.tags.slice(0, 2).join(', ') || '';
            this.iconPath = this.getPromptIcon(prompt);
        } else if (contextValue === 'category') {
            this.iconPath = new vscode.ThemeIcon('folder');
        } else if (contextValue === 'author') {
            this.iconPath = new vscode.ThemeIcon('person');
        } else if (contextValue === 'overview') {
            this.iconPath = new vscode.ThemeIcon('dashboard');
        }
    }

    private getPromptIcon(prompt: Prompt): vscode.ThemeIcon {
        // Choose icon based on prompt characteristics
        if (prompt.tags.includes('code') || prompt.tags.includes('programming')) {
            return new vscode.ThemeIcon('code');
        }
        if (prompt.tags.includes('documentation') || prompt.tags.includes('docs')) {
            return new vscode.ThemeIcon('book');
        }
        if (prompt.tags.includes('review') || prompt.tags.includes('analysis')) {
            return new vscode.ThemeIcon('search');
        }
        if (prompt.tags.includes('test') || prompt.tags.includes('testing')) {
            return new vscode.ThemeIcon('beaker');
        }
        if (prompt.rating >= 4) {
            return new vscode.ThemeIcon('star-full');
        }
        return new vscode.ThemeIcon('file-text');
    }
}