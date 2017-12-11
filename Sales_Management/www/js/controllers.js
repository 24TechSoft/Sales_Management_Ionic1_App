
var app = angular.module('satyam.controllers',['ionic']);


app.controller('MenuController', function(LoginService, DataService, $scope, $location, $ionicLoading, $cordovaDevice){
    //$scope.data = {};
    var _this = this;
   
    //var device_id = $cordovaDevice.getUUID();
    LoginService.checkLogin(device_id).then(function(response){
        console.log(response.data);
        usr_type=response.data.role;
        _this.usertyp=usr_type;
        _this.userid=response.data.user_id;
    });
   
    document.addEventListener('deviceready', function () {
      device_id = $cordovaDevice.getUUID();
    }, false);
    $scope.logout = function(){
        LoginService.logout(device_id).then(function(response){
            console.log(response.data.loggedout);
            if(response.data.loggedout == 'yes'){
                $location.path('/login2');
            }
        });
    };
    $scope.dashboard = function(){
        $ionicLoading.show();
         LoginService.checkLogin(device_id).then(function(response){
        //console.log(response);
            if(response.data.loggedin == 'yes'){
                DataService.dispatchDetails().then(function(response){
                    _this.dispatchDetails = response.data;
                    console.log(response.data);
                });

                DataService.orderDetails().then(function(response){
                    _this.orderDetails = response.data;
                    console.log(response.data);
                });
                if(response.data.role == 'super_admin' || response.data.role == 'admin'){
                    $location.path('app/dashboard/admin');
                }else if(response.data.role == 'salesman'){
                    $location.path('app/dashboard');
                }

            }
            else if(response.data.loggedin == 'no'){
                $ionicLoading.hide();
                $location.path('/login2');
            }
            else
                console.log('I donot know what happned!');
            $ionicLoading.hide();
        });
    };

    $scope.orderBook = function(){
        $ionicLoading.show()
        LoginService.checkLogin(device_id).then(function(response){
        //console.log(response);
            if(response.data.loggedin == 'yes'){
                $ionicLoading.hide();

                $location.path('/app/form')
            }
            else if(response.data.loggedin == 'no'){
                $ionicLoading.hide();
                $location.path('/login2');
            }
            else
                console.log('I donot know what happned!');

        });
    };

     $scope.deliveryOrders = function(){
        $ionicLoading.show();
        LoginService.checkLogin(device_id).then(function(response){
            _this.salesman_id   = response.data.user_id;
            if(response.data.loggedin == 'no'){
                $location.path('/login2');
            }

        });

        DataService.orderDetails().then(function(response){
            _this.deliveryOrders = response.data;
            $ionicLoading.hide();
        });
       
        $location.path('/app/delivery/orders');
    };

    $scope.orders = function(){
        $ionicLoading.show();
        LoginService.checkLogin(device_id).then(function(response){
            _this.salesman_id   = response.data.user_id;
            if(response.data.loggedin == 'no'){
                $location.path('/login2');
            }

        });

        DataService.orderAll().then(function(response){
            _this.orderAll      = response.data;
            console.log(response.data);
            $ionicLoading.hide();
        });
       
        $location.path('/app/order/list');
    };

    $scope.dispatches = function(){
        $ionicLoading.show();
        LoginService.checkLogin(device_id).then(function(response){
            _this.salesman_id   = response.data.user_id;
            if(response.data.loggedin == 'no'){
                $location.path('/login2');
            }

        });
        DataService.dispatchAll().then(function(response){
            _this.dispatchAll = response.data;
            $ionicLoading.hide();
        });
        $location.path('/app/dispatch/list')
    }

    $scope.trackSalesman=function(){
        $ionicLoading.show();
        LoginService.checkLogin(device_id).then(function(response){
            _this.salesman_id   = response.data.user_id;
            if(response.data.loggedin == 'no'){
                $location.path('/login2');
            }

        });
        $location.path('/app/track/salesman')
    }

     $scope.salesmanList=function(){
        $ionicLoading.show();
        LoginService.checkLogin(device_id).then(function(response){
            _this.salesman_id   = response.data.user_id;
            if(response.data.loggedin == 'no'){
                $location.path('/login2');
            }

        });
         DataService.salesmanAll().then(function(response){
            _this.salesmanAll = response.data;
           $ionicLoading.hide();
           console.log(response.data);
        });
        $location.path('/app/salesman/list')
    }

    $scope.reports = function(){
        $location.path('/app/reports')
    }
});

