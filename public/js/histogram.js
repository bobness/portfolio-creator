angular.module('pc').directive('histogram', ['portfolioService', function(portfolioService) {
  return {
    templateUrl: '../html/histogram.html',
    scope: {
      data: '='
    },
    link: function(scope) {
      var url = '/users/56c91e75a986a9d2ce8cc456/portfolio/themes';
      
      scope.createTheme = function() {};
      
      scope.deleteTheme = function() {};
    }
  }
}]);