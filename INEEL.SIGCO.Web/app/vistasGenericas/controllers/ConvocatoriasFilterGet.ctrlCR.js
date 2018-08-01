/*AYUDA:
contactosService nombre de factory en buscarContactos.CR.service
*/

(function () {
    "use strict";
    angular
        .module("ineelCR")
        .controller("ConvocatoriasFilterGetCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "buscarConvocatoriasService",
        "$uibModalInstance",
        "DTOptionsBuilder", ConvocatoriasFilterGetCtrl]);

    function ConvocatoriasFilterGetCtrl($scope, $state, $stateParams,
        convocatoriasService, $uibModalInstance, DTOptionsBuilder) {
        $scope.click = false;
        $scope.nueva = false;
        $scope.convocatoria = {};
        $scope.vinculo = [];
        $scope.convocatorias = [];
        $scope.convocatoriaSelect = {};
        $scope.dtOptions = DTOptionsBuilder
        .newOptions()
        .withOption('language', { sSearch: "Filtrar" })
        .withOption('responsive', true);

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.buscar = function (convocatoria) {
            $scope.click = true;
           
            convocatoriasService.getConvocatoriasAllFKsByEstado(convocatoria).then(
                    function (result) {
                        $scope.convocatorias = result.data;
                        $scope.click = false;
                        if ($scope.convocatorias.length === 0) {
                            toastr.warning("Ning&uacute;n resultado");
                        } else {
                            toastr.success("Seleccione el registro dando click");
                        }
                    },
                    function (err) {
                        $scope.convocatorias = [];
                        toastr.error(err.data.message || "Error al procesar su solicitud");
                        $scope.click = false;
                    }
                )
            
        }

        $scope.ok = function () {
            $scope.convocatoria = $scope.convocatoriaSelect.emp;
            $uibModalInstance.close($scope.convocatoria);
        }

    }


})();