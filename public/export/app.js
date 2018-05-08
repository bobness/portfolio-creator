angular.module('counteroffer', [])
  .controller('controller', ['$scope', '$http', function($scope, $http) {
    $http.get(('Counteroffer.json')).then(function(res) {
      var json = res.data;
      $scope.experiences = json.experiences;
      $scope.charts = makeCharts(json.experiences, json.tags);
    });
    
    var makeCharts = function(experiences, tags) {
      tags = tags.map(function(name) { return {name: name, count: 0 }; });
      var charts = [];
      experiences.forEach(function(exp) {
        exp.tags.forEach(function(name) {
          var index = tags.map(function(tag) { return tag.name; }).indexOf(name);
          if (index > -1) {
            tags[index].count++;
          }
        });
      });
      charts.push(
        tags.sort(function(a,b) { return b.count - a.count; })
      );
      return charts;
    };
    
    $scope.parseDate = function(exp) {
      var date = exp['start'],
          parts = date.split('/');
      if (parts.length >= 2) {
	      var month = parts[0],
            year = parts[1];
	      return new Date(year + '-' + month);
      } else {
	      return new Date(date);
      }
    };
    
    var filterFunc;
    $scope.setFilter = function(func) {
      filterFunc = func;
    };
    $scope.expFilter = function(exp) {
      if (filterFunc) {
        return filterFunc(exp);
      } else {
        return true;
      }
    };
    
    $scope.getExperiences = function() {
      return $scope.experiences;
    };
    $scope.selectedTags = [];
  }])
  .directive('experience', [function() {
    return {
      templateUrl: 'experience.html',
      scope: {
        data: '='
      },
      link: function(scope) {
        scope.getFormattedDescription = function() {
  	      if (scope.data.description) {
  	        return scope.data.description.split('\n').join('<br>');
  	      }
  	      return '';
        };
      }
    };
  }])
  .directive('histogram', [function() {
    return {
      templateUrl: 'histogram.html',
      scope: {
        data: '=',
        setFilter: '&',
        getExperiences: '&',
        selectedTags: '='
      },
      link: function(scope) {
        
        scope.visibleTags = angular.copy(scope.data);
        
        scope.selectTag = function(tag) {
          var index = scope.selectedTags
            .map(function(tag) { return tag.name; })
            .indexOf(tag.name);
          if (index === -1) {
            scope.selectedTags.push(tag);
          } else {
            scope.selectedTags.splice(index, 1);
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
        
        scope.isSelected = function(tag) {
          return scope.selectedTags.map(function(tag) { return tag.name; }).indexOf(tag.name) > -1;
        };
        
        var selectedExperiences = [];
        var oldTagName = '';
        
        scope.selectExperiencesFromTag = function(tagName) {
          selectedExperiences = scope.getExperiences().filter(function(exp) { return exp.tags.indexOf(tagName) > -1; });
          oldTagName = tagName;
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
    };
  }])