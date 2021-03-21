import * as vscode from 'vscode';

export class CommandUtil {

    static readonly START_REVIEW: string = 'vscode-git-review.start-review';
    static readonly FINISH_REVIEW: string = 'vscode-git-review.finish-review';

    static startReview() {
        vscode.commands.executeCommand(CommandUtil.START_REVIEW);
    }

    static finishReview() {
        vscode.commands.executeCommand(CommandUtil.FINISH_REVIEW);
    }

}