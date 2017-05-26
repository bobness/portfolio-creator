angular.module('pc').controller('portfolioController', ['$scope', '$uibModal', 'userService', 'portfolioService',
  function($scope, $uibModal, userService, portfolioService) {
    
    var url = '/users/56c91e75a986a9d2ce8cc456/portfolio/jobs';
    
    $scope.user = null;
    $scope.newjob = {
      name: '',
      skills_learned: [],
      knowledge_gained: []
    };
    
    userService.getUser('56c91e75a986a9d2ce8cc456').$promise.then(function(user) {
      $scope.user = user;
      
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
    });
  }]
);
