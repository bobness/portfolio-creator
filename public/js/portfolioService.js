angular.module('pc').factory('portfolioService', function($http) {
  var service = {};
  
  var put = function(data) {
    return $http.put(`/portfolios/${this.id}/experiences`, data).then(function(res) {
      return res.data;
    });
  };
  
  var post = function(url, data) {
    return $http.post(url, data).then(function(res) {
      return res.data;
    });
  };
  
  // service.id;
  
  service.getPortfolio = function(id) {
    this.id = id;
    return $http.get(`/portfolios/${id}`).then(function(res) {
      return res.data;
    });
  };
  
  service.addTag = function(tag, experience) {
    experience.tags.push(tag);
    return put(experience);
  };
  
  service.removeTag = function(tag, experience) {
    experience.tags = experience.filter(function(item) {
      return item !== tag;
    });
    return put(experience);
  };
    
  service.createExperience = function(experience) {
    return post(`/portfolios/${this.id}/experiences`, experience);
  };

  
  return service;
});