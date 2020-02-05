export const Config = {
  apiToken:
    process.env.REACT_APP_DFUSE_API_TOKEN ||
    "eyJhbGciOiJLTVNFUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTQ0MzEyMTMsImp0aSI6IjFiZGEzZDY4LTk2YjMtNGEwMi1iNDFhLTM2YTgxYTY2M2U1ZiIsImlhdCI6MTU1NDM0NDgxMywiaXNzIjoiZGZ1c2UuaW8iLCJzdWIiOiJ1aWQ6bWRmdXNlMmY0YzU3OTFiOWE3MzE1IiwidGllciI6ImVvc3EtdjEiLCJvcmlnaW4iOiJlb3NxLmFwcCIsInN0YmxrIjotMzYwMCwidiI6MX0.6uDO4Mfi5cpCEKrIti3VDfM_LXT_1Q0B-cas--dWVhBLYRwixlpto4bGgtedqJ0vAx8aKPZBZRDUJKYVgDdf-Q",
  chainId:
    process.env.REACT_APP_CHAIN_ID ||
    "5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191",
  chainApiProtocol: process.env.REACT_APP_CHAIN_API_PROTOCOL || "https",
  chainApiHost: process.env.REACT_APP_CHAIN_API_HOST || "kylin.eos.dfuse.io",
  chainApiPort: process.env.REACT_APP_CHAIN_API_PORT || "443"
}
