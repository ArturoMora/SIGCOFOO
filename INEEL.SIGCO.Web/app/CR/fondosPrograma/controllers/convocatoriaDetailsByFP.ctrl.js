(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ConvocatoriaDetailsByFPCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$stateParams",
            "ConvocatoriasCRService",
            "FondosProgramaCRService",
            "$uibModal",
            "DTOptionsBuilder",
            ConvocatoriaDetailsByFPCtrl
        ]);

    function ConvocatoriaDetailsByFPCtrl(AuthService, $scope, $state, $stateParams, ConvocatoriasCRService, FondosProgramaCRService, $uibModal, DTOptionsBuilder) {
        $scope.fondoPrograma_id = $stateParams.id;
        $scope.loading = true;
        $scope.authentication = AuthService.authentication;
        $scope.convocatoriasDeFondo = [];




        $scope.buscar = function () {

            //obtiene el nombre de la fuente de financiamiento
            FondosProgramaCRService.getFondoProgramaFKById($scope.fondoPrograma_id).then(
                function (result) {
                    $scope.fondosPrograma = result.data;
                },
                function (err) {
                    console.error(err);
                });

            FondosProgramaCRService.getFondoProgramaFKById($scope.fondoPrograma_id).then(
                function (result) {
                    $scope.convocatoriasDeFondo = result.data;
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

        $scope.eliminarRegistro = function (id) {
            ConvocatoriasCRService.DeleteConvocatoriaWithFKS(id).then(function (res) {
                $scope.buscar();
                toastr.success(res.data);
            }, function (err) {
                toastr.error("Error al intentar eliminar el registro");
                console.log(err);
            });
        }


        //Obtiene Vigencia
        $scope.getVigencia = function (fechaTermino) {
            var vigencia;
            //debugger;
            $scope.fechaActual = new Date();
            var finalDateComparacion = new Date(fechaTermino);

            if ($scope.fechaActual > finalDateComparacion) {
                //vigencia = $scope.fechaActual + " > " + finalDateComparacion + " Inactivo";
                vigencia = "Inactiva";
            }
            else if ($scope.fechaActual < finalDateComparacion) {
                //vigencia = $scope.fechaActual + " < " + finalDateComparacion + "Activo";
                vigencia = "Activa";
            }
            return vigencia;
        }

        $scope.detalleFuente = function (idReg) {
            $state.go("convocatoriaDetails", { id: idReg });
        }

    }



})();