app.controller('WelcomeController', function($scope, $location, $timeout){
     
})

app.controller('LoginController', function(LoginService, $scope, $location, $ionicLoading, $cordovaDevice) {
  
    $scope.data = {};
    

    $scope.login = function() {
        var email       =$scope.data.email;
        var password    =$scope.data.password;

        if(email == undefined || password == undefined){
            document.getElementById('error').style.display = "block";
            document.getElementById('error-msg').innerHTML = 'Email or Password field are empty!';
        }else{
            LoginService.login(email,password,device_id).then(function(response){
                document.getElementById('email').value      = "";
                document.getElementById('password').value   = "";
                if(response.data.status == 'ok')
                {
                     usr_id=response.data.user_data.id;
                    document.getElementById('error').style.display = "none";
                    document.getElementById('error-msg').innerHTML = "";
                    user_id = response.data;
                    if(response.data.role == "super_admin" || response.data.role == "admin")
                        $location.path('/app/dashboard/admin');
                    else if(response.data.role == "salesman")
                        $location.path('/app/dashboard');
                }
                else
                {
                    document.getElementById('error').style.display = "block";
                    document.getElementById('error-msg').innerHTML = 'You have provided wrong credentials!';
                    $location.path('/login2')
                }
            }).catch(function(response){
                console.log(response);
            });
        }
    };
});

app.controller('LogoutController', function(LoginService,$scope, $location, $cordovaDevice){
    $scope.data = {};
    //var device_id   = $cordovaDevice.getUUID();
    document.addEventListener('deviceready', function () {
      device_id = $cordovaDevice.getUUID();
    }, false);
    $scope.logout = function(){
        LoginService.logout(device_id).then(function(response){
            console.log(response.data.loggedout);
            if(response.data.loggedout == 'yes'){
                $location.path('/login2');
            }
        });
    };
});

app.controller('DashboardController', function($scope, $cordovaLocalNotification){
    
});

app.controller('DispatchSingleContoller', function(DataService, $scope, $stateParams, $ionicLoading){
    $scope.data = {};
    var _this = this;

    $scope.$on('$ionicView.enter', function(){
        $ionicLoading.show();
        DataService.dispatchSingle($stateParams.id).then(function(response){
            console.log(response);
            _this.dispatch = response.data;
            $ionicLoading.hide();
        });
    });
   
});

app.controller('OrderSingleController', function(DataService, $stateParams, $scope, $ionicLoading){
    $scope.data = {};
    var _this = this;

    $scope.$on('$ionicView.enter', function(){
        $ionicLoading.show();
        DataService.orderSingle($stateParams.id).then(function(response){
            //console.log(response);
            _this.order = response.data;
            $ionicLoading.hide();
        });
        
    });
    
});

