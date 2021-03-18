import simpleGit, { SimpleGit, StatusResult, SimpleGitOptions } from 'simple-git';

export class GitReview {
    
    private git: SimpleGit;

    constructor(workspace: string) {
        this.git = simpleGit(workspace);
    }

    async getBranchChoices() {
        return this.git.fetch().branch().then(result => {
            return result.all
        });
    }
    
    start(reviewBranch: string) {
        // save current working state (inluding open editors)
        // checkout review branch
        // pull changes
    }
    
    stop() {
        // revert any changes on review branch
        // switch to original branch
        // retrieve changes on original branch
        // optionally delete review branch
    }

}