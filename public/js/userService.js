angular.module('pc').factory('userService', function($resource) {
  var service = {};
  var User = $resource('/users/:id', 
    {id: '@_id'}, 
    {update: {method: 'PUT' /*, params: {id: '@id'}, isArray: false*/}
  });
  
  // /users/56c91e75a986a9d2ce8cc456/portfolio/skills
  
  service.getUser = function(id) {
    return User.get({id: id});
  };
  
/*
  service.updateUser = function(user) {
    if (user.$update) {
      return user.$update();      
    }
  };
*/
  
  return service;
});