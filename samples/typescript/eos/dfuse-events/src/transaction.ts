export function createDfuseHooksEventTransaction(actor: string, key: string, data: string) {
  return {
    actions: [
      {
        account: "dfuseiohooks",
        name: "event",
        authorization: [
          {
            actor,
            permission: "active"
          }
        ],
        data: {
          key,
          data
        }
      }
    ]
  }
}
