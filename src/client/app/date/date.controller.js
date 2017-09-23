(function() {
  'use strict';

  angular
    .module('app.date')
    .controller('DateController', DateController);

  DateController.$inject = ['$q', 'dataservice', 'logger'];
  /* @ngInject */
  function DateController($q, dataservice, logger) {
    var vm = this;
    vm.title = 'Date';

    activate();

    function activate() {
      var promises = [getMessageCount(), getPeople()];
      return $q.all(promises).then(function() {
        logger.info('Activated Date View');
      });
    }

    function getMessageCount() {
      return dataservice.getMessageCount().then(function(data) {
        vm.messageCount = data;
        return vm.messageCount;
      });
    }

    function getPeople() {
      return dataservice.getPeople().then(function(data) {
        vm.people = data;
        return vm.people;
      });
    }
  }
})();
