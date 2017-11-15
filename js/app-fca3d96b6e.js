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
        url: PEOPLE_ENDPOINT + '?q={uniqueUri:"'+ id +'"}&apiKey=uOw09VD_O3zuzZMHw4Bb04gYgDPk44tK',
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
        url: PEOPLE_ENDPOINT + '?q={uniqueUri:"'+ data.uniqueUri +'"}&apiKey=uOw09VD_O3zuzZMHw4Bb04gYgDPk44tK',
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
    }, 3000);

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

  ShellController.$inject = ['$rootScope', '$timeout', 'config'];
  /* @ngInject */
  function ShellController($rootScope, $timeout, config) {
    var vm = this;
    vm.busyMessage = 'Please wait ...';
    vm.isBusy = true;
    $rootScope.showSplash = true;

    activate();

    function activate() {
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
        logger.info('Activated Welcome View');
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
        debugger;
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
$templateCache.put("app/layout/ht-top-nav.html","<nav class=\"navbar navbar-default navbar-fixed-top fadeInDown\" ng-class=\"{\'navbar-shrink\': vm.isScrolled}\" ng-controller=\"NavController as vm\"><div class=\"navbar-header page-scroll\"><button type=button class=\"navbar-toggle collapsed\" data-toggle=collapse data-target=#navbar aria-expanded=false><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button></div><div class=\"collapse navbar-collapse\" id=navbar><ul class=\"nav navbar-nav text-center\"><li><a ng-href=\"{{ vm.uniqueId !== 250 ? vm.uniqueId : \'/\' }}\" ng-click=\"vm.scrollNav(\'#welcome\')\" class=\"page-scroll smoothie\">Welcome</a></li><li><a ng-href=\"{{ vm.uniqueId !== 250 ? vm.uniqueId : \'/\' }}\" ng-click=\"vm.scrollNav(\'#wedding-date\')\" class=\"page-scroll smoothie\">Date</a></li><li><a ng-href=\"{{ vm.uniqueId !== 250 ? vm.uniqueId : \'/\' }}\" class=\"navbar-brand smoothie\">{{ vm.couple.bride }} <img src=../images/live-heart.png> {{ vm.couple.groom }}</a></li><li><a ng-href=\"{{ vm.uniqueId !== 250 ? vm.uniqueId : \'/\' }}\" ng-click=\"vm.scrollNav(\'#our-people\')\" class=\"page-scroll smoothie\">Our People</a></li><li ng-if=\"vm.uniqueId !== 250\"><a ng-href=\"{{ vm.uniqueId !== 250 ? vm.uniqueId : \'/\' }}\" ng-click=\"vm.scrollNav(\'#rsvp\')\" class=\"page-scroll smoothie\">RSVP</a></li></ul></div></nav>");
$templateCache.put("app/layout/shell.html","<div ng-controller=\"ShellController as vm\"><div class=clearfix><ht-top-nav navline=vm.navline></ht-top-nav></div><div ng-include=\"\'app/layout/header.html\'\"></div><div ui-view class=shuffle-animation></div><div ngplus-overlay ngplus-overlay-delay-in=50 ngplus-overlay-delay-out=700 ngplus-overlay-animation=dissolve-animation><img src=images/busy.gif><div class=\"page-spinner-message overlay-message\">{{vm.busyMessage}}</div></div></div>");
$templateCache.put("app/layout/sidebar.html","<div ng-controller=\"SidebarController as vm\"><ht-sidebar when-done-animating=vm.sidebarReady()><div class=sidebar-filler></div><div class=sidebar-dropdown><a href=#>Menu</a></div><div class=sidebar-inner><div class=sidebar-widget></div><ul class=navi><li class=\"nlightblue fade-selection-animation\" ng-class=vm.isCurrent(r) ng-repeat=\"r in vm.navRoutes\"><a ui-sref={{r.name}} ng-bind-html=r.settings.content></a></li></ul></div></ht-sidebar></div>");
$templateCache.put("app/welcome/welcome.html","<section id=welcome><div class=section-inner><div class=container><div class=row><div class=\"col-lg-12 text-center mb100\"><h2 class=section-heading ng-if=vm.person.name>Dear {{vm.person.name}}</h2><hr class=thin-hr><h3 class=\"section-subheading secondary-font\" ng-if=\"vm.person.id !== 250\">Please join us on our special occasion!</h3><h3 class=\"section-subheading secondary-font\" ng-if=\"vm.person.id === 250\">Welcome to our wedding website!</h3></div></div></div><div class=container><div class=row><div class=\"col-md-5 col-md-offset-1 wow fadeIn\"><img src=images/us-again.jpg class=\"img-responsive mb30\"></div><div class=\"col-md-5 wow fadeIn\"><p class=text-center>A romance that started with a Facebook friend request in 2008 - and after nine years, 25 flights, and living together for 835 days, Natalie finally decided to accept Carl\'s friend request.</p><p class=text-center>On 29th December 2016, we got engaged in beautiful Colombia and now we\'re beyond excited to tie the knot and celebrate our life together with all our nearest and dearest. <span ng-if=\"vm.person.id !== 250\">We\'d be absolutely over the moon to have you join us in the celebrations.</span></p></div></div></div></div></section><script>\n  $(\'.parallax\').parallax({\n    positionY: \'-270px\'\n  });\n</script><section class=\"light-wrapper light-opaqued parallax\" data-parallax=scroll data-image-src=images/pattern.jpg data-speed=0.4><div class=section-inner><div class=\"wow fadeIn\"><div class=\"container text-center the-date\"><div class=row><div class=col-xs-12><p class=\"lead a-quote secondary-font mb0\" ng-if=\"vm.person.id !== 250\">We hope to see you on our special day!</p><p class=\"lead a-quote secondary-font mb0\" ng-if=\"vm.person.id === 250\">Excited is an understatement!</p></div></div></div></div></div></section><section id=wedding-date class=light-wrapper><div class=section-inner><div class=\"wow fadeIn\"><div class=\"container text-center\"><div class=row><div class=col-xs-12 role=tabpanel><div class=row><div class=\"col-xs-12 col-sm-12\"><ul class=\"nav nav-justified icon-tabs\" id=nav-tabs role=tablist><li role=presentation class=active><a href=#when role=tab data-toggle=tab><span class=\"tabtitle heading-font\">Date</span></a></li><li role=presentation ng-if=\"vm.person.id !== 250\"><a href=#where role=tab data-toggle=tab><span class=\"tabtitle heading-font\">Location</span></a></li><li role=presentation ng-if=\"vm.person.id !== 250\"><a href=#gifts role=tab data-toggle=tab><span class=\"tabtitle heading-font\">Gifts</span></a></li><li role=presentation ng-if=\"vm.person.id !== 250\"><a href=#stay role=tab data-toggle=tab><span class=\"tabtitle heading-font\">Hotels</span></a></li></ul></div><div class=\"col-xs-12 col-sm-12 mt60\"><div class=tab-content id=tabs-collapse><div role=tabpanel class=\"tab-pane fade in active\" id=when><div class=tab-inner style=\"padding-bottom: 0;\"><p class=\"lead secondary-font\" style=\"margin-bottom: 0;\" ng-if=\"vm.person.eveningGuest === true && vm.person.id !== 250\">Friday 16th February 2018<br>at 7:30pm</p><p class=\"lead secondary-font\" style=\"margin-bottom: 0;\" ng-if=\"vm.person.eveningGuest === false && vm.person.id !== 250\">Friday 16th February 2018<br>at 2 o\'clock</p><p class=\"lead secondary-font\" style=\"margin-bottom: 0;\" ng-if=\"vm.person.id === 250\">Friday 16th February 2018</p></div></div><div role=tabpanel class=\"tab-pane fade\" id=where ng-if=\"vm.person.id !== 250\"><div class=tab-inner><div class=row><div class=\"col-sm-5 col-sm-offset-1 text-left\"><p class=lead>Hedsor House</p><p>Hedsor Park</p><p>Taplow</p><p>Buckinghamshire</p><p>SL6 0HX</p></div><div class=col-sm-5><div id=mapwrapper><iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2480.145781406951!2d-0.6935206844697872!3d51.56556097964468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487663a34cd237c1%3A0xdade077d4ce23a90!2sHedsor+House!5e0!3m2!1sen!2suk!4v1500890159885\" width=450 height=300 frameborder=0 style=border:0 allowfullscreen></iframe></div></div></div></div></div><div role=tabpanel class=\"tab-pane fade\" id=gifts ng-if=\"vm.person.id !== 250\"><div class=tab-inner><div class=row><div class=\"col-sm-8 col-sm-offset-1 text-left\"><p class=lead>Gifts</p><p>As most of you know, we moved into our little flat together in 2015 and have since built our home with everything we need. Please don\'t feel obliged to give us a gift as it means more to us that you can join us on our special day, however, if you would like to, then a contribution towards our honeymoon would be greatly appreciated.</p></div></div></div></div><div role=tabpanel class=\"tab-pane fade\" id=stay ng-if=\"vm.person.id !== 250\"><div class=tab-inner><div class=row><div class=\"col-sm-5 col-sm-offset-1 text-left\"><p class=lead>Where to stay?</p><ul><li>Chequers Inn - High Wycombe (2 miles)</li><li>Premier Inn - High Wycombe (5.1 miles)</li><li>Travelodge - Maidenhead (5.2 miles)</li></ul><p><a target=_self href=downloads/hotels-near-hedsor.pdf download=hotels-near-hedsor.pdf>Click here for a full list of nearby hotels.</a></p></div></div></div></div></div></div></div></div></div></div></div></div></section><section id=our-people class=light-wrapper><div class=section-inner><div class=\"wow fadeIn\"><div class=container><div class=row><div class=col-xs-12><h2 class=section-heading>Meet the Groomsmen<h2></h2></h2></div></div><div class=row style=\"margin-bottom: 40px;\"><div class=col-sm-5ths><img src=images/people/adam_first.jpg alt=\"Adam Roylance\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\">Adam Roylance</h3></div><div class=col-sm-5ths><img src=images/people/jenson_first.jpg alt=\"Jenson Tagg\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\">Jenson Tagg</h3></div><div class=col-sm-5ths><img src=images/people/toby_first.jpg alt=\"Toby Barr\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\">Toby Barr</h3></div><div class=col-sm-5ths><img src=images/people/reece_first.jpg alt=\"Reece Tocker\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\">Reece Tocker</h3></div><div class=col-sm-5ths><img src=images/people/dan_first.jpg alt=\"Dan Hennessy\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\">Dan Hennessy</h3></div></div><div class=row><div class=col-xs-12><h2 class=section-heading>Meet the Bridesmaids<h2></h2></h2></div></div><div class=row><div class=col-sm-3><img src=images/people/freya_first.jpg alt=\"Freya Brook\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\">Freya Brook</h3></div><div class=col-sm-3><img src=images/people/jaely_first.jpg alt=\"Jaely Collier\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\">Jaely Collier</h3></div><div class=col-sm-3><img src=images/people/sarah_first.jpg alt=\"Sarah McDowall\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\">Sarah McDowall</h3></div><div class=col-sm-3><img src=images/people/ale_first.jpg alt=\"Alejandra Paixão\" class=\"img-responsive grayscale\"><h3 class=\"section-subheading secondary-font\">Alejandra Paixão</h3></div></div></div></div></div></section><section id=rsvp class=white-wrapper ng-if=\"vm.person.id !== 250\"><div class=section-inner><div class=container><div class=row><div class=\"col-md-12 text-center\"><div ng-hide=vm.person.formCompleted><div ng-if=\"vm.person.eveningGuest === true\"><h4 class=footer-goodbye>Will we be seeing you at our wedding reception?</h4></div><div ng-if=\"vm.person.eveningGuest === false\"><h4 class=footer-goodbye>Will we be seeing you on our wedding day?</h4></div><hr class=thin-hr><button class=\"btn btn-primary mt30\" ng-click=vm.attendingForm(true)>Yes</button> <button class=\"btn btn-primary mt30\" ng-click=vm.attendingForm(false)>No</button></div><div ng-show=vm.person.formCompleted><h2 class=section-heading>Thank you for the RSVP!</h2><hr class=thin-hr><div ng-if=vm.person.attending><h3 class=\"section-subheading secondary-font\">We\'re excited that you can make it!</h3><br><br><img src=images/rsvp.jpg alt=Excited! style=\"width: 300px;\"><br><br><h3 class=section-subheading style=\"font-size: 26px;\">#ItTakesTwoToTaylor</h3></div><div ng-if=\"vm.person.attending === false\"><h3 class=\"section-subheading secondary-font\">We\'re sorry that you\'re not able to make it.</h3></div></div></div><div class=\"col-xs-12 col-sm-8 col-sm-offset-2 animated\" id=contact ng-if=vm.attending><div id=message></div><form method=post class=\"main-contact-form wow\" ng-if=\"vm.person.formCompleted === false\" ng-hide=\"vm.closeForm === true\"><div class=form-group><label for=name>Name</label> <input type=text class=form-control name=name id=name ng-value=vm.person.name value=\"{{ vm.person.name }}\" ng-model=vm.post.name></div><div class=\"form-group has-error\" ng-show=vm.validationMsg.menu><label class=control-label>Please select a menu choice</label></div><div class=form-group ng-hide=!vm.check style=\"float: left;\" ng-if=\"vm.person.collective && vm.attending\" ng-repeat=\"per in vm.person.selective track by $index\"><label for=name>Meal preferences for {{ per.name }}</label><div class=funkyradio><div class=funkyradio-default><input type=radio name={{per.name}}-menu id={{per.name}}-menu-pork value=\"{{per.name}} - Pork\" ng-model=vm.post.menu[$index] ng-click=\"vm.validationMsg.menu = false;\"> <label for={{per.name}}-menu-pork>Pork</label></div><div class=funkyradio-default><input type=radio name={{per.name}}-menu id={{per.name}}-menu-vegetarian value=\"{{per.name}} - Vegetarian\" ng-model=vm.post.menu[$index] ng-click=\"vm.validationMsg.menu = false;\"> <label for={{per.name}}-menu-vegetarian>Vegetarian</label></div></div></div><div class=form-group ng-hide=!vm.check style=\"float: left;\" ng-if=\"!vm.person.collective && vm.attending\"><label for=name>Meal preference</label><div class=funkyradio><div class=funkyradio-default><input type=radio name={{vm.person.name}}-menu id={{vm.person.name}}-menu-pork value=\"{{vm.person.name}} - Pork\" ng-model=vm.post.menu[$index] ng-click=\"vm.validationMsg.menu = false;\"> <label for={{vm.person.name}}-menu-pork>Pork</label></div><div class=funkyradio-default><input type=radio name={{vm.person.name}}-menu id={{vm.person.name}}-menu-vegetarian value=\"{{vm.person.name}} - Vegetarian\" ng-model=vm.post.menu[$index] ng-click=\"vm.validationMsg.menu = false;\"> <label for={{vm.person.name}}-menu-vegetarian>Vegetarian</label></div></div></div><div class=form-group style=\"float: left; clear: both; width: 100%;\" ng-if=vm.attending><label for>Dietary requirements</label> <input type=text class=form-control name=diet placeholder=\"Dietary requirements\" id=diet ng-model=vm.post.diet value=\"{{ vm.post.diet }}\"></div><div class=form-group style=\"clear: both;\"><label for=comments>Leave us a message</label> <textarea ng-if=\"vm.attending || vm.attending === false\" name=comments class=\"form-control wow fadeIn\" id=comments placeholder=\"Your Message\" ng-model=vm.post.message></textarea></div><div class=\"form-group mt30\"><input ng-if=\"vm.attending || vm.attending === false\" class=\"btn btn-primary\" type=submit name=submit value=Submit ng-click=vm.formAuth(vm.post)> <img src=images/spinner.gif width=80 ng-if=vm.formLoading></div></form></div></div></div></div></section><footer class=light-wrapper><div class=\"col-md-12 text-center wow fadeIn\"><span class=copyright>Copyright &copy; 2017. Designed &amp; developed by Carl Taylor</span></div></footer>");
$templateCache.put("app/widgets/widget-header.html","<div class=widget-head ng-class=\"{\'collapsive\': allowCollapse === \'true\'}\" ng-click=toggleContent()><div class=\"page-title pull-left\">{{title}}</div><small class=page-title-subtle ng-show=subtitle>({{subtitle}})</small><div class=\"widget-icons pull-right\"></div><small class=\"pull-right page-title-subtle\" ng-show=rightText>{{rightText}}</small><div class=clearfix></div></div>");}]);