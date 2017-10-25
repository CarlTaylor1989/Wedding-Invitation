/**
 * weddingInvite - weddingInvite Project Generated from HotTowel Angular
 * @authors 
 * @version v0.0.0
 * @link 
 * @license 
 */
(function() {
  'use strict';

  angular.module('app', [
    'app.core',
    'app.widgets',
    'app.admin',
    'app.date',
    'app.welcome',
    'app.layout'
  ]);

})();

(function() {
  'use strict';

  angular.module('app.admin', [
    'app.core',
    'app.widgets'
  ]);

})();

(function() {
  'use strict';

  angular.module('blocks.exception', ['blocks.logger']);
})();

(function() {
  'use strict';

  angular.module('blocks.logger', []);
})();

(function() {
  'use strict';

  angular.module('blocks.router', [
    'ui.router',
    'blocks.logger'
  ]);
})();

(function() {
  'use strict';

  angular
    .module('app.core', [
      'ngAnimate', 'ngSanitize',
      'blocks.exception', 'blocks.logger', 'blocks.router',
      'ui.router', 'ngplus'
    ]);
})();

(function() {
  'use strict';

  angular.module('app.date', [
    'app.core',
    'app.widgets'
  ]);
})();

(function() {
  'use strict';

  angular.module('app.layout', ['app.core', 'ui.bootstrap.collapse']);
})();

(function() {
  'use strict';

  angular.module('app.welcome', [
    'app.core',
    'app.widgets'
  ]);
})();

(function() {
  'use strict';

  angular.module('app.widgets', []);
})();

(function() {
  'use strict';

  angular
    .module('app.admin')
    .controller('AdminController', AdminController);

  AdminController.$inject = ['logger'];
  /* @ngInject */
  function AdminController(logger) {
    var vm = this;
    vm.title = 'Admin';

    activate();

    function activate() {
      logger.info('Activated Admin View');
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('app.admin')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'admin',
        config: {
          url: '/admin',
          templateUrl: 'app/admin/admin.html',
          controller: 'AdminController',
          controllerAs: 'vm',
          title: 'Admin',
          settings: {
            nav: 2,
            content: 'Admin'
          }
        }
      }
    ];
  }
})();

// Include in index.html so that app level exceptions are handled.
// Exclude from testRunner.html which should run exactly what it wants to run
(function() {
  'use strict';

  angular
    .module('blocks.exception')
    .provider('exceptionHandler', exceptionHandlerProvider)
    .config(config);

  /**
   * Must configure the exception handling
   */
  function exceptionHandlerProvider() {
    /* jshint validthis:true */
    this.config = {
      appErrorPrefix: undefined
    };

    this.configure = function(appErrorPrefix) {
      this.config.appErrorPrefix = appErrorPrefix;
    };

    this.$get = function() {
      return { config: this.config };
    };
  }

  config.$inject = ['$provide'];

  /**
   * Configure by setting an optional string value for appErrorPrefix.
   * Accessible via config.appErrorPrefix (via config value).
   * @param  {Object} $provide
   */
  /* @ngInject */
  function config($provide) {
    $provide.decorator('$exceptionHandler', extendExceptionHandler);
  }

  extendExceptionHandler.$inject = ['$delegate', 'exceptionHandler', 'logger'];

  /**
   * Extend the $exceptionHandler service to also display a toast.
   * @param  {Object} $delegate
   * @param  {Object} exceptionHandler
   * @param  {Object} logger
   * @return {Function} the decorated $exceptionHandler service
   */
  function extendExceptionHandler($delegate, exceptionHandler, logger) {
    return function(exception, cause) {
      var appErrorPrefix = exceptionHandler.config.appErrorPrefix || '';
      var errorData = { exception: exception, cause: cause };
      exception.message = appErrorPrefix + exception.message;
      /**
       * Could add the error to a service's collection,
       * add errors to $rootScope, log errors to remote web server,
       * or log locally. Or throw hard. It is entirely up to you.
       * throw exception;
       *
       * @example
       *     throw { message: 'error message we added' };
       */
      logger.error(exception.message, errorData);

      $delegate(exception, cause);
    };
  }
})();

