/*AYUDA:
personasService nombre de factory en empleado.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelGEN")
        .controller("PersonasFilterGetCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "personasService",
        "$uibModalInstance",
        "DTOptionsBuilder", PersonasFilterGetCtrl]);

    function PersonasFilterGetCtrl($scope, $state, $stateParams,
        personasService, $uibModalInstance, DTOptionsBuilder) {
        //Evaluar eliminar este archivo
        //Evaluar eliminar este archivo
        //Evaluar eliminar este archivo

        // $scope.click = false;
        // $scope.nueva = false;
        // $scope.persona = {};
        // $scope.empleado = {};
        // $scope.empleados = [];
        // $scope.empleadoSelect = {};
        // $scope.dtOptions = DTOptionsBuilder
        // .newOptions()
        // .withOption('language', { sSearch: "Filtrar" })
        // .withOption('responsive', true);

        // $scope.cancel = function () {
        //     $uibModalInstance.dismiss('cancel');
        // }

        // $scope.buscar = function (persona) {
        //     $scope.click = true;
        //     debugger;
        //     alert('fooo');
        //     personasService.GetPersonas(persona).then(
        //             function (result) {
        //                 $scope.empleados = result.data;
        //                 $scope.click = false;
        //                 if ($scope.empleados.length === 0) {
        //                     toastr.warning("Ning&uacute;n resultado");
        //                 } else {
        //                     toastr.success("Seleccione el registro dando click");
        //                 }
        //             },
        //             function (err) {
        //                 $scope.proyectos = [];
        //                 toastr.error(err.data.message || "Error al procesar su solicitud");
        //                 $scope.click = false;
        //             }
        //         )
        // }

        // $scope.ok = function () {
        //     $scope.empleado = $scope.empleadoSelect.emp;
        //     $uibModalInstance.close($scope.empleado);
        // }

    }


})();
