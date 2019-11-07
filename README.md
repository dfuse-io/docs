# dfuse Documentation

We welcome contributions to improve the documentation. Simply open a pull request to start collaborating!

## Requirements

- Hugo **Extended** (with SCSS support), version 0.58.3 or higher
- Install from source (with SCSS support) with:

```
git checkout github.com/gohugoio/hugo
cd hugo
go install -v --tags extended
```

## Development

To start the hugo server, run this command:

```sh
hugo server
```

## Content Structure

All content can be found in the `/content` directory. The structure of the website is generated automatically based on the structure of that directory.

## Style guide

### Links

  - [1.1](#types--primitives) **external**: When you insert an external link use the `external-link` shortcode

    ```markdown
    {{< external-link href="https://app.dfuse.io" title="dfuseio" >}}
    {{< external-link href="https://app.dfuse.io">}}
    ```

- [1.2](#types--primitives) **internal references**: Please put all _internal references_ as _full paths_, for greppability and refactoring.

## Lexicon guide

- web application
- website
- dfuse
- real-time
- GraphQL
- API

## Deployment

Any commit to master automatically triggers a deployment. For this reason, the master branch is locked, requiring all changes to go through an approved pull request.


Reference
ETH -=> Endpoint ALPHA

<new> side menu


alpha (red)
beta (yeallo-orangy)
stage (light gray)
add sub-title to graphql shortcode
fix

refactor pages
