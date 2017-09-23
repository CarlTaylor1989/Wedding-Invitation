(function() {
  'use strict';

  angular
    .module('app.welcome')
    .controller('WelcomeController', WelcomeController);

  WelcomeController.$inject = ['$q', 'dataservice', 'logger', 'person', '$rootScope', '$http', '$timeout'];
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
      'name': person.name,
      'attending': '',
      'menu': [],
      'diet': '',
      'message': ''
    };
    vm.title = 'Welcome';
    vm.validationMsg = {};
    $rootScope.person = person;

    activate();

    function activate() {
      var promises = [getMessageCount(), getPeople()];
      return $q.all(promises).then(function() {
        logger.info('Activated Welcome View');
      });
    }

    function formAuth(data) {
      // Validation on Menu
      if(vm.post.menu.length < vm.person.selective.length) {
        vm.validationMsg.menu = true;
        return false;
      } else {
        postPerson(vm.post);
      }
    }

    function attendingForm(bool) {
      vm.attending = bool;
      vm.post.attending = true; // Set attending to Yes

      $timeout(function() {
        angular.element('html, body').stop().animate({
          scrollTop: angular.element('#contact').offset().top
        }, 1000, function() {
          angular.element('#contact').fadeIn();
        });
      }, 100);

      if(vm.attending === false) {
        vm.menu = ''; // Clear menu model
        vm.post.attending = false; // Set attending to No
      }
    }

    function getPeople() {
      return dataservice.getPeople().then(function(data) {
        vm.people = data;
        return vm.people;
      });
    }

    function getMessageCount() {
      return dataservice.getMessageCount().then(function(data) {
        vm.messageCount = data;
        return vm.messageCount;
      });
    }

    function postPerson(userData) {
    $http.post('/api/users', userData)
      .success(function(data) {
        console.log('Successfully posted '+ data);
        $timeout(function() {
          postEmail(data);
          vm.formComplete = true;
        }, 1000);
      })
      .error(function(data) {
        console.log('Error while posting: ' + data);
      });
    }

    function postEmail(data) {
      console.log('postEmail func');
      $http.post('/api/postEmail', data).success(function(d) {
        console.log('success: ' + d);
      }).error(function(d) {
        console.log('error: ' + d);
      });
    }

  }
})();
