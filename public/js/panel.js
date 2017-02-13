angular.module('pc').directive('panel', function() {
  return {
    templateUrl: '../html/panel.html',
    scope: {
      'title': '@',
      'url': '@',
      'data': '='
    },
    link: function(scope) {
    }
  }
});