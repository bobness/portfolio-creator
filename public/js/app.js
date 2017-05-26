angular.module('pc', [
  'ngResource',
  'xeditable',
  'ui.bootstrap',
  'ngSanitize'
]).run(function (editableOptions) {
   editableOptions.theme = 'bs3';
});