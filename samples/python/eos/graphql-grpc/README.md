## dfuse GraphQL Python Example

This simple program demonstrates how easy it is to query our GraphQL API over gRPC in Python. It:

* Request a token from our authentication API
* Creates a gRPC connection with credentials
* Instantiates a GraphQL client
* Executes a simple GraphQL query
* Prints the response

### Requirements

You will need to have Python3 (>= 3.4+) as well as `virtualenv` and `pip`
`>= 15.0+`.

We use a virtual environment for this example, all dependencies are listed
in the `requirements.txt` at the root of this project.

#### Quickstart

First of all, visit [https://app.dfuse.io](https://app.dfuse.io) to get
a free API key for your project.

Setup the virtual environment and pull all dependencies:

```bash
./install_deps.sh
```

Once your environment is setup properly, simply run the `example.py` script:

```bash
python3 example.py YOUR_API_KEY_HERE
```
