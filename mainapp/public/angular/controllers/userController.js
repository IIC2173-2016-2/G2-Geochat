// public/javascripts/angular/controllers
/* eslint-disable */
controllers

  .controller('userController', function($scope, $http) {
  $scope.showEdit = false;
  $scope.newCardForm = false;
  $scope.users;

  $scope.user;
  $scope.newUser;
  $scope.message = null;
  $scope.cardMessage = null;
  $scope.newCard = {};

  $scope.initialize = function functionName(user) {
    $scope.user = JSON.parse(user);
    $scope.newUser = copyJSON($scope.user);
    $scope.newUser.birthday = new Date($scope.newUser.birthday);
  }

  function copyJSON(fromJSON) {
    const toJSON = {};
    Object.keys(fromJSON).forEach((key) => {
      toJSON[key] = fromJSON[key];
    })
    return toJSON;
  }
   $scope.setUsers = function(users) {
    console.log(users);
    // $scope.users = JSON.parse(users);
    console.log(users);
    console.log($scope.users);

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
        console.log(err);
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


  function clearMessages() {
    $scope.errorMessage = null;
    $scope.successMessage = null;
  }

  ///MONEY

  $scope.buyArquicoins = function() {
    const id = $scope.user.id;
    const amount = 100;
    const card_id = JSON.parse($scope.cardToCharge).id;
    clearMessages();
    // $scope.setArquicoins(amount);
    $http.post(`/user/${id}/buy/arquicoins`, {
        id,
        amount,
        card_id,
      })
      .success(function(data) {
        $scope.setArquicoins($scope.user.arquicoins + amount);
        $scope.successMessage = `${amount} Arquicoins bought`;

        // $scope.user.arquicoins = data.user.arquicoins;
      })
      .error(function(err) {
        $scope.errorMessage = 'Unable to buy arquicoins with that card at this moment';
      });
  }

  $scope.spendArquicoins = function() {
    const id = $scope.user.id;
    const cost = 80;
    clearMessages();

    $http.post(`/user/${id}/buy/something`, {
        id: $scope.user.id,
        cost,
      })
      .success(function(data) {
        $scope.setArquicoins($scope.user.arquicoins - cost);
        $scope.successMessage = `Money well spend`;
      })
      .error(function(err) {
        $scope.errorMessage = `Something went wrong, probably you dont have the money`;
      });
  }

  $scope.transferArquicoins = function() {
    const id = $scope.user.id;
    const amount = 50;
    clearMessages();
    if(id === $scope.transferID){
      $scope.errorMessage = 'Cannot transfer to itself';
      return;
    }
    if(!$scope.transferID){
      $scope.errorMessage = 'No one selected';
      return;
    }

    $http.post(`/user/${id}/transfer/arquicoins`, {
        fromId: $scope.user.id,
        toId: $scope.transferID,
        amount,
      })
      .success(function(data) {
        $scope.setArquicoins($scope.user.arquicoins - amount);
        $scope.successMessage = `Money succesfully transfered`;

      })
      .error(function(err) {
        console.log(err);
        $scope.errorMessage = `Something went wrong, probably you dont have the money or the user doesnot exist`;
      });
  }
});
