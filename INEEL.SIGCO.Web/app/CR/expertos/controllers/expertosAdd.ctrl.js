(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("expertosAddCtrl", [
            "$scope",
            "$state",
            "ExpertosCRService",
            "LineasDesarrolloTecnologicoCRService",
            "$uibModal",
            "MenuService",
            "DTOptionsBuilder",
            expertosAddCtrl
        ]);

    function expertosAddCtrl($scope, $state, ExpertosCRService, lineasInvestigacion, $uibModal, MenuService, DTOptionsBuilder) {

        MenuService.setVariable('contacto', null);
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.investigadores = [];

        //llenar el combo de lineas de investigacion 
        $scope.llenarlineasInvestigacion = function () {
            lineasInvestigacion.getLineasDesarrolloTecnologico().then(
                function (response) {
                    $scope.lineas = response.data;
                }
                , function (error) {
                    toastr.warning(error.data.message);
                }
            );
        };

        //trae las comunidades de practica
        $scope.llenaComunidades = function () {
            ExpertosCRService.getComunidades().then(
                function (result) {
                    $scope.comunidades = result.data;
                }, function (error) {
                    toastr.error(error);
                }
            );
        }

        //buscar en los contactos agregados  
        $scope.buscarcontacto = function () {
            MenuService.setVariable('expertos', true);
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/ContactosGetGral.html',
                controller: 'ContactosGetGralCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                if (typeof selectedItem !== 'undefined') {
                    $scope.validaexperto(selectedItem);
                }
            });
        }

        //$scope.PersonaSeleccionada = {};
        $scope.openUser = function () {
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        return $scope.empleado;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                var investigadores = {
                    'clavePersona': selectedItem.clavePersona,
                    'nombreCompleto': selectedItem.nombreCompleto
                };
                $scope.investigadores.push(investigadores);
                $scope.expertosaddform.$setDirty();

            });
        }

        $scope.deleteUser = function (index) {
            $scope.investigadores.splice(index, 1);
        }

        $scope.validaexperto = function (selectedItem) {
            ExpertosCRService.validaexperto(selectedItem.contactoId).then(
                function (response) {
                    if (response.data != null) {
                        toastr.warning("El contacto ya esta considerado como un experto");
                    }
                    else {
                        $scope.contacto = {};
                        if (selectedItem.nombreEmpresa == undefined || selectedItem.nombreEmpresa == '' || selectedItem.nombreEmpresa == null) {
                            $scope.contacto.nombreEmpresa = selectedItem.empresa.nombreEmpresa;
                        } else {
                            $scope.contacto.nombreEmpresa = selectedItem.nombreEmpresa;
                        }

                        if (selectedItem.apellidoPaterno == null) {
                            selectedItem.apellidoPaterno = "";
                        }
                        if (selectedItem.apellidoMaterno == null) {
                            selectedItem.apellidoMaterno = "";
                        }
                        $scope.contacto.nombreCompleto = selectedItem.nombreContacto + " " + selectedItem.apellidoPaterno + " " + selectedItem.apellidoMaterno;
                        $scope.contacto.adjunto64 = selectedItem.adjunto64;
                        $scope.contacto.puesto = selectedItem.puesto;
                        $scope.contacto.localidad = selectedItem.localidad;
                        $scope.contacto.correo = selectedItem.correo;
                        $scope.contacto.telefono = selectedItem.telefono;
                        $scope.contacto.celular = selectedItem.celular;
                        $scope.contacto.empresaId = selectedItem.empresaId;
                        $scope.contacto.contactoId = selectedItem.contactoId;
                        $scope.contacto.estadoContacto = selectedItem.estadoContacto;
                        $scope.contacto.paisOrigen = selectedItem.paisOrigen;
                        $scope.expertosaddform.$setDirty();
                    }
                },
                function (error) { toastr.error(error.data.exceptionMessage); }
            );
        }

        $scope.agregarexperto = function () {
            if ($scope.expertosaddform.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            if($scope.investigadores.length==0){
                toastr.error("Agregue un por lo menos un investigador");
                return false;
            }
            else {
                $scope.experto = {};
                $scope.experto.contactoId = $scope.contacto.contactoId;
                $scope.experto.tipoExperto = 2;
                $scope.experto.especialidad = $scope.especialidad;
                $scope.experto.lineaDesarrolloTecnologicoId = $scope.lineadeinvestigacion.lineaDesarrolloTecnologicoId;
                $scope.experto.investigadores = $scope.investigadores;
                if ($scope.comunidad !== null) {
                    if ($scope.comunidad !== undefined) {
                        $scope.experto.ComunidadId =  $scope.comunidad.comunidadId;
                    }
                }
                
                $scope.desactivar = true;

                ExpertosCRService.crearexperto($scope.experto).then(
                    function (result) {
                        toastr.success(result.data);
                        MenuService.setVariable('expertos', false);
                        $state.go("expertosget");
                    },
                    function (error) {
                        $scope.desactivar = false;
                        toastr.error(error.data.message);
                    });
            }
        }


        $scope.llenarlineasInvestigacion();
        $scope.llenaComunidades();
    }


})();