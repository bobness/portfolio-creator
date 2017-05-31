angular.module('pc').directive('job', ['portfolioService', function(portfolioService) {
  return {
    templateUrl: '../html/job.html',
    scope: {
      data: '='
    },
    link: function(scope) {
      
      // TODO: parameterize the user id instead of using my test account
      var url = '/users/56c91e75a986a9d2ce8cc456/portfolio/jobs';
      
      var resetNewRows = function() {
        Object.keys(scope.newrows).forEach(function(key) {
          scope.newrows[key] = '';
        });
      };
      
      scope.newrows = {
        experience: ''
      };
      
      scope.createTag = function(name) {
        if (name) {
          resetNewRows();
          var list = scope.data['experiences'];
          if (!list.some(function(item) { return item === name; })) {
            list.push(name);
            return portfolioService.update(url, scope.data);
          }
        }
      };
      
      scope.deleteTag = function(name) {
        if (name) {
          scope.data['tags'] = scope.data['tags'].filter(function(item) {
            return item !== name;
          });
          return portfolioService.update(url, scope.data);
        }
      };
      
      function getSelectionText() { // https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text
        var text = "";
        if (window.getSelection) {
          text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
          text = document.selection.createRange().text;
        }
        return text;
      }
      
      scope.addSelectedTag = function() {
        var text = getSelectionText();
        scope.createTag(text);
      };
      
    }
  }
}]);