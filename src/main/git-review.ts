import simpleGit, { SimpleGit } from 'simple-git';
import { GitReviewBranch } from './git-review-branch';

export class GitReview {

    private git: SimpleGit;
    private originalBranch: string = 'main';
    private reviewBranch: GitReviewBranch | undefined;
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
        this.reviewBranch = gitReviewBranch;
        this.stashMessage = `VSCode Git-Review temporary stash for ${this.originalBranch} during review of ${this.reviewBranch.label}`;
        this.git.stash(['push', '-u', '-m', this.stashMessage]).checkout(this.reviewBranch.label);
    }
    
    finish() {
        this.git.reset(['--hard', 'HEAD']).checkout(this.originalBranch).stashList().then(stashList => {
            const filteredStashList = stashList.all.filter(val => val.message.endsWith(this.stashMessage))
            if (filteredStashList.length > 0) {
                const stashEntry = filteredStashList[0];
                const index = stashList.all.indexOf(stashEntry);
                return this.git.stash(['pop', '--index', `stash@{${index}}`]);
            }
        });
    }

}
