(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("FuenteFinanciamientoAddCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$filter",
            "FuentesFinanciamientoCRService",
            "comunService",
            "$uibModal",
            FuenteFinanciamientoAddCtrl
        ]);

    function FuenteFinanciamientoAddCtrl(AuthService, $scope, $state, $filter, FuentesFinanciamientoCRService, comunService, $uibModal) {
        $scope.authentication = AuthService.authentication;
        $scope.fuenteFinanciamiento = {};
        $scope.AddFuenteFinanciamiento = function () {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.fuenteFinanciamiento.nombreFF.replace(/ /g, "").replace(/\n/g, ""), "origen": "FuenteFinanciamiento" };
                comunService.ValidacionExistCR(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente) {
                        toastr.warning("El registro ya existe");
                        return false;
                    } else {
                        var fuenteFinanciamiento = {
                            "clave": $scope.fuenteFinanciamiento.clave,
                            "nombreFF": $scope.fuenteFinanciamiento.nombreFF,
                            "descripcion": $scope.fuenteFinanciamiento.descripcion,
                            "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                            "autor": AuthService.authentication.nombreCompleto,
                            "estado": 1,
                            "sitioWeb": $scope.fuenteFinanciamiento.sitioWeb,
                            "contactoId": $scope.fuenteFinanciamiento.contactoId,
                            "origenDatos": "SIGCO"
                        };

                        FuentesFinanciamientoCRService.create(fuenteFinanciamiento).then(
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
        }


        //$scope.ContactoSeleccionada = {};
        //$scope.vercontacto = false;
        $scope.openContacto = function () {
            $scope.vinculo = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/ContactosGetGral.html',
                controller: 'ContactosGetGralCtrl as showCase',
               
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                
                $scope.contacto = selectedItem.nombreContacto;
                if (selectedItem.apellidoPaterno != null && selectedItem.apellidoPaterno != 'NULL') {
                    $scope.contacto = $scope.contacto + " " + selectedItem.apellidoPaterno;
                }
                if (selectedItem.apellidoMaterno != null && selectedItem.apellidoMaterno != 'NULL') {
                    $scope.contacto = $scope.contacto + " " + selectedItem.apellidoMaterno;
                }
                //+ " " + selectedItem.apellidoPaterno + " " + selectedItem.apellidoMaterno;
                $scope.fuenteFinanciamiento.contactoId = selectedItem.contactoId;
                $scope.form.$setDirty();
            });
        }

        //Obtener Fuentes de financiamiento
        FuentesFinanciamientoCRService.TiposFuenteFinanciamientoGetEstado().then(
            function (result) {
                $scope.tiposFuenteFinanciamiento = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de Tipos de Fuente de Financiamiento");
            });

        ////ObtenerPaises
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