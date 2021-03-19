import { BranchSummaryBranch } from 'simple-git';
import { QuickPickItem } from 'vscode';

export class GitReviewBranch implements QuickPickItem {

    label: string;
    description?: string | undefined;
    origin: string;
    isRemote: boolean;
    private commit: string;

    constructor(branchSummary: BranchSummaryBranch) {
        this.commit = branchSummary.commit;
        this.isRemote = branchSummary.name.startsWith('remotes/');
        this.label = branchSummary.name.replace(/remotes\/(\w+)/g, '$1');
        this.description = this.isRemote ? `Remote branch at ${this.commit}` : this.commit;
        this.origin = branchSummary.name.replace(/remotes\/(\w+)\/(\w+)/g, '$2');
    }

}
