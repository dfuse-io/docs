#include "thecardgame.hpp"

void thecardgame::move(
    name from,
    name to,
    const string& card_id,
    const string& card_kind
) {
    action(
        std::vector<permission_level>(),
        "dfuseiohooks"_n,
        "event"_n,
        std::make_tuple(string(""), "card_id=" + card_id + "&card_kind=" + card_kind)
    ).send_context_free();

    // Rest of your contract, updating multi index rows, housekeeping, etc.
}
