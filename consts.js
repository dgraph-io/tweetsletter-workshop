import { gql } from '@apollo/client'

export const TWEET_QUERY = `
{
    queryTweets(order: { $sortOrder: $sortField } $filters) {
        id
        text
        featured
        issue
    }
}
`.trim();

export const USER_QUERY = `
{
    queryUser(order:{ $sortOrder: $sortField }, first: 3000)  {
        name
        followers
        location
        tweets(order:{ desc:score } $filters, first: 1) {
            id
            text
            score
            timestamp
            featured
            issue
        }
    }
}
`.trim();

export const SEARCH_FILTER = `text: { alloftext: "$searchTerms" }`;

export const ISSUE_FILTER = `issue: { eq: $issue }`;

export const DATE_FILTER = `timestamp: { $dateFilters }`;

export const GET_FEATURED = gql`
{
    queryTweets(order: { desc: featured }, first: 1) {
        id
        text 
        featured
        issue
    }
}`;


export const GET_MAX_ISSUE = gql`
{
    queryTweets(order: { desc: issue }, first: 1) {
        id
        text 
        featured
        issue
    }
}`;

export const SET_FEATURED = gql`
mutation ($id: String!, $date: DateTime) {
    updateTweets(input: { filter: { id: { eq: $id } }, set: { featured: $date } }) {
        tweets {
            id
        }
    }
}`;

export const SET_ISSUE = gql`
mutation ($id: String!, $issue: Int) {
    updateTweets(input: { filter: { id: { eq: $id } }, set: { issue: $issue } }) {
        tweets {
            id
        }
    }
}`;

export const DELETE_TWEET = gql`
mutation ($id: String!) {
    deleteTweets(filter: { id: { eq: $id } }) {
        tweets {
            id
        }
    }
}`;


export const SORT_OPTIONS = [
    { key: "Most Popular", by: "score", order: "desc" },
    { key: "Most Followed", by: "followers", order: "desc", isUserQuery: true },
    { key: "Newest", by: "timestamp", order: "desc" },
    { key: "Oldest", by: "timestamp", order: "asc" },
    { key: "Least Popular", by: "score", order: "asc" },
]

export const TWEET_STREAMS = [
    { key: "graphql", name: "GraphQL", formId: "f42fb24f-0998-4689-9e7d-e9c8e10008fb", twitterHandle: "graphqltweets" },
    { key: "graphqlsummit", name: "GraphQL Summit", formId: "f42fb24f-0998-4689-9e7d-e9c8e10008fb", twitterHandle: "graphqltweets" },
    //{ key: "react", name: "React", formId: "1dd9c550-b682-43d9-9fcf-819046e8bf6d" },
    { key: "golang", name: "Golang", formId: "7d019eb4-9324-4533-b7e7-5e11a7a84c6a", twitterHandle: "gtweetletter" },
]

export const DATE_FILTERS = [
    { days: 0, name: "Today" },
    { days: 1, name: "Yesterday" },
    { days: 7, name: "Last Week" },
    { days: 30, name: "Last Month" },
    { days: 90, name: "Last Quarter" },
    { days: 99999, name: "All Time" },
];

export const POPULAR_SEARCHES = ['hire','joke','video'];