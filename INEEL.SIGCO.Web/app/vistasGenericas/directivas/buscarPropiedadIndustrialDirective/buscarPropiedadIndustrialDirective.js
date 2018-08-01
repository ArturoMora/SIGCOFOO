;
(function () {
    "use strict";

    angular.module("directivasSIGCO")
        .controller('uoModalPIPropiedadIndustrialCtrl', ['$scope', '$uibModal', uoModalPIPropiedadIndustrialCtrl])
        .controller("PropiedadIndustrialModalFilterGetCtrl",
        ["$scope", "$state", "$stateParams",
            "$uibModal", "$uibModalInstance",
            "$http", "globalGet",
            PropiedadIndustrialModalFilterGetCtrl])
        .directive('propiedadIndustrialSelect', function () {
            return {
                restrict: 'ACE',
                templateUrl: function (elem, attrs) {
                    return attrs.templateUrl || 'app/vistasGenericas/directivas/buscarPropiedadIndustrialDirective/buscarPropiedadIndustrial.html';
                },
                controller: "uoModalPIPropiedadIndustrialCtrl",
                require: 'ngModel',
                scope: {
                    arreglo: "=?enarreglo",
                    ngModel: '=',
                    stateForm: "=?",
                }
            };
        });

    function PropiedadIndustrialModalFilterGetCtrl($scope, $state, $stateParams, $uibModal, $uibModalInstance,
        $http, globalGet) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        /* Servicio dentro del controlador para no replicar varios archivos de acuerdo al modulo */
        var API = globalGet.get("api");
        var service = {};
        service.GetAllnodes = function () {
            var endPoint = API + "PropiedadIndustrial/GetAllPropiedadInstitutoModal";
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
    function uoModalPIPropiedadIndustrialCtrl($scope, $uibModal) {
        $scope.elementoSeleccionadoArray = [];
        $scope.openModalPIPropiedadIndustrial = function () {
            $scope.arreglo = typeof $scope.arreglo === 'undefined' ? false : $scope.arreglo;
            $scope.selectItemPIPropiedadIndustrial = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/directivas/buscarPropiedadIndustrialDirective/buscarPropiedadIndustrialModalFilterGet.html',
                controller: 'PropiedadIndustrialModalFilterGetCtrl',
                resolve: {
                    selectItemPIPropiedadIndustrial: function () {
                        return $scope.selectItemPIPropiedadIndustrial;
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
                if (registros[i].propiedadIndustrialId == selectedItem.propiedadIndustrialId) {
                    return true;
                }
            }
            return false;
        }
    }
    ;
}());
