import * as vscode from 'vscode';
import { GitReviewStatus } from './git-review-status';

export class StatusBar {

    statusBar: vscode.StatusBarItem;
    status!: GitReviewStatus;

    constructor() { 
        this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.updateStatus(GitReviewStatus.READY_FOR_REVIEW);
        this.statusBar.show();
    }

    updateStatus(status: GitReviewStatus) {
        this.status = status;
        this.statusBar.text = `$(git-compare) ${this.status}`;
    }

}