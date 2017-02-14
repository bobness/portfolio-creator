angular.module('pc').factory('portfolioService', function($http) {
  var service = {};
  
  service.update = function(baseUrl, data) {
    return $http.put(baseUrl + '/' + data._id, data);
  };
  
  service.create = function(baseUrl, data) {
    return $http.post(baseUrl, data);
  };
  
  service.delete = function(baseUrl, data) {
    return $http.delete(baseUrl + '/' + data._id);
  };
  
  return service;
});