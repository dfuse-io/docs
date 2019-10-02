---
weight: 1
---

# Search

## dfuse Events

dfuse Events are a powerful way to give smart contract developers a way to ask dfuse Search to index their transactions, with arbitrary key/value pairs.

From within you smart contract, by simply sending an inline action to `dfuseiohooks:event`, you can instruct dfuse Search to index some fields with arbitrary data (within limits).

Once on chain, the search term `event.field:value` will allow you to retrieve those actions, anywhere on the dfuse Platform.

## Getting Started

Say a smart contract manages virtual pets. Each pet has a unique ID and a `kind` (`dog`, `cat`, `mouse`, `rabbit`).

Say you have an action `train(pet_id)` that trains and increases whatever features of your pet.

If you want to list all trainings for dogs, you're short of luck: the action does not contain the `kind` of pet being trained here.

By adding an inline action to `dfuseiohooks:event` in your smart contract, and exfiltrating the missing bit of data, such as `pet_kind=dog` in the `data` field, you will immediately be able to search for `event.pet_kind:dog action:train receiver:yourcontract` anywhere on the dfuse Platform.

The gist of the EOSIO contract implementation is:

{{< highlight cpp >}}
const std::string& pet_kind = get_pet_kind(pet_id);

eosio::action(
    std::vector<permission_level>(),
    "dfuseiohooks"_n,
    "event"_n,
    std::make_tuple(
      // Parameter `auth_key`
      std::string(""),
      // Parameter `data`
      std::string("pet_id=" + pet_id + "&pet_kind=" + pet_kind)
    )
).send_context_free();
{{< /highlight >}}


## Example contract

See an [example implementation](https://github.com/dfuse-io/example-dfuse-events/blob/master/contract/src/eospetgameio.cpp) from a [sample smart contract](https://github.com/dfuse-io/example-dfuse-events/blob/master/contract).


## Specifications

**Destination**: The inline action must be sent to contract `dfuseiohooks` with the action name `event`. The action signature is: `event(string auth_key, string data)`.

**Cost**: be cheap, and use an inline _context-free_ action to have minimal impact on transaction costs.  Also, there will never be code deployed on `dfuseiohooks`, so it executes extremely fast.

**Authorization**: Specify no authorization (`std::vector<permission_level>()`) when issuing a _context-free_ action.

**Indexing**: Only ONE such event per action will be indexed. If limits aren't breached, the parameters in `data` will be indexed as `event.field` in dfuse Search, attached to the action that **created** the inline to `dfuseiohooks:event`.  This allows you to search for `receiver:yourcontract event.field:value` or other combinations.

## Action parameters

Name | Type | Options | Description
-----|------|---------|------------
`auth_key` | string | required | The empty string (limited access) or a valid _dfuse Events Key_ if you have one. See [Indexing Limits](#dfuse-events-indexing-limits) for details.
`data` | string | required | A string containing the key/value pair list to index, as an [RFC 3986](https://tools.ietf.org/html/rfc3986) URL encoded string (i.e. `key1=value1&key2=value2`).

## Indexing Limits

An empty `auth_key` parameter imposes those limits to the indexing:

- A key/value pair under `data` is indexed only if:
    - the key has 16 characters or less
    - the value has 64 characters or less
    - there are no more than 3 keys (for unauthenticated calls)

If you need more than 3 key/values or want more than 64 bytes of value data, contact us to get a _dfuse Events Key_ for your contract.

{{< note >}}
If your `auth_key` is invalid or used within the wrong contract account, normal restrictions apply.
{{< /note >}}

## Search Query Language Specs

**dfuse Search** uses a simplified query language to reach unparalleled and predictable performances.

It is similar to GitHub's query language for issues and pull requests: it has a default `AND` operator between each query term. _Search_ adds a simple, one-level `OR` layer enclosed in parentheses.

You can enclose parameters using double-quotes after the `:`, or use a
single keyword. For example: `auth:eoscanadacom` or `auth:"eoscanadacom"`.

**Boolean support**: only `true` and `false` have special meaning when not using quotes: `input:true` queries for a boolean value, while `input:"true"` searches for a string value.

## Example queries

* `account:eosio.token receiver:eosio.token (data.from:eoscanadacom OR data.to:eoscanadacom)`
* `(auth:eoscanadacom OR receiver:eoscanadacom)`
* `account:eosio.token action:transfer`
* `(ram.consumed:eoscanadacom OR ram.released:eoscanadacom)`
* `receiver:eosio.token db.key:"accounts/eoscanadacom/........ehbo5"`
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
* `status:executed` will match the status of the transaction, here, only `executed`. NOTE: if `status` is not specified, an implicit `status:executed` is added to the query.
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
* Database operations applied by action. All values are name-encoded (including the primary key)
    * `db.key:` supports two values:
         * `[table_name]/[scope]/[primary-key]`
         * `[primary-key]`
    * `db.table:` supports two values:
         * `[table_name]/[scope]`
         * `[table_name]`
    * `db.scope:[scope]`
    * All the fields therein are name-encoded (even if somethings it can be the empty string), and are separated by the `/` character.