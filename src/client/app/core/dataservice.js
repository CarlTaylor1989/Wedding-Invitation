(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('dataservice', dataservice);

  dataservice.$inject = ['$http', '$q', 'exception', 'logger'];
  /* @ngInject */
  function dataservice($http, $q, exception, logger) {

    var API = 'https://api.mlab.com/api/1/databases/';
    var KEY = '&apiKey=uOw09VD_O3zuzZMHw4Bb04gYgDPk44tK';
    var USERS = 'invitations/collections/accepted';
    var PEOPLE = 'invitations/collections/people';

    var service = {
      getPeople: getPeople,
      getPerson: getPerson,
      getPersonTest: getPersonTest,
      getMessageCount: getMessageCount,
      postTest: postTest,
      postUser: postUser,
      postNotAttending: postNotAttending
    };

    return service;

    function getMessageCount() { return $q.when(72); }

    function getPeople() {
      return $http.get('/api/people')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getPeople')(e);
      }
    }

    function getPerson(id) {
      console.log('GOT HERE 1');
      return $http.get('/api/person/' + id)
        .then(success)
        .catch(fail);

      function success(r) {
        console.log(r);
        return r.data;
      }

      function fail(e) {
        console.log(e);
        return exception.catcher('XHR Failed for getPerson')(e);
      }
    }

    function getPersonTest(id) {
      console.log('GOT HERE 1', id);
      console.log(API + PEOPLE + '?q={"id":' + id + '}' + KEY);
      return $http({
        url: 'https://api.mlab.com/api/1/databases/invitations/collections/people?q={%22id%22:1}&apiKey=uOw09VD_O3zuzZMHw4Bb04gYgDPk44tK',
        method: 'GET',
        data: data
      }).then(function(response) {
        console.log(response)
        return response;
      }, function(response) {
        console.log(response)
        return exception.catcher('XHR Failed for postTest')(response);
      });
    }

    function postTest(data) {
      return $http({
        url: API + USERS + KEY,
        method: 'POST',
        data: data
      }).then(function(response) {
        return response;
      }, function(response) {
        return exception.catcher('XHR Failed for postTest')(response);
      });
    }

    function postNotAttending(data) {
      return $http({
        url: API + USERS + KEY,
        method: 'POST',
        data: data
      }).then(function(response) {
        return response;
      }, function(response) {
        return exception.catcher('XHR Failed for postNotAttending')(response);
      });
    }

    function postUser() {
      return $http.post('/api/users')
        .then(success)
        .catch(fail);

      function success(r) {
        return r.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for postUser')(e);
      }
    }

  }
})();
