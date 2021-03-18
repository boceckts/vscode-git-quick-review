import simpleGit, { SimpleGit } from 'simple-git';

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
            return Object.values(result.branches).map(bs => bs.name.replace(/remotes\/(\w+)/g, `$1`));
        });
    }
    
    start(reviewBranch: string) {
        this.reviewBranch = reviewBranch;
        this.stashMessage = `VSCode Git-Review temporary stash for ${this.originalBranch} during review of ${this.reviewBranch}`;
        this.git.stash(['push', '-m', this.stashMessage]).checkout(this.reviewBranch).pull();
        saveEditorState();
    }
    
    stop() {
        this.git.reset(['--hard', 'HEAD']).checkout(this.originalBranch).stash(['pop']);
    }

}