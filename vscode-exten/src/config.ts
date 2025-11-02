import * as vscode from 'vscode';

export class Config {
    static getApiUrl(): string {
        const config = vscode.workspace.getConfiguration('promptLibrary');
        return config.get('apiUrl', 'http://localhost:3000/api/prompts');
    }

    static getUserId(): string {
        const config = vscode.workspace.getConfiguration('promptLibrary');
        return config.get('userId', 'vscode-user');
    }
}