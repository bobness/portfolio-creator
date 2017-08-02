angular.module('pc').factory('portfolioService', function($http) {
  var service = {};
  
  // service.id;
  
  service.getPortfolio = function(id) {
    this.id = id;
    return $http.get(`/portfolios/${id}`).then(function(res) {
      return res.data;
    });
  };
  
  service.addTag = function(tag, experience) {
    experience.tags.push(tag);
    this.put(experience);
  };
  
  service.removeTag = function(tag, experience) {
    experience.tags = experience.filter(function(item) {
      return item !== tag;
    });
    this.put(experience);
  };
  
  service.put = function(data) {
    return $http.put(`/portfolios/${this.id}/experiences`, data).then(function(res) {
      return res.data;
    });
  };
  
  service.createExperience = function(experience) {
    return this.post(`/portfolios/${this.id}/experiences`, experience);
  };
  
  service.post = function(url, data) {
    return $http.post(url, data).then(function(res) {
      return res.data;
    });
  };
  
  return service;
});