---
weight: 20
title: Using dfuse Events
---
dfuse Events are a powerful way to give smart contract developers a
way to ask dfuse Search to index their transactions, with arbitrary
key/value pairs.

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

See an {{< external-link title="example implementation](https://github.com/dfuse-io/example-dfuse-events/blob/master/contract/src/eospetgameio.cpp) from a [sample smart contract" href="https://github.com/dfuse-io/example-dfuse-events/blob/master/contract" >}}.
