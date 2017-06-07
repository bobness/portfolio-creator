angular.module('pc', [
  'ngResource',
  'xeditable',
  'ui.bootstrap',
  'ngSanitize',
  'ngTagsInput'
]).run(function (editableOptions) {
   editableOptions.theme = 'bs3';
});