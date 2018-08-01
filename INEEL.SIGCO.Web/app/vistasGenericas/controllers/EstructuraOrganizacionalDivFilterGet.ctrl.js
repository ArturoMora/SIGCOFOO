
(function () {
    "use strict";
    var app = angular.module("directivasSIGCO");
    app.controller("EstructuraOrganizacionalDivFilterGetCtrl",
        ["$scope", "$state", "$stateParams",
            "$uibModal", "$uibModalInstance",
            "$http", "globalGet",
            EstructuraOrganizacionalDivFilterGetCtrl]);

    function EstructuraOrganizacionalDivFilterGetCtrl($scope, $state, $stateParams, $uibModal, $uibModalInstance,
        $http, globalGet) {
        
        /* Servicio dentro del controlador para no replicar varios archivos de acuerdo al modulo */
        var API = globalGet.get("api");
        var service = {};

        console.log($scope.clave);
        service.GetAllnodes = function (id) {
            var endPoint = API + "UnidadOrganizacional/GetAllNodesId/"+ $scope.clave+"/"+$scope.fechauo;
            return $http.post(endPoint);
        }
        /* Fin de Servicio dentro del controlador para no replicar varios archivos de acuerdo al modulo */

        $scope.unidadOrganizacional = {};
        $scope.nodoSeleccionado = {};
        $scope.data = [];
        $scope.seleccionarNodo = function (scope) {            
            var nodeData = scope.$modelValue;
            try {
                if ($scope.nivelMin > nodeData.tipoO || ($scope.nivelMax < nodeData.tipoO)) {
                    toastr.clear();
                    toastr.warning("Unidad Organizacional no disponible");
                    return;
                }
            } catch (e) {  }
            $scope.nodoSeleccionado = nodeData;
            toastr.clear();
            $scope.ok();
        }
        $scope.remove = function (scope) {
            //scope.remove();
        };
        $scope.toggle = function (scope) {

            scope.toggle();
            $scope.newSubItem(scope);
        };
        $scope.moveLastToTheBeginning = function () {
            var a = $scope.data.pop();
            $scope.data.splice(0, 0, a);
        };

        $scope.newSubItem = function (scope) {
            var nodeData = scope.$modelValue;
            $scope.unidadOrganizacional.claveunidad = nodeData.id;
            $scope.unidadOrganizacional.fechaEfectiva = $scope.fechauo;
            service.GetAllnodes($scope.unidadOrganizacional).then(
                function (result) {
                    var r = result.data;
                    if (r != null && r.length > 0 && r[0].children != null && r[0].children.length > 0) {
                        //alert("push");
                        nodeData.nodes = r[0].children;
                    } else {
                        nodeData.hoja = true;
                    }
                },
                function (error) {
                    toastr.error("error");
                }
            );
        };

        $scope.collapseAll = function () {
            $scope.$broadcast('angular-ui-tree:collapse-all');
        };

        $scope.expandAll = function () {
            $scope.$broadcast('angular-ui-tree:expand-all');
        };
        $scope.unidadOrganizacional.claveunidad = '';
        $scope.unidadOrganizacional.fechaEfectiva = $scope.fechauo;
        service.GetAllnodes($scope.unidadOrganizacional).then(
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
        $scope.ok = function () {
            $uibModalInstance.close($scope.nodoSeleccionado);
        }
    }

})();