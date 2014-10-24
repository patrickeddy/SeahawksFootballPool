angular.module('starter.controllers', [])

.controller('TabsCtrl', function($scope){
    $scope.game = JSON.parse(localStorage.getItem("game"));
    if ($scope.game === null)
      $scope.game = {};
})


.controller('DashCtrl', function($scope) {
  $scope.quarters = [{}];

  
  for (var count = 0; count < 4; count++){
    var quarter = {};
    // Setting up this scopes quarters variable with the scores and winners
    var scores = $scope.game["qtr" + (count + 1)];
    quarter.score = scores[0] + "-" + scores[1];
    quarter.winner = scores.winner;

    $scope.quarters[count] = quarter;
  }
})

.controller('PlayersCtrl', function($scope, $location, Players, $ionicPopup) {
  var playersFactory = Players;
  $scope.players = playersFactory.all();
  $scope.player = {};

  $scope.addPlayer = function() {
    $scope.player.id = $scope.players.length;
    playersFactory.add($scope.player);
    $location.path("/tab/players");
  };

  $scope.deletePlayer = function(playerId) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Player',
      template: 'Are you sure you want to delete this player?'
    });
    confirmPopup.then(function(res) {
      if (res) {
        playersFactory.remove(playerId);
        $scope.players = playersFactory.all();
      }
    });
  };
})

.controller('ResultsCtrl', function($scope, $location, $timeout, $ionicPopup) {

  $scope.quarters =[1,2,3,4];


  var sh_scores = [];
  var ot_scores = [];

  var columns = _.shuffle(_.range(10));
  var rows = _.shuffle(_.range(10));
  //    alert("Rows:" + rows + "\n" + "Cols:" + columns);

  $scope.generateWinners = function() {
    this.players = JSON.parse(localStorage.getItem("players"));

    if (this.players === null || this.players.length <= 1) {
      var alertPopup = $ionicPopup.alert({
        title: 'Not enough players',
        template: 'More than 1 player is needed to generate winners'
      });
      alertPopup.then(function(res) {
        console.log("Not enough players.");
      });
    } else {
      var gameTiles = _.shuffle(this.players);


      var numOfTiles = 100;
      var tilesEachPlayer = Math.floor(numOfTiles / this.players.length);
      var remaindingTiles = numOfTiles % tilesEachPlayer;
      //    alert("Amount of tiles per player:\n" + tilesEachPlayer);
      //    alert("Remainding tiles after:\n" + remaindingTiles);
      // Pushes the amount of tiles needed for each player onto the end of the array
      for (var i = 0; i < tilesEachPlayer; i++) {
        for (var player in this.players) {
          gameTiles.push(gameTiles[player]);
        }
      }
      for ( i = 0; i < remaindingTiles; i++) {
        gameTiles.push(gameTiles[i]);
      }
      gameTiles = _.shuffle(gameTiles);

      // Assigns point values to each gameTile
      var tile = 0;
      var tileOptions = new Array(10);
      for (i = 0; i < 10; i++) {
        tileOptions[i] = new Array(10);
      }
      for (var x = 0; x < 10; x++) {
        for (var y = 0; y < 10; y++) {
          tileOptions[x][y] = gameTiles[tile];
          tile++;
        }
      }
      //    alert("gameTiles after point assignment:\n" + JSON.stringify(tileOptions));

      // Getting the scores from the game scope object
      for (i = 0; i < 4; i++) {
        sh_scores[i] = $scope.game["qtr" + (i + 1)][0];
        ot_scores[i] = $scope.game["qtr" + (i + 1)][1];
      }
      for (var count = 0; count < 4; count++) {
        $scope.game["qtr" + (count + 1)]["winner"] = tileOptions[(sh_scores[count] % 10)][(ot_scores[count] % 10)];
      }

      localStorage.setItem("game", JSON.stringify($scope.game));
      $location.path("/tab/dash");
      //
      //        alert(JSON.stringify($scope.game['qtr1Winner']));
      //        alert(JSON.stringify($scope.game['qtr2Winner']));
      //        alert(JSON.stringify($scope.game['qtr3Winner']));
      //        alert(JSON.stringify($scope.game['qtr4Winner']));
    }
  };
});
