## dfuse Decode Hex Data (using eosjs)

This quick repository showcase how to decode hexadecimal string data
into a JSON structure.

To accomplish that, we fetch the right ABI type from a particular
contract, one that encoded the given data. From the ABI, we extract
the type we want to deserialize.

We then use `eosjs` to deserialize the hexadecimal data into a JSON
string value directly.

To run the example, clone this repository, then code at the root of
the project then:

```
yarn install
yarn run ts-node index.ts
```

### Code

Sample code recopied here as a quick reference.

```typescript
import { Api, JsonRpc } from 'eosjs';
import fetch from 'node-fetch'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { getTypesFromAbi, createInitialTypes, hexToUint8Array, SerialBuffer } from 'eosjs/dist/eosjs-serialize';
import { TextEncoder, TextDecoder } from 'util';

async function main(): Promise<void> {
    const signatureProvider = new JsSignatureProvider([]);
    const rpc = new JsonRpc('https://mainnet.eos.dfuse.io', { fetch: fetch as any });
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder() as any, textEncoder: new TextEncoder() });

    const abi = await api.getAbi("eosio.token")

    const builtinTypes = createInitialTypes()
    const types = getTypesFromAbi(builtinTypes, abi)

    const hexData = "000090e602ea30550000000000ea3055a08601000000000004454f530000000005656f736a73"
    const data = hexToUint8Array(hexData);

    const buffer = new SerialBuffer({ textDecoder: new TextDecoder() as any, textEncoder: new TextEncoder() });
    buffer.pushArray(data);

    // You would use the struct representing the table row in your own code
    const transferType = types.get("transfer")
    if (transferType === undefined) {
        console.log("Type 'transfer' does not exist on 'eosio.token' ABI")
        return
    }

    const transfer = transferType.deserialize(buffer);

    console.log("Deserialized hex data")
    console.log(` From: ${transfer.from}`)
    console.log(` To: ${transfer.to}`)
    console.log(` Quantity: ${transfer.quantity}`)
    console.log(` Memo: ${transfer.memo}`)
    console.log()
}

main().then(() => {
   process.exit(0)
}).catch((error) => {
    console.log("An error occurred", error)
    process.exit(1)
})
```