app.controller('OrderBookController', function(DataService, $scope, $ionicLoading, $ionicPopup, $location){
    $scope.data = {};
    var _this = this;

    $scope.$on('$ionicView.enter', function(){
        DataService.partyAll().then(function(response){
            _this.partyAll = response.data;
        });

        DataService.salesmanAll().then(function(response){
            _this.salesmanAll = response.data;
           
        });
        // For hideing the error msg on load
        var clsnm = document.getElementsByClassName('valid');
        for(var i = 0; i<clsnm.length; i++)
            clsnm[i].style.display = 'none';
    });

    var options = {
        date: new Date(),
        mode: 'date'
    };
    
    function onSuccess(date){
        var mm=(date.getMonth()+1).toString();
        var dd=date.getDate().toString();
        var yy=date.getFullYear().toString();
        if(mm.length==1)
        {
            mm="0"+mm;
        }
        if(dd.length==1)
        {
            dd="0"+dd;
        }
        document.getElementById("booking_date").value=yy+"/"+mm+"/"+dd;
    }
    
    function onError(error) { // Android only
        showAlert("Error","Error: " + error);
    }

    $scope.OpenDatePicker = function(){
        datePicker.show(options, onSuccess, onError);
    }

    $scope.orderBook = function(){
        var order_date  = document.getElementById("booking_date").value;
        var party       = document.getElementById('party').value;
        var salesman    = document.getElementById('salesman').value;
        var quantity    = $scope.data.quantity;
        var rate        = $scope.data.rate;
        var total_value = document.getElementById('total_value').value;
        var type        = document.getElementById('type').value;
        var flag        = true;

        if(order_date == ''){
            document.getElementById('error-msg-booking_date').style.display = 'block';
            flag = false;
        }
        if(party == 'Select One'){
            document.getElementById('error-msg-party').style.display = 'block';
            flag = false;
        }
        if(salesman == 'Select One'){
            document.getElementById('error-msg-salesman').style.display = 'block';
            flag = false;
        }
        if(quantity == undefined){
            document.getElementById('error-msg-quantity').style.display = 'block';
            flag = false;
        }
        if(rate == undefined){
            document.getElementById('error-msg-rate').style.display = 'block';
            flag = false;
        }
        if(total_value == ''){
            document.getElementById('error-msg-value').style.display = 'block';
            flag = false;
        }
        if(type == 'Select One'){
            document.getElementById('error-msg-type').style.display = 'block';
            flag = false;
        }
        if(flag){
            DataService.orderBook(order_date, party, salesman, quantity, rate, total_value, type).then(function(response){
                if(response.data.status == "ok"){
                     var alertPopup = $ionicPopup.alert({
                       title: 'Success',
                       template: 'Order has been successfully booked!'
                     });
                     alertPopup.then(function(res) {
                        document.getElementById("booking_date").value = '';
                        document.getElementById('party').selectedIndex = 0;
                        document.getElementById('salesman').selectedIndex = 0;
                        document.getElementById("quantity").value = '';
                        document.getElementById('rate').value = '';
                        document.getElementById('total_value').value = '';
                        document.getElementById('type').selectedIndex = 0;
                     });
                 }else{
                    var alertPopup = $ionicPopup.alert({
                       title: 'Failed',
                       template: 'Order booking fail!'
                     });
                     alertPopup.then(function(res) {
                       
                     });
                 }
            });
        }
    };

    $scope.calculate = function(){
        var total_value = 0;
        var quantity    = $scope.data.quantity;
        var rate        = $scope.data.rate;

        if(quantity != undefined && rate != undefined){
            total_value = parseFloat(quantity) * parseFloat(rate);
            document.getElementById('total_value').value = total_value;
        }
    }

    $scope.hideError = function(name){
        if(name == 'quantity' || name == 'rate'){
            document.getElementById('error-msg-'+name).style.display = 'none';
        }else
            document.getElementById('error-msg-'+name).style.display = 'none';
    };


});

app.directive('isNumber', function() {
  return {
    require: '?ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if(!ngModelCtrl) {
        return; 
      }

      ngModelCtrl.$parsers.push(function(val) {
        if (angular.isUndefined(val)) {
            var val = '';
        }
        
        var clean = val.replace(/[^-0-9\.]/g, '');
        var negativeCheck = clean.split('-');
        var decimalCheck = clean.split('.');
        if(!angular.isUndefined(negativeCheck[1])) {
            negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
            clean =negativeCheck[0] + '-' + negativeCheck[1];
            if(negativeCheck[0].length > 0) {
                clean =negativeCheck[0];
            }
            
        }
          
        if(!angular.isUndefined(decimalCheck[1])) {
            decimalCheck[1] = decimalCheck[1].slice(0,2);
            clean =decimalCheck[0] + '.' + decimalCheck[1];
        }

        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });

      element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
});

app.controller('DeliveryOrderController', function($ionicLoading, $scope){
    
    $scope.$on('$ionicView.enter', function(){
        $ionicLoading.hide();
    });
    
});

app.controller('OrderController', function($ionicLoading, $scope){
    
    $scope.$on('$ionicView.enter', function(){
        $ionicLoading.hide();
    });
    
});

