var usr_id= null;
var usr_type= null;
var device_id='1001';
angular.module('satyam', ['ionic', 'chart.js', 'ngCordova', 'satyam.controllers'])

.run(function (LoginService,DataService,$ionicPlatform, $state, $timeout, $ionicHistory,$interval,$location,$cordovaDevice) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
 
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      // Double tab back button
      var backbutton=0;

      var backButton = $ionicPlatform.registerBackButtonAction(function (event) {
          event.preventDefault();
          if ($state.current.name == "app.dashboard" || $state.current.name == "app.admin_dashboard") {
             if(backbutton==0){
                  backbutton++;
                    window.plugins.toast.showLongBottom('Press again to exit');
                  $timeout(function(){backbutton=0;},1000);
              }else{
                  navigator.app.exitApp();
              }
          } else {
             $ionicHistory.backView().go();
          }
      }, 100);//registerBackButton

      document.addEventListener('deviceready', function () {
        device_id = $cordovaDevice.getUUID();
      }, false);

      LoginService.checkLogin(device_id).then(function(response){
              
          if(response.data.loggedin == 'yes'){
              
              if(response.data.role == 'super_admin' || response.data.role == 'admin'){
                  
                  $location.path('app/dashboard/admin');
              }else if(response.data.role == 'salesman'){
                  
                  $location.path('app/dashboard');
              }
          }
          else if(response.data.loggedin == 'no'){
              
              $location.path('/login2');
          }else{
              $ionicLoading.hide();
              console.log('I donot know what happned!');
          }
      });
  });

  var onSuccess = function(position) {
        document.addEventListener('deviceready', function () {
          device_id = $cordovaDevice.getUUID();
        }, false);
        var lat=position.coords.latitude;
        var lon=position.coords.longitude;
        //alert(lat);
        //alert(lon);
        LoginService.checkLogin(device_id).then(function(response){
          if(response.data.loggedin == 'yes'){
            usr_id  = response.data.user_id;
            console.log(response.data);
            if(response.data.role != 'super_admin'){
              DataService.trackSalesman(usr_id,lat,lon).then(function(res){});
            }
            
          }
           
            //alert(usr_id);
        });
        
        // alert('Latitude: '          + position.coords.latitude          + '\n' +
        //       'Longitude: '         + position.coords.longitude         + '\n' +
        //       'Altitude: '          + position.coords.altitude          + '\n' +
        //       'Accuracy: '          + position.coords.accuracy          + '\n' +
        //       'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        //       'Heading: '           + position.coords.heading           + '\n' +
        //       'Speed: '             + position.coords.speed             + '\n' +
        //       'Timestamp: '         + position.timestamp                + '\n');
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
    
    $interval(function(){
       navigator.geolocation.getCurrentPosition(onSuccess, onError);
      },300000);

  document.addEventListener('deviceready', function () {
    // Android customization
    cordova.plugins.backgroundMode.setDefaults({ text:'Doing heavy tasks.'});
    // Enable background mode
    cordova.plugins.backgroundMode.enable();

    // Called when background mode has been activated
    cordova.plugins.backgroundMode.onactivate = function () {
      
    }

    // Called when background mode has been diactivated
    cordova.plugins.backgroundMode.ondeactivate = function() {alert('I am live now!')};
  }, false);

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('welcome', {
    url: '/welcome',
    templateUrl: 'templates/welcome.html',
    controller: 'WelcomeController',
    controllerAs: 'WelcomeCtrl'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'MenuController',
    controllerAs: 'MenuCtrl'
  })

  .state('login2', {
    url: '/login2',
    templateUrl: 'templates/login2.html',
    controller: 'LoginController',
    controllerAs: 'LoginCtrl'
  })

 .state('app.orderList', {
    url: '/order/list',
    views: {
      'menuContent': {
        templateUrl: 'templates/orders.html',
        controller: 'OrderController',
        controllerAs: 'OrderCtrl'
      }
    }
  })

  .state('app.order', {
    url: '/order/single/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/order_single.html',
        controller: 'OrderSingleController',
        controllerAs: 'OrderSingleCtrl'
      }
    }
  })

  .state('app.dispatchList', {
    url: '/dispatch/list',
    views: {
      'menuContent': {
        templateUrl: 'templates/dispatches.html',
        controller: 'DispatchController',
        controllerAs: 'DispatchCtrl'
      }
    }
  })

  .state('app.dispatch', {
    url: '/dispatch/single/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/dispatch_single.html',
        controller: 'DispatchSingleContoller',
        controllerAs: 'DispatchSingleCtrl'
      }
    }
  })

  .state('app.trackSalesman', {
    url: '/track/salesman/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/track_salesman.html',
        controller: 'TrackSalesmanContoller',
        controllerAs: 'TrackSalesmanCtrl'
      }
    }
  })

  .state('app.salesmanList', {
    url: '/salesman/list',
    views: {
      'menuContent': {
        templateUrl: 'templates/salesman-list.html',
        controller: 'SalesmanListContoller',
        controllerAs: 'SalesmanListCtrl'
      }
    }
  })

  .state('app.do', {
    url: '/do/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/do_single.html',
        controller: 'DOSingleController',
        controllerAs: 'DOSingleCtrl'
      }
    }
  })

  .state('app.pendingDO', {
    url: '/pendingDO/list',
    views: {
      'menuContent': {
        templateUrl: 'templates/pendingdo.html',
        controller: 'PendingDOController',
        controllerAs: 'PendingDOCtrl'
      }
    }
  })

  .state('app.admin_dashboard', {
      url: '/dashboard/admin',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard_admin.html',
          controller: 'DashboardController',
          controllerAs: 'DashboardCtrl'
        }
      }

    })
  .state('app.dashboard', {
      url: '/dashboard',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'DashboardCtrl'
        }
      }
    })

   .state('app.form', {
      url: '/form',
      views: {
        'menuContent': {
          templateUrl: 'templates/form.html',
          controller: 'OrderBookController',
          controllerAs: 'OrderBookCtrl'
        }
      }
    })

   .state('app.dorders', {
      url: '/delivery/orders',
      views: {
        'menuContent': {
          templateUrl: 'templates/delivery_orders.html',
          controller: 'DeliveryOrderController',
          controllerAs: 'DeliveryOrderCtrl'
        }
      }
    })

   .state('app.reports', {
      url: '/reports',
      views: {
        'menuContent': {
          templateUrl: 'templates/report.html'
        }
      }
    })

   .state('app.salesReport', {
      url: '/sales/report',
      views: {
        'menuContent': {
          templateUrl: 'templates/reports/salesReport.html',
          controller: 'SalesChartCtrl',
          controllerAs: 'SalesChartCtrl'
        }
      }
    })
  
   .state('app.tdispatchReport', {
      url: '/takenDispatch/report',
      views: {
        'menuContent': {
          templateUrl: 'templates/reports/takenDispatchReport.html',
          controller: 'TDispathcChartCtrl',
          controllerAs: 'TDispathcChartCtrl'
        }
      }
    })

   .state('app.targetReport', {
      url: '/target/report',
      views: {
        'menuContent': {
          templateUrl: 'templates/reports/targetReport.html',
          controller: 'TargetChartCtrl',
          controllerAs: 'TargetChartCtrl'
        }
      }
    })

   .state('app.manufactureReport', {
      url: '/manufacture/report',
      views: {
        'menuContent': {
          templateUrl: 'templates/reports/manufactureReport.html',
          controller: 'ManufactureChartCtrl',
          controllerAs: 'ManufactureChartCtrl'
        }
      }
    })

   .state('app.productionReport', {
      url: '/production/report',
      views: {
        'menuContent': {
          templateUrl: 'templates/reports/productionReport.html',
          controller: 'ProductionChartCtrl',
          controllerAs: 'ProductionChartCtrl'
        }
      }
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');
});