(function() {
  'use strict';

  exception.$inject = ["$q", "logger"];
  angular
    .module('blocks.exception')
    .factory('exception', exception);

  /* @ngInject */
  function exception($q, logger) {
    var service = {
      catcher: catcher
    };
    return service;

    function catcher(message) {
      return function(e) {
        var thrownDescription;
        var newMessage;
        if (e.data && e.data.description) {
          thrownDescription = '\n' + e.data.description;
          newMessage = message + thrownDescription;
        }
        e.data.description = newMessage;
        logger.error(newMessage);
        return $q.reject(e);
      };
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('blocks.logger')
    .factory('logger', logger);

  logger.$inject = ['$log', 'toastr'];

  /* @ngInject */
  function logger($log, toastr) {
    var service = {
      showToasts: true,

      error: error,
      info: info,
      success: success,
      warning: warning,

      // straight to console; bypass toastr
      log: $log.log
    };

    return service;
    /////////////////////

    function error(message, data, title) {
      toastr.error(message, title);
      $log.error('Error: ' + message, data);
    }

    function info(message, data, title) {
      toastr.info(message, title);
      $log.info('Info: ' + message, data);
    }

    function success(message, data, title) {
      toastr.success(message, title);
      $log.info('Success: ' + message, data);
    }

    function warning(message, data, title) {
      toastr.warning(message, title);
      $log.warn('Warning: ' + message, data);
    }
  }
} ());

/* Help configure the state-base ui.router */
(function() {
  'use strict';

  angular
    .module('blocks.router')
    .provider('routerHelper', routerHelperProvider);

  routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
  /* @ngInject */
  function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
    /* jshint validthis:true */
    var config = {
      docTitle: undefined,
      resolveAlways: {}
    };

    if (!(window.history && window.history.pushState)) {
      window.location.hash = '/';
    }

    $locationProvider.html5Mode(true);

    this.configure = function(cfg) {
      angular.extend(config, cfg);
    };

    this.$get = RouterHelper;
    RouterHelper.$inject = ['$location', '$rootScope', '$state', 'logger'];
    /* @ngInject */
    function RouterHelper($location, $rootScope, $state, logger) {
      var handlingStateChangeError = false;
      var hasOtherwise = false;
      var stateCounts = {
        errors: 0,
        changes: 0
      };

      var service = {
        configureStates: configureStates,
        getStates: getStates,
        stateCounts: stateCounts
      };

      init();

      return service;

      ///////////////

      function configureStates(states, otherwisePath) {
        states.forEach(function(state) {
          state.config.resolve =
            angular.extend(state.config.resolve || {}, config.resolveAlways);
          $stateProvider.state(state.state, state.config);
        });
        if (otherwisePath && !hasOtherwise) {
          hasOtherwise = true;
          $urlRouterProvider.otherwise(otherwisePath);
        }
      }

      function handleRoutingErrors() {
        // Route cancellation:
        // On routing error, go to the dashboard.
        // Provide an exit clause if it tries to do it twice.
        $rootScope.$on('$stateChangeError',
          function(event, toState, toParams, fromState, fromParams, error) {
            if (handlingStateChangeError) {
              return;
            }
            stateCounts.errors++;
            handlingStateChangeError = true;
            var destination = (toState &&
              (toState.title || toState.name || toState.loadedTemplateUrl)) ||
              'unknown target';
            var msg = 'Error routing to ' + destination + '. ' +
              (error.data || '') + '. <br/>' + (error.statusText || '') +
              ': ' + (error.status || '');
            logger.warning(msg, [toState]);
            $location.path('/');
          }
        );
      }

      function init() {
        handleRoutingErrors();
        updateDocTitle();
      }

      function getStates() { return $state.get(); }

      function updateDocTitle() {
        $rootScope.$on('$stateChangeSuccess',
          function(event, toState, toParams, fromState, fromParams) {
            stateCounts.changes++;
            handlingStateChangeError = false;
            var title = config.docTitle + ' ' + (toState.title || '');
            $rootScope.title = title; // data bind to <title>
          }
        );
      }
    }
  }
})();

(function() {
  'use strict';

  var core = angular.module('app.core');

  core.config(toastrConfig);

  toastrConfig.$inject = ['toastr'];
  /* @ngInject */
  function toastrConfig(toastr) {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';
  }

  var config = {
    appErrorPrefix: '[weddingInvite Error] ',
    appTitle: 'Natalie & Carl Wedding Invitation'
  };

  core.value('config', config);

  core.config(configure);

  configure.$inject = ['$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider'];
  /* @ngInject */
  function configure($logProvider, routerHelperProvider, exceptionHandlerProvider) {
    if ($logProvider.debugEnabled) {
      $logProvider.debugEnabled(true);
    }
    exceptionHandlerProvider.configure(config.appErrorPrefix);
    routerHelperProvider.configure({ docTitle: config.appTitle + ': ' });
  }

  function wowInit() {
    new WOW().init();
  }

  core.config(wowInit);

})();

/* global toastr:false, moment:false */
(function() {
  'use strict';

  angular
    .module('app.core')
    .constant('toastr', toastr)
    .constant('moment', moment);
})();

(function() {
  'use strict';

  appRun.$inject = ["routerHelper"];
  angular
    .module('app.core')
    .run(appRun);

  /* @ngInject */
  function appRun(routerHelper) {
    var otherwise = '/404';
    routerHelper.configureStates(getStates(), otherwise);
  }

  function getStates() {
    return [
      {
        state: '404',
        config: {
          url: '/404',
          templateUrl: 'app/core/404.html',
          title: '404'
        }
      }
    ];
  }
})();

(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('dataservice', dataservice);

  dataservice.$inject = ['$http', '$q', 'exception', 'logger'];
  /* @ngInject */
  function dataservice($http, $q, exception, logger) {

    var API = 'https://api.mlab.com/api/1/databases/';
    var KEY = '?apiKey=uOw09VD_O3zuzZMHw4Bb04gYgDPk44tK';
    var USERS = 'invitations/collections/accepted';

    var PEOPLE_ENDPOINT = 'https://api.mlab.com/api/1/databases/invitations/collections/people';

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
      console.log('here?')
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
      return $http({
        url: PEOPLE_ENDPOINT + '?q={id:'+ id +'}&apiKey=uOw09VD_O3zuzZMHw4Bb04gYgDPk44tK',
        method: 'GET'
      }).then(function(response) {
        return response.data[0];
      }, function(response) {
        return exception.catcher('XHR Failed for postTest')(response);
      });
    }

    function getPersonTest(id) {
      return $http({
        url: PEOPLE_ENDPOINT + '?q={id:'+ id +'}&apiKey=uOw09VD_O3zuzZMHw4Bb04gYgDPk44tK',
        method: 'GET'
      }).then(function(response) {
        return response.data[0];
      }, function(response) {
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

(function() {
  'use strict';

  angular
    .module('app.layout')
    .directive('htSidebar', htSidebar);

  /* @ngInject */
  function htSidebar() {
    // Opens and closes the sidebar menu.
    // Usage:
    //  <div ht-sidebar">
    //  <div ht-sidebar whenDoneAnimating="vm.sidebarReady()">
    // Creates:
    //  <div ht-sidebar class="sidebar">
    var directive = {
      link: link,
      restrict: 'EA',
      scope: {
        whenDoneAnimating: '&?'
      }
    };
    return directive;

    function link(scope, element, attrs) {
      var $sidebarInner = element.find('.sidebar-inner');
      var $dropdownElement = element.find('.sidebar-dropdown a');
      element.addClass('sidebar');
      $dropdownElement.click(dropdown);

      function dropdown(e) {
        var dropClass = 'dropy';
        e.preventDefault();
        if (!$dropdownElement.hasClass(dropClass)) {
          $sidebarInner.slideDown(350, scope.whenDoneAnimating);
          $dropdownElement.addClass(dropClass);
        } else if ($dropdownElement.hasClass(dropClass)) {
          $dropdownElement.removeClass(dropClass);
          $sidebarInner.slideUp(350, scope.whenDoneAnimating);
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('app.layout')
    .directive('htTopNav', htTopNav);

  /* @ngInject */
  function htTopNav() {
    var directive = {
      bindToController: true,
      controller: TopNavController,
      controllerAs: 'vm',
      restrict: 'EA',
      scope: {
        'navline': '='
      },
      templateUrl: 'app/layout/ht-top-nav.html'
    };

    TopNavController.$inject = ['$scope'];

    /* @ngInject */
    function TopNavController($scope) {
      var vm = this;
      $scope.isCollapsed = true;
    }

    return directive;
  }
})();

(function() {
  'use strict';

  angular
    .module('app.layout')
    .controller('NavController', NavController);

  NavController.$inject = [
    '$scope',
    '$state',
    'routerHelper',
    '$window',
    '$stateParams',
    '$rootScope',
    '$timeout',
    '$http'
  ];
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

    $window.onscroll = function() {
      vm.currentPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
      if (vm.currentPos >= vm.changePos) {
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

(function() {
  'use strict';

  angular
    .module('app.layout')
    .controller('ShellController', ShellController);

  ShellController.$inject = ['$rootScope', '$timeout', 'config', 'logger'];
  /* @ngInject */
  function ShellController($rootScope, $timeout, config, logger) {
    var vm = this;
    vm.busyMessage = 'Please wait ...';
    vm.isBusy = true;
    $rootScope.showSplash = true;
    vm.navline = {
      title: config.appTitle,
      text: 'Created by John Papa',
      link: 'http://twitter.com/john_papa'
    };

    activate();

    function activate() {
      logger.success(config.appTitle + ' loaded!', null);
      hideSplash();
    }

    function hideSplash() {
      //Force a 1 second delay so we can see the splash.
      $timeout(function() {
        $rootScope.showSplash = false;
      }, 1000);
    }

  }
})();

(function() {
  'use strict';

  angular
    .module('app.layout')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['$state', 'routerHelper'];
  /* @ngInject */
  function SidebarController($state, routerHelper) {
    var vm = this;
    var states = routerHelper.getStates();
    vm.isCurrent = isCurrent;

    activate();

    function activate() { getNavRoutes(); }

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
      return $state.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
    }
  }
})();

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

      if (vm.attending === false) {
        vm.menu = ''; // Clear menu model
        vm.post.attending = false; // Set attending to No
        dataservice.postNotAttending(vm.post);
      }
    }

    function getMessageCount() {
      return dataservice.getMessageCount().then(function(data) {
        vm.messageCount = data;
        return vm.messageCount;
      });
    }

    function postPerson(userData) {
      dataservice.postTest(userData).then(function(response) {
        // $timeout(function() {
        //   postEmail(response.data);
        //   vm.formComplete = true;
        // }, 1000);
        console.log(response);
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
              return dataservice.getPerson($stateParams.personId);
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

(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('htImgPerson', htImgPerson);

  htImgPerson.$inject = ['config'];
  /* @ngInject */
  function htImgPerson(config) {
    //Usage:
    //<img ht-img-person="{{person.imageSource}}"/>
    var basePath = config.imageBasePath;
    var unknownImage = config.unknownPersonImageSource;
    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
      attrs.$observe('htImgPerson', function(value) {
        value = basePath + (value || unknownImage);
        attrs.$set('src', value);
      });
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('htWidgetHeader', htWidgetHeader);

  /* @ngInject */
  function htWidgetHeader() {
    //Usage:
    //<div ht-widget-header title="vm.map.title"></div>
    // Creates:
    // <div ht-widget-header=""
    //      title="Movie"
    //      allow-collapse="true" </div>
    var directive = {
      scope: {
        'title': '@',
        'subtitle': '@',
        'rightText': '@',
        'allowCollapse': '@'
      },
      templateUrl: 'app/widgets/widget-header.html',
      restrict: 'EA',
      link: link
    };
    return directive;

    function link(scope, element, attr) {
      scope.toggleContent = function() {
        if (scope.allowCollapse === 'true') {
          var content = angular.element(element).siblings('.widget-content');
          content.toggle();
        }
      };
    }
  }
})();

angular.module("app.core").run(["$templateCache", function($templateCache) {$templateCache.put("app/admin/admin.html","<section class=mainbar><section class=matter><div class=container><div class=row><div class=\"widget wviolet\"><div ht-widget-header title={{vm.title}}></div><div class=\"widget-content user\"><h3>TODO: Implement Your Features</h3></div><div class=widget-foot><div class=clearfix></div></div></div></div></div></section></section>");
$templateCache.put("app/core/404.html","<section id=dashboard-view class=mainbar><section class=matter><div class=container><div class=row><div class=col-md-12><ul class=today-datas><li class=bred><div class=pull-left><i class=\"fa fa-warning\"></i></div><div class=\"datas-text pull-right\"><a><span class=bold>404</span></a>Page Not Found</div><div class=clearfix></div></li></ul></div></div><div class=row><div class=\"widget wblue\"><div ht-widget-header title=\"Page Not Found\" allow-collapse=true></div><div class=\"widget-content text-center text-info\"><div class=container>No soup for you!</div></div><div class=widget-foot><div class=clearfix></div></div></div></div></div></section></section>");
$templateCache.put("app/date/date.html","<section id=welcome><div class=section-inner><div class=container><div class=row><div class=\"col-lg-12 text-center mb100 wow fadeIn\"><h2 class=section-heading>Natalie and Carl</h2><hr class=thin-hr><h3 class=\"section-subheading secondary-font\">Join us on our special occasion.</h3></div></div></div></div></section>");
$templateCache.put("app/layout/header.html","<header id=headerwrap class=\"backstretched fullheight\" style=\"position: relative; z-index: 0; background: none; height: 676px;\"><div class=\"container vertical-center\" style=\"padding-top: 152px;\"><div class=\"intro-text vertical-center text-center smoothie\" style=\"padding-top: 110px;\"><div class=\"intro-heading wow fadeIn heading-font\"><span class=secondary-font>Celebrating</span>Natalie and Carl</div></div></div><div class=backstretch style=\"left: 0px; top: 0px; overflow: hidden; margin: 0px; padding: 0px; z-index: -999998; position: absolute; width: 100%; height: 676px;\"><div class=\"carousel slide\" data-ride=carousel><ol class=carousel-indicators><li data-target=#carousel-example-generic data-slide-to=0 class=active></li></ol><div class=carousel-inner role=listbox><div class=\"item active\"><img src=../images/us.jpg alt=\"This is us!\"><div class=carousel-caption></div></div></div></div></div></header>");
$templateCache.put("app/layout/ht-top-nav.html","<nav class=\"navbar navbar-default navbar-fixed-top fadeInDown\" ng-class=\"{\'navbar-shrink\': vm.isScrolled}\" ng-controller=\"NavController as vm\"><div class=container-fluid><div class=\"navbar-header page-scroll\"><button type=button class=\"navbar-toggle collapsed\" data-toggle=collapse data-target=#navbar aria-expanded=false><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button></div><div class=\"collapse navbar-collapse\" id=navbar><ul class=\"nav navbar-nav text-center\"><li><a href=\"/{{ vm.uniqueId }}\" ng-click=\"vm.scrollNav(\'#welcome\')\" class=\"page-scroll smoothie\">Welcome</a></li><li><a href=\"/{{ vm.uniqueId }}\" ng-click=\"vm.scrollNav(\'#wedding-date\')\" class=\"page-scroll smoothie\">Date</a></li><li><a href=\"/{{ vm.uniqueId }}\" class=\"navbar-brand smoothie\">{{ vm.couple.bride }} <img src=../images/live-heart.png> {{ vm.couple.groom }}</a></li><li><a href=\"/{{ vm.uniqueId }}\" ng-click=\"vm.scrollNav(\'#our-people\')\" class=\"page-scroll smoothie\">Our People</a></li><li><a href=\"/{{ vm.uniqueId }}\" ng-click=\"vm.scrollNav(\'#rsvp\')\" class=\"page-scroll smoothie\">RSVP</a></li></ul></div></div></nav>");
$templateCache.put("app/layout/shell.html","<div ng-controller=\"ShellController as vm\"><div class=clearfix><ht-top-nav navline=vm.navline></ht-top-nav></div><div ng-include=\"\'app/layout/header.html\'\"></div><div ui-view class=shuffle-animation></div><div ngplus-overlay ngplus-overlay-delay-in=50 ngplus-overlay-delay-out=700 ngplus-overlay-animation=dissolve-animation><img src=images/busy.gif><div class=\"page-spinner-message overlay-message\">{{vm.busyMessage}}</div></div></div>");
$templateCache.put("app/layout/sidebar.html","<div ng-controller=\"SidebarController as vm\"><ht-sidebar when-done-animating=vm.sidebarReady()><div class=sidebar-filler></div><div class=sidebar-dropdown><a href=#>Menu</a></div><div class=sidebar-inner><div class=sidebar-widget></div><ul class=navi><li class=\"nlightblue fade-selection-animation\" ng-class=vm.isCurrent(r) ng-repeat=\"r in vm.navRoutes\"><a ui-sref={{r.name}} ng-bind-html=r.settings.content></a></li></ul></div></ht-sidebar></div>");
$templateCache.put("app/welcome/welcome.html","<section id=welcome><div class=section-inner><div class=container><div class=row><div class=\"col-lg-12 text-center mb100\"><h2 class=section-heading ng-if=vm.person.name>Hi {{vm.person.name}}</h2><hr class=thin-hr><h3 class=\"section-subheading secondary-font\">Join us on our special occasion.</h3></div></div></div><div class=container><div class=row><div class=\"col-md-5 col-md-offset-1 wow fadeIn\"><img src=\"https://scontent-lht6-1.xx.fbcdn.net/v/t1.0-9/17190906_10158357508400224_927789344308959818_n.jpg?oh=8a317f5268fd41299174c7c45601b6a7&oe=5A06818C\" class=\"img-responsive mb30\"><p class=text-center>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p></div><div class=\"col-md-5 wow fadeIn\"><img src=\"https://scontent-lht6-1.xx.fbcdn.net/v/t1.0-9/20257927_10155668154587642_6519342810189991287_n.jpg?oh=ff1e3d294316e44a5d9fb558be0dce9a&oe=59F25D41\" class=\"img-responsive mb30\"><p class=text-center>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p></div></div></div></div></section><script>\n  $(\'.parallax\').parallax();\n</script><section class=\"light-wrapper light-opaqued parallax\" data-parallax=scroll data-image-src=\"https://scontent-lht6-1.xx.fbcdn.net/v/t1.0-9/14224871_10154581441837642_1845308316091187860_n.jpg?oh=2276170d7d8db0b8af22c1b539d06579&oe=59F6C877\" data-speed=0.7><div class=section-inner><div class=\"wow fadeIn\"><div class=\"container text-center the-date\"><div class=row><div class=col-xs-12><p class=\"lead a-quote secondary-font\">Let\'s write a quote here about us! :p</p></div></div></div></div></div></section><section id=wedding-date class=light-wrapper><div class=section-inner><div class=\"wow fadeIn\"><div class=\"container text-center\"><div class=row><div class=col-xs-12 role=tabpanel><div class=row><div class=\"col-xs-4 col-sm-12\"><ul class=\"nav nav-justified icon-tabs\" id=nav-tabs role=tablist><li role=presentation class=active><a href=#when role=tab data-toggle=tab><span class=\"tabtitle heading-font\">The Date</span></a></li><li role=presentation><a href=#where role=tab data-toggle=tab><span class=\"tabtitle heading-font\">The Location</span></a></li><li role=presentation><a href=#stay role=tab data-toggle=tab><span class=\"tabtitle heading-font\">Where to stay?</span></a></li></ul></div><div class=\"col-xs-8 col-sm-12 mt60\"><div class=tab-content id=tabs-collapse><div role=tabpanel class=\"tab-pane fade in active\" id=when><div class=tab-inner><p class=\"lead secondary-font\">16th February 2018</p></div></div><div role=tabpanel class=\"tab-pane fade\" id=where><div class=tab-inner><div class=row><div class=\"col-sm-5 col-sm-offset-1 text-left\"><p class=lead>Hedsor House</p><p>Hedsor Park</p><p>Taplow</p><p>Buckinghamshire</p><p>SL6 0HX</p></div><div class=col-sm-5><div id=mapwrapper><iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2480.145781406951!2d-0.6935206844697872!3d51.56556097964468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487663a34cd237c1%3A0xdade077d4ce23a90!2sHedsor+House!5e0!3m2!1sen!2suk!4v1500890159885\" width=463 height=220 frameborder=0 style=border:0 allowfullscreen></iframe></div></div></div></div></div><div role=tabpanel class=\"tab-pane fade\" id=stay><div class=tab-inner><div class=row><div class=\"col-sm-5 col-sm-offset-1 text-left\"><p class=lead>Where to stay?</p><ul><li>Hotel 1</li><li>Hotel 2</li><li>Hotel 3</li></ul></div></div></div></div></div></div></div></div></div></div></div></div></section><section id=our-people class=light-wrapper><div class=section-inner><div class=\"wow fadeIn\"><div class=container><div class=row><div class=col-xs-12><h2 class=section-heading>Meet the Groomsmen<h2></h2></h2></div></div><div class=row style=\"margin-bottom: 40px;\"><div class=col-sm-5ths><img src=\"https://scontent-lht6-1.xx.fbcdn.net/v/t1.0-9/15940510_10158020981320542_3271052378048383733_n.jpg?oh=a7fee78d09b8ac05242b0ab907b05fa9&oe=5A0092A2\" alt=\"Adam Roylance\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\"><i class=\"fa fa-male\" aria-hidden=true></i> Adam Roylance</h3></div><div class=col-sm-5ths><img src=\"https://scontent-lht6-1.xx.fbcdn.net/v/t1.0-0/p206x206/18519900_10155365920714243_6223846216862283914_n.jpg?oh=8944c1f19a5739cb21e65c7867296c15&oe=59FF50C2\" alt=\"Jenson Tagg\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\">Jenson Tagg</h3></div><div class=col-sm-5ths><img src=\"https://scontent-lht6-1.xx.fbcdn.net/v/t1.0-9/1469828_10152099263884316_951495177_n.jpg?oh=8735de403a14479fb53ab7a4bba94b4d&oe=5A0CA473\" alt=\"Toby Barr\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\">Toby Barr</h3></div><div class=col-sm-5ths><img src=\"https://scontent-lht6-1.xx.fbcdn.net/v/t31.0-8/17632014_10158282324150417_2831114810542218688_o.jpg?oh=a9ab33ccf51fd2e53165be2f2aa441e9&oe=59F0560D\" alt=\"Reece Tocker\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\">Reece Tocker</h3></div><div class=col-sm-5ths><img src=\"https://scontent-lht6-1.xx.fbcdn.net/v/t1.0-9/13528729_10209711859297751_5897795310314393633_n.jpg?oh=8a0563b8b9ead8a1e3135726b0ce122c&oe=59FB477C\" alt=\"Dan Hennessy\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\">Dan Hennessy</h3></div></div><div class=row><div class=col-xs-12><h2 class=section-heading>Meet the Bridesmaids<h2></h2></h2></div></div><div class=row><div class=col-sm-3><img src=\"https://scontent-lht6-1.xx.fbcdn.net/v/t1.0-9/843_10151257651277155_1030737319_n.jpg?oh=131bf1b5fead92c5eaf2d3e4a754e9f6&oe=59ECAED1\" alt=\"Freya Brook\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\"><i class=\"fa fa-female\" aria-hidden=true></i> Freya Brook</h3></div><div class=col-sm-3><img src=\"https://scontent-lht6-1.xx.fbcdn.net/v/t1.0-9/12279066_10153625965766006_5962740131971583631_n.jpg?oh=40ac9a39531e91dba58e838eec1a463f&oe=59FAB94F\" alt=\"Jaely Collier\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\">Jaely Collier</h3></div><div class=col-sm-3><img src=\"https://scontent-lht6-1.xx.fbcdn.net/v/t1.0-9/16998950_10154493411137309_8674191618146175489_n.jpg?oh=d40b620f5dac032f16c714edafc0b69e&oe=5A3751E1\" alt=\"Sarah McDowall\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\">Sarah McDowall</h3></div><div class=col-sm-3><img src=\"https://scontent-lht6-1.xx.fbcdn.net/v/t1.0-9/10404320_10155786195150573_6464601391871969077_n.jpg?oh=e2abf67b3d115b739d451ec487e7e705&oe=5A026B4C\" alt=\"Alejandra Paixão\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\">Alejandra Paixão</h3></div></div></div></div></div></section><footer id=rsvp class=white-wrapper><div class=container><div class=row><div class=\"col-md-12 text-center\"><h4 class=footer-goodbye>Will we be seeing you on our special day?</h4><button class=\"btn btn-primary mt30\" ng-click=vm.attendingForm(true)>Yes</button> <button class=\"btn btn-primary mt30\" ng-click=vm.attendingForm(false)>No</button></div><hr class=\"col-sm-12 thin-hr\"><div class=\"col-sm-8 col-sm-offset-2 section-inner animated\" id=contact ng-if=\"vm.attending || vm.attending === false\"><div id=message></div><form method=post class=\"main-contact-form wow\" ng-class=\"vm.formComplete ? \'fadeOut\' : \'fadeIn\'\"><div ng-if=vm.attending><h3>Thank you for attending!</h3><h4>Please fill out the RSVP form below.</h4></div><div ng-if=\"vm.attending === false\"><h3>We\'re sad that you cannot make it.</h3><h4>Please leave us a message if you like.</h4></div><br><br><br><div class=form-group><label for=name>Name</label> <input type=text class=form-control name=name id=name ng-value=vm.person.name value=\"{{ vm.person.name }}\" ng-model=vm.post.name></div><div class=\"form-group has-error\" ng-show=vm.validationMsg.menu><label class=control-label>Please select a menu choice</label></div><div class=form-group ng-hide=!vm.check style=\"float: left;\" ng-if=\"vm.person.collective && vm.attending\" ng-repeat=\"per in vm.person.selective track by $index\"><label for=name>Meal preferences for {{ per.name }}</label><div class=funkyradio><div class=funkyradio-default><input type=radio name={{per.name}}-menu id={{per.name}}-menu-lamb value=\"{{per.name}} - Lamb\" ng-model=vm.post.menu[$index] ng-click=\"vm.validationMsg.menu = false;\"> <label for={{per.name}}-menu-lamb>Lamb</label></div><div class=funkyradio-default><input type=radio name={{per.name}}-menu id={{per.name}}-menu-fish value=\"{{per.name}} - Fish\" ng-model=vm.post.menu[$index]> <label for={{per.name}}-menu-fish>Fish</label></div><div class=funkyradio-default><input type=radio name={{per.name}}-menu id={{per.name}}-menu-vegetarian value=\"{{per.name}} - Vegetarian\" ng-model=vm.post.menu[$index]> <label for={{per.name}}-menu-vegetarian>Vegetarian</label></div></div></div><div class=form-group ng-hide=!vm.check style=\"float: left;\" ng-if=\"!vm.person.collective && vm.attending\"><label for=name>Meal preferences</label><div class=funkyradio><div class=funkyradio-default><input type=radio name={{vm.person.name}}-menu id={{vm.person.name}}-menu-lamb value=\"{{vm.person.name}} - Lamb\" ng-model=vm.post.menu> <label for={{vm.person.name}}-menu-lamb>Lamb</label></div><div class=funkyradio-default><input type=radio name={{vm.person.name}}-menu id={{vm.person.name}}-menu-fish value=\"{{vm.person.name}} - Fish\" ng-model=vm.post.menu> <label for={{vm.person.name}}-menu-fish>Fish</label></div><div class=funkyradio-default><input type=radio name={{vm.person.name}}-menu id={{vm.person.name}}-menu-vegetarian value=\"{{vm.person.name}} - Vegetarian\" ng-model=vm.post.menu> <label for={{vm.person.name}}-menu-vegetarian>Vegetarian</label></div></div></div><div class=form-group style=\"float: left; clear: both; width: 100%;\" ng-if=vm.attending><label for>Dietary requirements</label> <input type=text class=form-control name=diet placeholder=\"Dietary requirements\" id=diet ng-model=vm.post.diet value=\"{{ vm.post.diet }}\"></div><div class=form-group style=\"clear: both;\"><label for=comments>Leave us a message</label> <textarea ng-if=\"vm.attending || vm.attending === false\" name=comments class=\"form-control wow fadeIn\" id=comments placeholder=\"Your Message *\" required data-validation-required-message=\"Please enter a message.\" ng-model=vm.post.message></textarea></div><div class=form-group><input ng-if=\"vm.attending || vm.attending === false\" class=\"btn btn-primary mt30\" type=submit name=submit value=Submit ng-click=vm.formAuth(vm.post)></div></form></div></div></div></footer>");
$templateCache.put("app/widgets/widget-header.html","<div class=widget-head ng-class=\"{\'collapsive\': allowCollapse === \'true\'}\" ng-click=toggleContent()><div class=\"page-title pull-left\">{{title}}</div><small class=page-title-subtle ng-show=subtitle>({{subtitle}})</small><div class=\"widget-icons pull-right\"></div><small class=\"pull-right page-title-subtle\" ng-show=rightText>{{rightText}}</small><div class=clearfix></div></div>");}]);