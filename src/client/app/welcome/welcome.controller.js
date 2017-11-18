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
    vm.closeForm = false;
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
        // logger.info('Activated Welcome View');
      });
    }

    function formAuth(data) {
      if (vm.person.collective) {
        if ((data.menu === undefined || data.menu.length === 0) || data.menu.length < vm.person.selective.length) {
          vm.validationMsg.menu = true;
          return false;
        } else {
          postPerson(data, vm.person);
        }
      } else {
        if (data.menu === undefined || data.menu.length === 0) {
          vm.validationMsg.menu = true;
          return false;
        } else {
          postPerson(data, vm.person);
        }
      }
    }

    function attendingForm(bool) {
      vm.attending = bool;

      if(vm.attending === true) {
        vm.post.attending = true; // Set attending to true

        if(vm.person.eveningGuest === true) {
          postPerson(vm.post, vm.person);
        } else if(vm.person.eveningGuest === false) {
          $timeout(function() {
            angular.element('html, body').stop().animate({
              scrollTop: angular.element('#contact').offset().top - 93
            }, 1000, function() {
              angular.element('#contact').fadeIn();
            });
          }, 100);
        }
      } else if (vm.attending === false) {
        vm.post.attending = false; // Set attending to false
        vm.post.menu = ''; // Clear menu model

        if(vm.person.eveningGuest === true) {
          postPerson(vm.post, vm.person);
        } else if(vm.person.eveningGuest === false) {
          dataservice.postNotAttending(vm.post).then(function(response) {
            vm.person.formCompleted = true;
            vm.person.attending = vm.post.attending;
            dataservice.updatePerson(vm.person);
          });
        }
      }
    }

    function getMessageCount() {
      return dataservice.getMessageCount().then(function(data) {
        vm.messageCount = data;
        return vm.messageCount;
      });
    }

    function postPerson(userData, person) {
      vm.closeForm = true;
      vm.formLoading = true;
      dataservice.postPerson(userData).then(function(response) {
        person.formCompleted = true;
        person.attending = userData.attending;
        dataservice.updatePerson(person).then(function() {
          vm.formLoading = false;
        });
      });
    }

  }
})();
