#pragma once

#include <string>
#include <eosio/eosio.hpp>

class [[eosio::contract("eospetgameio")]] eospetgameio: public eosio::contract {
    public:
        eospetgameio(eosio::name receiver, eosio::name code, eosio::datastream<const char*> ds)
        :eosio::contract(receiver, code, ds)
        {}

        [[eosio::action]]
        void train(eosio::name pet_id);

    private:
        std::string get_pet_kind(eosio::name pet_id);
};
