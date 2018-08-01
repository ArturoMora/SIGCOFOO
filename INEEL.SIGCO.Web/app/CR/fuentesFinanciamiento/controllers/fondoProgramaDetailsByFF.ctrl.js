(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("FondoProgramaDetailsByFFCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$stateParams",
            "FondosProgramaCRService",
            "FuentesFinanciamientoCRService",
            "$uibModal",
            "DTOptionsBuilder",
            FondoProgramaDetailsByFFCtrl
        ]);

    function FondoProgramaDetailsByFFCtrl(AuthService, $scope, $state, $stateParams, FondosProgramaCRService, FuentesFinanciamientoCRService, $uibModal, DTOptionsBuilder) {
        $scope.fuenteFinanciamiento_id = $stateParams.id;
        $scope.loading = true;
        $scope.authentication = AuthService.authentication;
        $scope.programasDeFuente = [];

        $scope.buscar = function () {
            //obtiene el nombre de la fuente de financiamiento
            FuentesFinanciamientoCRService.getFuenteFinanciamientoFK($scope.fuenteFinanciamiento_id).then(
                function (result) {
                    $scope.fuentesFinanciamiento = result.data;
                },
                function (err) {
                    console.error(err);
                });

            FuentesFinanciamientoCRService.getFuenteFinanciamientoFK($scope.fuenteFinanciamiento_id).then(
                function (result) {
                    $scope.programasDeFuente = result.data;
                    $scope.dtOptions = DTOptionsBuilder
                        .newOptions()
                        .withOption("responsive", true);
                    $scope.loading = false;
                },
                function (err) {
                    console.error(err);
                });
        }

        $scope.buscar();


        $scope.mostrarAlerta = function () {
            toastr.error("El fondo tiene convocatorias asociadas, elimine cada una primero");
        }

        $scope.eliminarRegistro = function (id) {
            FondosProgramaCRService.DeleteFondoWithFKS(id).then(
                function (res) {
                    $scope.buscar();
                    toastr.success(res.data);
                }, function (err) {
                    toastr.error("Error al intentar eliminar el registro");
                    console.log(err);
                }
            );
        }

        //Consulta estado
        $scope.consultaEstado = function (estado) {
            var _estado;

            if (estado == true) {
                _estado = "Activo";
            } else if (estado == false) {
                _estado = "Inactivo";
            }
            return _estado;
        }
    }


})();