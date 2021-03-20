import simpleGit, { SimpleGit } from 'simple-git';
import { GitReviewBranch } from './git-review-branch';
import { GitReviewStatus } from './git-review-status';
import { IllegalStateError } from './errors';

export class GitReview {

    private git: SimpleGit;
    private reviewStatus: GitReviewStatus;
    private originalBranch: string = 'main';
    private reviewBranch: GitReviewBranch | undefined;
    private stashMessage: string = '';

    constructor(workspace: string) {
        this.git = simpleGit(workspace);
        this.reviewStatus = GitReviewStatus.READY_FOR_REVIEW;
    }

    async getBranchChoices() {
        return this.git.fetch().branch().then(result => {
            this.originalBranch = result.current;
            return Object.values(result.branches).map(bs => new GitReviewBranch(bs)).filter(grb => grb.isRemote);
        });
    }

    start(gitReviewBranch: GitReviewBranch) {
        this.reviewBranch = gitReviewBranch;
        this.toggleReviewStatus(GitReviewStatus.READY_FOR_REVIEW, GitReviewStatus.IN_PROGRESS);
        this.stashMessage = `VSCode Git-Review temporary stash for ${this.originalBranch} during review of ${this.reviewBranch.label}`;
        this.git.stash(['push', '-u', '-m', this.stashMessage]).checkout(this.reviewBranch.label);
    }

    finish() {
        this.toggleReviewStatus(GitReviewStatus.IN_PROGRESS, GitReviewStatus.READY_FOR_REVIEW);
        this.git.reset(['--hard', 'HEAD']).checkout(this.originalBranch).stashList().then(stashList => {
            const filteredStashList = stashList.all.filter(val => val.message.endsWith(this.stashMessage))
            if (filteredStashList.length > 0) {
                const stashEntry = filteredStashList[0];
                const index = stashList.all.indexOf(stashEntry);
                return this.git.stash(['pop', '--index', `stash@{${index}}`]);
            }
        });
    }


    private toggleReviewStatus(from: GitReviewStatus, to: GitReviewStatus) {
        if (this.reviewStatus != from) {
            throw new IllegalStateError(this.reviewStatus);
        }
        this.reviewStatus = to;
    }
}
