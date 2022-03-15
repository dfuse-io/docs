# dfuse Documentation

We welcome contributions to improve the documentation. Simply open a pull request to start collaborating!

## Requirements

- Hugo **Extended** (with SCSS support), version 0.58.3 or higher
- Install from source (with SCSS support) with:

```
git clone https://github.com/gohugoio/hugo.git
cd hugo
go install -v --tags extended
```

## Development

To start the hugo server, run this command:

```sh
hugo serve
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

### Example code

Use the following begin and end tags to indicate code sections that need to be referenced:

```javascript
// CODE:BEGIN:quickstarts_javascript_node_eos_section1
function() {
  var some = "code"
}
// CODE:END:quickstarts_javascript_node_eos_section1
```

Section names need to follow the path of the file from project root.
For example the example snippet is from the file:

```markdown
├── quickstarts
│   └── javascript
│       └── node
│           └── index.eos.js
├── guides
└── ...
```

When hugo builds the site, the code sections are extracted and stored in the `data` folder in project root.
Example code can then be referenced with the following shortcode:
```go
{{< code-section "quickstarts_javascript_node_eos_section1" >}}
```

## Lexicon guide

- web application
- website
- dfuse
- real-time
- GraphQL
- API
