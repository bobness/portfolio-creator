angular.module('pc').controller('portfolioController', ['$scope', '$uibModal', 'userService', 'portfolioService',
  function($scope, $uibModal, userService, portfolioService) {
    
    var url = '/users/56c91e75a986a9d2ce8cc456/portfolio/experiences';
    
    $scope.user = null;
    $scope.newexp = {
      'Company Name': '',
      'Title': '',
      'Description': '',
      'Start Date': null,
      'End Date': null,
      'tags': []
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
    
    $scope.$watch('user.portfolio.experiences', function() {
      if ($scope.user && $scope.user.portfolio) {
        $scope.charts = makeCharts($scope.user.portfolio.experiences);
        $scope.user.portfolio.experiences.forEach(function(exp) {
            if (exp.Description && exp.Description.indexOf("\"") === 0) {
              exp.Description = exp.Description.substring(1,exp.Description.length-1);
            }
        })
      }
    }, true);
    
    $scope.getExperiences = function() {
      return $scope.user.portfolio.experiences;
    };
    
    userService.getUser('56c91e75a986a9d2ce8cc456').$promise.then(function(user) {
      $scope.user = user;
    });
    
    $scope.parseDate = function(exp) {
      var date = exp['Start Date'],
          parts = date.split('/'),
          month = parts[0],
          year = parts[1];
      return new Date(`${year}-${month}`);
    };
    
    var makeCharts = function(experiences) {
      var charts = [];
      var tags = [];
      experiences.forEach(function(exp) {
        var expTags = exp.tags;
        expTags.forEach(function(name) {
          var tag = tags.filter(function(tag2) { return tag2.name === name; })[0];
          if (!tag) {
            tag = {name: name, count: 0};
            tags.push(tag);
          }
          tag.count++;
        });
      });
      charts.push(
        tags.sort(function(a,b) { return b.count - a.count; })
      );
      return charts;
    };
    
    $scope.createExperience = function(exp) {
      return portfolioService.create(url, exp).then(function(newexp) {
        $scope.user.portfolio.experiences.push(newexp);
        $scope.newexp.name = '';
      });
    };
    
    $scope.openLinkedInModal = function() {
        var modal = $uibModal.open({
          templateUrl: '../html/linkedin-modal.html',
          transclude: true,
          scope: $scope,
          controller: function($scope, $uibModalInstance, $sce) {
            $scope.title = 'LinkedIn Import';
            
            $scope.close = function() {
              $uibModalInstance.dismiss('cancel');
            };
            
            $scope.uploadCSV = function() {
              var file = document.getElementById('csvFile').files[0];
              var reader = new FileReader();
              reader.onload = function() {
                var rows = reader.result.split('\n');
                var cols = rows.shift().split('\t');
                var experiences = [];
                var currentExp;
                rows.forEach(function(row) {
                  if (row) {
                   var items = row.split('\t');
                    if (items.length === cols.length || items.length === 2) {
                      currentExp = {};
                      for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var col = cols[i];
                        currentExp[col] = item;
                      }
                      experiences.push(currentExp);                
                    } else if (items.length === 1) {
                        currentExp.Description += `\n${row}`;
                    } else if (items.length === 5) {
                        currentExp.Description += `\n${items[0]}`;
                        currentExp.Location = items[1];
                        currentExp['Start Date'] = items[2];
                        currentExp['End Date'] = items[3];
                        currentExp.Title = items[4];
                    }
                  }
                });
                $scope.$applyAsync(function() {
                  experiences.forEach(function(exp) {
                    $scope.createExperience(exp);
                  });
                });
              };
              reader.readAsText(file);
            };
          }
        });
    };
  }]
);
