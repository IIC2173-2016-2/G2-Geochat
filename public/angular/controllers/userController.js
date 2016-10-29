// public/javascripts/angular/controllers
/* eslint-disable */
controllers

    .controller('userController', function ($scope, $http) {
      $scope.showEdit = false;

      $scope.triggerShowEdit = function() {
        $scope.showEdit = !$scope.showEdit;
      }
    });
