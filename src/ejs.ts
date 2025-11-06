import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function escapeRegExp(s: string): string {
    return s.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}

export function activate(context: vscode.ExtensionContext) {
	const delimiter: string = vscode.workspace.getConfiguration('ejs-language-support-with-delimiters').get<string>('delimiter') || '%';

	const templatePath: string = path.join(context.extensionPath, 'syntaxes', 'ejs-template.json');
	const outputPath: string = path.join(context.extensionPath, 'syntaxes', 'ejs.tmLanguage.json');

	const schema: string = fs.readFileSync(templatePath, 'utf-8');
	const escapedDelimiter = escapeRegExp(delimiter);
	const updated: string = schema.replace(/<DELIMITER>/g, escapedDelimiter);

	fs.writeFileSync(outputPath, updated);

	vscode.workspace.onDidChangeConfiguration((e) => {
		if (e.affectsConfiguration('ejs-language-support-with-delimiters.delimiter')) {
			vscode.window.showInformationMessage('Delimiter changed — reload to apply?', 'Reload').then((s) => {
				if (s === 'Reload') {
					activate(context);
					vscode.commands.executeCommand('workbench.action.reloadWindow')
				};
			});
		};
	});
};