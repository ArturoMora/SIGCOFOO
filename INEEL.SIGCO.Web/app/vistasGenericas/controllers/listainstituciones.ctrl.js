
(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("listainstitucionesCtrl", [
            "$scope",
            "$uibModalInstance",
            "$uibModal",
            "InstitucionService",
            "comunService",
            listainstitucionesCtrl]);

    function listainstitucionesCtrl($scope, $uibModalInstance, $uibModal,InstitucionService,comunService) {
        $scope.institucion = {};
        $scope.agregarvisible = false;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.ok = function (item) {
            $uibModalInstance.close(item);
        }

        $scope.agregarinstitucion = function () {
            $scope.agregarvisible = !$scope.agregarvisible;
        }

        //Obtener Paises
        InstitucionService.GetPaises().then(
            function (result) {
                $scope.paises = result.data;
            },
            function (err) {
                console.error(err);
            });
        //Agregar institucion
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.instituto.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.instituto.descripcion.replace(/\n/g, "");
                $scope.instituto.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "instituto" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.instituto.fechaEfectiva = new Date();
                        $scope.instituto.estado = 1;
                        $scope.desactivar = true;
                        InstitucionService.addfrommodal($scope.instituto).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $scope.instituto = {};
                                        },
                                        function (err) {
                                            $scope.desactivar = false;
                                            console.error(err);
                                        });
                    }
                });

            }
        }

    }
})();