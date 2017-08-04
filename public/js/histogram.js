angular.module('pc').directive('histogram', ['$location', '$q', '$window', 'portfolioService', function($location, $q, $window, portfolioService) {
  return {
    templateUrl: 'html/histogram.html',
    scope: {
      data: '=',
      setFilter: '&',
      getExperiences: '&',
      updateExperience: '&',
      selectedTags: '=',
      themes: '<'
    },
    link: function(scope) {
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
      
      scope.renameTags = function(newTagName) {
        $q.all(selectedExperiences.map(function(exp) {
          exp.tags.splice(exp.tags.indexOf(oldTagName), 1);
          exp.tags.push(newTagName);
          return portfolioService.updateExperience(exp);
        })).then(function() {
          $window.location.reload();
        });
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