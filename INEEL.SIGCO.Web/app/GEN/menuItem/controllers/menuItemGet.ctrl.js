(function () {
    "use strict";

    angular
        .module("ineelGEN")
        .controller("menuItemGetCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "menuItemGENService",
        "DTOptionsBuilder",
        "$uibModal",
        menuItemGetCtrl
        ]);

    function menuItemGetCtrl($scope, $state, $stateParams, menuItemGENService, DTOptionsBuilder, $uibModal) {
            $scope.parentId = 0;
            menuItemGENService.GetByParent(0).then(
            function (result) {
                alert("entro");
                $scope.UnidadesOrganizacionales = result.data;
            },
            function (err) {
                console.error("No se han podido cargar los registros");
            });

    }

})();