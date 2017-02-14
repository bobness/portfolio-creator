angular.module('pc').controller('portfolioController', ['$scope', 'userService', function($scope, userService) {
  $scope.user = null;
  $scope.panels = [];
  
  userService.getUser('56c91e75a986a9d2ce8cc456').$promise.then(function(user) {
    $scope.user = user;
    $scope.panels = [
      {
        title: 'Skills',
        data: user.portfolio.skills,
        url: '/users/56c91e75a986a9d2ce8cc456/portfolio/skills'
      },
      {
        title: 'Knowledge',
        data: user.portfolio.knowledge,
        url: '/users/56c91e75a986a9d2ce8cc456/portfolio/knowledge'
      },
      {
        title: 'Jobs',
        data: user.portfolio.jobs,
        url: '/users/56c91e75a986a9d2ce8cc456/portfolio/jobs'
      }
    ];
  });
}]);
