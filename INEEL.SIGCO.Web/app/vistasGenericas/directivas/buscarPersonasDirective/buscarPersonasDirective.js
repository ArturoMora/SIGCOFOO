;
(function () {
    "use strict";

    angular.module("directivasSIGCO")
        .controller('uoModalPersonaCtrl2', ['$scope', '$uibModal', uoModalPersonaCtrl2])
        .controller("PersonasModalFilterGetCtrl",
            ["$scope", "$state", "$stateParams",
                "$uibModal", "$uibModalInstance",
                "$http", "globalGet",
                PersonasModalFilterGetCtrl])
        .directive('personasSelect', function () {
            return {
                restrict: 'ACE',
                templateUrl: function (elem, attrs) {
                    return attrs.templateUrl || 'app/vistasGenericas/directivas/buscarPersonasDirective/buscarPersonas.html';
                },
                controller: "uoModalPersonaCtrl2",
                require: 'ngModel',
                scope: {
                    arreglo: "=?enarreglo",
                    ngModel: '=',
                    stateForm: "=?",
                }
            };
        });

    function PersonasModalFilterGetCtrl($scope, $state, $stateParams, $uibModal, $uibModalInstance,
        $http, globalGet) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        /* Servicio dentro del controlador para no replicar varios archivos de acuerdo al modulo */
        var API = globalGet.get("api");
        var service = {};
        service.GetAllnodes = function () {
            var endPoint = API + "Personas/GetAllForModal";
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
    function uoModalPersonaCtrl2($scope, $uibModal) {
        $scope.elementoSeleccionadoArray = [];
        $scope.openModalPersona = function () {
            $scope.arreglo = typeof $scope.arreglo === 'undefined' ? false : $scope.arreglo;
            $scope.selectItemPersona = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/directivas/buscarPersonasDirective/buscarPersonasModalFilterGet.html',
                controller: 'PersonasModalFilterGetCtrl',
                resolve: {
                    selectItemPersona: function () {
                        return $scope.selectItemPersona;
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
                if (registros[i].clavePersona == selectedItem.clavePersona) {
                    return true;
                }
            }
            return false;
        }
    }
    ;
}());
