(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("ProyectoAsignadoEditCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$uibModal",
        "$uibModalInstance",
        "$stateParams",
        "DTOptionsBuilder",
        "EmpresasCRService",
        "ProyectosEmpresaCRService",
        ProyectoAsignadoEditCtrl
    ]);

    function ProyectoAsignadoEditCtrl(AuthService, $filter, $scope, $state, $uibModal, $uibModalInstance, $stateParams, DTOptionsBuilder,EmpresasCRService, ProyectosEmpresaCRService) {
        $scope.authentication = AuthService.authentication;
        var id = $stateParams.id;
        $scope.dtInstance = {};

        var proyectoId = $scope.proyectoId;
        $scope.ElementoSeleccionado = {};
        $scope.ElementoSeleccionado.claveUnidad = {};

        $scope.proyectoAsginadoEdit = {};
        
        EmpresasCRService.getEmpresas().then(
          function (result) {
              $scope.empresas = result.data;
          },
          function (err) {
              toastr.error(data.exceptionMessage);
          });

        ProyectosEmpresaCRService.getProyectoEmpresaAsignado(proyectoId).then(
        function (result) {
            $scope.proyectoAsginadoEdit = result.data;
        },
        function (err) {
            toastr.error(data.exceptionMessage);
        });

        $scope.openEstructuraOrg = function (idEmpresa) {
            if (idEmpresa == undefined || idEmpresa === null || idEmpresa === "") {
                toastr.error("debe seleccionar la empresa");
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
                        $scope.proyectoAsginadoEdit.claveUnidadEmpresa = selectedItem.claveUnidad;
                        $scope.proyectoAsginadoEdit.unidadOrganizacionalEmpresas.nombreUnidad = selectedItem.nombreUnidad;
                        $scope.proyectoAsginadoEdit.contacto.nombreCompleto = "";
                        $scope.proyectoAsginadoEdit.contactoId = null;
                    }
                });
            }
        }

        $scope.ContactoSeleccionado = {};

        $scope.vercontacto = false;

        $scope.openContacto = function () {
            $scope.ElementoSeleccionado.claveUnidad = $scope.proyectoAsginadoEdit.claveUnidadEmpresa;
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
                    $scope.proyectoAsginadoEdit.contacto.nombreCompleto = selectedItem.nombreContacto + " " + selectedItem.apellidoPaterno + " " + selectedItem.apellidoMaterno;
                    $scope.proyectoAsginadoEdit.contactoId = selectedItem.contactoId;
                    $scope.ContactoSeleccionado = selectedItem;
                });
            }
        }

        $scope.ok = function () {
            ProyectosEmpresaCRService.update($scope.proyectoAsginadoEdit).then(
                    function (result) {
                        toastr.success(result.data);
                        $uibModalInstance.dismiss('cancel');
                        $scope.recargar();
                    },
            function (err) {
                toastr.error(data.exceptionMessage);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.limpiar = function () {
            $scope.ElementoSeleccionado.nombreUnidad = "";
            $scope.nombreCompleto = "";
        }
    }
})();