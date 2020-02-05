import * as React from "react";
import {Subscription} from "react-apollo";
import {searchSubscription} from "../subscription";



let recordedMessages: any[] = []
type SearchListProps = {
  searchQuery: string
  renderLoading: () => React.ReactNode
  renderError: (error: any) => React.ReactNode
  renderResults: (results: any[]) => React.ReactNode
}


export const SearchList: React.FC<SearchListProps> = ({
                                                 searchQuery,
                                                 renderLoading,
                                                 renderError,
                                                 renderResults
                                               }) => (
  <Subscription subscription={searchSubscription} variables={{ searchQuery }}>
    {({ loading, error, data }) => {
      if (error !== undefined) {
        return renderError(error)
      }

      if (loading) {
        return renderLoading()
      }

      recordedMessages = [...recordedMessages.slice(-20), data]

      return renderResults(recordedMessages)
    }}
  </Subscription>
)