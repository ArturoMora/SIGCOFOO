/*AYUDA:
ResponsableDivisionalService nombre de factory en responsableDivisionalAdd.service.js
*/

(function () {
    "use strict";
    var app = angular.module("ineelMT");
    app.controller("EstructuraOrganizacionalCtrlBorrar",
        ["$scope", "$state", "$stateParams",
             "$uibModal", ProyectosFilterCtrlBorrar]);

    function ProyectosFilterCtrlBorrar($scope, $state, $stateParams, $uibModal) {
        $scope.ElementoSeleccionado = {};
        $scope.open = function () {
            $scope.selectItem = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/EstructuraOrganizacional.html',
                controller: 'EstructuraOrganizacionalFilterGetCtrl',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.ElementoSeleccionado = selectedItem;                
            });
        }
    }

})();