"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
function escapeRegExp(s) {
    return s.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}
function activate(context) {
    const delimiter = vscode.workspace.getConfiguration('ejs-language-support-with-delimiters').get('delimiter') || '%';
    const templatePath = path.join(context.extensionPath, 'syntaxes', 'ejs-template.json');
    const outputPath = path.join(context.extensionPath, 'syntaxes', 'ejs.tmLanguage.json');
    const schema = fs.readFileSync(templatePath, 'utf-8');
    const escapedDelimiter = escapeRegExp(delimiter);
    const updated = schema.replace(/<DELIMITER>/g, escapedDelimiter);
    fs.writeFileSync(outputPath, updated);
    vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('ejs-language-support-with-delimiters.delimiter')) {
            vscode.window.showInformationMessage('Delimiter changed — reload to apply?', 'Reload').then((s) => {
                if (s === 'Reload') {
                    activate(context);
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                }
                ;
            });
        }
        ;
    });
}
;
