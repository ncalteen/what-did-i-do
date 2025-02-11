import { PullRequestReviewDecision, PullRequestReviewState, PullRequestState } from '@octokit/graphql-schema';
/**
 * Contribution Data Map
 */
export type Contributions = {
    /** Total Commit Contributions */
    totalCommitContributions: number;
    /** Total Issue Contributions */
    totalIssueContributions: number;
    /** Total Pull Request Contributions */
    totalPullRequestContributions: number;
    /** Total Pull Request Review Contributions */
    totalPullRequestReviewContributions: number;
    /** Total Repositories with Contributed Commits */
    totalRepositoriesWithContributedCommits: number;
    /** Total Repositories with Contributed Issues */
    totalRepositoriesWithContributedIssues: number;
    /** Total Repositories with Contributed Pull Requests */
    totalRepositoriesWithContributedPullRequests: number;
    /** Total Repositories with Contributed Pull Request Reviews */
    totalRepositoriesWithContributedPullRequestReviews: number;
    /** Total Repository Contributions */
    totalRepositoryContributions: number;
    /** Issue Contributions by Repository */
    issueContributionsByRepository: IssueContributionsByRepository;
    /** Pull Request Contributions by Repository */
    pullRequestContributionsByRepository: PullRequestContributionsByRepository;
    /** Pull Request Review Contributions by Repository */
    pullRequestReviewContributionsByRepository: PullRequestReviewContributionsByRepository;
};
/** Issue Contributions by Repository GraphQL Response */
export type GraphQLIssueContributionsByRepository = {
    user: {
        contributionsCollection: {
            issueContributionsByRepository: {
                contributions: {
                    nodes: {
                        issue: {
                            assignees: {
                                nodes: {
                                    login: string;
                                }[];
                            };
                            body: string;
                            comments: {
                                nodes: {
                                    author: {
                                        login: string;
                                    };
                                    body: string;
                                    createdAt: string;
                                }[];
                            };
                            createdAt: string;
                            number: number;
                            state: string;
                            title: string;
                            url: string;
                        };
                    }[];
                    pageInfo: {
                        endCursor: string;
                        hasNextPage: boolean;
                    };
                    totalCount: number;
                };
                repository: {
                    nameWithOwner: string;
                    url: string;
                };
            }[];
        };
    };
};
/** Pull Request Contributions by Repository GraphQL Response */
export type GraphQLPullRequestContributionsByRepository = {
    user: {
        contributionsCollection: {
            pullRequestContributionsByRepository: {
                contributions: {
                    nodes: {
                        pullRequest: {
                            assignees: {
                                nodes: {
                                    login: string;
                                }[];
                            };
                            body: string;
                            closed: boolean;
                            comments: {
                                nodes: {
                                    author: {
                                        login: string;
                                    };
                                    body: string;
                                    createdAt: string;
                                }[];
                            };
                            createdAt: string;
                            editor?: {
                                login: string;
                            };
                            isDraft: boolean;
                            merged: boolean;
                            number: number;
                            reviewDecision?: PullRequestReviewDecision;
                            state: PullRequestState;
                            title: string;
                            url: string;
                        };
                    }[];
                    pageInfo: {
                        endCursor: string;
                        hasNextPage: boolean;
                    };
                    totalCount: number;
                };
                repository: {
                    nameWithOwner: string;
                    url: string;
                };
            }[];
        };
    };
};
/** Pull Request Review Contributions by Repository GraphQL Response */
export type GraphQLPullRequestReviewContributionsByRepository = {
    user: {
        contributionsCollection: {
            pullRequestReviewContributionsByRepository: {
                contributions: {
                    nodes: {
                        pullRequest: {
                            author?: {
                                login: string;
                            };
                            body: string;
                            closed: boolean;
                            createdAt: string;
                            merged: boolean;
                            number: number;
                            state: PullRequestState;
                            title: string;
                            url: string;
                        };
                        pullRequestReview: {
                            body: string;
                            createdAt: string;
                            state: PullRequestReviewState;
                        };
                    }[];
                    pageInfo: {
                        endCursor: string;
                        hasNextPage: boolean;
                    };
                    totalCount: number;
                };
                repository: {
                    nameWithOwner: string;
                    url: string;
                };
            }[];
        };
    };
};
/** Total Contributions GraphQL Response */
export type GraphQLTotalContributions = {
    user: {
        contributionsCollection: {
            /** Total Commit Contributions */
            totalCommitContributions: number;
            /** Total Issue Contributions */
            totalIssueContributions: number;
            /** Total Pull Request Contributions */
            totalPullRequestContributions: number;
            /** Total Pull Request Review Contributions */
            totalPullRequestReviewContributions: number;
            /** Total Repositories with Contributed Commits */
            totalRepositoriesWithContributedCommits: number;
            /** Total Repositories with Contributed Issues */
            totalRepositoriesWithContributedIssues: number;
            /** Total Repositories with Contributed Pull Requests */
            totalRepositoriesWithContributedPullRequests: number;
            /** Total Repositories with Contributed Pull Request Reviews */
            totalRepositoriesWithContributedPullRequestReviews: number;
            /** Total Repository Contributions */
            totalRepositoryContributions: number;
        };
    };
};
/** Issue Contributions by Repository */
export type IssueContributionsByRepository = {
    [key: string]: {
        contributions: {
            body: string;
            comments: {
                nodes: {
                    author: {
                        login: string;
                    };
                    body: string;
                    createdAt: string;
                }[];
            };
            createdAt: Date;
            number: number;
            state: string;
            title: string;
            url: string;
        }[];
        totalCount: number;
        url: string;
    };
};
/** Pull Request Contributions by Repository */
export type PullRequestContributionsByRepository = {
    [key: string]: {
        contributions: {
            body: string;
            closed: boolean;
            comments: {
                nodes: {
                    author: {
                        login: string;
                    };
                    body: string;
                    createdAt: string;
                }[];
            };
            createdAt: Date;
            isDraft: boolean;
            merged: boolean;
            number: number;
            reviewDecision?: PullRequestReviewDecision;
            state: PullRequestState;
            title: string;
            url: string;
        }[];
        totalCount: number;
        url: string;
    };
};
/** Pull Request Review Contributions by Repository */
export type PullRequestReviewContributionsByRepository = {
    [key: string]: {
        contributions: {
            pullRequest: {
                body: string;
                closed: boolean;
                createdAt: Date;
                merged: boolean;
                number: number;
                state: PullRequestState;
                title: string;
                url: string;
            };
            pullRequestReview: {
                body: string;
                createdAt: Date;
                state: PullRequestReviewState;
            };
        }[];
        totalCount: number;
        url: string;
    };
};
/** Issue Summary */
export type IssueSummary = {
    createdAt: string;
    number: number;
    repository: string;
    repositoryUrl: string;
    status: string;
    title: string;
    url: string;
};
/** Pull Request Summary */
export type PullRequestSummary = {
    createdAt: string;
    number: number;
    repository: string;
    repositoryUrl: string;
    status: string;
    title: string;
    url: string;
};
/** Pull Request Review Summary */
export type PullRequestReviewSummary = {
    createdAt: string;
    number: number;
    repository: string;
    repositoryUrl: string;
    reviewDecision?: PullRequestReviewDecision;
    status: string;
    title: string;
    url: string;
};
/** Repository Summary */
export type RepositorySummary = {
    issues: number;
    name: string;
    pullRequests: number;
    pullRequestReviews: number;
    url: string;
};