app.controller('DispatchController', function($ionicLoading, $scope){
    $scope.$on('$ionicView.enter', function(){
        $ionicLoading.hide();
    });

});
app.controller('SalesmanListContoller', function(DataService,$scope,$ionicLoading,$state){
     $ionicLoading.hide();
     var _this=this;
      $scope.$on('$ionicView.enter', function(){

      });
});
app.controller('TrackSalesmanContoller', function(DataService,$scope,$ionicLoading,$stateParams,$cordovaGeolocation){
    var _this=this;
    _this.track_id=$stateParams.id;
    $scope.$on('$ionicView.enter', function(){
        DataService.getSalesman($stateParams.id).then(function(response){
            console.log(response.data.trackData);
            var len=response.data.trackData.length;
            console.log(len);
            if(len==0){
                var latLng = new google.maps.LatLng(26.1445,91.7362);

                var mapOptions = {
                  center: latLng,
                  zoom: 16,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                };
             }else{
                    var latLng = new google.maps.LatLng(response.data.trackData[len-1].lat, response.data.trackData[len-1].lon);

                    var mapOptions = {
                      center: latLng,
                      zoom: 16,
                      mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                }
                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);


            google.maps.event.addListenerOnce($scope.map, 'idle', function(){
                var iconBase = 'img/marker2.png';
                
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng,
                    icon: iconBase
                });

                var infoWindow = new google.maps.InfoWindow({
                    content: "Here I am!"
                });
                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.open($scope.map, marker);
                });
                
            });
        });
    });

    $scope.currentPosition=function(track_id){
        DataService.getSalesman(track_id).then(function(response){
            console.log(response.data.trackData);
            var len=response.data.trackData.length;
            console.log(len);
            if(len==0){
                var latLng = new google.maps.LatLng(26.1445,91.7362);

                var mapOptions = {
                  center: latLng,
                  zoom: 16,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                };
             }else{
                    var latLng = new google.maps.LatLng(response.data.trackData[len-1].lat, response.data.trackData[len-1].lon);

                    var mapOptions = {
                      center: latLng,
                      zoom: 16,
                      mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                }
                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);


            google.maps.event.addListenerOnce($scope.map, 'idle', function(){
                var iconBase = 'img/marker2.png';
                
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng,
                    icon: iconBase
                });

                var infoWindow = new google.maps.InfoWindow({
                    content: "Here I am!"
                });
                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.open($scope.map, marker);
                });
                
            });
        });
    }

    $scope.track=function(track_id){
        DataService.getSalesman(track_id).then(function(response){
            //console.log(response.data.trackData.length);
            var len=response.data.trackData.length;
            var latLng = new google.maps.LatLng(response.data.trackData[0].lat, response.data.trackData[0].lon);

            var mapOptions = {
              center: latLng,
              zoom: 16,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };
        
            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);


            google.maps.event.addListenerOnce($scope.map, 'idle', function(){
                var iconBase = 'img/marker2.png';
                for(var j=0; j<len; j++){
                
                    var latLngMrkr = new google.maps.LatLng(response.data.trackData[j].lat, response.data.trackData[j].lon);
                    
                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        animation: google.maps.Animation.DROP,
                        position: latLngMrkr,
                        icon: iconBase
                    });

                    var infoWindow = new google.maps.InfoWindow({
                        content: "Here I am!"
                    });
                    google.maps.event.addListener(marker, 'click', function () {
                        infoWindow.open($scope.map, marker);
                    });
                }
                
            });
        });
    }
     
     var watchID = navigator.geolocation.watchPosition(onSuccess, onError, {enableHighAccuracy: true,timeout: Infinity,interval: 2000});

      function onSuccess(position) {
      //alert('Latitude: '  + position.coords.latitude      + '<br />' +
      //      'Longitude: ' + position.coords.longitude
      //      );
      // var element = document.getElementById('geolocation');
      // element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
      //                     'Longitude: ' + position.coords.longitude     + '<br />' +
      //                     '<hr />'      + element.innerHTML;

        // var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
        // var mapOptions = {
        //   center: latLng,
        //   zoom: 15,
        //   mapTypeId: google.maps.MapTypeId.ROADMAP
        // };
 
        // $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
        //   var marker = new google.maps.Marker({
        //       map: $scope.map,
        //       animation: google.maps.Animation.DROP,
        //       position: latLng
        //   });     
         
        //   var infoWindow = new google.maps.InfoWindow({
        //       content: "Here I am!"
        //   });
         
        //   google.maps.event.addListener(marker, 'click', function () {
        //       infoWindow.open($scope.map, marker);
        //   });
         
        // });

  }

  function onError(error) {
      alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
  }

  //    var options = {timeout: 10000, enableHighAccuracy: true};
 
  //   $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
  //   var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
  //   var mapOptions = {
  //     center: latLng,
  //     zoom: 15,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   };
 
  //   $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
  // }, function(error){
  //   console.log("Could not get location");
  // });
});

