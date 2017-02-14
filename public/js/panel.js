angular.module('pc').directive('panel', ['portfolioService', function(portfolioService) {
  return {
    templateUrl: '../html/panel.html',
    scope: {
      'title': '@',
      'url': '@',
      'data': '='
    },
    link: function(scope) {
      
      scope.newrow = {name: ''};

      scope.update = function(obj) {
        if (obj) {
          portfolioService.update(scope.url, obj);
        }
      };
      
      scope.create = function(obj) {
        if (obj && obj.name) {
          portfolioService.create(scope.url, obj).success(function(obj) {
            scope.data.push(obj);
            scope.newrow.name = '';
          });
        }
      };
      
      scope.delete = function(obj) {
        if (obj) {
          portfolioService.delete(scope.url, obj).then(function() { // FIXME: request does not happen until page refresh...
            scope.data = scope.data.filter(function(item) {
              return item._id !== obj._id; 
            });
          });
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