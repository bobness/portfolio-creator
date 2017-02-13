angular.module('pc').controller('portfolioController', ['$scope', 'userService', function($scope, userService) {
  $scope.user = {};
  
  userService.getUser('56c91e75a986a9d2ce8cc456').$promise.then(function(user) {
    $scope.user = user;
  });
  
  $scope.$watch('user', function(user) {
    if (user && user.$update) {
      user.$update();
    }
  });
}]);
