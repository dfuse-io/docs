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
      hideChildren: (name.value != "Subscription" && name.value != "Query"),
      description: description ? description.value : '',
      fields: fields.map(field => {
        const { name, type, description, arguments, defaultValue } = field;
        //console.log("MAMA", JSON.stringify(field))
        let typeDef = getFieldType(type)

        return {
          name: name.value,
          type: typeDef,
          description: description ? description.value : '',
          arguments: arguments.map(arg => {
            const  { name, type, description, defaultValue } = arg;

            let typeDef = getFieldType(type, defaultValue)

            return {
              name: name.value,
              type: typeDef,
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
function getFieldType(field, defaultValue) {
  const { type, kind, name } = field;
  //console.log("BVOOOOOOOOOOOOOO", defaultValue);


  if (field.kind === 'NonNullType') {
    if (field.type.kind === 'ListType') {
      if (field.type.type.kind === 'NonNullType') {
        if (field.type.type.type.kind === 'NamedType') {
          return {isList: true, reqList: true, reqType: true, name: field.type.type.type.name.value}
        } else {
          throw("unsupported path type:", field.type.type.type.kind)
        }
      } else if (field.type.type.kind === 'NamedType') {
        return {isList: true, reqList: true, name: field.type.type.name.value}
      } else {
          throw("unsupported path type:", field.type.type.kind)
      }
    } else if (field.type.kind === 'NamedType') {
      return {reqType: true, name: field.type.name.value}
    } else {
      throw("unsupported path type:", field.type.kind)
    }
  } else if (field.kind === 'ListType') {
    if (field.type.kind === 'NonNullType') {
      if (field.type.type.kind === 'NamedType') {
        return {isList: true, reqType: true, name: field.type.type.name.value}
      } else {
        throw("unsupported path type:", field.type.type.kind)
      }
    } else if (field.type.kind === 'NamedType') {
      return {isList: true, name: field.type.name.value}
    } else {
      throw("unsupported path type:", field.type.kind)
    }
  } else if (field.kind === 'NamedType') {
    const out = {name: field.name.value}
    if (defaultValue !== undefined) {
      out.default = formatDefaultValue(defaultValue)
    }
    return out
  } else {
    throw("unsupported path type:", field.kind)
  }
}

function formatDefaultValue(def) {
  switch (def.kind) {
  case 'IntValue':
    return def.value
  case 'StringValue':
    return JSON.stringify(def.value)
  case 'BooleanValue':
    return def.value
  case 'EnumValue':
    return def.value
  default:
    throw("unsupported format value:", def.kind)
  }
}

processSources([
  '../dfuse-ethereum/dgraphql/schema/subscription.graphql',
  '../dfuse-ethereum/dgraphql/schema/subscription_alpha.graphql',
  '../dfuse-ethereum/dgraphql/schema/query.graphql',
//  '../dfuse-ethereum/dgraphql/schema/query_alpha.graphql',
  '../dfuse-ethereum/dgraphql/schema/transactions.graphql',
  '../dfuse-ethereum/dgraphql/schema/block.graphql',
  '../dfuse-ethereum/dgraphql/schema/trx_state_tracker.graphql',
], 'data/eth/graphql.json')

processSources([
  '../dfuse-eosio/dgraphql/schema/subscription.graphql',
  '../dfuse-eosio/dgraphql/schema/query.graphql',
  '../dfuse-eosio/dgraphql/schema/query_alpha.graphql',
  '../dfuse-eosio/dgraphql/schema/block.graphql',
  '../dfuse-eosio/dgraphql/schema/search_transaction.graphql',
  '../dfuse-eosio/dgraphql/schema/accounthist.graphql',
  '../dfuse-eosio/dgraphql/schema/transactions.graphql',
  '../dfuse-eosio/dgraphql/schema/blockmeta.graphql',
  '../dfuse-eosio/dgraphql/schema/tokenmeta.graphql',
], 'data/eos/graphql.json')


console.log('Done!')
