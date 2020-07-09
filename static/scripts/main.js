/**
 * Adds a "copy" button to all code tabs
 */
function addCopyButtons(clipboard) {
  document.querySelectorAll('.book-tabs pre > code').forEach(function (codeBlock) {
    var button = document.createElement('button');
    button.className = 'copy-code-button';
    button.type = 'button';
    button.innerText = 'Copy';

    button.addEventListener('click', function () {
      clipboard.writeText(codeBlock.innerText).then(function () {
        /* Chrome doesn't seem to blur automatically,
            leaving the button in a focused state. */
        button.blur();

        button.innerText = 'Copied!';

        setTimeout(function () {
            button.innerText = 'Copy';
        }, 2000);
      }, function (error) {
        button.innerText = 'Error';
      });
    });

    var pre = codeBlock.parentNode;
    if (pre.parentNode.classList.contains('highlight')) {
        var highlight = pre.parentNode;
        highlight.parentNode.insertBefore(button, highlight);
    } else {
      pre.parentNode.insertBefore(button, pre);
    }
  });
}

// Progressive enhancement
if (navigator && navigator.clipboard) {
  addCopyButtons(navigator.clipboard);
}


/**
 * Client-side redirects. This is necessary because the old version of the docs was built on Slate,
 * which has no routing at all. Everything was concatenated on one page, and all linking was done
 * through #url-fragments, which don't get sent to the server, preventing us from using Hugo aliases.
 * This list should not be extended, use Hugo aliases instead.
 *
 * The keys of the map are the new urls, and the arrays are the old urls are need to map to them
 *
 * As a general rule of thumb, if there is an exact match between the old page and the new page, we take
 * the user there. If the page doesn't exist anymore, we try to take them to the most similar page if we can.
 */
