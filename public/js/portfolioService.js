angular.module('pc').factory('portfolioService', function($http) {
  var service = {};
  
  var portfolio;
  
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
  
  var rootUrl = '/portfolio';
  
  service.getPortfolio = function() {
    return $http.get(rootUrl).then(function(res) {
	    portfolio = res.data;
      return portfolio;
    });
  };
  
  service.addTag = function(tag, experience) {
	  var index = portfolio.experiences.indexOf(experience);
    var expUrl = rootUrl + '/experiences/' + index;
    experience.tags.push(tag);
    return put(expUrl, experience);
  };
  
  service.removeTag = function(tag, experience) {
	  var index = portfolio.experiences.indexOf(experience);
    var expUrl = rootUrl + '/experiences/' + index;
    experience.tags.splice()
    experience.tags = experience.tags.filter(function(item) {
      return item !== tag;
    });
    return put(expUrl, experience);
  };
    
  service.createExperience = function(experience) {
    return post(rootUrl + '/experiences', experience);
  };
  
  service.updateExperience = function(experience) {
	  var index = portfolio.experiences.indexOf(experience);
    return put(rootUrl + '/experiences/' + index, experience);
  };
  
  service.deleteExperience = function(experience) {
	  var index = portfolio.experiences.indexOf(experience);
	  return $http.delete(rootUrl + '/experiences/' + index);
  };
  
  service.createTheme = function(theme) {
    return post(rootUrl + '/themes', theme);
  };
  
  service.deleteTheme = function(themeName) {
	  var index = portfolio.themes.map(function(theme) { return theme.name; }).indexOf(themeName);
	  return $http.delete(rootUrl + '/themes/' + index);
  };
  
  service.createCampaign = function(themeName, path = '.') {
    var body = {
      theme: themeName,
      path: path + '/' + themeName + '.json'
    };
    return post(rootUrl + '/campaign', body);
  };
  
//   service.sendSurvey = function() {
//     return {
//       then: function() {}
//     };
//   }; // not needed for the builder UI
  service.sendSurvey = function(surveyObj) {
    return post('/portfolios/' + this.id + '/contact', surveyObj);
  };
  
  return service;
});