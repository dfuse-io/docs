---
weight: 30

#TODO: Find a better title
pageTitle: Writing reliably to the chain (push guarantee)
pageTitleIcon: eosio

sideNav: true
sideNavTitle: Public APIs
sideNavLinkRename: Writing On Chain

BookToC: true
#release: stable

---

In this tutorial, we will demonstrate you how to setup `eosjs` to push a
transaction through dfuse API Push Guaranteed endpoint.

The endpoint is 100% compatible with EOS push transaction endpoint. The single
difference is that, when the required headers are present, you'll get the response
back only when your transaction has reach a block, passed 1, 2 or 3 handoffs or is
irreversible (depending on value passed in header `X-Eos-Push-Guarantee`).

You can check the [Push Guaranteed Reference]({{< ref "/eosio/public-apis/reference/rest/post-chain-push_transaction" >}}) for
all details on the feature.

You are going to follow a quick guide to send tokens from one account to another
one on the Kylin Test Network using dfuse `push_transaction` with push guaranteed
activated.

For that, you will need an account on the Kylin Test Network with some tokens in
it (see https://cryptokylin.io/ `Get Started` tutorial to create an account there and
get some coins).

We are going to use TypeScript in this example, it should be quite easy to convert
the code in here to pure JavaScript if it's what you targets.

### 1. Project Set Up & Dependencies

Foremost, be sure to have a valid dfuse API key at hand.

{{< dfuse-account-creation >}}

Let's create the project and add the required dependencies.

{{< tabs "create-project-folder" >}}

{{< tab lang="shell" title="NPM" >}}
mkdir -p example-push-guaranteed
cd example-push-guaranteed
npm init -y
npm install @dfuse/client eosjs node-fetch text-encoding
npm install --save-dev typescript ts-node @types/node @types/node-fetch @types/text-encoding
{{< /tab >}}

{{< tab lang="shell" title="Yarn" >}}
mkdir -p example-push-guaranteed
cd example-push-guaranteed
yarn init -y
yarn add @dfuse/client eosjs node-fetch text-encoding
yarn add --dev typescript ts-node @types/node @types/node-fetch @types/text-encoding
{{< /tab >}}

{{< /tabs >}}

### 2. Configure & Create dfuse Client

All dfuse API calls must be authenticated using a an API token that is generated
by using your API key. The easiest way to go for this is using the `@dfuse/client`
that will make all the heavy lifting of managing the API token for us.

You will also see a `readConfig` function that reads the script configuration form
the various environment variables, check at the end of this page to see the
definition of this code.

{{< tabs "config-and-client" >}}
{{< tab lang="typescript" title="TypeScript">}}
{{< code-section "tutorials_eos_push-guaranteed_section3">}}
{{< /tab >}}
{{< /tabs >}}

{{< alert type="note" >}}
Explaining the `@dfuse/client` is out of scope for this tutorial. Refer to the
[JavaScript Quickstart]({{< ref "/eosio/public-apis/getting-started/javascript-quickstart" >}}) for
further details about the `@dfuse/client` library.
{{< /alert >}}

### 3. Define HTTP Override

When `eosjs` push a transaction (or make any `/v1/chain` calls in fact), it simply does
it by doing an HTTP call. Since dfuse Push Guaranteed is a drop-in replacement of the
native EOSIO `push_transaction` call, the most important part to perform in your
application is overriding `eosjs` HTTP handling so that some extra headers are passed.

The headers that are required:
  - `Authorization: Bearer $DFUSE_API_TOKEN`
  - `X-Eos-Push-Guarantee: in-block | irreversible | handoff:1 | handoffs:2 | handoffs:3`

{{< alert type="important" >}}
Those two headers needs to be present on your push transaction request otherwise, the
push guaranteed API will not kicked in and you will use the "normal endpoint" in
those situations.
{{< /alert >}}

{{< tabs "custom-fetch" >}}
{{< tab lang="typescript" title="TypeScript">}}
{{< code-section "tutorials_eos_push-guaranteed_section2">}}
{{< code-section "tutorials_eos_push-guaranteed_section4">}}
{{< /tab >}}
{{< /tabs >}}

