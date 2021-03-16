// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposableSwitch = vscode.commands.registerCommand('vscode-git-review.start-review', () => {
		// fetch all branches
		// allow user to choose review branch
		// save current working state (inluding open editors)
		// checkout review branch
		// pull changes

		vscode.window.showInformationMessage('Start a review');
	});
	context.subscriptions.push(disposableSwitch);

	let disposableRevert = vscode.commands.registerCommand('vscode-git-review.stop-review', () => {
		// revert any changes on review branch
		// switch to original branch
		// retrieve changes on original branch
		// optionally delete review branch

		vscode.window.showInformationMessage('Finish a review');
	});
	context.subscriptions.push(disposableRevert);
}

// this method is called when your extension is deactivated
export function deactivate() {}
