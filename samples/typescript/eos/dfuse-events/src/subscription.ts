import gql from "graphql-tag"

export const searchSubscription = gql`
  subscription($searchQuery: String!) {
    searchTransactionsForward(query: $searchQuery, lowBlockNum: -500) {
      trace {
        id
        matchingActions {
            name
            account
            json
        }
      }
    }
  }
`
