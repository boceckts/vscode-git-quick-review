import * as vscode from 'vscode';
import { GitReviewStatus } from './git-review-status';
import { CommandUtil } from './commands';

export class StatusBar {

    statusBar: vscode.StatusBarItem;
    status!: GitReviewStatus;

    constructor() { 
        this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MAX_SAFE_INTEGER);
        this.updateStatus(GitReviewStatus.READY_FOR_REVIEW);
        this.statusBar.show();
    }

    updateStatus(status: GitReviewStatus) {
        this.status = status;
        this.statusBar.text = `$(git-compare) ${this.status}`;
        this.statusBar.command = CommandUtil.getCommandForReviewStatus(this.status);
        this.statusBar.tooltip = CommandUtil.getInfoForReviewStatus(this.status);
    }

}