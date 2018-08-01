(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("proyectosGetTotalCtrl", [
            "$scope",
            "ClientesCRService",
            proyectosGetTotalCtrl
        ]);

    function proyectosGetTotalCtrl($scope, ClientesCRService) {

        $scope.proyectos = {};

        ClientesCRService.getProyectosTotales().then(
            function (response) {
                if (typeof response.data !== 'undefined' && response.data != null) {
                    $scope.proyectos = response.data;
                
                }
            },
            function (error) {
                toastr.error(error.data.messageDetail);
            }
        );



    }


})();