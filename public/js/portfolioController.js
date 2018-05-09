angular.module('pc').controller('portfolioController', ['$scope', '$uibModal', '$location', 'portfolioService',
  function($scope, $uibModal, $location, portfolioService) {
    
    $scope.alerts = [];
    
    var addAlert = function(type, msg) {
      $scope.alerts.push({
        type: type,
        msg: msg
      });
    };
    
    var success = function(msg) {
      addAlert('success', msg);
    };
    
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
    
    $scope.newexp = {
      'company': '',
      'title': '',
      'description': '',
      'start': '',
      'end': '',
      'tags': []
    };
    
    var filterFunc;
    $scope.setFilter = function(func) {
      filterFunc = func;
    };
    
    $scope.selectedTags = [];
    
    $scope.createTheme = function(selectedTags) {
      var name = prompt('Theme name');
      if (name) {
        var theme = {
          name: name,
          tags: selectedTags.map(function(tag) { return tag.name; })
        };
        return portfolioService.createTheme(theme).then(function(theme) {
  	      $scope.portfolio.themes.push(theme);
  				$scope.selectedTags = [];
  				$location.path(theme.name);
        });
      }
    };
    
    $scope.themeIsSelected = function(name) {
	    if (name) {
		    return selectedThemeName() === name;
	    }
	    if ($scope.portfolio) {
		    return $scope.portfolio.themes.map(function(theme) { return theme.name; }).indexOf(selectedThemeName()) > -1;
	    }
	    return false;
    };
    
    const selectedThemeName = function() {
	    return $location.path().substring(1);
    };
    
    $scope.deleteSelectedTheme = function() {
	    var name = selectedThemeName();
	    return portfolioService.deleteTheme(name).then(function() {
		    $scope.portfolio.themes = $scope.portfolio.themes.filter(function(theme) { return theme.name !== name; });
		    $location.path('');
	    });
    };
    
    $scope.expFilter = function(exp) {
      if (filterFunc) {
        return filterFunc(exp);
      } else {
        return true;
      }
    };
    
    $scope.$watch('portfolio.experiences', function() {
      if ($scope.portfolio) {
        $scope.charts = makeCharts($scope.portfolio.experiences);
        $scope.portfolio.experiences.forEach(function(exp) {
            if (exp.Description && exp.Description.indexOf("\"") === 0) {
              exp.Description = exp.Description.substring(1,exp.Description.length-1);
            }
        })
      }
    }, true);
    
    $scope.getExperiences = function() {
      return $scope.portfolio.experiences;
    };
    
    portfolioService.getPortfolio().then(function(portfolio) {
      $scope.portfolio = portfolio;
      
/*
      // DEBUG
      $scope.portfolio.questions = [
        {
          text: 'What is the salary range?',
          html: '<blah><span>$</span><input type="number"></input><span> thousand (e.g., $150-200 thousand)</span></blah>'
        }
      ];
      // /DEBUG
*/
    });
    
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
      return portfolioService.createExperience(exp).then(function(newexp) {
	      $scope.$applyAsync(function() {
        	$scope.portfolio.experiences.push(newexp);
					$scope.newexp.name = '';
	      });
      });
    };
    
    $scope.showSurvey = function() {
      $location.hash('contact');
    };
    
    $scope.hideSurvey = function() {
      $location.hash('');
    };
    
    $scope.surveyVisible = function() {
      return $location.hash() === 'contact';
    }
    
    $scope.refreshExperiences = function(callObj) {
	    var removedExp = callObj.exp;
	    $scope.$applyAsync(function() {
		    $scope.portfolio.experiences = $scope.portfolio.experiences.filter(function(exp) { return exp !== removedExp; });
		  });
    };
    
    $scope.openLinkedInModal = function() {
        var modal = $uibModal.open({
          templateUrl: 'html/linkedin-modal.html',
          transclude: true,
          scope: $scope,
          controller: function($scope, $uibModalInstance, $sce) {
            $scope.title = 'LinkedIn Import';
            
            $scope.close = function() {
              $uibModalInstance.dismiss('cancel');
            };
            
            $scope.uploadCSV = function() { // TODO: change to parse the "quoted descriptions" correctly
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
                        currentExp.Description += '\n' + row;
                    } else if (items.length === 5) {
                        currentExp.Description += '\n' + items[0];
                        currentExp.Location = items[1];
                        currentExp['start'] = items[2];
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
    
    $scope.createCampaign = function() {
      var path = 'public/export';
      var themeName = selectedThemeName();
      return portfolioService.createCampaign(themeName, path).then(function() {
        success('Created campaign JSON file: ' + path + '/' + themeName + '.json');
      });
    };
  }]
);
