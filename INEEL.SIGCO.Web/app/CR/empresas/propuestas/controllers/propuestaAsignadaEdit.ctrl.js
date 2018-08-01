(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("PropuestaAsignadaEditCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$uibModal",
        "$uibModalInstance",
        "$stateParams",
        "DTOptionsBuilder",
        "EmpresasCRService",
        "PropuestasEmpresaCRService",
        PropuestaAsignadaEditCtrl
    ]);

    function PropuestaAsignadaEditCtrl(AuthService, $filter, $scope, $state, $uibModal, $uibModalInstance, $stateParams, DTOptionsBuilder, EmpresasCRService, PropuestasEmpresaCRService) {
        $scope.authentication = AuthService.authentication;
        var id = $stateParams.id;
        $scope.dtInstance = {};

        var propuestaId = $scope.propuestaId;
        $scope.ElementoSeleccionado = {};
        $scope.ElementoSeleccionado.claveUnidad = {};

        $scope.propuestaAsignadaEdit = {};

        EmpresasCRService.getEmpresas().then(
          function (result) {
              $scope.empresas = result.data;
          },
          function (err) {
              toastr.error(data.exceptionMessage);
          });

        PropuestasEmpresaCRService.getPropuestaEmpresaAsignada(propuestaId).then(
        function (result) {
            $scope.propuestaAsignadaEdit = result.data;
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
                        $scope.propuestaAsignadaEdit.claveUnidadEmpresa = selectedItem.claveUnidad;
                        $scope.propuestaAsignadaEdit.unidadOrganizacionalEmpresas.nombreUnidad = selectedItem.nombreUnidad;
                        $scope.propuestaAsignadaEdit.contacto.nombreCompleto = "";
                        $scope.propuestaAsignadaEdit.contactoId = null;
                    }
                });
            }
        }

        $scope.ContactoSeleccionado = {};

        $scope.vercontacto = false;

        $scope.openContacto = function () {
            $scope.ElementoSeleccionado.claveUnidad = $scope.propuestaAsignadaEdit.claveUnidadEmpresa;
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
                    $scope.propuestaAsignadaEdit.contacto.nombreCompleto = selectedItem.nombreContacto + " " + selectedItem.apellidoPaterno + " " + selectedItem.apellidoMaterno;
                    $scope.propuestaAsignadaEdit.contactoId = selectedItem.contactoId;
                    $scope.ContactoSeleccionado = selectedItem;
                });
            }
        }

        $scope.ok = function () {
            PropuestasEmpresaCRService.update($scope.propuestaAsignadaEdit).then(
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