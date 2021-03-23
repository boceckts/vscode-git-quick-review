import * as vscode from 'vscode';

export class WorkspaceUtil {

    private readonly REVIEW_FILE_NAME: string = 'REVIEW';
    private activeTextEditor: string | undefined;
    private visibleTextEditors: string[] = [];

    getWorkspace() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders != undefined && workspaceFolders?.length > 0) {
            return workspaceFolders[0].uri.fsPath;
        } else {
            return null;
        }
    }

    async collectEditorState() {
        this.activeTextEditor = vscode.window.activeTextEditor?.document.fileName;
        console.log(vscode.window.visibleTextEditors);
        this.visibleTextEditors = vscode.window.visibleTextEditors.map(editor => editor.document.fileName);
        console.log(this.visibleTextEditors);
        return vscode.commands.executeCommand('workbench.action.closeAllEditors');
    }

    async restoreEditorState() {
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');
        return Promise.all(this.visibleTextEditors.map(async editor => {
            const textDocuemnt = await vscode.workspace.openTextDocument(editor);
            return vscode.window.showTextDocument(textDocuemnt);
        })).then(() => {
            if (this.activeTextEditor != undefined) {
                vscode.workspace.openTextDocument(this.activeTextEditor).then(async textDocuemnt => {
                    return vscode.window.showTextDocument(textDocuemnt);
                });
            }
        });
    }

}