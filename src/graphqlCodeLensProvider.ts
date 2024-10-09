import * as vscode from 'vscode';

export class GraphQLCodeLensProvider implements vscode.CodeLensProvider {
    public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
        const codeLenses: vscode.CodeLens[] = [];
        const text = document.getText();
        const queryRegex = /^### (.+)$/gm;

        let match;
        while ((match = queryRegex.exec(text)) !== null) {
            const line = document.lineAt(document.positionAt(match.index).line);
            const range = new vscode.Range(line.range.start, line.range.end);

            const codeLens = new vscode.CodeLens(range, {
                title: "Execute Query",
                command: "graphql-client.execute",
                arguments: [this.getQueryText(document, line.lineNumber)]
            });

            codeLenses.push(codeLens);
        }

        return codeLenses;
    }

    private getQueryText(document: vscode.TextDocument, startLine: number): string {
        let endLine = startLine + 1;
        while (endLine < document.lineCount && !document.lineAt(endLine).text.startsWith('###')) {
            endLine++;
        }
        const range = new vscode.Range(startLine + 1, 0, endLine, 0);
        return document.getText(range);
    }
}