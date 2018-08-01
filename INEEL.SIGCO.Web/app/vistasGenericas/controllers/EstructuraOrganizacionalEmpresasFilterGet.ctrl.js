
(function () {
    "use strict";
    var app = angular.module("directivasSIGCO");
    app.controller("EstructuraOrganizacionalEmpresasFilterGetCtrl",[
             "$scope", 
             "$uibModalInstance",
             "$http", 
             "globalGet",
             "$timeout",
             EstructuraOrganizacionalEmpresasFilterGetCtrl]);

    function EstructuraOrganizacionalEmpresasFilterGetCtrl($scope, $uibModalInstance, $http, globalGet, $timeout) {
        /* Servicio dentro del controlador para no replicar varios archivos de acuerdo al modulo */
        
        var API = globalGet.get("api");
        var service = {};
        service.GetAllnodes = function (Unidad) {
            var endPoint = API + "UnidadOrganizacionalEmpresas/GetAllnodes";
            return $http.post(endPoint, Unidad);
        }
        
        /* Fin de Servicio dentro del controlador para no replicar varios archivos de acuerdo al modulo */

        $scope.nodoSeleccionado = {};
        $scope.data = [];
        $scope.seleccionarNodo = function (scope) {
            var nodeData = scope.$modelValue;
            $scope.nodoSeleccionado = nodeData;
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
        $scope.resultX = {};
        $scope.newSubItem = function (scope) {
            var nodeData = scope.$modelValue;
            service.GetAllnodes(nodeData).then(
                function (result) {
                    $scope.resultX = {};
                    var r = result.data;
                    $scope.resultX = r;
                    if (r != null && r.length > 0 && r[0].children != null && r[0].children.length > 0) {
                        nodeData.nodes = r[0].children;
                    } else {
                        nodeData.hoja = true;
                    }
                },
                function (error) {
                    toastr.success("error");
                }
                );
        };

        $scope.collapseAll = function () {
            $scope.$broadcast('angular-ui-tree:collapse-all');
        };

        $scope.expandAll = function () {
            $scope.$broadcast('angular-ui-tree:expand-all');
        };
        var itemEO = { padre: null, EmpresaId: $scope.idEmpresa }
        service.GetAllnodes(itemEO).then(
            function (result) {
                $scope.data = result.data;
                return $timeout(function () {
                    $scope.collapseAll();    
                },500);
                
            },
            function (error) {
                toastr.success("error");
                console.log(error);
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