app.controller('DOSingleController', function(DataService, $stateParams, $scope, $ionicLoading){
    $scope.data = {};
    var _this = this;

    $scope.$on('$ionicView.enter', function(){
        $ionicLoading.show();
        DataService.DOSingle($stateParams.id).then(function(response){
            console.log(response);
            _this.do = response.data;
            $ionicLoading.hide();
        });
    });
});

app.controller('PendingDOController', function(DataService, $scope, $ionicLoading){
    $scope.data = {};
    var _this = this;

    $scope.$on('$ionicView.enter', function(){
        $ionicLoading.show();

        DataService.orderDetails().then(function(response){
            console.log(response);
            _this.pendingdo = response.data;
            $ionicLoading.hide();
        });
    });
});

//Report in HighCharts Plugin........
app.controller("SalesChartCtrl", function (ReportService, $scope, $ionicLoading, $location) {
    $scope.labels = [];
    $scope.series = ['Ordered Qty', 'Dispatch Qty', 'Remaining Qty'];
    $scope.color = [ 'rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)'];
    $scope.data = [
        
    ];
    $ionicLoading.show();
    ReportService.salesReport().then(function(response){
        console.log(response);
        var parties = response.data.parties;
        var data_0 = response.data.ordered_qty;
        var data_1 = response.data.dispatch_qty;
        var data_2 = response.data.remaining_qty;
            parties.forEach(function(party){
                var str = party.name;
                var str2 = str.substring(0, 4);
                $scope.labels.push(str2.toUpperCase()); 
            })
        for(var i = 0; i<3; i++){
            var indata= [];
            for(var j = 0; j< parties.length; j++){
                if(i==0)
                    indata.push(data_0[j]);
                else if(i==1)
                    indata.push(data_1[j]);
                else if(i==2)
                    indata.push(data_2[j]);
            }
             $scope.data.push(indata);
        }
        $ionicLoading.hide();
    });
});

// app.controller("SalesChartCtrl", function (ReportService, $scope, $ionicLoading) {
//     $scope.myChartObject = {};
    
//     $scope.myChartObject.type = "BarChart";

//     $scope.$on('$ionicView.enter', function(){
//         $ionicLoading.show();
//         ReportService.salesReport().then(function(response){
            
//             var parties = response.data.parties;
//             var ordered_qty = response.data.ordered_qty;
//             var dispatch_qty = response.data.dispatch_qty;
//             var remaining_qty = response.data.remaining_qty;
//             $scope.myChartObject.data = {
//                 "cols": [
//                     {id: "month", label: "Month", type: "string"},
//                     {id: "ord_qty", label: "Ordered", type: "number"},
//                     {id: "dis_qty", label: "Dispatch", type: "number"},
//                     {id: "rem-qty", label: "Remaining", type: "number"},
//                 ], 
//                 "rows": [

//                 ]
//             };
//             var i = 0;
//             parties.forEach(function(party){
//                  $scope.myChartObject.data.rows.push({c: [{v: party.name},{v: ordered_qty[i], f: ordered_qty[i]+' QTY'},{v: dispatch_qty[i], f: dispatch_qty[i]+' QTY'},{v: remaining_qty[i], f: remaining_qty[i]+' QTY'},]});
//                  i++;
//             })
            
