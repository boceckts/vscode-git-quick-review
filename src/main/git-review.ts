import simpleGit, { SimpleGit, BranchSummaryBranch } from 'simple-git';
import * as vscode from 'vscode';

export class GitReview {

    private git: SimpleGit;
    private originalBranch: string = 'main';
    private reviewBranch: string = '';
    private stashMessage: string = '';

    constructor(workspace: string) {
        this.git = simpleGit(workspace);
    }

    async getBranchChoices() {
        return this.git.fetch().branch().then(result => {
            this.originalBranch = result.current;
            return Object.values(result.branches).map(bs => new GitReviewBranch(bs)).filter(grb => grb.isRemote);
        });
    }
    
    start(gitReviewBranch: GitReviewBranch) {
        this.reviewBranch = gitReviewBranch.label;
        this.stashMessage = `VSCode Git-Review temporary stash for ${this.originalBranch} during review of ${this.reviewBranch}`;
        this.git.stash(['push', '-u', '-m', this.stashMessage]).checkout(this.reviewBranch);
    }
    
    stop() {
        this.git.reset(['--hard', 'HEAD']).checkout(this.originalBranch).stash(['pop', '--index']);
    }

}

export class GitReviewBranch implements vscode.QuickPickItem {

    label: string;
    description?: string | undefined;
    origin: string;
    isRemote: boolean;
    private commit: string;

    constructor(branchSummary: BranchSummaryBranch) {
        this.commit = branchSummary.commit;
        this.isRemote = branchSummary.name.startsWith('remotes/');
        this.label = branchSummary.name.replace(/remotes\/(\w+)/g, '$1');
        this.description = this.isRemote? `Remote branch at ${this.commit}` : this.commit;
        this.origin = branchSummary.name.replace(/remotes\/(\w+)\/(\w+)/g, '$2');
    }
}
