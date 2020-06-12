const { createDfuseClient } = require('@dfuse/client');

const client = createDfuseClient({
  apiKey: process.env.REACT_APP_DFUSE_API_KEY,
  network: 'mainnet'
});

export const checkBalance = async (account, setBalance) => {
  var balance = null;
  const resp = await client.stateTable('eosio.token', account, 'accounts');
  if (resp.rows.length > 0) {
    balance = resp.rows[0].json.balance;
  }
  setBalance(balance);
};
