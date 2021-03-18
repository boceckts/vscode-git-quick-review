import simpleGit, { SimpleGit, StatusResult, SimpleGitOptions } from 'simple-git';

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
            return result.all
        });
    }
    
    start(reviewBranch: string) {
        this.reviewBranch = reviewBranch;
        this.stashMessage = `VSCode Git-Review temporary stash for ${this.originalBranch} during review of ${this.reviewBranch}`;
        this.git.stash(['push', '-m', this.stashMessage]).checkoutLocalBranch(this.reviewBranch).pull();
    }
    
    stop() {
        this.git.reset(['--hard', 'HEAD']).checkout(this.originalBranch).stash(['pop']);
        // optionally delete review branch
    }

}