(function() {
  'use strict';

  angular
    .module('app.welcome')
    .controller('WelcomeController', WelcomeController);

  WelcomeController.$inject = [
    '$q',
    'dataservice',
    'logger',
    'person',
    '$rootScope',
    '$http',
    '$timeout'
  ];
  /* @ngInject */
  function WelcomeController($q, dataservice, logger, person, $rootScope, $http, $timeout) {
    var vm = this;
    vm.attending = '';
    vm.attendingForm = attendingForm;
    vm.check = true;
    vm.formAuth = formAuth;
    vm.formComplete = false;
    vm.person = person;
    vm.post = {
      'uniqueId': person.uniqueUri,
      'name': person.name,
      'attending': '',
      'menu': [],
      'dietRequirements': '',
      'message': ''
    };
    vm.title = 'Welcome';
    vm.validationMsg = {};
    $rootScope.person = person;

    activate();

    function activate() {
      var promises = [getMessageCount()];
      return $q.all(promises).then(function() {
        logger.info('Activated Welcome View');
      });
    }

    function formAuth(data) {
      // Validation on Menu
      if (vm.post.menu.length < vm.person.selective.length) {
        vm.validationMsg.menu = true;
        return false;
      } else {
        postPerson(vm.post, vm.person);
      }
    }

    function attendingForm(bool) {
      vm.attending = bool;
      vm.post.attending = true; // Set attending to true

      $timeout(function() {
        angular.element('html, body').stop().animate({
          scrollTop: angular.element('#contact').offset().top
        }, 1000, function() {
          angular.element('#contact').fadeIn();
        });
      }, 100);

      if (vm.attending === false) {
        vm.menu = ''; // Clear menu model
        vm.post.attending = false; // Set attending to false
        dataservice.postNotAttending(vm.post);
      }
    }

    function getMessageCount() {
      return dataservice.getMessageCount().then(function(data) {
        vm.messageCount = data;
        return vm.messageCount;
      });
    }

    function postPerson(userData, person) {
      dataservice.postPerson(userData).then(function(response) {
        vm.formComplete = true;
        person.formCompleted = true;
        console.log(person);
        dataservice.updatePerson(person).then(function(r) {

        });
      });
    }

  }
})();
