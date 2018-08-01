(function () {
    "use strict";

    var app = angular.module("ineelMT")
    .filter("getTipoAcceso", function() {
        return function(input) {
            return input ? 'Público' : 'Privado';
        }
    });

    app.controller("ProyectosItfGetCtrl", ["$scope", "$rootScope",
        "$state", "$stateParams", "itfsService", "DTOptionsBuilder", "AuthService", "$location", ProyectosItfGetCtrl]);

    function ProyectosItfGetCtrl($scope,$rootScope,
        $state, $stateParams, itfsService, DTOptionsBuilder, AuthService, $location) {
        toastr.clear();
        $scope.authentication = AuthService.authentication;
        $rootScope.detallesItf = false;
        $scope.proyecto = {};
        $scope.loading = true;
        var numJefe = $scope.authentication.userName;
        itfsService.getProyectosPropios(numJefe).then(
            function (result) {
                $scope.proyecto = result.data;
                $scope.loading = false;
                // DataTables configurable options
                $scope.dtOptions = DTOptionsBuilder
                    .newOptions()
                    .withOption('aaSorting', [4, 'asc'])
                    .withOption('responsive', true);
                toastr.clear();
                //toastr.options = { positionClass: "toast-top-center" };
                if($rootScope.fromState.url != '/indexITF')
                    toastr.warning("Clic en nuevo ITF de la columna <b>Opciones</b>", "Para nuevo ITF", { positionClass: "toast-top-center" });
                
            },
            function (err) {
                $scope.loading = false;
                console.error(err);
            });


        $scope.verItf = function(idProyecto) {
           // toastr.warning("Modulo pendiente");
            $location.path('formDetails/' + idProyecto + '/infoGral')
        };
    }

})();