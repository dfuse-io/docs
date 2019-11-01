const gql = require('graphql-tag');
const fs = require('fs');

function processSources(schemaSources, destination) {

  console.log(`Generating GraphQL schema data from source files:
  ${schemaSources.map(path => ` * ${path}`).join('\n')}`);

  const schema = schemaSources.map(path => fs.readFileSync(path, 'utf-8')).join(' ')

  // Loop over the schema definitions, extracting interesting data
  const jsonSchema = gql(schema).definitions.map(def => {
    const { name, description, fields } = def;

    if (def.kind !== 'ObjectTypeDefinition') return null
    // TODO: Add support for Enum types

    return {
      name: name.value,
      description: description ? description.value : '',
      fields: fields.map(field => {
        const { name, type, description, arguments } = field;

        let typeName = getFieldType(type)

        return {
          name: name.value,
          type: typeName,
          description: description ? description.value : '',
          arguments: arguments.map(arg => {
            const  { name, type, description, defaultValue } = arg;

            let typeName = getFieldType(type)
            return {
              name: name.value,
              type: typeName,
              description: description ? description.value : '',
            }
          })
        }
      })
    }
  }).filter(x => !!x);

  fs.writeFileSync(destination, JSON.stringify(jsonSchema, null, 2));
}

// Recursively parses the field name
function getFieldType(field) {
  const { type, kind, name } = field;
  console.log("BVOOOOOOOOOOOOOO", field);

  switch (kind) {
  case 'NonNullType':
    return `${getFieldType(type)}!`
  case 'ListType':
    return `[${getFieldType(type)}]`
  case 'NamedType':
    return name.value
  default:
    throw("Wutz that kind?", kind)
  }
}


processSources([
  '../dgraphql/eth/subscription.graphql',
  '../dgraphql/eth/query.graphql',
  '../dgraphql/eth/transactions.graphql',
  '../dgraphql/eth/block.graphql',
], 'data/eth/graphql.json')

processSources([
  '../dgraphql/eos/schema.graphql',
  '../dgraphql/eos/search_transaction.graphql',
  '../dgraphql/eos/transactions.graphql',
  '../dgraphql/eos/blockmeta.graphql',
], 'data/eos/graphql.json')


console.log('Done!')
