angular.module('pc').directive('histogram', ['$location', 'portfolioService', function($location, portfolioService) {
  return {
    templateUrl: 'html/histogram.html',
    scope: {
      data: '=',
      setFilter: '&',
      getExperiences: '&',
      selectedTags: '=',
      themes: '<'
    },
    link: function(scope) {
      var expUrl = '/portfolios/577b11b224ec6cce246a5751/experiences';
      
      scope.createTheme = function() {};
      
      scope.deleteTheme = function() {};
      
      scope.visibleTags = angular.copy(scope.data);
      
      scope.selectTag = function(tag) {
        if (scope.selectedTags.indexOf(tag) === -1) {
          scope.selectedTags.push(tag);
        } else {
          scope.selectedTags.splice(scope.selectedTags.indexOf(tag.name));
        }
      };
      
      var filterExperiencesByTags = function(exp, tags) {
        return tags.reduce(function(matched, tag) {
          var name = tag.name || tag;
          return matched && (exp.tags.indexOf(name) > -1);
        }, true);
      };
      
      var filterExperiencesBySelectedTags = function(exp) {
        return filterExperiencesByTags(exp, scope.selectedTags);
      };
      
      scope.$watch(function() { return $location.path(); }, function(path) {
        var currentTheme = scope.themes.filter(function(theme) { return theme.name === path.substring(1)})[0];
        if (currentTheme) {
          scope.visibleTags = scope.data.filter(function(tag) { 
            return currentTheme.tags.indexOf(tag.name) > -1;
          });
        } else {
          scope.visibleTags = angular.copy(scope.data);
        }
      });
      
      scope.isSelected = function(tag) {
        return scope.selectedTags.map(function(tag) { return tag.name; }).indexOf(tag.name) > -1;
      };
      
      var selectedExperiences = [];
      var oldTagName = '';
      scope.selectExperiencesFromTag = function(tagName) {
        selectedExperiences = scope.getExperiences().filter(function(exp) { return exp.tags.indexOf(tagName) > -1; });
        oldTagName = tagName;
      };
      var updateExperiences = function() {
        if (selectedExperiences.length > 0) {
          return portfolioService.update(expUrl, selectedExperiences.pop()).then(function() { // FIXME: use a new service function
            updateExperiences();
          });
        }
      };
      scope.renameTags = function(newTagName) {
        selectedExperiences.forEach(function(exp) {
          exp.tags = exp.tags.filter(function(tagName) {
             return tagName !== oldTagName;
          });
          exp.tags.push(newTagName);
        });
        updateExperiences();
      };
      
      scope.$watchCollection('selectedTags', function() {
        if (scope.setFilter) {
          if (scope.selectedTags.length > 0) {
            scope.setFilter({func: filterExperiencesBySelectedTags});
          } else {
            scope.setFilter({func: null});
          }
        }
      });
      
      scope.$watch('filter', function() {
        if (scope.setFilter && (!scope.filter || scope.filter.length === 0)) {
          scope.setFilter({func: null});
        }
      });
    }
  }
}]);