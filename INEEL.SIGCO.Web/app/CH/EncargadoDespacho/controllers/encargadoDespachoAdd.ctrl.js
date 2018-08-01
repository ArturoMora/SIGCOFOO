(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("EncargadoDespachoCtrlAdd", ['AuthService', '$scope', 'EncargadoDespachoService', 'globalGet', '$state', '$uibModal','$filter','comunService', EncargadoDespachoCtrlAdd]);
    function EncargadoDespachoCtrlAdd(AuthService, $scope, EncargadoDespachoService, globalGet, $state, $uibModal, $filter, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;
        $scope.registro = {};
        //////////////////////Buscar persona////////////
        $scope.PersonaSeleccionada = {};
        $scope.openUser = function () {
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        return $scope.empleado;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.PersonaSeleccionada = selectedItem;
                $scope.registro.clavePersona = $scope.PersonaSeleccionada.clavePersona;
                $scope.registro.nombrePersona = $scope.PersonaSeleccionada.nombreCompleto;
            });
        }
        //Agregar Ambito
        $scope.save = function () {
            if ($scope.ValidForm.$invalid || typeof $scope.unidadOselect === 'undefined') {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.registro.clavePersona, "origen": "encargadoDespacho" };
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
                        if ($scope.registro.fechaEfectivaNombramiento >= $scope.registro.fechaFinNombramiento) {
                            toastr.error("La fecha de inicio debe ser menor a la de término");
                            return false;
                        }
                        /////////////////
                        $scope.desactivar = true;
                        $scope.registro.claveUnidad = $scope.unidadOselect.claveUnidad;
                        $scope.registro.fechaEfectiva = $scope.unidadOselect.fechaEfectiva;
                        EncargadoDespachoService.Add($scope.registro).then(
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