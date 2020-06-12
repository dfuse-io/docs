## dfuse API Push Guaranteed Example (via `eosjs`)

This repository sole purposes is to demonstrate you to setup `eosjs` to push a
transaction through dfuse API Push Guaranteed endpoint.

The endpoint is 100% compatible with EOS push transaction endpoint. The single
difference is that, when the required headers are present, you'll get the response
back only when your transaction has reach a block, passed 1, 2 or 3 handoffs or is
irreversible (depending on value passed in header `X-Eos-Push-Guarantee`).

See https://docs.dfuse.io/#rest-api-post-push_transaction

## Quick Start

You are going to follow a quick guide to send tokens from one account to another
one on the Kylin Test Network using dfuse `push_transaction` with push guaranteed
activated.

For that, you will need an account on the Kylin Test Network with some tokens in
it (see https://cryptokylin.io/ `Get Started` tutorial to create an account there and
get some coins), a dfuse API key (check https://www.dfuse.io/en#subscribe to get a free
API token).

    yarn install

Run the following commands from your terminal:

    export DFUSE_API_KEY="<dfuse API key here>"
    export TRANSFER_FROM_ACCOUNT="<account name that will send the token>"
    export SIGNING_PRIVATE_KEY="<account private key here>"

The `<dfuse API key here>` should be replaced with your dfuse API key,
`<account name that will send the token>` should be replaced with the
account name that will transfer money to someone else and
`<account private key here>` should be replaced with the private key
controlling the Kylin test net account defined in `TRANSFER_FROM_ACCOUNT`.

**Note** The private key must be able to fulfill `<from>@active` where the
`<from>` is actually the account name specified in `TRANSFER_FROM_ACCOUNT`.

Launch the `index.js` script to see stuff going on:

    yarn run start

### Security

This repository use an environment variable via `JsSignatureProvider` to store the
private key for **testing** purposes. In a real production environment, always ensure
security of private keys.

Better yet, like state directly in `eosjs` library, use a third-party signing provider:

> The Signature Provider holds private keys and is responsible for signing transactions.

> Using the JsSignatureProvider in the browser is not secure and should only be used for development purposes. Use a secure vault outside of the context of the webpage to ensure security when signing transactions in production

### EOS Mainnet/Kylin

If you want to try on EOS Mainnet or Kylin instead, you can provide the following
extra environment variables:

    export DFUSE_API_NETWORK="<mainnet.eos.dfuse.io OR kylin.eos.dfuse.io>"
    export TRANSFER_TO_ACCOUNT="<account name that will receive the token>"
    export TRANSFER_QUANTITY="<quantity to transfer, defaults to 0.0001 EOS if unset>"

### Other Guaranteed Option

It's possible to specify `PUSH_GUARANTEED` environment variable to test out
the various values for the push guaranteed. Valid values are:

- `in-block`
- `handoff:1`
- `handoffs:2`
- `handoffs:3`
- `irreversible`

See https://docs.dfuse.io/#rest-api-post-push_transaction

### Headers

- `Authorization: Bearer $DFUSE_API_TOKEN`
- `X-Eos-Push-Guarantee: in-block | handoff:1 | handoffs:2 | handoffs:3 | irreversible`
