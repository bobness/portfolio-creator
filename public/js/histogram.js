angular.module('pc').directive('histogram', ['portfolioService', function(portfolioService) {
  return {
    templateUrl: 'html/histogram.html',
    scope: {
      data: '=',
      setFilter: '&',
      getExperiences: '&'
    },
    link: function(scope) {
      var themeUrl = '/users/56c91e75a986a9d2ce8cc456/portfolio/themes';
      var expUrl = '/users/56c91e75a986a9d2ce8cc456/portfolio/experiences';
      
      scope.createTheme = function() {};
      
      scope.deleteTheme = function() {};
      
      scope.selectedTags = [];
      scope.selectTag = function(tag) {
        if (scope.selectedTags.indexOf(tag) === -1) {
          scope.selectedTags.push(tag);
        } else {
          scope.selectedTags = scope.selectedTags.filter(function(tag2) { return tag2.name !== tag.name; });
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
          return portfolioService.update(expUrl, selectedExperiences.pop()).then(function() {
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