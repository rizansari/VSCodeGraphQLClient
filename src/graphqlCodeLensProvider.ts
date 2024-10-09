import * as vscode from 'vscode';

export class GraphQLCodeLensProvider implements vscode.CodeLensProvider {
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;
    
    public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
        const codeLenses: vscode.CodeLens[] = [];
        const text = document.getText();
        const queryRegex = /^### (.+)$/gm;

        console.log('GraphQL CodeLens Provider provideCodeLenses called');

        let match;
        while ((match = queryRegex.exec(text)) !== null) {
            console.log('Match found:', match[1]);
            const line = document.lineAt(document.positionAt(match.index).line);
            const range = new vscode.Range(line.range.start, line.range.end);

            const codeLens = new vscode.CodeLens(range, {
                title: "Execute Query",
                command: "graphql-client.execute",
                arguments: [this.getQueryText(document, line.lineNumber)]
            });

            codeLenses.push(codeLens);
        }

        console.log('GraphQL CodeLens Provider provideCodeLenses returning codeLenses:', codeLenses);

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

    public refresh(): void {
        this._onDidChangeCodeLenses.fire();
    }
}