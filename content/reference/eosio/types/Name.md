# `Name`

An `Name` is a string that represents a uint64 value,
name-encoded using the base32 algorithm. It can only include
characters `a` through `z` and/or numbers from `1` to `5`, and the dot
`.` character.  It has a maximum length of 12 or 13 characters
(depending on the contents).


### `AccountName`

An `AccountName` is a [Name](#type-Name)-encoded string
that represents an account on the chain.


### `ActionName`

An `ActionName` is a [Name](#type-Name)-encoded string
that represents a contract's action.


### `PermissionName`

A `PermissionName` is a [Name](#type-Name)-encoded string
that represents a valid permission on the chain.


### `TableName`

A `TableName` is a [Name](#type-Name)-encoded string
that represents a contract's table on the chain.
