const gql = require('graphql-tag');
const fs = require('fs');

const schema = fs.readFileSync('/Users/olivier/projects/dgraphql/eth/transactions.graphql', 'utf-8');
const jsonSchema = gql(schema).definitions.map(def => {
  const { name, description, fields } = def;

  if (def.kind !== 'ObjectTypeDefinition') return null

  return {
    name: name.value,
    description: description ? description.value : '',
  }
}).filter(x => !!x);

fs.writeFileSync('data/graphql.json', JSON.stringify(jsonSchema, null, 2));