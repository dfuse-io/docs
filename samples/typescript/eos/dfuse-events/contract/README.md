## An example contract for dfuse Events

The purpose of this repository is to demonstrate a sample
EOS smart contract leveraging dfuse Events to control indexing
of those transactions within dfuse Search.

The general idea behind dfuse Events is to send an inline context-free
action `dfuseiohooks:event(auth_key, url_encoded_fields)` acting
as a marker for dfuse Search to index the calling action (your
contract's action) based value in the `url_encoded_fields` parameter.

Let's break that down in much smaller steps. To start the example,
let's use a fictive business use case.

Assume a smart contract that trains pets, each pet
having a unique id (an eosio `name`) and a kind
(one of `dog`, `cat`, `mouse` and `rabbit`). This smart contract
has a `train(pet_id)` action that train a pet.

Now, you would like to search the blockchain to easily find all
transaction containing action for specific kind of pets, like all
dogs.

First step is to modify a bit contract's `train` action so that it
sends an inline context-free action `dfuseiohooks:event`.

The inline context-free action parameters must be provided using
a strict pre-defined format to be correctly indexed by dfuse Search.

The first parameter `auth_key` is a string that must be the empty string
`""` or a currently valid dfuse Events key that we
can provide to you to lift built-in indexing limits (max
3 fields, max of 16 characters per field's name, max 64 characters
per field's value).

**Note** Contact us directly to request a dfuse Events key.

The second parameter `data` is a string containing an url encoded
string representing a key/value pair list. For example, the string
`pet_id=blurrycat&trainer=b1` represents the key/value pair list
`[{ key: "pet_id", value: "blurrycat" }, { key: "trainer", value: "b1" }]`.

So, let's go ahead, from our contract's `train` action, let's
instruct dfuse Search to index by `pet_id` and by `pet_kind`:

```
const std::string& pet_kind = get_pet_kind(pet_id);

eosio::action(
    std::vector<permission_level>(),
    "dfuseiohooks"_n,
    "event"_n,
    std::make_tuple(
        std::string(""),
        std::string("pet_id=" + pet_id.to_string() + "&pet_kind=" + pet_kind)
    )
).send_context_free();
```

This snippet of code create's an action `dfuseioshooks:event` (
`"dfuseiohooks"_n, "event"_n` arguments) with
no authorization (`std::vector<permission_level>()`, need to be empty
since it will be a context-free action) with the first parameter
being the empty string (the key) and the second one being an url
encoded string with first key/value pair being the `pet_id:<pet_id>`
received and second key/value pair being the `pet_kind:<pet_kind>`
received.

When your transaction will be accepted by the blockchain, dfuse Search
will be notified, it will first check the `auth_key` parameter of the
`dfuseiohooks:event` inline action to ensures it the empty string
or a valid dfuse Events key to decide of which indexing restrictions to apply.

It will decode the second parameter of the `dfuseiohooks:event`
action, turn it into a list of key/value pair and will then
index the transaction that send the inline action specially,
assigning each of the decomposed field to the `event.<field>:<value>`
SQE field.

Now that the action has been indexed, you can easily search
for those only actions you are interested in.

- Search all `train` action that had `pet_kind` set to dog with
`event.pet_kind:dog receiver:eospetgameio`

- Search all `train` action that had `pet_id` sets to `blurrycat`
with `event.pet_id:blurrycat receiver:eospetgameio`

**Important** The `receiver:<contract>` should always be used to
ensure that it was really **your** `<contract>` that sent the inline action.
You would not like someone doing the same `pet_id=blurrycat&pet_kind=cat`
fields indexing to be included in your search's results!

You can check the results getting out of a test account in eosq.app
directly: [event.pet_kind:rabbit receiver:eospetgameio](https://eosq.app/search?q=event.pet_kind%253Arabbit%2520receiver%253Aeospetgameio)

Congratulations, you have solved your use case of finding
all transactions dealing with a specific kind of pets, or even
a particular pet using its id.
