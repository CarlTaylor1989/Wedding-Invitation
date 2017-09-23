(function() {
  'use strict';

  angular
    .module('app.date')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'date',
        config: {
          url: '/date',
          templateUrl: 'app/date/date.html',
          controller: 'DateController',
          controllerAs: 'vm',
          title: 'date',
          settings: {
            nav: 3,
            content: 'Date'
          }
        }
      }
    ];
  }
})();
