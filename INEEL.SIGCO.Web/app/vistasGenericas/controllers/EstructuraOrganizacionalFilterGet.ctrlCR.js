
//(function () {
//    "use strict";
//    var app = angular.module("directivasSIGCO");
//    app.controller("EstructuraOrganizacionalFilterGetCtrl",        
//        ["$scope", "$state", "$stateParams",
//             "$uibModal", "$uibModalInstance",
//             "$http", "globalGet",
//             EstructuraOrganizacionalCtrl]);

//    function EstructuraOrganizacionalCtrl($scope, $state, $stateParams, $uibModal, $uibModalInstance,
//        $http, globalGet) {
//        /* Servicio dentro del controlador para no replicar varios archivos de acuerdo al modulo */
//        var API = globalGet.get("api");
//        var service = {};
//        service.GetAllnodes = function (id) {
//            var endPoint = API + "UnidadOrganizacional/GetAllnodes/" + id;
//            return $http.get(endPoint);
//        }
//        service.GetPadreAllnodes = function () {
//            var endPoint = API + "UnidadOrganizacional/GetAllnodes";
//            return $http.get(endPoint);
//        }
//        /* Fin de Servicio dentro del controlador para no replicar varios archivos de acuerdo al modulo */

//        $scope.nodoSeleccionado = {};
//        $scope.data = [];
//        $scope.seleccionarNodo = function (scope) {
//            var nodeData = scope.$modelValue;
//            $scope.nodoSeleccionado = nodeData;
//            $scope.ok();
//        }
//        $scope.remove = function (scope) {
//            //scope.remove();
//        };
//        $scope.toggle = function (scope) {
            
//            scope.toggle();
//            $scope.newSubItem(scope);
//        };
//        $scope.moveLastToTheBeginning = function () {
//            var a = $scope.data.pop();
//            $scope.data.splice(0, 0, a);
//        };

//        $scope.newSubItem = function (scope) {
//            var nodeData = scope.$modelValue;
//            debugger;
//            service.GetAllnodes(nodeData.id).then(
//                function (result) {
//                    var r = result.data;
//                    if (r != null && r.length > 0 && r[0].children != null && r[0].children.length > 0) {
//                        //alert("push");
//                        debugger;
//                        nodeData.nodes = r[0].children;
//                    } else {
//                        nodeData.hoja = true;
//                    }
//                },
//                function (error) {
//                    toastr.success("error");
//                }
//                );
//        };

//        $scope.collapseAll = function () {
//            $scope.$broadcast('angular-ui-tree:collapse-all');
//        };

//        $scope.expandAll = function () {
//            $scope.$broadcast('angular-ui-tree:expand-all');
//        };
//        service.GetPadreAllnodes().then(
//            function (result) {
//                $scope.data = result.data;
//            },
//            function (error) {
//                toastr.success("error");
//            }
//        );

//        $scope.cancel = function () {
//            $uibModalInstance.dismiss('cancel');
//        }
//        $scope.ok = function () {
//            $uibModalInstance.close($scope.nodoSeleccionado);
//        }
//    }

//})();