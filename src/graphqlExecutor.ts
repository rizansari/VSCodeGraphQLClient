import * as vscode from 'vscode';
import { GraphQLClient, Variables } from 'graphql-request';
import { parseDocumentText, parseSelectedText } from './utils';

let resultPanel: vscode.WebviewPanel | undefined;

export async function executeGraphQL() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }

    const document = editor.document;
    const documentText = document.getText();
    const map = parseDocumentText(documentText);

    const selection = editor.selection;
    const selectedText = document.getText(selection);

    const { query, variables } = parseSelectedText(selectedText, map);

    const endpoint = map.get('endpoint');
    if (!endpoint) {
        vscode.window.showErrorMessage('No endpoint specified');
        return;
    }

    try {
        const data = await executeGraphQLRequest(endpoint, query, variables);
        
        if (!resultPanel) {
            resultPanel = vscode.window.createWebviewPanel(
                'graphqlResult',
                'GraphQL Result',
                vscode.ViewColumn.Beside,
                { enableScripts: true }
            );
            
            resultPanel.onDidDispose(() => {
                resultPanel = undefined;
            });
        }

        resultPanel.webview.html = getWebviewContent(JSON.stringify(data, null, 2));
        resultPanel.reveal(vscode.ViewColumn.Beside);
    } catch (error) {
        vscode.window.showErrorMessage('Error executing GraphQL request ' + error);
    }
}

function getWebviewContent(jsonContent: string): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GraphQL Result</title>
    </head>
    <body>
        <pre>${jsonContent}</pre>
    </body>
    </html>`;
}

async function executeGraphQLRequest<T>(
    endpoint: string,
    query: string,
    variables?: Variables
): Promise<T> {
    const client = new GraphQLClient(endpoint);

    try {
        const response = await client.request<T>(query, variables);
        return response;
    } catch (error) {
        console.error('Error executing GraphQL request:', error);
        throw error;
    }
}