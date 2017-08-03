angular.module('pc').factory('portfolioService', function($http) {
  var service = {};
  
  var put = function(portfolioId, data) {
    return $http.put(`/portfolios/${portfolioId}/experiences/${data._id}`, data).then(function(res) {
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
    return put(this.id, experience);
  };
  
  service.removeTag = function(tag, experience) {
    experience.tags = experience.tags.filter(function(item) {
      return item !== tag;
    });
    return put(this.id, experience);
  };
    
  service.createExperience = function(experience) {
    return post(`/portfolios/${this.id}/experiences`, experience);
  };

  
  return service;
});