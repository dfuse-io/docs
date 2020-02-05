#pragma once

#include <string>

#include <eosio/eosio.hpp>

using eosio::action;
using eosio::datastream;
using eosio::name;
using eosio::permission_level;
using std::string;

class [[eosio::contract("thecardgame")]] thecardgame: public eosio::contract {
    public:
        thecardgame(name receiver, name code, datastream<const char*> ds)
        :eosio::contract(receiver, code, ds)
        {}

        [[eosio::action]]
        void move(name from, name to, const string& card_id, const string& card_kind);
};
