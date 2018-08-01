/*AYUDA:
ResponsableDivisionalService nombre de factory en responsableDivisionalAdd.service.js
*/

(function () {
    "use strict";
    var app = angular.module("ineelMT");
    app.controller("ProyectosFilterCtrlBorrar",
        ["$scope", "$state", "$stateParams",
             "$uibModal", ProyectosFilterCtrlBorrar]);

    function ProyectosFilterCtrlBorrar($scope, $state, $stateParams, $uibModal) {
        $scope.ProyectoSeleccionado = {};
        $scope.open = function () {
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarProyecto.html',
                controller: 'ProyectosFilterGetCtrl',
                resolve: {
                    proyectoSelect: function () {
                        return $scope.proyectoSelect;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.ProyectoSeleccionado = selectedItem;
            });
        }
    }

})();