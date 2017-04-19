angular.module('pc').factory('portfolioService', function($http) {
  var service = {};
  
  service.update = function(baseUrl, data) {
    return $http.put(baseUrl + '/' + data._id, data).then(function(res) {
      return res.data;
    });
  };
  
  service.create = function(baseUrl, data) {
    return $http.post(baseUrl, data).then(function(res) {
      return res.data;
    });
  };
  
  service.delete = function(baseUrl, data) {
    return $http.delete(baseUrl + '/' + data._id);
  };
  
  return service;
});