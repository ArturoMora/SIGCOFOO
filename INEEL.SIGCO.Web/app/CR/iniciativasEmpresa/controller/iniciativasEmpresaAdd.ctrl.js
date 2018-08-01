(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("IniciativasEmpresaAddCtrl", [
            "AuthService",
            "$filter",
            "$scope",
            "$state",
            "$stateParams",
            "$uibModal",
            "EmpresasCRService",
            "IniciativasEmpresaCRService",
            IniciativasEmpresaAddCtrl
        ]);

    function IniciativasEmpresaAddCtrl(AuthService, $filter, $scope, $state, $stateParams, $uibModal, EmpresasCRService, IniciativasEmpresaCRService) {
        $scope.authentication = AuthService.authentication;
        var id = $stateParams.id;


        $scope.valorIniciativa = id;

        $scope.iniciativaEmpresa = {};
        $scope.empresas = [];
        $scope.cveUnidad = {};
        $scope.ElementoSeleccionado = {};
        $scope.ElementoSeleccionado.nombreUnidad;
        
        debugger;
        IniciativasEmpresaCRService.getIniciativaEmpresa(id).then(
            function (result) {
                $scope.iniciativaEmpresa = result.data;
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
                        $scope.iniciativaEmpresa.claveUnidadEmpresa = selectedItem.claveUnidad;
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
                    $scope.iniciativaEmpresa.contactoId = selectedItem.contactoId;
                    $scope.ContactoSeleccionado = selectedItem;
                });
            }
        }

        $scope.AddIniciativaEmpresa = function () {
            if ($scope.iniciativaEmpresaAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            else {
                $scope.iniciativaEmpresa.empresaId = $scope.empresas.empresaId;
                IniciativasEmpresaCRService.updateEmpresa($scope.iniciativaEmpresa).then(
                    function (result) {
                        toastr.success(result.data);
                        $state.go("iniciativasEmpresaGet");
                    },
                    function (err) {
                        toastr.error(err);
                    });
            }
        };

        $scope.limpiar = function () {
            debugger;
            $scope.ElementoSeleccionado.nombreUnidad = "";
            $scope.nombreCompleto = "";
        }
    }
})();