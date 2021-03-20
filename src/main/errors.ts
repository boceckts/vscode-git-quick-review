import { GitReviewStatus } from "./git-review-status";

export class IllegalStateError extends Error {

    constructor(status: GitReviewStatus) {
        super(`The action is not allowed for satus '${status}'.`);
    }

}