(function() {
  'use strict';

  angular
    .module('app.welcome')
    .run(appRun);

  appRun.$inject = ['routerHelper', 'dataservice', '$filter', '$stateParams'];
  /* @ngInject */
  function appRun(routerHelper, dataservice, $filter, $stateParams) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'welcome',
        config: {
          url: '/',
          templateUrl: 'app/welcome/welcome.html',
          resolve: {
            person: function(dataservice, $filter, $stateParams) {
              if($stateParams.personId) {
                return dataservice.getPerson($stateParams.personId);
              } else {
                return dataservice.getPerson(250);
              }
            }
          },
          controller: 'WelcomeController',
          controllerAs: 'vm',
          title: 'welcome',
          settings: {
            nav: 1,
            content: 'Welcome'
          }
        }
      },
      {
        state: 'welcomePerson',
        config: {
          url: '/{personId}',
          templateUrl: 'app/welcome/welcome.html',
          resolve: {
            person: function(dataservice, $filter, $stateParams) {
              if($stateParams.personId) {
                return dataservice.getPerson($stateParams.personId);
              } else {
                return dataservice.getPerson(250);
              }
            }
          },
          controller: 'WelcomeController',
          controllerAs: 'vm',
          title: 'welcome',
          settings: {
            nav: 1,
            content: 'Welcome'
          }
        }
      }
    ];
  }
})();
