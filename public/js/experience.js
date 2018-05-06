angular.module('pc').directive('experience', ['portfolioService', function(portfolioService) {
  return {
    templateUrl: 'html/experience.html',
    scope: {
      data: '='
    },
    link: function(scope) {
      
      var resetNewRows = function() {
        Object.keys(scope.newrows).forEach(function(key) {
          scope.newrows[key] = '';
        });
      };
      
      scope.newrows = {
        experience: ''
      };
      
      scope.tagObjects = scope.data.tags.map(function(tag) {
        return {
          text: tag
        };
      });
      
      scope.createTag = function(tag) {
        if (tag) {
          if (tag.text) {
            tag = tag.text;
          }
          resetNewRows();
          var list = scope.data.tags;
          if (!list.some(function(item) { return item === tag; })) {
            return portfolioService.addTag(tag, scope.data);
          }
        }
      };
      
      scope.deleteTag = function(tag) {
        if (tag) {
          if (tag.text) {
            tag = tag.text;
          }
          return portfolioService.removeTag(tag, scope.data);
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
        return scope.createTag(text).then(function() {
		    	scope.tagObjects.push({text: text});
        });
      };
      
      scope.getFormattedDescription = function() {
	      if (scope.data.description) {
	        return scope.data.description.split('\n').join('<br>');
	      }
	      return '';
      };
      
    }
  }
}]);