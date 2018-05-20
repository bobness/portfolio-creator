function Question() {
  this.type = 'text';
  this.text = 'Question text';
  this.required = false;
  this.value = null;;
}

angular.module('pc').directive('survey', ['portfolioService', function(portfolioService) {
  return {
    templateUrl: 'html/survey.html',
    scope: {
      theme: '<',
      questions: '<',
      tagCounts: '<'
    },
    link: function(scope, elem, attrs) {
      
      scope.questionTypes = ['text', 'textarea', 'skills'];
      
      scope.capitalizeFirstLetter = function(text) {
        var firstLetter = text[0];
        return firstLetter.toUpperCase() + text.substr(1);
      };
      
      scope.questions = scope.questions || [];
      
      scope.addQuestion = function() {
        return portfolioService.createQuestion(new Question(), scope.theme).then(function(question) {
          scope.questions.push(question);
        });
      };
      
      scope.updateQuestion = function(question) {
        return portfolioService.updateQuestion(question, scope.theme);
      };
      
      scope.deleteQuestion = function(question) {
        return portfolioService.deleteQuestion(question, scope.theme).then(function() {
          scope.questions = scope.questions.filter(function(q) { return q !== question; });
        });
      };
      
      scope.progress = function() {
        var requiredQuestions = scope.questions.filter(function(question) { return question.required; });
        var denominator = requiredQuestions.length;
        var numerator = requiredQuestions.filter(function(question) { return !!question.value; }).length;
        
        return Math.round((numerator/denominator)*100);
      };
      
      scope.$watch('tagCounts', function() {
        if (scope.tagCounts) {
          scope.tags = scope.tagCounts.map(function(tag) {
            return {
              name: tag.name,
              selected: false
            };
          });
        }
      });
      
      scope.tagsSelected = null;
      
      scope.selectTag = function(tag) {
        if (tag.selected) {
          scope.tagsSelected = true;
        } else {
          scope.tagsSelected = scope.tags.reduce(function(anySelected, tag) {
            return tag.selected ||  anySelected;
          }, false);
        }
      };
    }
  };
}])