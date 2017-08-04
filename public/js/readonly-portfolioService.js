angular.module('pc').factory('portfolioService', function($http) {
  var service = {};
  
  service.getPortfolio = function(id) {
    return $http.get(`${id}.json`).then(function(res) {
      return res.data;
    });
  };
  
  service.addTag = function() {};
  
  service.removeTag = function() {};
  
  service.createExperience = function() {};
  
  service.createTheme = function() {};
  
  return service;
});