import * as vscode from 'vscode';
import { executeGraphQL } from './graphqlExecutor';

export function activate(context: vscode.ExtensionContext) {
    let executeGraphQLCommand = vscode.commands.registerCommand('graphql-client.execute', () => {
        executeGraphQL();
    });

    context.subscriptions.push(executeGraphQLCommand);
}

export function deactivate() { }