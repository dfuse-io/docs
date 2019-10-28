const gql = require('graphql-tag');
const fs = require('fs');

const schemaSources = [
  '../dgraphql/eth/subscription.graphql',
  '../dgraphql/eth/query.graphql',
  '../dgraphql/eth/transactions.graphql',
  '../dgraphql/eth/block.graphql',
]

console.log(`Generating GraphQL schema data from source files:
${schemaSources.map(path => ` * ${path}`).join('\n')}`);

const schema = schemaSources.map(path => fs.readFileSync(path, 'utf-8')).join(' ')

// Recursively parses the field name
function getFieldType(field) {
  const { type, kind, name } = field;

  if (kind === 'NonNullType') {
    return `${getFieldType(type)}!`
  }
  if (kind === 'ListType') {
    return `[${getFieldType(type)}]`
  }

  return name.value;
}

// Loop over the schema definitions, extracting interesting data
const jsonSchema = gql(schema).definitions.map(def => {
  const { name, description, fields } = def;

  if (def.kind !== 'ObjectTypeDefinition') return null

  return {
    name: name.value,
    description: description ? description.value : '',
    fields: fields.map(field => {
      const { name, type, description } = field;

      let typeName = getFieldType(type)

      return {
        name: name.value,
        type: typeName,
        description: description ? description.value : ''
      }
    })
  }
}).filter(x => !!x);

console.log('Done!')

fs.writeFileSync('data/eth-graphql.json', JSON.stringify(jsonSchema, null, 2));
