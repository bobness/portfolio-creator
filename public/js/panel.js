angular.module('pc').directive('panel', ['portfolioService', function(portfolioService) {
  return {
    templateUrl: '../html/panel.html',
    scope: {
      'title': '@',
      'url': '@',
      'data': '='
    },
    link: function(scope) {

      scope.update = function(obj) {
        if (obj) {
          portfolioService.update(scope.url, obj);
        }
      };
      
/*
      scope.test = function() {
        console.log(scope);
      };
*/
    }
  }
}]);