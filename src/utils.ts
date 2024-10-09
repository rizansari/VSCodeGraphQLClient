export function parseDocumentText(documentText: string): Map<string, string> {
    const lines = documentText.split('\n\n')[0];
    const linesArray = lines.split('\n');
    let map = new Map<string, string>();
    linesArray.forEach((line) => {
        const parts = line.split('=');
        map.set(parts[0].trim(), parts[1].trim());
    });
    return map;
}

export function parseSelectedText(selectedText: string, map: Map<string, string>): { query: string, variables: any } {
    let query = '';
    let variables = {};
    try {
        query = selectedText.split('\n\n')[0];
        let variablesText = selectedText.split('\n\n')[1];

        if (!variablesText) {
            variablesText = '{}';
        } else {
            if (variablesText.includes('{{')) {
                map.forEach((value, key) => {
                    variablesText = variablesText.replace(`{{${key}}}`, value);
                });
            }
        }

        variables = JSON.parse(variablesText);
    } catch (error) {
        query = selectedText;
    }
    return { query, variables };
}