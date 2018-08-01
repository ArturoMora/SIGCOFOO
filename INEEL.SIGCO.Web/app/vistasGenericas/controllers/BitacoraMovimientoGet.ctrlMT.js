
(function () {
    "use strict";
    var app = angular.module("ineelMT");
    app.controller("BitacoraMovimientoGetCtrl",        
        ["$scope", "$state", "$stateParams",             
             "$http", "globalGet",
             BitacoraMovimientoGetCtrl]);

    function BitacoraMovimientoGetCtrl($scope, $state, $stateParams,
        $http, globalGet) {
        /* Servicio dentro del controlador para no replicar varios archivos de acuerdo al modulo */
        var API = globalGet.get("api");
        var service = {};

        service.GetAll = function () {
            var endPoint = API + "BitacoraMovimientos/GetAll";
            return $http.get(endPoint);
        }
        /* Fin de Servicio dentro del controlador para no replicar varios archivos de acuerdo al modulo */

        $scope.elementos = [];
        service.GetAll().then(
            function (result) {
                $scope.elementos = result.data;
            },
            function (error) {
                toastr.success(error);
            }
        );

    }

})();