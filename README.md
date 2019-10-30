# dfuse Documentation

We welcome contributions to improve the documentation. Simply open a pull request to start collaborating!

## Requirements

- Hugo **Extended** (with SCSS support), version 0.55 or higher

## Development

To start the hugo server, run this command:

```sh
hugo server
```

## Content Structure

All content can be found in the `/content` directory. The structure of the website is generated automatically based on the structure of that directory.

## Style guide

### Links
  - [1.1](#types--primitives) **external**: When you insert an external link use the `externalLink` shortcode
    ```markdown
    {{<externalLink href="https://app.dfuse.io" title="dfuseio>}}
    {{<externalLink href="https://app.dfuse.io">}}
    ```
 
## Deployment

Any commit to master automatically triggers a deployment. For this reason, the master branch is locked, requiring all changes to go through an approved pull request.
