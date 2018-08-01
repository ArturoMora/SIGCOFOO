/*AYUDA:
contactosService nombre de factory en buscarContactos.CR.service
*/

(function () {
    "use strict";
    angular
        .module("ineelCR")
        .controller("ContactosFilterGetCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "buscarContactosService",
        "$uibModalInstance",
        "DTOptionsBuilder", ContactosFilterGetCtrl]);

    function ContactosFilterGetCtrl($scope, $state, $stateParams,
        contactosService, $uibModalInstance, DTOptionsBuilder) {
        $scope.click = false;
        $scope.nueva = false;
        $scope.contacto = {};
        $scope.vinculo = [];
        $scope.contactos = [];
        $scope.contactoSelect = {};
        $scope.dtOptions = DTOptionsBuilder
        .newOptions()
        .withOption('language', { sSearch: "Filtrar" })
        .withOption('responsive', true);

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.buscar = function (contacto) {
            $scope.click = true;
           
            contactosService.GetContactos(contacto).then(
                    function (result) {
                        $scope.contactos = result.data;
                        $scope.click = false;
                        if ($scope.contactos.length === 0) {
                            toastr.warning("Ning&uacute;n resultado");
                        } else {
                            toastr.success("Seleccione el registro dando click");
                        }
                    },
                    function (err) {
                        $scope.contactos = [];
                        toastr.error(err.data.message || "Error al procesar su solicitud");
                        $scope.click = false;
                    }
                )
            
        }

        $scope.ok = function () {
            $scope.contacto = $scope.contactoSelect.emp;
            $uibModalInstance.close($scope.contacto);
        }

    }


})();