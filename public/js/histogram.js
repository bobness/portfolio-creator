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
      
      scope.selectedExperiences = [];
      scope.selectExperience = function(exp) {
        if (scope.selectedExperiences.indexOf(exp) === -1) {
          scope.selectedExperiences.push(exp);
        } else {
          scope.selectedExperiences = scope.selectedExperiences.filter(function(exp2) { return exp2.name !== exp.name; });
        }
      };
      
      var filterJobsBySelectedExperiences = function(job) {
        return scope.selectedExperiences.reduce(function(matched, exp) {
          return matched && (job.experiences.indexOf(exp.name) > -1);
        }, true);
      };
      
      scope.isSelected = function(exp) {
        return scope.selectedExperiences.map(function(exp) { return exp.name; }).indexOf(exp.name) > -1;
      };
      
      var selectedJobs = [];
      var oldExpName = '';
      scope.selectJobsFromExperience = function(expName) {
        selectedJobs = scope.getJobs().filter(function(job) { return job.experiences.indexOf(expName) > -1; });
        oldExpName = expName;
      };
      scope.renameExperiences = function(newExpName) {
        selectedJobs.forEach(function(job) {
          job.experiences = job.experiences.filter(function(expName) {
             return expName !== oldExpName;
          });
          job.experiences.push(newExpName);
          portfolioService.update(jobUrl, job);
        });
      };
      
      scope.$watchCollection('selectedExperiences', function() {
        if (scope.setFilter) {
          if (scope.selectedExperiences.length > 0) {
            scope.setFilter({func: filterJobsBySelectedExperiences});
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