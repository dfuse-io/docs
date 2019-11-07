## Requirements

- Hugo 0.55 or higher
- Hugo extended version, read more [here](https://gohugo.io/news/0.48-relnotes/)

# Hugo Book Theme

This project is based on the Book Hugo Theme.

[![Hugo](https://img.shields.io/badge/hugo-0.55-blue.svg)](https://gohugo.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Development

To start the hugo server, run this command:

```sh
hugo server
```

## Menu

### File tree menu (default)

By default theme will render pages from `content/docs` section as menu in a tree structure.
You can set `title` and `weight` in front matter of pages to adjust order and titles in menu.

### Leaf bundle menu

You can also use leaf bundle and content of it's `index.md` as menu.
Given you have this file structure

```
├── content
│   ├── docs
│   │   ├── page-one.md
│   │   └── page-two.md
│   └── posts
│       ├── post-one.md
│       └── post-two.md
```

Create file `content/docs/menu/index.md` with content

```md
+++
headless = true
+++

- [Book Example](/docs/)
  - [Page One](/docs/page-one)
  - [Page Two](/docs/page-two)
- [Blog](/posts)
```

And Enable it by settings `BookMenuBundle: /menu` in Site configuration

- [Example menu](https://github.com/alex-shpak/hugo-book/blob/master/exampleSite/content/menu/index.md)
- [Example config file](https://github.com/alex-shpak/hugo-book/blob/master/exampleSite/config.yaml)
- [Leaf bundles](https://gohugo.io/content-management/page-bundles/)

## Blog

Simple blog supported for section `posts`

## Configuration

### Site Configuration

There are few configuration options you can add to your `config.toml` file.
You can also see `yaml` example [here](https://github.com/alex-shpak/hugo-book/blob/master/exampleSite/config.yaml).

```toml
# (Optional) Set this to true if you use capital letters in file names
disablePathToLower = true

# (Optional) Set this to true to enable 'Last Modified by' date and git author
#  information on 'doc' type pages.
enableGitInfo = true

# (Optional) Theme is intended for documentation use, therefore it doesn't render taxonomy.
# You can remove related files with config below
disableKinds = ['taxonomy', 'taxonomyTerm']

[params]
# (Optional, default 6) Set how many table of contents levels to be showed on page.
# Use false to hide ToC, note that 0 will default to 6 (https://gohugo.io/functions/default/)
# You can also specify this parameter per page in front matter
BookToC = 3

# (Optional, default none) Set the path to a logo for the book. If the logo is
# /static/logo.png then the path would be 'logo.png'
BookLogo = 'logo.png'

# (Optional, default none) Set leaf bundle to render as side menu
# When not specified file structure and weights will be used
BookMenuBundle = '/menu'

# (Optional, default docs) Specify section of content to render as menu
# You can also set value to "*" to render all sections to menu
BookSection = 'docs'

# (Optional) This value is duplicate of $link-color for making active link highlight in menu bundle mode
# BookMenuBundleActiveLinkColor = '\#004ed0'

# Set source repository location.
# Used for 'Last Modified' and 'Edit this page' links.
BookRepo = 'https://github.com/alex-shpak/hugo-book'

# Enable 'Edit this page' links for 'doc' page type.
# Disabled by default. Uncomment to enable. Requires 'BookRepo' param.
# Path must point to 'content' directory of repo.
BookEditPath = 'edit/master/exampleSite/content'

# (Optional, default January 2, 2006) Configure the date format used on the pages
# - In git information
# - In blog posts
BookDateFormat = 'Jan 2, 2006'

# (Optional, default true) Enables search function with lunr.js,
# Index is built on fly, therefore it might slowdown your website.
BookSearch = true
```

### Page Configuration

You can specify additional params per page in front matter

```toml
# Set type to 'docs' if you want to render page outside of configured section or if you render section other than 'docs'
type = 'docs'

# Set page weight to re-arrange items in file-tree menu (if BookMenuBundle not set)
weight = 10

# (Optional) Set to mark page as flat section in file-tree menu (if BookMenuBundle not set)
bookFlatSection = true

# (Optional) Set true to hide page or section from side menu (if BookMenuBundle not set)
bookHidden = true

# (Optional) Set how many levels of ToC to show. use 'false' to hide ToC completely
bookToC = 3
```

### Partials

There are few empty partials you can override in `layouts/partials/`

| Partial                                         | Placement                              |
| ----------------------------------------------- | -------------------------------------- |
| `layouts/partials/docs/inject/head.html`        | Before closing `<head>` tag            |
| `layouts/partials/docs/inject/body.html`        | Before closing `<body>` tag            |
| `layouts/partials/docs/inject/footer.html`      | After page content                     |
| `layouts/partials/docs/inject/menu-before.html` | At the beginning of `<nav>` menu block |
| `layouts/partials/docs/inject/menu-after.html`  | At the end of `<nav>` menu block       |

### Extra Customisation

| File                  | Description                                                                           |
| --------------------- | ------------------------------------------------------------------------------------- |
| `static/favicon.svg`  | Override default favicon                                                              |
| `assets/_custom.scss` | Customise or override scss styles                                                     |
| `assets/_fonts.scss`  | Replace default font with custom fonts (e.g. local files or remote like google fonts) |

## Shortcodes

### Expand

Provides clickable panel that show extra hidden content.

```
{{< expand >}}
## Markdown content
{{< /expand >}}
```

### Tabs

Useful if you want to show alternative information per platform or setting.

```
{{< tabs "uniqueid" >}}
{{< tab "MacOS" >}} # MacOS Content {{< /tab >}}
{{< tab "Linux" >}} # Linux Content {{< /tab >}}
{{< tab "Windows" >}} # Windows Content {{< /tab >}}
{{< /tabs >}}
```

### Multi column text

Organize text in 2 or more columns to use space efficiently.

```html
{{< columns >}} <!-- begin columns block -->

# Left Content Lorem markdownum insigne...

<---> <!-- magic sparator, between columns -->

# Mid Content Lorem markdownum insigne...

<---> <!-- magic sparator, between columns -->

# Right Content Lorem markdownum insigne...
{{< /columns >}}
```

## Redirection of old Slate URLs

The old version of the docs (https://github.com/eoscanada/dfuse-documentation) was built on Slate, which has no routing at all. Everything was concatenated on one page, and all linking was done through #url-fragments, which don't get sent to the server, preventing us from using Hugo aliases. Because of this, we had to use client-side redirects in JavaScript on page load.

The configuration of the redirects can be found [here](https://github.com/eoscanada/dfuse-docs-2/blob/master/static/scripts/main.js). The keys of the map are the new urls, and the arrays are the old urls are need to map to them. As a general rule of thumb, if there is an exact match between the old page and the new page, we take the user there. If the page doesn't exist anymore, we try to take them to the most similar page if we can.