{{< alert type="note" >}}
This adds the headers to **all** HTTP queries and routes all traffic to dfuse endpoint.
You could adapt the code above to only make the changes when the request is for the
push transaction endpoint if you prefer and route all other requests to a different endpoint.
{{< /alert >}}

### 4. Transfer Transaction

Now, let's define our `main` function that will create the transfer action, package
it in a signed transaction and send it to the EOSIO network.

We go fast over it, but the code is simply creating an `eosio.token:transfer` action
with the correct parameters and push all that through

{{< tabs "main-transfer" >}}
{{< tab lang="typescript" title="TypeScript">}}
{{< code-section "tutorials_eos_push-guaranteed_section1">}}
{{< code-section "tutorials_eos_push-guaranteed_section5">}}
{{< /tab >}}
{{< /tabs >}}

#### Security

We use an environment variable via `JsSignatureProvider` to store the
private key for **testing** purposes. In a real production environment, always ensure
security of your private keys.

Better yet, like stated directly in `eosjs` library, use a third-party signing provider:

> The Signature Provider holds private keys and is responsible for signing transactions.
> Using the JsSignatureProvider in the browser is not secure and should only be used for development purposes. Use a secure vault outside of the context of the webpage to ensure security when signing transactions in production

### 5. Execute Code

Run the following commands from your terminal:

<!-- Renders better with typescript -->
{{< highlight "typescript" >}}
export DFUSE_API_KEY="<dfuse API key here>"
export TRANSFER_FROM_ACCOUNT="<account name that will send the token>"
export SIGNING_PRIVATE_KEY="<account private key here>"
{{< /highlight >}}

The `<dfuse API key here>` should be replaced with your dfuse API key,
`<account name that will send the token>` should be replaced with the
account name that will transfer money to someone else and
`<account private key here>` should be replaced with the private key
controlling the Kylin test net account defined in `TRANSFER_FROM_ACCOUNT`.

**Note** The private key must be able to fulfill `<from>@active` where the
`<from>` is actually the account name specified in `TRANSFER_FROM_ACCOUNT`.

Then launch the `index.ts` script to see the transaction being pushed to
the network and waiting for the guaranteed condition to be met prior returning
from the `api.transac` call:

{{< tabs "execute-script" >}}

{{< tab lang="shell" title="NPM" >}}
./node_modules/bin/ts-node index.ts
{{< /tab >}}

{{< tab lang="shell" title="Yarn" >}}
yarn ts-node index.ts
{{< /tab >}}

{{< /tabs >}}

{{< alert type="note" >}}
If you want to try on EOS Mainnet or Kylin instead, you can provide the following
extra environment variables:

<!-- Renders better with typescript -->
{{< highlight typescript >}}
export DFUSE_API_NETWORK="<mainnet.eos.dfuse.io OR kylin.eos.dfuse.io>"
export TRANSFER_TO_ACCOUNT="<account name that will receive the token>"
export TRANSFER_QUANTITY="<quantity to transfer, defaults to 0.0001 EOS if unset>"
{{< /highlight >}}
{{< /alert >}}

### 6. Support Code

And for sake of completion, here are the supporting code used throughout the
tutorial to make reading easier:

{{< tabs "support-code" >}}
{{< tab lang="typescript" title="TypeScript">}}
{{< code-section "tutorials_eos_push-guaranteed_section6">}}
{{< /tab >}}
{{< /tabs >}}

## 7. Full Working Example

{{< tabs "full-working">}}

{{< tab lang="shell" title="TypeScript">}}
git clone https://github.com/dfuse-io/docs
cd docs/tutorials/eos/push-guaranteed
yarn install

# Replace '<dfuse API key here>' with your own API key!
export DFUSE_API_KEY="<dfuse API key here>"
export TRANSFER_FROM_ACCOUNT="<account name that will send the token>"
export SIGNING_PRIVATE_KEY="<account private key here>"

yarn ts-node index.ts
{{< /tab >}}
{{< /tabs >}}
