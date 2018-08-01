(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("EmpresaDetailsCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$stateParams",
            "$http",
            "globalGet",
            "$uibModal",
            "UnidadesCRService",
            "EmpresasCRService",
            "ContactosCRService",
            "DTOptionsBuilder",
            "HistorialUnidadesCRService",
            "PropuestasEmpresaCRService",
            "IniciativasEmpresaCRService",
            "ProyectosEmpresaCRService",
            EmpresaDetailsCtrl]);

    function EmpresaDetailsCtrl(AuthService, $scope, $state, $stateParams, $http, globalGet, $uibModal, UnidadesCRService, EmpresasCRService, ContactosCRService, DTOptionsBuilder, HistorialUnidadesCRService, PropuestasEmpresaCRService, IniciativasEmpresaCRService, ProyectosEmpresaCRService) {
        $scope.authentication = AuthService.authentication;
        $scope.empresa_id = $stateParams.id;
        $scope.empresaUnidad = {};
        var API = globalGet.get("api");

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDOM('fltpi');

        $scope.tab = 2;
        $scope.active2 = "active";

        $scope.newTAB = function () {
            $scope.active2 = "";
            $scope.active3 = "";
            $scope.active4 = "";
            $scope.active5 = "";
            $scope.active6 = "";
            $scope.active7 = "";

            switch ($scope.tab) {
                case 2:
                    $scope.active2 = "active";
                    break;
                case 3:
                    $scope.active3 = "active";
                    break;
                case 4:
                    $scope.active4 = "active";
                    break;
                case 5:
                    $scope.active5 = "active";
                    break;
                case 6:
                    $scope.active6 = "active";
                    break;
                case 7:
                    $scope.active7 = "active";
                    break;

                default:
            }
        }


        $scope.proyectosAsignadosEmpresa = [];
        $scope.propuestasAsignadasEmpresa = [];
        $scope.iniciativasAsignadasEmpresa = [];

        $scope.cargaContactos = function () {
            ContactosCRService.GetAllByEmpresa($stateParams.id).then(
                function (res) {
                    $scope.contactos = res.data;
                }, function (err) {
                    console.log(err);
                }
            );
        }



        HistorialUnidadesCRService.GetAllByEmpresa($stateParams.id).then(
            function(res){
                $scope.historial = res.data;
            }, function (err) {
                toastr.error("Error al cargar el historial de movimientos");
                console.log(err);
            }
        );

        $scope.cargaContactos();

        $scope.verDetalle = function(id){
            $scope.id = id.$modelValue.claveUnidad.trim();  //$modelValue retorna el $scope de un elemento
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/detalleunidadOrganizacionalEmpresas/detalleUnidadOrganizacionalEmpresas.html',
                controller: 'detalleUnidadOrganizacionalEmpresasCtrl',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });
        }

        EmpresasCRService.getDetailEmpresa($scope.empresa_id).then(
            function (result) {
                $scope.empresa = result.data;
                
            },
            function (err) {
                console.error(err);
            });

        CargarUnidades();

        function CargarUnidades() {
            var API = globalGet.get("api");
            var service = {};
            service.GetAllnodes = function (empresaUnidad) {
                var endPoint = API + "UnidadOrganizacionalEmpresas/GetAllnodes";
                return $http.post(endPoint, empresaUnidad);

            }

            $scope.nodoSeleccionado = {};
            $scope.data = [];

            $scope.seleccionarNodo = function (scope) {
                var nodeData = scope.$modelValue;
                $scope.nodoSeleccionado = nodeData;
                $scope.empresaUnidadEdit = $scope.nodoSeleccionado;
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/CR/empresas/unidadOrganizacional/unidadEdit.html',
                    size: 'lg',
                    controller: function ($uibModalInstance) {
                        $scope.ok = function () {
                            if ($scope.empresaUnidadEdit.nombreUnidad == '' || $scope.empresaUnidadEdit.nombreUnidad == null || $scope.empresaUnidadEdit.nombreUnidad == undefined) {
                                toastr.error("Se requiere el nombre de la unidad");
                            } else {

                                UnidadesCRService.editarUnidad($scope.empresaUnidadEdit).then(
                                    function (result) {

                                        toastr.success(result.data);
                                        CargarUnidades();
                                        $uibModalInstance.dismiss('cancel');
                                    },
                                    function (err) {
                                        toastr.error(err.data.exceptionMessage);
                                    });

                            }
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    scope: $scope
                });
            }

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
                            //alert("push");
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

            var itemEO = { padre: null, EmpresaId: $scope.empresa_id }
            service.GetAllnodes(itemEO).then(
                function (result) {

                    $scope.data = result.data;
                },
                function (error) {
                    toastr.success("error");
                }
            );
        }

        $scope.detalleProyectoAsignado = function (id) {
            $scope.proyectoId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/proyectos/proyectoAsignadoDetail.html',
                controller: 'ProyectoAsignadoDetailsCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargar();
            });
        }

        $scope.detalleIniciativaAsignada = function (id) {
            $scope.folioId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/iniciativas/iniciativaAsignadaDetail.html',
                controller: 'IniciativaAsignadaDetailCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargar();
            });
        }

        $scope.detallePropuestaAsignado = function (id) {
            $scope.proyectoId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/propuestas/propuestaAsignadaDetail.html',
                controller: 'PropuestaAsignadaDetailsCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargar();
            });
        }

        ProyectosEmpresaCRService.getProyectosAsignadosEmpresa($scope.empresa_id).then(
            function (result) {
                $scope.proyectosAsignadosEmpresa = result.data;
            },
            function (err) {
                toastr.error(err);
            });

        PropuestasEmpresaCRService.getPropuestasAsignadasEmpresa($scope.empresa_id).then(
            function (result) {
                $scope.propuestasAsignadasEmpresa = result.data;
            },
            function (err) {
                toastr.error(err);
            });

        IniciativasEmpresaCRService.getIniciativasAsignadasEmpresa($scope.empresa_id).then(
            function (result) {
                $scope.iniciativasAsignadasEmpresa = result.data;
            },
            function (err) {
                toastr.error(err);
            });
    }
})();
