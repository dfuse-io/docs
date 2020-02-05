
export interface SearchResult {
  cursor: string
  undo: boolean
  trace: TransactionTrace
}

export interface ActionTrace {
  account: string
  data: any
  name: string
  receiver: string
}

export interface TransactionTrace {
  id: string
  status: string
  block: {
    id: string
    num: number
    timestamp: string
  }
  executedActions: ActionTrace[]
}

/**
 * Mapping from "<action-acccount>:<action-name>": count
 * used to render stats.
 **/
export interface ActionMap {
  [key:string]: number
}
