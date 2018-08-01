
(function () {
    "use strict";
    angular
        .module("ineelCR")
        .controller("PropuestasFilterGetCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "buscarPropuestasService",
        "$uibModalInstance",
        "DTOptionsBuilder", PropuestasFilterGetCtrl]);

    function PropuestasFilterGetCtrl($scope, $state, $stateParams,
        buscarPropuestasService, $uibModalInstance,
        DTOptionsBuilder) {
        $scope.click = false;
        $scope.nueva = false;
        $scope.propuestaInput = {};
        $scope.propuesta = {};
        $scope.propuestas = [];
        $scope.propuestaSelect = {};
        $scope.dtOptions = DTOptionsBuilder
        .newOptions()
        .withOption('language', { sSearch: "Filtrar" })
        .withOption('responsive', true);


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.buscar = function () {
            $scope.click = true;
            //debugger;
            buscarPropuestasService.GetPropuestas($scope.propuestaInput).then(
                    function (result) {
                        $scope.propuestas = result.data;
                        //debugger;
                        $scope.click = false;
                        if ($scope.propuestas.length === 0) {
                            toastr.warning("Ning&uacute;n resultado");
                        } else {
                            toastr.success("Seleccione el registro dando click");
                        }

                    },
                    function (err) {
                        $scope.propuestas = [];
                        toastr.error(err.data.message || "Error al procesar su solicitud");
                        //debugger;
                        $scope.click = false;
                    }
                )
        }

        $scope.ok = function (e) {
            //debugger;
            $scope.propuesta = e;
            $uibModalInstance.close($scope.propuesta);
            //debugger;
        }

    }
})();