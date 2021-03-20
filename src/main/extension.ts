// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GitReview } from './git-review';
import { GitReviewBranch } from "./git-review-branch";

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

			const reviewBranch = await getReviewBranch(branches).then();

			if (reviewBranch != undefined) {
				doWithErrorHandling(gitReview, gitReview.start, [reviewBranch]);
			}

		} else {
			vscode.window.showWarningMessage('Git-Review only works in a workspace.');
		}

	});
	context.subscriptions.push(disposableSwitch);

	let disposableRevert = vscode.commands.registerCommand('vscode-git-review.stop-review', () => {

		if (gitReview != null) {
			doWithErrorHandling(gitReview, gitReview.finish);
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

export async function getReviewBranch(branches: Thenable<GitReviewBranch[]>) {
	const reviewBranch = vscode.window.showQuickPick(branches, {
		placeHolder: "Select a remote git branch to review",
		canPickMany: false});
	return reviewBranch;
}

export function doWithErrorHandling(gitReview: GitReview, action: Function, args: any[] = []) {
	try {
		action.call(gitReview, args);
	} catch (error) {
		vscode.window.showWarningMessage(error.message);
	}
}