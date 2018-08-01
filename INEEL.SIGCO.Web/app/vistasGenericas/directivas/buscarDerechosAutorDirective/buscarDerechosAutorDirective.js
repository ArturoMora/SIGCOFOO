;
(function () {
    "use strict";

    angular.module("directivasSIGCO")
        .controller('uoModalDerechoAutorCtrl', ['$scope', '$uibModal', uoModalDerechoAutorCtrl])
        .controller("DerechosAutorModalFilterGetCtrl",
        ["$scope", "$state", "$stateParams",
            "$uibModal", "$uibModalInstance",
            "$http", "globalGet",
            DerechosAutorModalFilterGetCtrl])
        .directive('derechosAutorSelect', function () {
            return {
                restrict: 'AE',
                templateUrl: function (elem, attrs) {
                    return attrs.templateUrl || 'app/vistasGenericas/directivas/buscarDerechosAutorDirective/buscarDerechosAutor.html';
                },
                controller: "uoModalDerechoAutorCtrl",
                require: 'ngModel',
                scope: {
                    arreglo: "=?enarreglo",
                    ngModel: '=',
                    stateForm: "=?",
                    requerido: "@",
                }
            };
        });

    function DerechosAutorModalFilterGetCtrl($scope, $state, $stateParams, $uibModal, $uibModalInstance,
        $http, globalGet) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        /* Servicio dentro del controlador para no replicar varios archivos de acuerdo al modulo */
        var API = globalGet.get("api");
        var service = {};
        service.GetAllnodes = function () {
            var endPoint = API + "DerechosAutor/GetAllPropiedadInstitutoModal";
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
    function uoModalDerechoAutorCtrl($scope, $uibModal) {
        $scope.elementoSeleccionadoArray = [];
        $scope.requerido = (typeof $scope.requerido) === "undefined" ? false : $scope.requerido;
        
        $scope.openModalDerechoAutor = function () {
            $scope.arreglo = typeof $scope.arreglo === 'undefined' ? false : $scope.arreglo;
            $scope.selectItemDerechoAutor = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/directivas/buscarDerechosAutorDirective/buscarDerechosAutorModalFilterGet.html',
                controller: 'DerechosAutorModalFilterGetCtrl',
                resolve: {
                    selectItemDerechoAutor: function () {
                        return $scope.selectItemDerechoAutor;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                if ($scope.arreglo) {
                    if ($scope.existe($scope.elementoSeleccionadoArray, selectedItem)) {
                        toastr.warning("No se permiten duplicados");
                        return;
                    }
                    $scope.elementoSeleccionadoArray.push(selectedItem);
                    $scope.ngModel = $scope.elementoSeleccionadoArray;
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
        $scope.existe = function (registros, selectedItem) {
            
            if (registros == null || registros.length == 0) {
                return false;
            }
            for (var i = 0; i < registros.length; i++) {
                if (registros[i].derechosAutorId == selectedItem.derechosAutorId) {
                    return true;
                }
            }
            return false;
        }
    }
    ;
}());
