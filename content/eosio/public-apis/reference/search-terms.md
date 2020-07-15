---
weight: 60

pageTitle: Search Terms for EOSIO
pageTitleIcon: eosio

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: Search Terms

BookToC: false
#release: stable

---
## Example queries

* `account:eosio.token receiver:eosio.token (data.from:eoscanadacom OR data.to:eoscanadacom)`
* `(auth:eoscanadacom OR receiver:eoscanadacom)`
* `account:eosio.token action:transfer`
* `(ram.consumed:eoscanadacom OR ram.released:eoscanadacom)`
* `receiver:eosio.token db.table:stats`

## Available query fields

These are the prefixes or fields available for query:

* `action:` is the name of the action executed
* `account:` matches the `account` called on the action. Not to be mixed up with `receiver`. This will match notifications sent from a contract to another account.
* `receiver:` means the account with code that has executed the action. This is unambiguous.
* `act_digest:` the 16 first hex characters of the hash of the binary action payload
* `auth:` means the action was signed with the authority of a given account. The field has two formats:
    * `auth:account` an account, irrespective of the permission which signed the transaction
    * `auth:account@perm` an account and specific permission that signed the transaction, in which this action was declared.
* `scheduled:true` will match deferred transactions
* `notif:true` will match *only* notifications, excluding input action or other inline actions.
* `input:true` will match *only* the top-level actions (those present in the original transactions, and not as a side effect of contract execution).
* `event.sub.fields`: dfuse Events indexing matching specific fields, see [dfuse Events](#dfuse-events) for details.
* `data.sub.fields:` a good number of action-specific fields can be matched for equality. Ex: `data.from` and `data.to` (present in `transfer` operations).
    * lists are flattened, and terms matched when the query is present in the list.
    * nested documents fields are separated by `.`, so `data.user.id:hello` will match the action data: `{"data": {"user": {"id": "hello"}}}`
    * Here is a non-exhaustive list of `data.*` attributes currently indexed: `data.from`, `data.to`, `data.account`, `data.actor`, `data.creator`,  `data.executer`, `data.name`, `data.owner`,  `data.permission`, `data.producer`,  `data.proposal_name`, `data.producer_key`, `data.proposal_hash`, `data.proposer`, `data.producers.*` (nested), `data.voter_name` and many more....
* Hashed data attributes:
  * `data.abi:SHA256` matches `setabi` actions with an ABI data hashing to a given SHA256 fingerprint
  * `data.code:SHA256` matches `setcode` actions with an ABI data hashing to a given SHA256 fingerprint
* RAM operations incurred by action:
    * `ram.consumed:` is set to accounts that have consumed some RAM during an action
    * `ram.released:` is set to accounts that have released some RAM during an action
* Database operations applied by action. All values are name-encoded.
    * `db.table:` supports two values:
         * `[table_name]/[scope]`
         * `[table_name]`
    * All the fields therein are name-encoded (even if somethings it can be the empty string), and are separated by the `/` character.