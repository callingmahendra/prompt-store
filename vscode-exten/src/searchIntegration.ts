import * as vscode from 'vscode';
import { PromptService } from './promptService';
import { ChatIntegration } from './chatIntegration';
import { PromptWebviewProvider } from './promptWebview';

export class SearchIntegration {
    
    /**
     * Show search interface for prompts
     */
    static async showSearchInterface(promptService: PromptService, extensionUri: vscode.Uri): Promise<void> {
        // First, let user choose search type
        const searchType = await vscode.window.showQuickPick([
            { 
                label: '$(search) Search All Fields', 
                description: 'Search in title, description, content, author, and tags',
                searchBy: 'all' as const
            },
            { 
                label: '$(symbol-text) Search by Title', 
                description: 'Search only in prompt titles',
                searchBy: 'title' as const
            },
            { 
                label: '$(tag) Search by Tags', 
                description: 'Search only in prompt tags',
                searchBy: 'tags' as const
            },
            { 
                label: '$(file-text) Search by Content', 
                description: 'Search only in prompt content',
                searchBy: 'content' as const
            },
            { 
                label: '$(person) Search by Author', 
                description: 'Search only by author name',
                searchBy: 'author' as const
            },
            { 
                label: '$(list-selection) Browse by Tag', 
                description: 'Browse prompts by selecting a tag',
                searchBy: 'browse-tags' as const
            },
            { 
                label: '$(organization) Browse by Author', 
                description: 'Browse prompts by selecting an author',
                searchBy: 'browse-authors' as const
            }
        ], {
            placeHolder: 'How would you like to search for prompts?'
        });

        if (!searchType) {
            return;
        }

        if (searchType.searchBy === 'browse-tags') {
            await this.browseByTags(promptService, extensionUri);
            return;
        }

        if (searchType.searchBy === 'browse-authors') {
            await this.browseByAuthors(promptService, extensionUri);
            return;
        }

        // Get search query from user
        const query = await vscode.window.showInputBox({
            placeHolder: `Enter search term for ${searchType.label.replace('$(search) ', '').replace('$(symbol-text) ', '').replace('$(tag) ', '').replace('$(file-text) ', '').replace('$(person) ', '')}`,
            prompt: searchType.description
        });

        if (!query) {
            return;
        }

        // Perform search
        const results = await promptService.searchPrompts(query, searchType.searchBy);
        
        if (results.length === 0) {
            vscode.window.showInformationMessage(`No prompts found matching "${query}"`);
            return;
        }

        // Show results
        await this.showSearchResults(results, query, searchType.searchBy, extensionUri, promptService);
    }

    /**
     * Browse prompts by selecting from available tags
     */
    private static async browseByTags(promptService: PromptService, extensionUri: vscode.Uri): Promise<void> {
        try {
            // Try to get popular tags first, fallback to all tags
            let tags: string[] = [];
            try {
                const popularTags = await promptService.getPopularTags(20);
                tags = popularTags.map(tagObj => tagObj.tag);
            } catch (error) {
                console.warn('Failed to get popular tags, falling back to all tags:', error);
                tags = await promptService.getAllTags();
            }
            
            if (tags.length === 0) {
                vscode.window.showInformationMessage('No tags found');
                return;
            }

            const selectedTag = await vscode.window.showQuickPick(
                tags.map(tag => ({
                    label: `$(tag) ${tag}`,
                    description: tag,
                    tag: tag
                })),
                {
                    placeHolder: 'Select a tag to browse prompts'
                }
            );

            if (!selectedTag) {
                return;
            }

            const results = await promptService.getPromptsByTag(selectedTag.tag);
            await this.showSearchResults(results, selectedTag.tag, 'tags', extensionUri, promptService);
        } catch (error) {
            console.error('Error browsing by tags:', error);
            vscode.window.showErrorMessage('Failed to browse tags');
        }
    }

    /**
     * Browse prompts by selecting from available authors
     */
    private static async browseByAuthors(promptService: PromptService, extensionUri: vscode.Uri): Promise<void> {
        const authors = await promptService.getAllAuthors();
        
        if (authors.length === 0) {
            vscode.window.showInformationMessage('No authors found');
            return;
        }

        const selectedAuthor = await vscode.window.showQuickPick(
            authors.map(author => ({
                label: `$(person) ${author}`,
                description: author,
                author: author
            })),
            {
                placeHolder: 'Select an author to browse their prompts'
            }
        );

        if (!selectedAuthor) {
            return;
        }

        const results = await promptService.getPromptsByAuthor(selectedAuthor.author);
        await this.showSearchResults(results, selectedAuthor.author, 'author', extensionUri, promptService);
    }

