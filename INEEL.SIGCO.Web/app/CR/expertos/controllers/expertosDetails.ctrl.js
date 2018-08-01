(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("expertosDetailsCtrl", [
            "$scope",
            "$state",
            "$stateParams",
            "ExpertosCRService",
            "MenuService",
            expertosDetailsCtrl
        ]);

    function expertosDetailsCtrl($scope, $state, $stateParams, ExpertosCRService, MenuService) {
        $scope.expertoid = $stateParams.id;
        $scope.idRol = MenuService.getRolId();
        
        $scope.consultarexperto = function () {
            ExpertosCRService.getexperto($scope.expertoid).then(
                function (response) { 
                    if (typeof response.data !== 'undefined' && response.data !== null) {
                        
                        $scope.experto = response.data;
                        $scope.autores = $scope.experto.investigadores;
                    }
                    else {
                        toastr.warning("No se encontraron resultados...");
                    }
                }, 
                function (error) { 
                    toastr.error(error.data.messageDetail);
                });
        };

        $scope.consultarexperto();
    }


})();