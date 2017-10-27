(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('dataservice', dataservice);

  dataservice.$inject = ['$http', '$q', 'exception', 'logger'];
  /* @ngInject */
  function dataservice($http, $q, exception, logger) {

    var ATTEND_ENDPOINT = 'https://api.mlab.com/api/1/databases/invitations/collections/accepted';
    var PEOPLE_ENDPOINT = 'https://api.mlab.com/api/1/databases/invitations/collections/people';
    var KEY = '?apiKey=uOw09VD_O3zuzZMHw4Bb04gYgDPk44tK';

    var service = {
      getMessageCount: getMessageCount,
      getPerson: getPerson,
      postPerson: postPerson,
      postNotAttending: postNotAttending,
      updatePerson: updatePerson
    };

    return service;

    function getMessageCount() { return $q.when(72); }

    function getPerson(id) {
      return $http({
        url: PEOPLE_ENDPOINT + '?q={id:'+ id +'}&apiKey=uOw09VD_O3zuzZMHw4Bb04gYgDPk44tK',
        method: 'GET'
      }).then(function(response) {
        console.log(response.data[0]);
        return response.data[0];
      }, function(response) {
        return exception.catcher('XHR Failed for getPerson')(response);
      });
    }

    function postPerson(data) {
      return $http({
        url: ATTEND_ENDPOINT + KEY,
        method: 'POST',
        data: data
      }).then(function(response) {
        return response;
      }, function(response) {
        return exception.catcher('XHR Failed for postPerson')(response);
      });
    }

    function updatePerson(data) {
      return $http({
        url: PEOPLE_ENDPOINT + '?q={id:'+ data.id +'}&apiKey=uOw09VD_O3zuzZMHw4Bb04gYgDPk44tK',
        method: 'PUT',
        data: data
      }).then(function(response) {
        console.log('success', response);
        return response;
      }, function(response) {
        console.log('fail', response);
        return exception.catcher('XHR Failed for updatePerson')(response);
      });
    }

    function postNotAttending(data) {
      return $http({
        url: ATTEND_ENDPOINT + KEY,
        method: 'POST',
        data: data
      }).then(function(response) {
        return response;
      }, function(response) {
        return exception.catcher('XHR Failed for postNotAttending')(response);
      });
    }

  }
})();
