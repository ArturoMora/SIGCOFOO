;
(function () {
    "use strict";
    
    angular.module("directivasSIGCO")
        .controller('uoModalComunidadPCtrl', ['$scope', '$uibModal', uoModalComunidadPCtrl])
        .controller("ComunidadPracticaModalFilterGetCtrl",
            ["$scope", "$state", "$stateParams",
                "$uibModal", "$uibModalInstance",
                "$http", "globalGet",
                ComunidadPracticaModalFilterGetCtrl])
        .directive('comudidadPracticaSelect', function () {
            return {
                restrict: 'ACE',
                templateUrl: function (elem, attrs) {
                    return attrs.templateUrl || 'app/vistasGenericas/buscarComunidad.html';
                },
                controller: "uoModalComunidadPCtrl",
                require: 'ngModel',
                scope: {
                    arreglo: "=?enarreglo",
                    ngModel: '=',
                    stateForm: "=?",
                }
            };
        });

    function ComunidadPracticaModalFilterGetCtrl($scope, $state, $stateParams, $uibModal, $uibModalInstance,
        $http, globalGet) {

        /* Servicio dentro del controlador para no replicar varios archivos de acuerdo al modulo */
        var API = globalGet.get("api");
        var service = {};
        service.GetAllnodes = function () {
            var endPoint = API + "Comunidades/GetAllForModal";
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
    }
    ;
    function uoModalComunidadPCtrl($scope, $uibModal) {
        $scope.comunidadSeleccionada = [];
        $scope.openModalComunidad = function () {
            $scope.arreglo = typeof $scope.arreglo === 'undefined' ? false : $scope.arreglo;
            $scope.selectItemComunidad = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarComunidadModalFilterGet.html',
                controller: 'ComunidadPracticaModalFilterGetCtrl',
                resolve: {
                    selectItemComunidad: function () {
                        return $scope.selectItemComunidad;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                if ($scope.arreglo) {
                    $scope.comunidadSeleccionada.push(selectedItem);
                    $scope.ngModel = $scope.comunidadSeleccionada;
                    //****Para la validacion de formularios al momento de ingresar datos y no guardarlos, en teoria no debe de alterar el funcionamiento de la directiva */
                    if ($scope.stateForm) {
                        $scope.stateForm.$setDirty();
                    }
                } else {
                    $scope.ngModel = selectedItem;
                    //****Para la validacion de formularios al momento de ingresar datos y no guardarlos, en teoria no debe de alterar el funcionamiento de la directiva */
                    if ($scope.stateForm) {
                        $scope.stateForm.$setDirty();
                    }
                }


            });
        }
    }
    ;
}());