    /**
     * Show search results in a quick pick interface
     */
    private static async showSearchResults(
        results: any[], 
        query: string, 
        searchBy: string,
        extensionUri: vscode.Uri,
        promptService?: PromptService
    ): Promise<void> {
        // Create promptService instance if not provided
        const service = promptService || new PromptService();
        const items = results.map(prompt => ({
            label: `$(book) ${prompt.title}`,
            description: prompt.description,
            detail: `Tags: ${prompt.tags.join(', ')} | Author: ${prompt.author} | Rating: ${prompt.rating}`,
            prompt: prompt,
            buttons: [
                {
                    iconPath: new vscode.ThemeIcon('comment-discussion'),
                    tooltip: 'Send to Chat'
                },
                {
                    iconPath: new vscode.ThemeIcon('copy'),
                    tooltip: 'Copy to Clipboard'
                },
                {
                    iconPath: new vscode.ThemeIcon('eye'),
                    tooltip: 'View Details'
                }
            ]
        }));

        const quickPick = vscode.window.createQuickPick();
        quickPick.items = items;
        quickPick.placeholder = `Found ${results.length} prompt(s) for "${query}" in ${searchBy}`;
        quickPick.matchOnDescription = true;
        quickPick.matchOnDetail = true;

        // Handle button clicks
        quickPick.onDidTriggerItemButton(async (e) => {
            const prompt = (e.item as any).prompt;
            const buttonIndex = (e.item as any).buttons.indexOf(e.button);
            
            quickPick.hide();
            
            switch (buttonIndex) {
                case 0: // Send to Chat
                    await ChatIntegration.sendPromptToChat(prompt);
                    break;
                case 1: // Copy to Clipboard
                    await service.trackUsage(prompt.id);
                    await vscode.env.clipboard.writeText(prompt.content);
                    vscode.window.showInformationMessage('Prompt copied to clipboard!');
                    break;
                case 2: // View Details
                    await this.showPromptDetails(prompt, extensionUri);
                    break;
            }
        });

        // Handle selection
        quickPick.onDidAccept(async () => {
            const selected = quickPick.selectedItems[0] as any;
            if (selected) {
                quickPick.hide();
                
                const action = await vscode.window.showQuickPick([
                    { label: '$(comment-discussion) Send to Chat', action: 'chat' },
                    { label: '$(copy) Copy to Clipboard', action: 'copy' },
                    { label: '$(eye) View Details', action: 'view' }
                ], {
                    placeHolder: 'What would you like to do with this prompt?'
                });

                if (action) {
                    switch (action.action) {
                        case 'chat':
                            await ChatIntegration.sendPromptToChat(selected.prompt);
                            break;
                        case 'copy':
                            await service.trackUsage(selected.prompt.id);
                            await vscode.env.clipboard.writeText(selected.prompt.content);
                            vscode.window.showInformationMessage('Prompt copied to clipboard!');
                            break;
                        case 'view':
                            await this.showPromptDetails(selected.prompt, extensionUri);
                            break;
                    }
                }
            }
        });

        quickPick.show();
    }

    /**
     * Show detailed view of a prompt using the existing webview provider
     */
    private static async showPromptDetails(prompt: any, extensionUri: vscode.Uri): Promise<void> {
        PromptWebviewProvider.createOrShow(extensionUri, prompt);
    }

    /**
     * Quick search with auto-complete
     */
    static async quickSearch(promptService: PromptService): Promise<void> {
        const query = await vscode.window.showInputBox({
            placeHolder: 'Type to search prompts...',
            prompt: 'Search across all prompt fields'
        });

        if (!query) {
            return;
        }

        const results = await promptService.searchPrompts(query, 'all');
        
        if (results.length === 0) {
            vscode.window.showInformationMessage(`No prompts found matching "${query}"`);
            return;
        }

        await ChatIntegration.showPromptQuickPick(results);
    }
}