const redirectMap = {
  "/": [
    "/#introduction",
    "/#resources",
    "/#release-notes",
    '/#type-Transaction',
  ],
  "/guides/getting-started/": ["/#getting-started"],
  "/guides/eosio/getting-started/with-javascript/": ["/#get-started-dfuse-client-js"],
  "/guides/eosio/getting-started/with-python/": ["/#get-started-graphql-over-grpc-python"],
  "/guides/eosio/getting-started/with-go/": ["/#get-started-graphql-over-grpc-grpcurl"],
  "/guides/eosio/getting-started/with-other-languages/": ["/#get-started-other-languages"],
  "/guides/core-concepts/authentication/": [
    "/#authentication",
    "/#issuing-a-short-lived-jwt",
    "/#key-types--rate-limiting",
    "/#rest-authentication",
    "/#websocket-authentication",
    "/#graphql-authentication",
    "/#graphql-over-grpc-authentication",
  ],
  "/eosio/reference/graphql/": [
    "/#queries",
    "/#subscriptions",
    "/#graphql",
    "/#getting-started-with-graphql",
    "/#paginated-queries",
    "/#navigating-forks-searching-graphql",
    "/#graphql-api-reference",
  ],
  "/guides/core-concepts/graphql/": [
    "/#transports",
    "/#graphql-over-rest",
    "/#apollo-subscription-transport",
    "/#graphql-over-grpc",
    "/#searching-through-graphql",
    "/#graphql-sample-queries",
    "/#graphql-over-grpc-grpcurl",
  ],
  "/guides/eosio/tutorials/": ["/#get-started-tutorials"],
  "/eosio/reference/endpoints/": ["/#endpoints"],
  "/reference/ethereum/endpoints/": [
    "/#eth-mainnet",
    "/#ropsten-mainnet",
  ],
  "/eosio/reference/endpoints/": [
    "/#eosio---mainnet",
    "/#eosio---cryptokylin",
    "/#eosio---testnet",
    "/#worbli---mainnet",
  ],
  "/eosio/reference/websocket/introduction": [
    "/#websocket",
    "/#websocket-request-types",
  ],
  "/eosio/reference/websocket/request-message-format/": ["/#websocket-request-message-format"],
  "/eosio/reference/websocket/never-missing-a-beat/": ["/#websocket-never-miss-a-beat"],
  "/eosio/reference/websocket/navigating-forks/": ["/#websocket-navigating-forks"],
  "/eosio/reference/websocket/req-get-action-traces/": ["/#websocket-get-action-traces"],
  "/eosio/reference/websocket/req-get-transaction-lifecycle/": ["/#websocket-get-transaction-lifecycle"],
  "/eosio/reference/websocket/req-get-table-rows/": ["/#websocket-get-table-rows"],
  "/eosio/reference/websocket/req-get-head-info/": ["/#websocket-get-head-info"],
  "/eosio/reference/websocket/req-unlisten/": ["/#websocket-req-unlisten"],
  "/eosio/reference/websocket/req-ping/": ["/#websocket-req-ping"],
  "/eosio/reference/websocket/responses/": [
    "/#websocket-responses",
    "/#websocket-resp-listening",
    "/#websocket-resp-progress",
    "/#websocket-resp-error",
  ],

  "/reference/": [
    "/#rest-api",
    "/#types",
  ],
  "/eosio/reference/rest/auth-issue-intro/": ["/#post-v1-auth-issue"],
  "/eosio/reference/rest/block-id-by-time/": [
    "/#rest-get-v0-block_id-by_time",
    "/#rest-api-get-v0-block_id-by_time",
  ],
  "/eosio/reference/rest/fetch-transaction/": [
    "/#rest-get-v0-fetch-transaction",
    "/#rest-api-get-v0-transaction_id",
  ],
  "/eosio/reference/rest/push-transaction/": [
    "/#span-classpostpostspan-pushtransaction",
    "/#rest-api-post-v1-push-transaction",
  ],
  "/eosio/reference/rest/search-transactions/": [
    "/#rest-get-v0-search-transactions",
    "/#rest-api-get-v0-search-transactions",
    "/#ref-search-pagination",
  ],
  "/eosio/reference/rest/state-abi/": [
    "/#rest-get-v0-state-abi",
    "/#rest-api-get-v0-state-abi",
  ],
  "/eosio/reference/rest/state-abi-decode/": [
    "/#rest-get-v0-state-abi-decode",
    "/#rest-api-get-v0-state-abi-decode",
  ],
  "/eosio/reference/rest/state-key-accounts/": ["/#rest-get-v0-state-key-accounts"],
  "/eosio/reference/rest/state-permission-links/": [
    "/#rest-get-v0-state-permission_links",
    "/#rest-api-get-v0-state-permission_links",
  ],
  "/eosio/reference/rest/state-table/": [
    "/#rest-get-v0-state-table",
    "/#rest-api-get-v0-state-table",
    "/#state-table-KeyType",
  ],
  "/eosio/reference/rest/state-table-row/": [
    "/#rest-get-v0-state-table-row",
    "/#type-state-TableRow",
  ],
  "/eosio/reference/rest/state-table-scopes/": [
    "/#rest-get-v0-state-table-scopes",
    "/#rest-api-get-v0-state-table-scopes",
  ],
  "/eosio/reference/rest/state-tables-accounts/": [
    "/#rest-get-v0-state-tables-accounts",
    "/#rest-api-get-v0-state-tables-accounts",
  ],
  "/eosio/reference/rest/state-tables-scopes/": ["/#rest-get-v0-state-tables-scopes"],
  "/eosio/reference/rest/errors/": ["/#rest-errors"],
  "/eosio/reference/search-terms/": [
    "/#search",
    "/#dfuse-query-language",
    "/#ref-search-query-specs",
    "/#ref-query-language",
  ],
  "/eosio/reference/dfuse-events/": [
    "/#dfuse-events",
    "/#dfuse-events-indexing-limits",
  ],
  "/eosio/reference/types/name": [
    "/#type-Name",
    "/#type-name",
  ],
  "/eosio/reference/types/accountname": ["/#type-AccountName"],
  "/eosio/reference/types/actionname": ["/#type-ActionName"],
  "/eosio/reference/types/permissionname": ["/#type-PermissionName"],
  "/eosio/reference/types/tablename": ["/#type-TableName"],
  "/eosio/reference/types/publickey": ["/#type-PublicKey"],
  "/eosio/reference/types/tablesnapshotresponse": ["/#type-TableSnapshotResponse"],
  "/eosio/reference/types/tablerows": ["/#type-TableRows"],
  "/eosio/reference/types/tabledeltaresponse": ["/#type-TableDeltaResponse"],
  "/eosio/reference/types/tabledelta": ["/#type-TableDelta"],
  "/eosio/reference/types/stateresponse": ["/#type-StateResponse"],
  "/eosio/reference/types/statetablerowresponse": ["/#type-StateTableRowResponse"],
  "/eosio/reference/types/multistateresponse": ["/#type-MultiStateResponse"],
  "/eosio/reference/types/actiontrace": ["/#type-ActionTrace"],
  "/eosio/reference/types/creationtree": ["/#type-CreationTree"],
  "/eosio/reference/types/creationtreenode": ["/#type-CreationTreeNode"],
  "/eosio/reference/types/dbop": ["/#type-DBOp"],
  "/eosio/reference/types/dbrow": ["/#type-DBRow"],
  "/eosio/reference/types/dtrxop": [
    "/#type-DTrxOp",
    "/#type-DTrxOps",
  ],
  "/eosio/reference/types/extdtrxop": ["/#type-ExtDTrxOp"],
  "/eosio/reference/types/ramop": ["/#type-RAMOp"],
  "/eosio/reference/types/tableop": ["/#type-TableOp"],
  "/eosio/reference/types/searchtransactionsresponse": ["/#type-SearchTransactionsResponse"],
  "/eosio/reference/types/searchtransactionsrow": ["/#type-SearchTransactionsRow"],
  "/eosio/reference/types/transactionlifecycleresponse": ["/#type-TransactionLifecycleResponse"],
  "/eosio/reference/types/transactionlifecycle": ["/#type-TransactionLifecycle"],
  "/eosio/reference/types/transactiontrace": ["/#type-TransactionTrace"],
  "/eosio/reference/types/headinfo": ["/#type-HeadInfo"],
  "/eosio/reference/types/linkedpermission": ["/#type-state-LinkedPermission"],
 }

 const flattenedRedirectMap = Object.keys(redirectMap).reduce((map, newUrl) => {
  redirectMap[newUrl].forEach(oldUrl => {
    map[oldUrl] = newUrl;
  })
  return map;
 }, {})

 const pathWithFragment = location.pathname + location.hash;
 const redirectTo = flattenedRedirectMap[pathWithFragment];

 // @TODO Should we log URLs that don't match our patterns to find cases
 // we are not aware of? Maybe there's a blog somewhere linking to a very
 // old URL we missed.
 if (redirectTo) {
   location.href = redirectTo;
 }


 /**
  * NOTE: The TOC is generated here at run-time. This is because shortcodes/partials are run AFTER
  * the TOC is generated, so any headings created by a partial are not taken into account.
  */
 const tableOfContents = document.createElement('ul');
 const parser = new DOMParser();

 document.querySelector('.book-page').querySelectorAll('h1, h2, h3, h4, h5').forEach(heading => {
   if (heading.getAttribute("toc-hidden") == "true") {
     return;
   }
   const link = document.createElement('a')
   link.innerText = heading.innerText;
   link.setAttribute('href', `#${heading.id}`);
   link.setAttribute('class', `toc-level-${heading.tagName}`)

   tableOfContents.appendChild(document.createElement('li').appendChild(link))
   console.log(heading)
 })

 var x = document.querySelector('#TableOfContents ul');
 if (x != null) {
   x.replaceWith(tableOfContents);
 }
