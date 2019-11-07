---
title: Billing
weight: 70
---

{{< row-wrapper >}}
{{< sub-section-title title="Billing" >}}

## Subscription plans

dfuse offers a fast and powerful API to interface with blockchains at an affordable price. Our main website [lists the different subscription plans](https://www.dfuse.io/pricing) that are offered at the moment.

You can subscribe to one of those plans by creating an account on our self-service portal and visiting the [My Current Subscription](https://app.dfuse.io/subscription) page. You can start using dfuse immediately after signing up and creating an API key, but you'll be subject to the acceptable use restrictions of our **Free** default plan.

For more information regarding this acceptable use policy, we invite you to read the [Rate Limiting]({{< ref "/guides/core-concepts/rate-limiting" >}}) article.

We recommend you to setup a payment method as soon as you consider using the service for any serious project. You can adjust your subscription plan at any time and we will prorate the payment for the remainder of your billing cycle.

## What are Documents?

A **Document** is a response payload returned by the dfuse API.

Each of our subscription plan includes a fixed number of **Documents**, which we may change over time and are indicated when you setup your subscription. You can use the dfuse API for the fixed monthly price of your subscription, but any extra **Document** passed that threshold will be charged at a per unit price.

Please note that our **Pay-As-You-Go** (**Free** with a registered payment method) is **0.00$** per month up to the acceptable use limit. This is the most flexible option as it does not force you into committing to a monthly subscription, but still ensures that your application will not be impacted if you go beyond the number of free **Documents**.

## How can I know how many Documents I have used?

Login to the Self-Service Portal and visit the [My Current Subscription](https://app.dfuse.io/subscription) page. At the top of the page you will see your **Usage consumption** for the **Last 7 days** and **Last 30 days**.

{{< figure src="/img/usage_consumption.png" width="320" >}}

## How are Documents counted for each API?

### Authentication endpoint (auth.dfuse.io)

Authentication response payloads are free (i.e. they do not count towards your included number of **Documents**). Although, this service is subject to [Rate Limiting]({{< ref "/guides/core-concepts/rate-limiting" >}}).

### REST APIs

When using our REST API, each HTTP response counts as one (1) **Document**, but it is important to note that in the case of the REST API Search, which may return hundreds of results, each result counts as a **Document**. For instance, a search query returning 75 results, will be billed as 75 **Documents**.

### WebSocket

Opening a connection does not incur any charge. All of our WebSocket APIs are streaming-oriented meaning that a long running connection will be expected to receive multiple results and each of those will count as a **Document**.

### GraphQL (over WebSocket or gRPC)

Opening a connection does not incur any charge. A GraphQL **Query** response will either count as one (1) **Document** or multiple **Documents** in the case of a list of results (ex. `searchTransactionsForward`). Similarly, a streaming GraphQL **Subscription** will be charged as many **Documents** as you receive response payloads during its lifetime.

{{< row-wrapper-end >}}