(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("EncargadoDespachoCtrlEdit", ['AuthService', '$scope','$rootScope', 'EncargadoDespachoService', 'globalGet', '$state', '$stateParams', '$uibModal','$filter','comunService', EncargadoDespachoCtrlEdit]);
    function EncargadoDespachoCtrlEdit(AuthService, $scope, $rootScope, EncargadoDespachoService, globalGet, $state, $stateParams, $uibModal, $filter, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $rootScope.idG;
        $scope.registro = {};
        $scope.unidadOselect = {};
        EncargadoDespachoService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
                $scope.excepcion = $scope.registro.clavePersona;
                if ($scope.registro.fechaEfectivaNombramiento != null) {
                    $scope.registro.fechaEfectivaNombramiento = new Date(result.data.fechaEfectivaNombramiento);
                }
                if ($scope.registro.fechaFinNombramiento != null) {
                    $scope.registro.fechaFinNombramiento = new Date(result.data.fechaFinNombramiento);
                }
                $scope.registro.nombreUnidad = $scope.registro.unidadOrganizacional.nombreUnidad;
                $scope.unidadOselect.claveUnidad = $scope.registro.claveUnidad;
                $scope.unidadOselect.nombreUnidad = $scope.registro.nombreUnidad;
            },
            function (err) {
                console.error(err);
            });


        $scope.save = function () {
            if ($scope.ValidForm.$invalid || typeof $scope.unidadOselect === 'undefined') {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.registro.clavePersona, "origen": "encargadoDespacho", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                //Validacion Fechas
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                if ($scope.registro.fechaEfectivaNombramiento > $scope.hoy) {
                    toastr.error("La fecha de inicio debe estar comprendida hasta el " + $scope.hoyString);
                    return false;
                }
                debugger;
                if ($scope.registro.fechaEfectivaNombramiento >= $scope.registro.fechaFinNombramiento && ($scope.registro.fechaFinNombramiento!=null)) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }
                /////////////////
                $scope.desactivar = true;
                $scope.registro.claveUnidad = $scope.unidadOselect.claveUnidad;
                if (typeof $scope.unidadOselect.fechaEfectiva === 'undefined') {
                    $scope.registro.fechaEfectiva = $scope.registro.fechaEfectiva
                } else {
                    $scope.registro.fechaEfectiva = $scope.unidadOselect.fechaEfectiva;
                }
                EncargadoDespachoService.Update($scope.registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("catalogosrh.EncargadoDespachoGet");
                                },
                                function (err) {
                                    console.error(err);
                                    $scope.desactivar = false;
                                });
                    }
                });
            }
        }
    }
})();