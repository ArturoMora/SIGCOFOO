(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("menuItemGetCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "menuItemCRService",
        "DTOptionsBuilder",
        "$uibModal",
        menuItemGetCtrl
        ]);

    function menuItemGetCtrl($scope, $state, $stateParams, menuItemCRService, DTOptionsBuilder, $uibModal) {
            $scope.parentId = 0;
            menuItemCRService.GetByParent(0).then(
            function (result) {
                alert("entro");
                $scope.UnidadesOrganizacionales = result.data;
            },
            function (err) {
                console.error("No se han podido cargar los registros");
            });

    }

})();