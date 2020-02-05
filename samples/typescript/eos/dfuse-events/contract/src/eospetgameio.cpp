#include "eospetgameio.hpp"

void eospetgameio::train(
    eosio::name pet_id
) {
    const std::string& pet_kind = get_pet_kind(pet_id);

    // Send an inline context-free action `dfuseiohooks:event`
    eosio::action(
        std::vector<eosio::permission_level>(),
        "dfuseiohooks"_n,
        "event"_n,
        std::make_tuple(
            // Parameter `auth_key`
            std::string(""),
            // Parameter `data` (ensures to escape `&` and `=` in values if you use user-provided strings!)
            std::string("pet_id=" + pet_id.to_string() + "&pet_kind=" + pet_kind)
        )
    ).send_context_free();

    // Rest of your contract, updating multi index rows, housekeeping, etc.
}

/**
 * Normally, you would probably retrieve the kind of the pet from
 * a table of your contract. For this example, we will simply choose
 * it based on the uint64 value of the name.
 */
std::string eospetgameio::get_pet_kind(eosio::name pet_id) {
    auto remainder = pet_id.value % 4;

    if (remainder == 3) return "dog";
    if (remainder == 2) return "cat";
    if (remainder == 1) return "mouse";

    // When remainder == 0
    return "rabbit";
}
