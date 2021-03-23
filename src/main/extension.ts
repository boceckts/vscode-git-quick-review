// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GitReview } from './git-review';
import { GitReviewBranch } from "./git-review-branch";
import { CommandUtil } from './commands';
import { StatusBar } from './status-bar';
import { WorkspaceUtil as GitWorkspace } from './git-workspace';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const gitWorkspace = new GitWorkspace();
	let gitReview: GitReview;

	const cwd = gitWorkspace.getWorkspace();
	if (cwd != null) {
		gitReview = new GitReview(cwd);
		const statusBar = new StatusBar();
		gitReview.onStatusChanged = statusBar.updateStatus.bind(statusBar);
	}

	let disposableSwitch = vscode.commands.registerCommand(CommandUtil.START_REVIEW, async () => {

		if (gitReview != null) {

			if (gitReview.isReadyForReview()) {
				
				const branches = gitReview.getBranchChoices()
				
				const reviewBranch = await getReviewBranch(branches).then();
				
				if (reviewBranch != undefined) {
					gitWorkspace.collectEditorState().then(() => gitReview.start(reviewBranch));
				}

			} else {
				const finishAction = 'Finish Git Review';
				const action = vscode.window.showInformationMessage('A git review is currently in progress, please finish your current review befor starting a new one. Do you want to finish the review now?', finishAction);
				action.then(action => {
					if (action == finishAction) {
						CommandUtil.finishReview();
					}
				})
			}

		} else {
			vscode.window.showWarningMessage('Git-Review only works in a workspace.');
		}

	});
	context.subscriptions.push(disposableSwitch);

	let disposableRevert = vscode.commands.registerCommand(CommandUtil.FINISH_REVIEW, () => {

		if (gitReview != null) {

			if (gitReview.isReviewInProgress()) {
				gitReview.finish().then(() => gitWorkspace.restoreEditorState());
			} else {
				const startAction = 'Start Git Review';
				const action = vscode.window.showInformationMessage('Currently, there is no git review in progress. Do you want to start one now?', startAction);
				action.then(action => {
					if (action == startAction) {
						CommandUtil.startReview();
					}
				})
			}

		} else {
			vscode.window.showWarningMessage('Git-Review only works in a workspace.');
		}

	});
	context.subscriptions.push(disposableRevert);
}

// this method is called when your extension is deactivated
export function deactivate() { }

export async function getReviewBranch(branches: Thenable<GitReviewBranch[]>) {
	const reviewBranch = vscode.window.showQuickPick(branches, {
		placeHolder: "Select a remote git branch to review",
		canPickMany: false});
	return reviewBranch;
}
