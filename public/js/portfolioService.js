angular.module('pc').factory('portfolioService', function($http) {
  var service = {};
  
  var put = function(url, data) {
    return $http.put(url, data).then(function(res) {
      return res.data;
    });
  };
  
  var post = function(url, data) {
    return $http.post(url, data).then(function(res) {
      return res.data;
    });
  };
  
  service.getPortfolio = function(id) {
    this.id = id;
    return $http.get('/portfolios/' + id).then(function(res) {
      return res.data;
    });
  };
  
  service.addTag = function(tag, experience) {
    var expUrl = '/portfolios/' + this.id + '/experiences/' + experience._id;
    experience.tags.push(tag);
    return put(expUrl, experience);
  };
  
  service.removeTag = function(tag, experience) {
    var expUrl = '/portfolios/' + this.id + '/experiences/' + experience._id;
    experience.tags.splice()
    experience.tags = experience.tags.filter(function(item) {
      return item !== tag;
    });
    return put(expUrl, experience);
  };
    
  service.createExperience = function(experience) {
    return post('/portfolios/' + this.id + '/experiences', experience);
  };
  
  service.updateExperience = function(experience) {
    return put('/portfolios/' + this.id + '/experiences/' + experience._id, experience);
  };
  
  service.createTheme = function(theme) {
    return post('/portfolios/' + this.id + '/themes', theme);
  };

  
  return service;
});