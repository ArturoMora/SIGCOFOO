(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("FuenteFinanciamientoEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "comunService",
        "$uibModal",
        "FuentesFinanciamientoCRService",
        FuenteFinanciamientoEditCtrl
        ]);

    function FuenteFinanciamientoEditCtrl(AuthService, $scope, $state, $stateParams,comunService,$uibModal, FuentesFinanciamientoCRService) {

        $scope.fuenteFinanciamiento_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        FuentesFinanciamientoCRService.getFuenteFinanciamiento($scope.fuenteFinanciamiento_id).then(
            function (result) {
                
                $scope.fuentesFinanciamiento = result.data;
                $scope.fuentesFinanciamiento.fechaRegistro = new Date(result.data.fechaRegistro);
                $scope.fuentesFinanciamiento.fechaEfectiva = new Date(result.data.fechaEfectiva);
                $scope.excepcion = result.data.nombreFF.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        $scope.openContacto = function () {
            //$scope.vinculo = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/ContactosGetGral.html',
                controller: 'ContactosGetGralCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                
                if ($scope.fuentesFinanciamiento.contacto == undefined || $scope.fuentesFinanciamiento.contacto == null) {
                    $scope.fuentesFinanciamiento.contacto = {};
                }
                $scope.fuentesFinanciamiento.contacto = selectedItem;
                $scope.fuentesFinanciamiento.contacto.nombreCompleto = selectedItem.nombreContacto + " " + selectedItem.apellidoPaterno + " " + selectedItem.apellidoMaterno;
                $scope.fuentesFinanciamiento.contactoId = selectedItem.contactoId;
                $scope.form.$setDirty();
            });
        }

        $scope.saveFuenteFinanciamiento = function () {
            
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.fuentesFinanciamiento.nombreFF.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "FuenteFinanciamiento",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCR(registro).then(function (result) {
                    $scope.existente = result.data;
                    
                    if ($scope.existente) {
                        toastr.warning("El registro ya existe");
                        return false;
                    } else {
                        FuentesFinanciamientoCRService.update($scope.fuentesFinanciamiento).then(
                            function (result) {
                                toastr.success(result.data);
                                $state.go("fuentesFinanciamientoGet");
                            },
                            function (err) {
                                console.error(err);
                            });
                    }
                });

                
            }
        };

        ////ObtenerDisciplinas
        //FuentesFinanciamientoCRService.TiposFuenteFinanciamientoGet().then(
        //    function (result) {
        //        $scope.tiposFuenteFinanciamiento = result.data;
        //        $scope.loading = false;
        //    },
        //    function (err) {
        //        toastr.error("No se han podido cargar los registros de Tipos de Fuente de Financiamiento");
        //    });

        //ObtenerPaises
        //FuentesFinanciamientoCRService.PaisesGet().then(
        //    function (result) {
        //        $scope.paises = result.data;
        //        $scope.loading = false;
        //    },
        //    function (err) {
        //        toastr.error("No se han podido cargar los registros de Paises");
        //    });
    }
})();