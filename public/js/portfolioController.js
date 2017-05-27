angular.module('pc').controller('portfolioController', ['$scope', '$uibModal', 'userService', 'portfolioService',
  function($scope, $uibModal, userService, portfolioService) {
    
    var url = '/users/56c91e75a986a9d2ce8cc456/portfolio/jobs';
    
    $scope.user = null;
    $scope.newjob = {
      name: '',
      skills_learned: [],
      knowledge_gained: []
    };
    
    $scope.$watch('user.portfolio.jobs', function() {
      if ($scope.user && $scope.user.portfolio) {
        $scope.charts = makeCharts($scope.user.portfolio.jobs);
        $scope.user.portfolio.jobs.forEach(function(job) {
            if (job.Description && job.Description.indexOf("\"") === 0) {
              job.Description = job.Description.substring(1,job.Description.length-1);
            }
        })
      }
    }, true);
    
    userService.getUser('56c91e75a986a9d2ce8cc456').$promise.then(function(user) {
      $scope.user = user;
    });
    
    $scope.parseDate = function(job) {
      var date = job['Start Date'],
          parts = date.split('/'),
          month = parts[0],
          year = parts[1];
      return new Date(`${year}-${month}`);
    };
    
    var makeCharts = function(jobs) {
      var charts = [];
      var experiences = [];
      jobs.forEach(function(job) {
        var jobExperiences = job.experience; // TODO: change to experiences
        jobExperiences.forEach(function(name) {
          var exp = experiences.filter(function(exp2) { return exp2.name === name; })[0];
          if (!exp) {
            exp = {name: name, count: 0};
            experiences.push(exp);
          }
          exp.count++;
        });
      });
      charts.push(
        experiences.sort(function(a,b) { return b.count - a.count; })
      );
      return charts;
    };
    
//     $scope.charts = makeCharts($scope.user.portfolio.jobs);
    
    $scope.createJob = function(job) {
      return portfolioService.create(url, job).then(function(newjob) {
        $scope.user.portfolio.jobs.push(newjob);
        $scope.newjob.name = '';
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
                var jobs = [];
                var currentJob;
                rows.forEach(function(row) {
                  if (row) {
                   var items = row.split('\t');
                    if (items.length === cols.length || items.length === 2) {
                      currentJob = {};
                      for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var col = cols[i];
                        currentJob[col] = item;
                      }
                      jobs.push(currentJob);                
                    } else if (items.length === 1) {
                        currentJob.Description += `\n${row}`;
                    } else if (items.length === 5) {
                        currentJob.Description += `\n${items[0]}`;
                        currentJob.Location = items[1];
                        currentJob['Start Date'] = items[2];
                        currentJob['End Date'] = items[3];
                        currentJob.Title = items[4];
                    }
                  }
                });
                //console.log(jobs);
                $scope.$applyAsync(function() {
                  jobs.forEach(function(job) {
                    $scope.createJob(job);
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
