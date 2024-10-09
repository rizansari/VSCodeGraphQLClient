import * as vscode from 'vscode';
import { executeGraphQL } from './graphqlExecutor';
import { GraphQLCodeLensProvider } from './graphqlCodeLensProvider';

let codeLensProvider: GraphQLCodeLensProvider;

export function activate(context: vscode.ExtensionContext) {
    let executeGraphQLCommand = vscode.commands.registerCommand('graphql-client.execute', (query: string) => {
        executeGraphQL(query);
    });

    console.log('GraphQL Client extension is now active!');

    codeLensProvider = new GraphQLCodeLensProvider();
    let disposable = vscode.languages.registerCodeLensProvider(
        { language: 'graphql', scheme: 'file' },
        codeLensProvider
    );

    context.subscriptions.push(disposable);
    context.subscriptions.push(executeGraphQLCommand);

    console.log('GraphQL CodeLens Provider is now active!');

    // Register event listeners
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(refreshCodeLensesIfGraphQL),
        vscode.workspace.onDidChangeTextDocument((e) => refreshCodeLensesIfGraphQL(e.document)),
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                refreshCodeLensesIfGraphQL(editor.document);
            }
        })
    );

    // Refresh CodeLenses for any already open GraphQL files
    if (vscode.window.activeTextEditor) {
        refreshCodeLensesIfGraphQL(vscode.window.activeTextEditor.document);
    }
}

function refreshCodeLensesIfGraphQL(document: vscode.TextDocument) {
    if (isGraphQLFile(document)) {
        refreshCodeLenses();
    }
}

function isGraphQLFile(document: vscode.TextDocument): boolean {
    return document.languageId === 'graphql' || document.fileName.endsWith('.gql');
}

function refreshCodeLenses() {
    codeLensProvider.refresh();
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && isGraphQLFile(activeEditor.document)) {
        vscode.commands.executeCommand('vscode.executeCodeLensProvider', activeEditor.document.uri);
    }
}

export function deactivate() { }