(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("IniciativaAsignadaEditCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$uibModal",
        "$uibModalInstance",
        "$stateParams",
        "DTOptionsBuilder",
        "EmpresasCRService",
        "IniciativasEmpresaCRService",
         IniciativaAsignadaEditCtrl
    ]);

    function IniciativaAsignadaEditCtrl(AuthService, $filter, $scope, $state, $uibModal, $uibModalInstance, $stateParams, DTOptionsBuilder, EmpresasCRService, IniciativasEmpresaCRService) {
        $scope.authentication = AuthService.authentication;
        var id = $stateParams.id;
        $scope.dtInstance = {};

        var inciativaId = $scope.folioId;
        $scope.ElementoSeleccionado = {};
        $scope.ElementoSeleccionado.claveUnidad = {};

        $scope.iniciativaAsignadaEdit = {};

        EmpresasCRService.getEmpresas().then(
          function (result) {
              $scope.empresas = result.data;
          },
          function (err) {
              toastr.error(data.exceptionMessage);
          });

        IniciativasEmpresaCRService.getIniciativaEmpresaAsignada(inciativaId).then(
        function (result) {
            $scope.iniciativaAsignadaEdit = result.data;
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
                        debugger;
                        $scope.iniciativaAsignadaEdit.claveUnidadEmpresa = selectedItem.claveUnidad;
                        $scope.iniciativaAsignadaEdit.unidadOrganizacionalEmpresas.nombreUnidad = selectedItem.nombreUnidad;
                        $scope.iniciativaAsignadaEdit.contacto.nombreCompleto = "";
                        $scope.iniciativaAsignadaEdit.contactoId = null;
                    }
                });
            }
        }

        $scope.ContactoSeleccionado = {};

        $scope.vercontacto = false;

        $scope.openContacto = function () {
            $scope.ElementoSeleccionado.claveUnidad = $scope.iniciativaAsignadaEdit.claveUnidadEmpresa;
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
                    debugger;
                    $scope.iniciativaAsignadaEdit.contacto.nombreCompleto = selectedItem.nombreContacto + " " + selectedItem.apellidoPaterno + " " + selectedItem.apellidoMaterno;
                    $scope.iniciativaAsignadaEdit.contactoId = selectedItem.contactoId;
                    $scope.ContactoSeleccionado = selectedItem;
                });
            }
        }

        $scope.ok = function () {
            IniciativasEmpresaCRService.update($scope.iniciativaAsignadaEdit).then(
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