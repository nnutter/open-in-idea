import * as vscode from 'vscode';
import { exec, ExecException } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.openInIDEA', () => {
        const config = vscode.workspace.getConfiguration('openInIDEA');
        const ideaLauncher: string = config.get('launcherPath', 'idea'); // default = "idea"

        const openFiles = vscode.window.tabGroups.all.flatMap(tg => tg.tabs)
            .filter(tab => tab.input instanceof vscode.TabInputText)
            .map(tab => (tab.input as vscode.TabInputText).uri.fsPath);
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('No workspace folder is open.');
            return;
        }

        // Collect unique workspace folders containing open files
        const workspacePaths = new Set<string>();
        for (const file of openFiles) {
            const folder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(file));
            if (folder) {
                workspacePaths.add(folder.uri.fsPath);
            }
        }

        // Fallback: if no open file is in a workspace, include all roots
        if (workspacePaths.size === 0) {
            for (const folder of workspaceFolders) {
                workspacePaths.add(folder.uri.fsPath);
            }
        }

        // Build args: workspace folders first, then open files with cursor position for active last
        let args = Array.from(workspacePaths).map(f => `"${f}"`);
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && openFiles.includes(activeEditor.document.fileName)) {
            const otherFiles = openFiles.filter(f => f !== activeEditor.document.fileName);
            args.push(...otherFiles.map(f => `"${f}"`));
            const position = activeEditor.selection.active;
            const tabSize = Number(activeEditor.options.tabSize) || 4;
            const lineText = activeEditor.document.lineAt(position.line).text;
            let visualColumn = 0;
            for (let i = 0; i < position.character; i++) {
                if (lineText[i] === '\t') {
                    visualColumn += tabSize;
                } else {
                    visualColumn += 1;
                }
            }
            args.push(`--line ${position.line + 1}`, `--column ${visualColumn}`, `"${activeEditor.document.fileName}"`);
        } else {
            args.push(...openFiles.map(f => `"${f}"`));
        }

        const cmd = `${ideaLauncher} ${args.join(' ')}`;

        exec(cmd, (error: ExecException | null, stdout: string, stderr: string) => {
            if (error) {
                vscode.window.showErrorMessage(`Failed to launch IntelliJ: ${stderr || error.message}`);
                return;
            }
            vscode.window.showInformationMessage('Opened workspace(s) and files in IntelliJ.');
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
