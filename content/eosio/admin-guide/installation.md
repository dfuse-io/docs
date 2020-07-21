---
weight: 40

pageTitle: Installation
pageTitleIcon: eosio

sideNav: true
sideNavTitle: System Admin Guide
sideNavLinkRename: Installation

BookToC: false
#release: stable

---

Installing `dfuse for EOSIO` requires two programs:

1. `dfuseeos`
2. A deep-mind-enabled `nodeos`


## Installing `dfuseeos`

* Download pre-compiled binaries from the [GitHub Releases](https://github.com/dfuse-io/dfuse-eosio/releases) page.
* Put the binary `dfuseeos` in your `PATH`.

To install from source, refer to https://github.com/dfuse-io/dfuse-eosio


## Installing a deep-mind-enabled `nodeos`

dfuse for EOSIO requires a deep-mind enabled `nodeos` binary. At the time of writing, the patch necessary for dfuse to function has been merged into https://github.com/eosio/eos but has not yet been published in a new release. Version v2.0 is known not to have the deep-mind patch. Subsequent releases should have all that is necessary.

The current source code can be found on branch [release/2.0.x-dm](https://github.com/dfuse-io/eos/tree/release/2.0.x-dm)
under [github.com/dfuse-io/eos](https://github.com/dfuse-io/eos) fork of EOSIO software.

**Notes**:

* It is safe to use this forked version as a replacement for your current installation, all
  special instrumentations are gated around a config option (i.e. `deep-mind = true`) that is off by
  default.

* This instrumentation has been merged in the upstream develop branch,
  but is not yet in a release: https://github.com/EOSIO/eos/pull/8788

### Mac OS X:

#### Mac OS X Brew Install

{{< highlight sh >}}
brew install dfuse-io/tap/eosio
{{< /highlight >}}

#### Mac OS X Brew Uninstall

{{< highlight sh >}}
brew remove eosio
{{< /highlight >}}

### Ubuntu Linux:

#### Ubuntu 18.04 Package Install

{{< highlight sh >}}
wget https://github.com/dfuse-io/eos/releases/download/v2.0.5-dm-12.0/eosio_2.0.5-dm.12.0-1-ubuntu-18.04_amd64.deb
sudo apt install ./eosio_2.0.5-dm.12.0-1-ubuntu-18.04_amd64.deb
{{< /highlight >}}

#### Ubuntu 16.04 Package Install

{{< highlight sh >}}
wget https://github.com/dfuse-io/eos/releases/download/v2.0.5-dm-12.0/eosio_2.0.5-dm.12.0-1-ubuntu-16.04_amd64.deb
sudo apt install ./eosio_2.0.5-dm.12.0-1-ubuntu-16.04_amd64.deb
{{< /highlight >}}

#### Ubuntu Package Uninstall

{{< highlight sh >}}
sudo apt remove eosio
{{< /highlight >}}

### RPM-based (CentOS, Amazon Linux, etc.):

#### RPM Package Install

{{< highlight sh >}}
wget https://github.com/dfuse-io/eos/releases/download/v2.0.5-dm-12.0/eosio-2.0.5-dm.12.0-1.el7.x86_64.rpm
sudo yum install ./eosio-2.0.5-dm.12.0-1.el7.x86_64.rpm
{{< /highlight >}}

#### RPM Package Uninstall

{{< highlight sh >}}
sudo yum remove eosio
{{< /highlight >}}
