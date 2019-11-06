---
weight: 30
title: Writing reliably to the chain (push guarantee)
---

{{< row-wrapper >}}

{{< sub-section-title title="Writing reliably to the chain (push guarantee)" protocol="EOS">}}

In this tutorial, we will demonstrate you how to setup `eosjs` to push a
transaction through dfuse API Push Guaranteed endpoint.

The endpoint is 100% compatible with EOS push transaction endpoint. The single
difference is that, when the required headers are present, you'll get the response
back only when your transaction has reach a block, passed 1, 2 or 3 handoffs or is
irreversible (depending on value passed in header `X-Eos-Push-Guarantee`).

You can check the [Push Guaranteed Reference]({{ ref "/reference/eosio/rest/push-transaction }}) for
all details on the feature.

You are going to follow a quick guide to send tokens from one account to another
one on the Jungle 2.0 Test Network using dfuse `push_transaction` with push guaranteed
activated.

For that, you will need an account on the Jungle 2.0 Test Network with some tokens in
it (see https://jungletestnet.io/ `Get Started` tutorial to create an account there and
get some coins).

We are going to use TypeScript in this example, it should be quite easy to convert
the code in here to pure JavaScript if it's what you targets.

### 1. Project Set Up & Dependencies

First, let's create the project and add the required dependencies

{{< tabs "create-project-folder" >}}

{{< tab lang="shell" title="NPM" >}}
mkdir -p example-push-guaranteed
cd example-push-guaranteed
npm init -y
npm install eosjs node-fetch text-encoding
npm install --save-dev typescript ts-node @types/node @types/node-fetch @types/text-encoding
{{< /tab >}}

{{< tab lang="shell" title="Yarn" >}}
mkdir -p example-push-guaranteed
cd example-push-guaranteed
yarn init -y
yarn add eosjs node-fetch text-encoding
yarn add --dev typescript ts-node @types/node @types/node-fetch @types/text-encoding
{{< /tab >}}

{{< /tabs >}}

### 2. Define HTTP Override

When `eosjs` push a transaction, it simply does it by doing an HTTP call. Since
dfuse Push Guaranteed is a drop-in replacement of the native EOSIO `push_transaction`
call, the important call to perform in your application is overriding
`eosjs` HTTP handling so that some extra headers are passed.

The headers that are required:
  - `Authorization: Bearer $DFUSE_API_TOKEN`
  - `X-Eos-Push-Guarantee: in-block | irreversible | handoff:1 | handoffs:2 | handoffs:3`

{{< important >}}
Those two headers needs to be present on your push transaction request otherwise, the
push guaranteed API will not kicked in and you will use the "normal endpoint" in
those situations.
{{< /important >}}

{{< tabs "custom-fetch" >}}
{{< tab-code title="Node.js" filename="./tutorials/eosio/push-guaranteed/index.ts" range="4:4,23:33" >}}
{{< /tabs >}}

{{< note >}}
This add the headers to **all** HTTP queries. It should not be a problem since those headers
would be ignored. You could adapt the code above to only make the changes when the request
is for the push transaction endpoint if you prefer.
{{< /note >}}

### 3. Transfer Transaction

Now, let's define our `main` function that will create the transfer action, package
it in a signed transaction and send it to the EOSIO network.

{{< tabs "main-transfer" >}}
{{< tab-code title="Node.js" filename="./tutorials/eosio/push-guaranteed/index.ts" range="1:3,43:85" >}}
{{< /tabs >}}

### 4. Execute Code

Create a `.env` file with the following content:

{{< code-block lang="shell" >}}
export DFUSE_API_TOKEN=<dfuse API token here>
export TRANSFER_FROM_ACCOUNT=<account name that will send the token>
export SIGNING_PRIVATE_KEY=<account private key here>
{{< /code-block >}}

The `<dfuse API token here>` should be replaced with your dfuse API token,
`<account name that will send the token>` should be replaced with the
account name that will transfer money to someone else (`junglefaucet`) and
`<account private key here>` should be replaced with the private key
controlling the Jungle test net account defined in `TRANSFER_FROM_ACCOUNT`.

**Note** The private key must be able to fullfilled `<from>@active` where the
`<from>` is actually the account name specified in `TRANSFER_FROM_ACCOUNT`.

Load it in your environment (or simple type the `export` commands in your
terminal):

    source .env

Adapt the `push-transaction.ts` script to fit your need

Launch the `push-transaction.ts` script:

    yarn run ts-node push-transaction.ts

### Mainnet/Kylin

If you want to try on Mainnet or Kylin instead, you can provide the following
extra environment variables:

    export DFUSE_API_URL=<https://mainnet.eos.dfuse.io OR https://kylin.eos.dfuse.io>
    export TRANSFER_TO_ACCOUNT=<account name that will receive the token>
    export TRANSFER_QUANTITY=<quantity to transfer, defaults to 0.0001 EOS if unset>

### Security

This repository use an environment variable via `JsSignatureProvider` to store the
private key for **testing** purposes. In a real production environment, always ensure
security of private keys.

Better yet, like state directly in `eosjs` library, use a third-party signing provider:

> The Signature Provider holds private keys and is responsible for signing transactions.

> Using the JsSignatureProvider in the browser is not secure and should only be used for development purposes. Use a secure vault outside of the context of the webpage to ensure security when signing transactions in production


{{< row-wrapper-end >}}
