/*AYUDA:
ResponsableDivisionalService nombre de factory en responsableDivisionalAdd.service.js
*/

(function () {
    "use strict";
    var app = angular.module("ineelGEN");
    app.controller("PersonasFilterCtrl",
        ["$scope", "$state", "$stateParams",
             "$uibModal", PersonasFilterCtrl]);

    function PersonasFilterCtrl($scope, $state, $stateParams,  $uibModal) {
        $scope.PersonaSeleccionada = {};
        $scope.open = function () {
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        return $scope.empleado;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {                
                $scope.PersonaSeleccionada = selectedItem;                
            });
        }
    }

})();