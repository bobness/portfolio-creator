angular.module('pc').directive('survey', ['$sce', 'portfolioService', function($sce, portfolioService) {
  return {
    templateUrl: 'html/survey.html',
    scope: {
//       questions: '<',
      themes: '<'
    },
    link: function(scope, elem, attrs) {
      
/*
      var checkAnswered = function(e) {
        var input = e.target;
        var questionText = input.getAttribute('question');
        var question = scope.questions.filter(function(question) { return question.text === questionText; })[0];
        if (!question || !question.inputs) {
          return false;
        }
        question.answered = question.inputs.reduce(function(answered, input) {
          return answered && input.val;
        }, false);
      };
*/
      
/*
      scope.$watch('questions', function() {
        if (scope.questions) {
          scope.questions.forEach(function(question) {
            
            var parser = new DOMParser();
            var doc = parser.parseFromString(question.html, "text/xml");
            var inputElements = Array.prototype.slice.call(doc.getElementsByTagName('input'));
            inputElements.forEach(function(inputEl) {
              inputEl.setAttribute('question', question.text);
            });
            question.inputs = inputElements;
            question.html = (new XMLSerializer()).serializeToString(doc);
            
            question.trustedHtml = $sce.trustAsHtml(question.html);
          });
        }
      });
*/
/*
      
      scope.$watch(function() {
        return elem.find('input').length;
      }, function() {
        elem.find('input').off('blur');
        elem.find('input').on('blur', checkAnswered);
      })
*/
      
/*
      var questionsAnswered = function() {
        if (!scope.questions) {
          return 0;
        }
        return scope.questions.filter(function(question) {
          return question.answered;
        }).length;
      };
*/
      
/*
      scope.progress = function() {
        if (!scope.questions) {
          return 0;1
        }
        return Math.round((questionsAnswered()/scope.questions.length)*100);
      };
*/

      // TODO: use dynamic questions, but for now just manually computer progress
      scope.progress = function() {
        var answered = Object.keys(scope.answered);
        var denominator = answered.length;
        var numerator = answered.filter(function(questionName) { return scope.answered[questionName]; }).length;
        
        return Math.round((numerator/denominator)*100);
      };
      
      scope.answered = {
        salary: null, // TODO: make this two fields to force a range
        teamSize: null,
        company: null,
        themes: null,
        email: null
      };
      
      scope.answer = function(questionName, value) {
        scope.answered[questionName] = !!value;
      };
/*
      scope.createQuestion = function() {
        // TODO
      };
*/

      scope.themesSelected = null;
      
      scope.selectTheme = function(theme) {
        if (theme.selected) {
          scope.themesSelected = true;
        } else {
          scope.themesSelected = scope.themes.reduce(function(anySelected, theme) {
            return theme.selected ||  anySelected;
          }, false);
        }
        
      };
      
      scope.submit = function() {
        // ng-models: themes.selected, salary, company, teamSize
        var email = {
          email: scope.email,
          selectedThemes: scope.themes
            .filter(function(theme) { return theme.selected; })
            .map(function(theme) { return theme.name; }),
          salary: scope.salary,
          company: scope.company,
          teamSize: scope.teamSize
        };
        return portfolioService.sendSurvey(email);
      };
    }
  };
}])