import * as vscode from 'vscode';
import { GitReviewStatus } from './git-review-status';

export class CommandUtil {

    static readonly START_REVIEW: string = 'vscode-git-review.start-review';
    static readonly FINISH_REVIEW: string = 'vscode-git-review.finish-review';

    static startReview() {
        vscode.commands.executeCommand(CommandUtil.START_REVIEW);
    }

    static finishReview() {
        vscode.commands.executeCommand(CommandUtil.FINISH_REVIEW);
    }

    static getCommandForReviewStatus(status: GitReviewStatus) {
        if (status == GitReviewStatus.READY_FOR_REVIEW) {
            return CommandUtil.START_REVIEW;
        } else if (status == GitReviewStatus.IN_PROGRESS) {
            return CommandUtil.FINISH_REVIEW;
        } else {
            return '';
        }
    }

    static getInfoForReviewStatus(status: GitReviewStatus) {
        if (status == GitReviewStatus.READY_FOR_REVIEW) {
            return 'Start a git review of a remote branch.';
        } else if (status == GitReviewStatus.IN_PROGRESS) {
            return 'Finish the git review which is currently in progress.';
        } else {
            return 'Undfined git review status.';
        }
    }

}