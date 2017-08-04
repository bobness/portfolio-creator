angular.module('pc').factory('portfolioService', ['$http', '$q', function($http, $q) {
  var service = {};
  
  service.getPortfolio = function(id) {
    return $http.get(id + '.json').then(function(res) {
      return res.data;
    });
  };
  
  service.addTag = function() {
    return {
      then: function() {}
    };
  };
  
  service.removeTag = function() {
    return {
      then: function() {}
    };
  };
  
  service.createExperience = function() {
    return {
      then: function() {}
    };
  };
  
  service.updateExperience = function() {
    return {
      then: function() {}
    };
  };
  
  service.createTheme = function() {
    return {
      then: function() {}
    };
  };
  
  return service;
}]);