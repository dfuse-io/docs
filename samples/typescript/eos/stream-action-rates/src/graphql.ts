import { gql } from "apollo-boost";

/**
* SubscribeTransactions:
* Subscription query to connect to the transaction stream
* $cursor: pagination cursor, can be saved to be reused in case of disconnection
* $lowBlockNum: starting block num, a negative number means fetching the past N blocks
**/
export const subscribeTransactions = gql`
  fragment actionTracesFragment on ActionTrace {
    account
    receiver
    name
  }

  subscription subscribeTransactions($cursor: String, $lowBlockNum: Int64) {
    searchTransactionsForward(
      query: "action:transfer"
      lowBlockNum: $lowBlockNum
      cursor: $cursor
    ) {
      cursor
      undo
      trace {
        id
        status
        block {
          id
          num
          timestamp
        }
        executedActions {
          ...actionTracesFragment
        }
      }
    }
  }
`;
