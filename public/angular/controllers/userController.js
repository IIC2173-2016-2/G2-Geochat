// public/javascripts/angular/controllers
/* eslint-disable */
controllers

  .controller('userController', function($scope, $http) {
  $scope.showEdit = false;
  $scope.newCardForm = false;

  $scope.user;
  $scope.newUser;
  $scope.message = null;
  $scope.cardMessage = null;
  $scope.newCard = {};

  $scope.initialize = function functionName(user) {
    $scope.user = JSON.parse(user);
    $scope.newUser = copyJSON($scope.user);
    console.log($scope.newUser);
    $scope.newUser.birthday = new Date($scope.newUser.birthday);
  }

  function copyJSON(fromJSON) {
    const toJSON = {};
    Object.keys(fromJSON).forEach((key) => {
      toJSON[key] = fromJSON[key];
    })
    return toJSON;
  }

  $scope.setArquicoins = function(amount) {
    console.log(amount);
    $scope.user.arquicoins = amount;
  }

  $scope.triggerShowEdit = function() {
    $scope.message = null;
    $scope.showEdit = !$scope.showEdit;
  }

  $scope.toggleNewCardForm = function() {
    $scope.newCardMessage = null;
    $scope.newCardForm = !$scope.newCardForm;
  }

  $scope.parseDateOfCard = function(card) {
    card.expire_date = new Date(card.expire_date);
  }

  $scope.toggleEditCard = function(card) {
    card.edit = !card.edit;
  }

  $scope.save = function() {
    const username = $scope.newUser.username;
    $http.get(`/user/${username}/exists`)
      .success(function(data) {
        if (!data.exists || username === $scope.user.username) {
          $http.post(`/user/${$scope.newUser.id}/update`, $scope.newUser)
            .success(function(data) {
              $scope.user = data.user;
              copyJSON($scope.user, $scope.newUser);
              $scope.newUser.birthday = new Date($scope.newUser.birthday);
              $scope.triggerShowEdit();
              $scope.message = 'saved successfully';
            })
            .error(function(err) {
              $scope.message = err;
            });
        } else {
          $scope.message = 'username is taken';
        }
      })
      .error(function(err) {
        console.log('meneh');
        $scope.message = err;
      });
  }


  $scope.fetchCards = function() {
    $http.get(`/user/${$scope.user.id}/fetchCards`)
      .success(function(data) {
        $scope.cards = data.cards;
      })
      .error(function(err) {
        console.log('meneh');
        $scope.cardMessage = err;
      });
  }
  $scope.addCard = function() {
    $scope.newCard.user_id = $scope.user.id;
    $http.post(`/user/${$scope.user.id}/card/new`, $scope.newCard)
      .success(function(data) {
        $scope.cards.push(data.card);
        $scope.newCard = {};
        $scope.newCardForm = false;
      })
      .error(function(err) {
        console.log('meneh');
        $scope.cardMessage = err;
      });
  }
  $scope.updateCard = function(card) {
    delete card.edit;
    $http.post(`/user/${$scope.user.id}/card/${card.id}/update`, card)
      .success(function(data) {
        card = data.card;
        card.edit = false;
      })
      .error(function(err) {
        console.log(err);
      });
  }

  function removeCard(card) {
    const index = $scope.cards.indexOf(card);
    $scope.cards.splice(index, 1);
  }


  $scope.delete = function(card) {
    $http.post(`/user/${$scope.user.id}/card/${card.id}/delete`, card)
      .success(function(data) {
        removeCard(card);
      })
      .error(function(err) {
        console.log(err);
      });
  }



  ///MONEY

  $scope.buyArquicoins = function() {
    const id = $scope.user.id;
    const amount = 100;
    // $scope.setArquicoins(amount);
    $http.post(`/user/${id}/buy/arquicoins`, {
        id: $scope.user.id,
        amount,
      })
      .success(function(data) {
        $scope.setArquicoins($scope.user.arquicoins + amount);

        // $scope.user.arquicoins = data.user.arquicoins;
      })
      .error(function(err) {
        $scope.moneyMessage = err;
      });
  }

  $scope.spendArquicoins = function() {
    const id = $scope.user.id;
    const cost = 80;
    $http.post(`/user/${id}/buy/something`, {
        id: $scope.user.id,
        cost,
      })
      .success(function(data) {
        $scope.setArquicoins($scope.user.arquicoins - cost);
      })
      .error(function(err) {
        $scope.moneyMessage = err;
      });
  }

  $scope.transferArquicoins = function() {
    const id = $scope.user.id;
    const amount = 50;
    $http.post(`/user/${id}/transfer/arquicoins`, {
        fromId: $scope.user.id,
        toId: 1,
        amount,
      })
      .success(function(data) {
        $scope.setArquicoins($scope.user.arquicoins - amount);
      })
      .error(function(err) {
        console.log(err);
        $scope.moneyMessage = err;
      });
  }
});
