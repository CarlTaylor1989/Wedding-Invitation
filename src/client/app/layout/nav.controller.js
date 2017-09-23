(function() {
  'use strict';

  angular
    .module('app.layout')
    .controller('NavController', NavController);

  NavController.$inject = ['$scope', '$state', 'routerHelper', '$window', '$stateParams', '$rootScope', '$timeout', '$http'];
  /* @ngInject */
  function NavController($scope, $state, routerHelper, $window, $stateParams, $rootScope, $timeout, $http) {
    var vm = this;
    var states = routerHelper.getStates();

    vm.changePos = 75;
    vm.currentPos = 0;
    vm.isCurrent = isCurrent;
    vm.isScrolled = false;
    vm.scrollPos = 0;
    vm.couple = {'bride': 'Natalie', 'groom': 'Carl'};
    $timeout(function() {
      vm.uniqueId = $rootScope.person.id;
    }, 1000);

    vm.scrollNav = scrollNav;

    activate();

    function activate() {
      getNavRoutes();
    }

    function getNavRoutes() {
      vm.navRoutes = states.filter(function(r) {
        return r.settings && r.settings.nav;
      }).sort(function(r1, r2) {
        return r1.settings.nav - r2.settings.nav;
      });
    }

    function isCurrent(route) {
      if (!route.title || !$state.current || !$state.current.title) {
        return '';
      }
      var menuName = route.title;
      return $state.current.title.substr(0, menuName.length) === menuName ? 'active' : '';
    }

    $window.onscroll = function(){
      vm.currentPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
      if(vm.currentPos >= vm.changePos ) {
        vm.isScrolled = true;
        $scope.$apply();
      } else {
        vm.isScrolled = false;
        $scope.$apply();
      }
    };

    function scrollNav(id) {
      angular.element('html, body').stop().animate({
        scrollTop: angular.element(id).offset().top
      }, 1000);
      event.preventDefault();
    }

  }
})();
