angular.module('pc').controller('portfolioController', ['$scope', 'userService', 'portfolioService',
  function($scope, userService, portfolioService) {
    
    var url = '/users/56c91e75a986a9d2ce8cc456/portfolio/jobs';
    
    $scope.user = null;
    $scope.newjob = {
      name: '',
      skills_learned: [],
      knowledge_gained: []
    };
    
    userService.getUser('56c91e75a986a9d2ce8cc456').$promise.then(function(user) {
      $scope.user = user;
      
      $scope.createJob = function(job) {
        return portfolioService.create(url, job).then(function(newjob) {
          $scope.user.portfolio.jobs.push(newjob);
          $scope.newjob.name = '';
        });
      };
    });
  }]
);
