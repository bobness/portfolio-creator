angular.module('pc').directive('histogram', ['portfolioService', function(portfolioService) {
  return {
    templateUrl: 'html/histogram.html',
    scope: {
      data: '=',
      setFilter: '&',
      getExperiences: '&',
      selectedTags: '='
    },
    link: function(scope) {
      var expUrl = '/portfolios/577b11b224ec6cce246a5751/experiences';
      
      scope.createTheme = function() {};
      
      scope.deleteTheme = function() {};
      
      scope.selectTag = function(tag) {
        if (scope.selectedTags.indexOf(tag) === -1) {
          scope.selectedTags.push(tag);
        } else {
          scope.selectedTags.splice(scope.selectedTags.indexOf(tag.name));
        }
      };
      
      var filterExperiencesBySelectedTags = function(exp) {
        return scope.selectedTags.reduce(function(matched, tag) {
          return matched && (exp.tags.indexOf(tag.name) > -1);
        }, true);
      };
      
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