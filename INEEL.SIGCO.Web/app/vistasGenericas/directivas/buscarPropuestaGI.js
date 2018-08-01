;
(function () {
    "use strict";
    
    angular.module("directivasSIGCO")
        .controller('uoModalPropuestaGICtrl', ['$scope', '$uibModal', uoModalPropuestaGICtrl])
        .controller("PropuestasGIModalFilterGetCtrl",
            ["$scope", "$state", "$stateParams",
                "$uibModal", "$uibModalInstance",
                "$http", "globalGet",
                PropuestasGIModalFilterGetCtrl])
        .directive('seleccionarPropuesta', function () {
            return {
                restrict: 'ACE',
                templateUrl: function (elem, attrs) {
                    return attrs.templateUrl || 'app/vistasGenericas/buscarPropuestaGI.html';
                },
                controller: "uoModalPropuestaGICtrl",
                require: 'ngModel',
                scope: {
                    arreglo: "=?enarreglo",
                    ngDeleteItem: "&",
                    ngModel: '=',
                }
            };
        });

    function PropuestasGIModalFilterGetCtrl($scope, $state, $stateParams, $uibModal, $uibModalInstance,
        $http, globalGet) {

        /* Servicio dentro del controlador para no replicar varios archivos de acuerdo al modulo */
        var API = globalGet.get("api");
        var service = {};
        service.GetAllnodes = function () {
            var endPoint = API + "Propuesta/GetAllForModal";
            return $http.get(endPoint);
        }
        /* Fin de Servicio dentro del controlador para no replicar varios archivos de acuerdo al modulo */
        $scope.data = [];
        service.GetAllnodes().then(
            function (result) {
                $scope.data = result.data;
            },
            function (error) {
                toastr.success("error");
            }
        );

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        $scope.ok = function (seleccion) {
            $uibModalInstance.close(seleccion);
        }
        debugger;
    }
    ;
    function uoModalPropuestaGICtrl($scope, $uibModal) {
        $scope.propuestaSeleccionada = [];
        $scope.eliminarModalPropuesta = function () {
            $scope.ngDeleteItem();
        };
        $scope.openModalPropuesta = function () {
            $scope.arreglo = typeof $scope.arreglo === 'undefined' ? false : $scope.arreglo;
            $scope.selectItemPropuesta = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarPropuestaGIModalFilterGet.html',
                controller: 'PropuestasGIModalFilterGetCtrl',
                resolve: {
                    selectItemPropuesta: function () {
                        return $scope.selectItemPropuesta;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                if ($scope.arreglo) {
                    $scope.propuestaSeleccionada.push(selectedItem);
                    $scope.ngModel = $scope.propuestaSeleccionada;
                } else {
                    $scope.ngModel = selectedItem;
                }


            });

            debugger;
        }
    }
    ;
}());
