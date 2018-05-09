angular.module('pc').directive('survey', ['$sce', 'portfolioService', function($sce, portfolioService) {
  return {
    templateUrl: 'html/survey.html',
    scope: {
      tagCounts: '<',
      successFunc: '&'
    },
    link: function(scope, elem, attrs) {
      
      scope.$watch('tagCounts', function() {
        if (scope.tagCounts) {
          scope.tags = scope.tagCounts.map(function(tag) {
            return {
              name: tag.name,
              selected: false
            };
          });
          scope.otherTag = {
            name: 'Other',
            selected: false,
            text: ''
          };
        }
      });

      scope.progress = function() {
        var answered = Object.keys(scope.answered);
        var denominator = answered.length;
        var numerator = answered.filter(function(questionName) { return scope.answered[questionName]; }).length;
        
        return Math.round((numerator/denominator)*100);
      };
      
      scope.answered = {
        salary: null,
        comments: null,
        company: null,
        tags: null,
        email: null
      };
      
      scope.answer = function(questionName, value) {
        scope.answered[questionName] = !!value;
      };

      scope.tagsSelected = null;
      
      scope.selectTag = function(tag) {
        if (tag.selected) {
          scope.tagsSelected = true;
        } else {
          var tags = scope.tags.concat(scope.otherTag);
          scope.tagsSelected = tags.reduce(function(anySelected, tag) {
            return tag.selected ||  anySelected;
          }, false);
        }
        
      };
      
      scope.submit = function() {
        var email = {
          email: scope.email,
          selectedtags: scope.tags
            .filter(function(tag) { return tag.selected; })
            .map(function(tag) { return tag.name; }),
          salary: scope.salary,
          company: scope.company,
          comments: scope.comments
        };
        var text = JSON.stringify(email);
        return scope.successFunc({text: text});
      };
    }
  };
}])