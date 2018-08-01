(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ContactoDetailsCtrl", [
            "$scope",
            "$stateParams",
            "ContactosCRService",
            ContactoDetailsCtrl
        ]);

    function ContactoDetailsCtrl($scope, $stateParams, ContactosCRService) {
        $scope.loading = true;
        $scope.contacto_id = $stateParams.id;

        $scope.tab = 2;
        $scope.active2 = "active";

        $scope.newTAB = function () {
            $scope.active2 = "";
            $scope.active3 = "";

            switch ($scope.tab) {
                case 2:
                    $scope.active2 = "active";
                    break;
                case 3:
                    $scope.active3 = "active";
                    break;
                default:
            }
        }

        ContactosCRService.getContacto($scope.contacto_id).then(
            function (result) {
                $scope.contacto = result.data;
                //                       console.error($scope.contacto.tituloPersona.nombre);
            },
            function (err) {
                console.error(err);
            });
        ContactosCRService.getContactoPerfil($scope.contacto_id).then(
            function (result) {
                $scope.perfiles = result.data;
            },
            function (err) {
                console.error(err);
            });
        ContactosCRService.getPuestoHistorico($scope.contacto_id).then(
            function (result) {
                $scope.puestos = result.data;
            },
            function (err) {
                console.error(err);
            });
        $scope.loading = false;
    }
})();
