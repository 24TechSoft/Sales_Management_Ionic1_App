var app = angular.module('satyam');

app.factory('LoginService', function($http) {
    var LinkLoginStatus = 'http://satyam.24techsoft.com/api/checkLogin/'
    var LinkLogIn       = 'http://satyam.24techsoft.com/api/login';
    var LinkLogOut      = 'http://satyam.24techsoft.com/api/logout';
    return {
        checkLogin: function(device_id){
            return $http.get(LinkLoginStatus + device_id);
        },

        login: function(email,password,device_id){
            var data ={
                "email"       : email,
                "password"    : password,
                "device_id"   : device_id

            };
            return $http({
                    method: 'POST',
                    url: LinkLogIn,
                    data: data
                });
        },

        logout: function(device_id){
            var data ={
                device_id   : device_id
            };
            return $http.post(LinkLogOut, data);
        }
    }
});

app.factory('DataService', function($http){
    var LinkDispatch        = 'http://satyam.24techsoft.com/api/dispatches';
    var LinkOrder           = 'http://satyam.24techsoft.com/api/orders/pending';
    var LinkDispatchSingle  = 'http://satyam.24techsoft.com/api/dispatch/';
    var LinkOrderSingle     = 'http://satyam.24techsoft.com/api/order/';
    var LinkDOSingle        = 'http://satyam.24techsoft.com/api/DO/';
    var LinkOrderBook       = 'http://satyam.24techsoft.com/api/orderBook';
    var LinkAllOrders       = 'http://satyam.24techsoft.com/api/orderAll';
    var LinkAllDispatches   = 'http://satyam.24techsoft.com/api/dispatchAll';
    var LinkAllParty        = 'http://satyam.24techsoft.com/api/partyAll';
    var LinkAllSalesman     = 'http://satyam.24techsoft.com/api/salesmanAll';
    var LinkTrackSalesman   = 'http://satyam.24techsoft.com/api/trackSalesman';
    var LinkGetAllSalesman  = 'http://satyam.24techsoft.com/api/getAllSalesman';
    var LinkGetSalesman     = 'http://satyam.24techsoft.com/api/getSalesman/';

    return{
        orderAll: function(){
            return $http.get(LinkAllOrders);
        },

        dispatchAll: function(){
            return $http.get(LinkAllDispatches);
        },

        partyAll: function(){
            return $http.get(LinkAllParty);
        },

        salesmanAll: function(){
            return $http.get(LinkAllSalesman);
        },

        dispatchDetails: function(){
            return $http.get(LinkDispatch);
        },

        orderDetails: function(){
            return $http.get(LinkOrder);
        },

        dispatchSingle: function(dispatchId){
            return $http.get(LinkDispatchSingle+dispatchId);
        },

        orderSingle: function(orderid){
            return $http.get(LinkOrderSingle+orderid);
        },

        DOSingle: function(doid){
            return $http.get(LinkDOSingle+doid);
        },

        orderBook: function(order_date, party, salesman, quantity, rate, total_value, type){
            var postData = {
                order_date      : order_date,
                party           : party,
                salesman        : salesman,
                quantity        : quantity,
                rate            : rate,
                total_value     : total_value,
                type            : type
            };

            return $http.post(LinkOrderBook, postData);
        },

        trackSalesman: function(usr_id,lat,lon){
            var postData = {
               usr_id:usr_id
               ,lat:lat
               ,lon:lon
            };

            return $http.post(LinkTrackSalesman, postData);
        },

        getAllSalesman: function(){
            return $http.get(LinkGetAllSalesman);
        },

        getSalesman: function(id){
            return $http.get(LinkGetSalesman+id);
        }
    }
});

app.factory('ReportService', function($http){
    var LinkSalesReport         = 'http://satyam.24techsoft.com/api/report/sales';
    var LinkTakenDispatchReport = 'http://satyam.24techsoft.com/api/report/takenDispatch';
    var LinkTargetReport        = 'http://satyam.24techsoft.com/api/report/target';
    var LinkManufactureReport   = 'http://satyam.24techsoft.com/api/report/manufacture';
    var LinkProductionReport    = 'http://satyam.24techsoft.com/api/report/production';
    
    return{
        salesReport: function(){
            return $http.get(LinkSalesReport);
        },

        takenDispatchReport: function(){
            return $http.get(LinkTakenDispatchReport);
        },

        targetReport: function(){
            return $http.get(LinkTargetReport);
        },

        manufactureReport: function(){
            return $http.get(LinkManufactureReport);
        },

        productionReport: function(){
            return $http.get(LinkProductionReport);
        }
    }
});