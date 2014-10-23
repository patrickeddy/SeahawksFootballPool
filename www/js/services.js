angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Players', function () {

    var players = JSON.parse(localStorage.getItem("players"));
    if (players === null)
        players = [];
    return {
        all: function () {
            return players;
        },
        get: function (playerId) {
            // Simple index lookup
            return players[playerId];
        },
        add: function (newPlayer) {
            players.push(newPlayer);
            localStorage.setItem("players", JSON.stringify(players));
        },
        remove: function (playerId) {
            if (players.length > 1) {
                players = _.without(players, _.findWhere(players, {
                    id: playerId
                }));
                localStorage.setItem("players", JSON.stringify(players));
            } else {
                players = [];
                localStorage.clear();
            }
        }
    }
});