//             $scope.myChartObject.options = {
//                 'title': 'Sales Report Bar Chart',
//                 'isStacked': true,
//                 "fill": 20,
//                 "displayExactValues": true,
//                 "hAxis": {
//                     "title": "Quantity"
//                 },
//                 "legend": { "position": 'top', "maxLines": 3 },
//             };
//             $ionicLoading.hide();
//         });

//     });
// });

app.controller("TDispathcChartCtrl", function (ReportService, $scope) {
    $scope.labels = [];
    $scope.series = ['Total Order', 'Total Dispatch', 'Deviation'];
    $scope.data = [
    ];
    ReportService.takenDispatchReport().then(function(response){
        var products        = response.data.products;
        var totalOrderd     = response.data.totalOrderd;
        var totalDispatch   = response.data.totalDispatch;
        var totalDeviation  = response.data.totalDeviation;

        products.forEach(function(product){
           var indata= [];
            var str = product.name;
            var str2 = str.substring(0, 4);
            $scope.labels.push(str2.toUpperCase());
        });
        for(var i = 0; i<3; i++){
            var indata= [];
            for(var j = 0; j< products.length; j++){
                if(i==0)
                    indata.push(totalOrderd[j]);
                else if(i==1)
                    indata.push(totalDispatch[j]);
                else if(i==2)
                    indata.push(totalDeviation[j]);
            }
             $scope.data.push(indata);
        }
    });
});

app.controller("TargetChartCtrl", function (ReportService, $scope) {
    $scope.labels = [];
    $scope.series = ['Production Target', 'Manufactured Product', 'Deviation'];
    $scope.data = [
    ];

        ReportService.targetReport().then(function(response){
            var products   = response.data.products;
            var target     = response.data.target;
            var produced   = response.data.produced;
            var deviation  = response.data.deviation;
            
            products.forEach(function(product){
                var indata= [];
                var str = product.name;
                var str2 = str.substring(0, 4);
                $scope.labels.push(str2.toUpperCase());
            });
            for(var i = 0; i<3; i++){
                var indata= [];
                for(var j = 0; j< products.length; j++){
                    if(i==0)
                        indata.push(target[j]);
                    else if(i==1)
                        indata.push(produced[j]);
                    else if(i==2)
                        indata.push(deviation[j]);
                }
                 $scope.data.push(indata);
            }
        });
});

app.controller("ManufactureChartCtrl", function (ReportService, $scope) {

    $scope.labels = [];
    $scope.series = ['Total Ordered', 'Total Manufactured', 'Deviation'];
    $scope.colours = ['#FD1F5E','#7FFD1F','#1EF9A1'];
    $scope.data = [
    ];
    $scope.options = {
      }

        ReportService.manufactureReport().then(function(response){
            var products            = response.data.products;
            var totalOrder          = response.data.totalOrder;
            var totalManufactured   = response.data.totalManufactured;
            var deviation           = response.data.deviation;
            
            products.forEach(function(product){
                var indata= [];
                var str = product.name;
                var str2 = str.substring(0, 4);
                $scope.labels.push(str2.toUpperCase());
            });
            for(var i = 0; i<3; i++){
                var indata= [];
                for(var j = 0; j< products.length; j++){
                    if(i==0)
                        indata.push(totalOrder[j]);
                    else if(i==1)
                        indata.push(totalManufactured[j]);
                    else if(i==2)
                        indata.push(deviation[j]);
                }
                 $scope.data.push(indata);
            }
        });
});

app.controller("ProductionChartCtrl", function (ReportService, $scope) {
    $scope.labels = ['Total Manufactured','Total Ordered', 'Total Dispatch'];
    $scope.data = [

    ];


        ReportService.productionReport().then(function(response){
           console.log(response);
            var products            = response.data.products;
            var totalDispatch          = response.data.totalDispatch;
            var totalManufactured   = response.data.totalManufactured;
            var totalOrderd           = response.data.totalOrderd;
            var indata= [];
            indata.push([totalManufactured, totalOrderd, totalDispatch]);
    
                $scope.data = indata;
        });
});