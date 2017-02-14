angular.module('pc').factory('portfolioService', function($http) {
  var service = {};
  
  service.update = function(baseUrl, data) {
    return $http.put(baseUrl + '/' + data._id, data);
  };
  
  return service;
});