angular.module('pc').directive('histogram', ['portfolioService', function(portfolioService) {
  return {
    templateUrl: '../html/histogram.html',
    scope: {
      data: '=',
      setFilter: '&',
      getJobs: '&'
    },
    link: function(scope) {
      var themeUrl = '/users/56c91e75a986a9d2ce8cc456/portfolio/themes';
      var jobUrl = '/users/56c91e75a986a9d2ce8cc456/portfolio/jobs';
      
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
      
      var filterJobsBySelectedTags = function(job) {
        return scope.selectedTags.reduce(function(matched, tag) {
          return matched && (job.tags.indexOf(tag.name) > -1);
        }, true);
      };
      
      scope.isSelected = function(tag) {
        return scope.selectedTags.map(function(tag) { return tag.name; }).indexOf(tag.name) > -1;
      };
      
      var selectedJobs = [];
      var oldTagName = '';
      scope.selectJobsFromTag = function(tagName) {
        selectedJobs = scope.getJobs().filter(function(job) { return job.tags.indexOf(tagName) > -1; });
        oldTagName = tagName;
      };
      var updateJobs = function() {
        if (selectedJobs.length > 0) {
          return portfolioService.update(jobUrl, selectedJobs.pop()).then(function() {
            updateJobs();
          });
        }
      };
      scope.renameTags = function(newTagName) {
        selectedJobs.forEach(function(job) {
          job.tags = job.tags.filter(function(tagName) {
             return tagName !== oldTagName;
          });
          job.tags.push(newTagName);
        });
        updateJobs();
      };
      
      scope.$watchCollection('selectedTags', function() {
        if (scope.setFilter) {
          if (scope.selectedTags.length > 0) {
            scope.setFilter({func: filterJobsBySelectedTags});
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