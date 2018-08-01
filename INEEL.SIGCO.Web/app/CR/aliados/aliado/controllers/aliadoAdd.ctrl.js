(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("AliadoAddCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$stateParams",
            "$filter",
            "AliadosCRService",
            "$uibModal",
            "DTOptionsBuilder",
            AliadoAddCtrl
        ]);

    function AliadoAddCtrl(AuthService, $scope, $state, $stateParams, $filter, AliadosCRService, $uibModal, DTOptionsBuilder) {
        $scope.authentication = AuthService.authentication;
        $scope.aliado = {};
        var val = null;
        $scope.listaContactos = [];

        //Modal de empresas que aun no son aliados
        $scope.openEmpresasForAliados=function() {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CR/aliados/aliado/modalAliados/empresasForAliadosGet.html',
                controller: 'EmpresasForAliadosGetCtrl',
                scope:$scope
            });
            modalInstance.result.then(function(selectedItem) {
                var estado = "";
                var municipio = "";
                var localidad = "";
                var colonia = "";
                var calle = "";
                var cp = "";

                $scope.empresa = selectedItem.nombreEmpresa;
                $scope.aliado.empresaId = selectedItem.empresaId;

                if (selectedItem.calle != null && selectedItem.calle != undefined) {
                    calle = selectedItem.calle;
                }
                if (selectedItem.colonia != null && selectedItem.colonia != undefined) {
                    colonia = ' ' + selectedItem.colonia;
                }
                if (selectedItem.localidad != null && selectedItem.localidad != undefined) {
                    localidad = ', ' + selectedItem.localidad;
                }
                if (selectedItem.municipios) {
                    if (selectedItem.municipios.nombreMunicipio != null && selectedItem.municipios.nombreMunicipio != undefined) {
                        municipio = ', ' + selectedItem.municipios.nombreMunicipio;
                    }
                }
                if (selectedItem.estados) {
                    if (selectedItem.estados.nombreEstado != null && selectedItem.estados.nombreEstado != undefined) {
                        estado = ', ' + selectedItem.estados.nombreEstado;
                    }
                }

                
                $scope.aliadoAddForm.$setDirty();

                if (selectedItem.cp != null && selectedItem.cp != undefined) {
                    cp = ', C.P. ' + selectedItem.cp;
                }
                $scope.tipoOrganizacion = selectedItem.tipoOrganizacion.nombre;

                $scope.aliado.direccion = calle + colonia + localidad + municipio + estado + cp;
                $scope.EmpresaSeleccionada = selectedItem;
            });
        }

        $scope.EmpresaSeleccionada = {};
        $scope.tipoOrganizacion = "";
        $scope.verempresa = false;
        

        //Buscar Contacto
        $scope.ContactoSeleccionada = {};
        $scope.vercontacto = false;
        $scope.openContacto = function () {
            $scope.vinculo = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/ContactosGetGral.html',
                controller: 'ContactosGetGralCtrl as showCase',
                resolve: {
                    institucion: function () {
                        $scope.vercontacto = false;
                        return $scope.vinculo;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                var aPaterno = "";
                var aMaterno = "";
                selectedItem.apellidoPaterno == null ? aPaterno : aPaterno = selectedItem.apellidoPaterno;
                selectedItem.apellidoMaterno == null ? aMaterno : aMaterno = selectedItem.apellidoMaterno;
                
                $scope.contacto = selectedItem.nombreContacto + " " + aPaterno + " " + aMaterno;
                $scope.aliado.contactoId = selectedItem.contactoId;
                $scope.aliado.nombre = selectedItem.nombreCompleto;
                $scope.aliado.correo = selectedItem.correo;
                $scope.ContactoSeleccionada = selectedItem;

                var duplicidad = $scope.verificaDuplicidadContacto(selectedItem);
                if (duplicidad) {
                    toastr.error("El contacto ya se encuentra registrado");
                    $scope.contacto = "";
                    return false;
                } else {
                    $scope.listaContactos.push(selectedItem);
                    $scope.contacto = "";
                    $scope.aliadoAddForm.$setDirty();
                }
            });
        }

        $scope.verificaDuplicidadContacto = function (contacto) {

            for (var c = 0; c < $scope.listaContactos.length; c++) {
                if ($scope.listaContactos[c].nombreCompleto == contacto.nombreCompleto) {
                    return true;
                }
            }

        }

        $scope.eliminaContacto = function (posicion) {
            $scope.listaContactos.splice(posicion, 1);
        }

        $scope.AddAliado = function () {
            if ($scope.aliadoAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                $scope.aliado.listaContactos = $scope.listaContactos;
                $scope.aliado.fechaRegistro = new Date();
                $scope.aliado.estado = 1;
                $scope.aliado.autor = AuthService.authentication.nombreCompleto;

                $scope.desactivar = true;
                AliadosCRService.create($scope.aliado)
                    .then(
                    function (result) {
                        toastr.success(result.data);
                        $state.go("aliadosGet");
                    },
                    function (err) {
                        toastr.error(err.data.message);
                        console.error(err.data);
                        $scope.desactivar = false;
                    });
            }
        }
    }
})();