angular.module('pc', [
  'ngResource',
  'xeditable'
]).run(function (editableOptions) {
   editableOptions.theme = 'bs3';
});