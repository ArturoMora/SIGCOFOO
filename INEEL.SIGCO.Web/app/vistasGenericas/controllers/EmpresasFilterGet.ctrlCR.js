/*AYUDA:
empresasService nombre de factory en empleado.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCR")
        .controller("EmpresasFilterGetCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "buscarEmpresasService",
        "$uibModalInstance",
        "DTOptionsBuilder", EmpresasFilterGetCtrl]);

    function EmpresasFilterGetCtrl($scope, $state, $stateParams,
        buscarEmpresasService, $uibModalInstance, DTOptionsBuilder) {
        $scope.click = false;
        $scope.nueva = false;
        $scope.empresa = {};
        $scope.institucion = [];
        $scope.empresas = [];
        $scope.empresaSelect = {};
        $scope.dtOptions = DTOptionsBuilder
        .newOptions()
        .withOption('language', { sSearch: "Filtrar" })
        .withOption('responsive', true);

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.buscar = function (empresa) {
            $scope.click = true;
           
            buscarEmpresasService.GetEmpresas(empresa).then(
                    function (result) {
                        $scope.empresas = result.data;
                        $scope.click = false;
                        if ($scope.empresas.length === 0) {
                            toastr.warning("Ning&uacute;n resultado");
                        } else {
                            toastr.success("Seleccione el registro dando click");
                        }
                    },
                    function (err) {
                        $scope.empresas = [];
                        toastr.error(err.data.message || "Error al procesar su solicitud");
                        $scope.click = false;
                    }
                )
        }

        $scope.ok = function () {
            $scope.empresa = $scope.empresaSelect.emp;
            $uibModalInstance.close($scope.empresa);
        }

    }


})();