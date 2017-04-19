angular.module('pc').directive('job', ['portfolioService', function(portfolioService) {
  return {
    templateUrl: '../html/job.html',
    scope: {
      data: '='
    },
    link: function(scope) {
      
      // TODO: parameterize the user id instead of using my test account
      var url = '/users/56c91e75a986a9d2ce8cc456/portfolio/jobs';
      
      var lists = {
        skills: 'skills_learned',
        knowledge: 'knowledge_gained'
      };
      
      var resetNewRows = function() {
        Object.keys(scope.newrows).forEach(function(key) {
          scope.newrows[key] = '';
        });
      };
      
      scope.newrows = {
        skills: '',
        knowledge: ''
      };
      
      scope.create = function(type, name) {
        if (type && name) {
          resetNewRows();
          var list = scope.data[lists[type]];
          if (!list.some(function(item) { return item === name; })) {
            list.push(name);
            return portfolioService.update(url, scope.data);
          }
        }
      };
      
      scope.delete = function(type, name) {
        if (type && name) {
          var list = lists[type];
          scope.data[list] = scope.data[list].filter(function(item) {
            return item !== name;
          });
          return portfolioService.update(url, scope.data);
        }
      };
      
    }
  }
}]);