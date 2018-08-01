(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ProyectosEmpresaAddCtrl", [
            "AuthService",
            "$filter",
            "$scope",
            "$state",
            "$stateParams",
            "$uibModal",
            "EmpresasCRService",
            "ProyectosEmpresaCRService",
            ProyectosEmpresaAddCtrl
        ]);

    function ProyectosEmpresaAddCtrl(AuthService, $filter, $scope, $state, $stateParams, $uibModal,
        EmpresasCRService,
        ProyectosEmpresaCRService) {
        $scope.authentication = AuthService.authentication;
        var id = $stateParams.id;
        $scope.proyectoEmpresa = {};
        $scope.empresas = [];
        $scope.ElementoSeleccionado = {};
        $scope.ElementoSeleccionado.nombreUnidad;

        ProyectosEmpresaCRService.getProyectoEmpresa(id).then(
            function (result) {
                $scope.proyectoEmpresa = result.data;
            },
            function (err) {
                toastr.error(err);
            });

        EmpresasCRService.getEmpresas().then(
            function (result) {
                $scope.empresas = result.data;
            },
            function (err) {
                toastr.error(err);
            });

        $scope.openEstructuraOrg = function (idEmpresa) {
            if (idEmpresa == undefined || idEmpresa === null || idEmpresa === "") {
                toastr.error("Debe seleccionar la empresa");
            } else {
                $scope.selectItem = {};
                $scope.idEmpresa = idEmpresa;
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    templateUrl: 'app/vistasGenericas/EstructuraOrganizacionalEmpresas.html',
                    controller: 'EstructuraOrganizacionalEmpresasFilterGetCtrl',
                    resolve: {
                        selectItem: function () {
                            return $scope.selectItem;
                        }
                    },
                    scope: $scope
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.ElementoSeleccionado = selectedItem;
                    if (selectedItem != null) {
                        $scope.proyectoEmpresa.claveUnidadEmpresa = selectedItem.claveUnidad;
                        $scope.nombreCompleto = "";
                        $scope.contactoId = null;
                    }
                });
            }
        }

        $scope.ContactoSeleccionado = {};

        $scope.vercontacto = false;

        $scope.openContacto = function () {
            if ($scope.ElementoSeleccionado.claveUnidad == undefined || $scope.ElementoSeleccionado.claveUnidad == null || $scope.ElementoSeleccionado.claveUnidad == "") {
                toastr.error("Debe seleccionar la unidad organizacional");
            }
            else {
                $scope.vinculo = {};
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    templateUrl: 'app/vistasGenericas/contactosUnidadGet.html',
                    controller: 'ContactosUnidadGetCtrl as showCase',
                    resolve: {
                        institucion: function () {
                            $scope.vercontacto = false;
                            return $scope.vinculo;
                        }
                    },
                    scope: $scope,
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.nombreCompleto = selectedItem.nombreContacto + " " + selectedItem.apellidoPaterno + " " + selectedItem.apellidoMaterno;
                    $scope.proyectoEmpresa.contactoId = selectedItem.contactoId;
                    $scope.ContactoSeleccionado = selectedItem;
                });
            }
        }

        $scope.AddProyectoEmpresa = function () {
            if ($scope.proyectoEmpresaAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            else {
                    $scope.proyectoEmpresa.empresaId = $scope.empresas.empresaId;
                    ProyectosEmpresaCRService.updateEmpresa($scope.proyectoEmpresa).then(
                        function (result) {
                            toastr.success(result.data);
                            $state.go("proyectosEmpresaGet");
                        },
                        function (err) {
                            toastr.error(err);
                        });
                }
        };

        $scope.limpiar = function () {
            $scope.ElementoSeleccionado.nombreUnidad = "";
            $scope.nombreCompleto = "";
        }
    }
})();
