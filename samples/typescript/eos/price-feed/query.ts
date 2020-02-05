import gql from "graphql-tag";

export const getRexPoolQuery = gql`
  subscription($cursor: String!, $lowBlockNum: Int64!, $highBlockNum: Int64!) {
    searchTransactionsForward(
      cursor: $cursor,
      query: "account:eosio receiver:eosio db.table:rexpool/eosio",
      lowBlockNum: $lowBlockNum,
      highBlockNum: $highBlockNum
    ) {
      cursor
      trace {
        id
        block {
          num
          timestamp
        }
        matchingActions {
          dbOps {
            operation
            key {
              code
              table
              scope
            }
            oldData
            newData
          }
        }
      }
    }
  }
`;