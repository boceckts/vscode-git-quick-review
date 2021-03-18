// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GitReview } from './git-review';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let gitReview: GitReview;

	const cwd = getWorkspace();
	if (cwd != null) {
		gitReview = new GitReview(cwd);
	}

	let disposableSwitch = vscode.commands.registerCommand('vscode-git-review.start-review', async () => {

		if (gitReview != null) {

			const branches = gitReview.getBranchChoices()

			getReviewBranch(branches).then(reviewBranch => {

				if (reviewBranch != undefined) {
					gitReview.start(reviewBranch);
				}
			})

		} else {
			vscode.window.showWarningMessage('Git-Review only works in a workspace.');
		}

	});
	context.subscriptions.push(disposableSwitch);

	let disposableRevert = vscode.commands.registerCommand('vscode-git-review.stop-review', () => {

		if (gitReview != null) {
			gitReview.stop();
		} else {
			vscode.window.showWarningMessage('Git-Review only works in a workspace.');
		}

	});
	context.subscriptions.push(disposableRevert);
}

// this method is called when your extension is deactivated
export function deactivate() { }

export function getWorkspace() {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders != undefined && workspaceFolders?.length > 0) {
		return workspaceFolders[0].uri.fsPath;
	} else {
		return null;
	}
}

export function getReviewBranch(branches: Thenable<string[]>) {
	const reviewBranch = vscode.window.showQuickPick(branches, {
		placeHolder: "Select the git branch to review.",
		canPickMany: false});
	return reviewBranch.then(result => {
		return result?.trim();
	})
}