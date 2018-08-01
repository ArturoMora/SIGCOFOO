(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("AliadoEditCtrl", [
            "$scope",
            "$state",
            '$rootScope',
            "$stateParams",
            "AliadosCRService",
            "$uibModal",
            "ProyectosEmpresaCRService",
            "PropuestasEmpresaCRService",
            "DTOptionsBuilder",
            AliadoEditCtrl
        ]);

    function AliadoEditCtrl($scope, $state, $rootScope, $stateParams, AliadosCRService, $uibModal, ProyectosEmpresaCRService, PropuestasEmpresaCRService, DTOptionsBuilder) {

        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('frtp');

        var id = "";
        $scope.listaContactos = [];
        $scope.aliado_id = $stateParams.id;
        $scope.direccion = null;
        $scope.conveniosM = [];
        $scope.actividadesM = [];

        $scope.tipoOrganizacion = "";

        $scope.propuestasAsignadosEmpresa = [];
        $scope.proyectosAsignadosEmpresa = [];
        $scope.oportunidadNegocioEmpresa = [];

        $state.datePicker = getRangoDeFechaDefault(0, 0, 50)
        // desdel el 75 a 50 años de la fecha actual

        $rootScope.idConv = "";
        $scope.setId = function (idC) {
            $rootScope.idConv = idC;
        }



        $scope.cargarAliadosInfo = function () {

            AliadosCRService.getAliado($scope.aliado_id).then(
                function (result) {
                    var estado = "";
                    var municipio = "";
                    var localidad = "";
                    var colonia = "";
                    var calle = "";
                    var cp = "";

                    $scope.aliados = result.data;

                    for (var x = 0; x < $scope.aliados.listaContactosRegistrados.length; x++) {
                        $scope.listaContactos.push($scope.aliados.listaContactosRegistrados[x].contacto);
                    }

                    if ($scope.aliados.empresa.calle != null && $scope.aliados.empresa.calle != undefined) {
                        calle = $scope.aliados.empresa.calle;
                    }
                    if ($scope.aliados.empresa.colonia != null && $scope.aliados.empresa.colonia != undefined) {
                        colonia = ' ' + $scope.aliados.empresa.colonia;
                    }
                    if ($scope.aliados.empresa.localidad != null && $scope.aliados.empresa.localidad != undefined) {
                        localidad = ', ' + $scope.aliados.empresa.localidad;
                    }
                    if ($scope.aliados.empresa.municipios) {
                        if ($scope.aliados.empresa.municipios.nombreMunicipio != null && $scope.aliados.empresa.municipios.nombreMunicipio != undefined) {
                            municipio = ', ' + $scope.aliados.empresa.municipios.nombreMunicipio;
                        }
                    }
                    if ($scope.aliados.empresa.estados) {
                        if ($scope.aliados.empresa.estados.nombreEstado != null && $scope.aliados.empresa.estados.nombreEstado != undefined) {
                            estado = ', ' + $scope.aliados.empresa.estados.nombreEstado;
                        }
                    }

                    if ($scope.aliados.empresa.cp != null && $scope.aliados.empresa.cp != undefined) {
                        cp = ', C.P. ' + $scope.aliados.empresa.cp;
                    }

                    //$scope.tipoOrganizacion = $scope.aliados.empresa.tipoOrganizacion.nombre;
                    $scope.direccion = calle + colonia + localidad + municipio + estado + cp;
                    $scope.conveniosM = $scope.aliados.convenio;
                    $scope.actividadesM = $scope.aliados.actividadAdicional;
                    if ($scope.aliados.empresa == null || $scope.aliados.empresa == 0 || $scope.aliados.empresa == undefined) {

                    }
                    else {
                        id = $scope.aliados.empresa.empresaId;
                        consultarAlianzas(id);
                    }
                },
                function (err) {
                    toastr.error(err.data);
                });



        };


        $scope.nose = function () {

            $scope.saveAliado2();

        }

        $scope.eliminaContacto = function (posicion) {
            $scope.listaContactos.splice(posicion, 1);
            $scope.aliadoForm.$setDirty();
        }

        //Obtiene Vigencia
        $scope.getVigencia = function (fechaTermino) {
            var vigencia;
            $scope.fechaActual = new Date();
            var finalDateComparacion = new Date(fechaTermino);

            if ($scope.fechaActual > finalDateComparacion) {
                vigencia = "Inactiva";
            }
            else if ($scope.fechaActual < finalDateComparacion) {
                vigencia = "Activa";
            }
            return vigencia;
        }

        function consultarAlianzas(id) {
            $scope.propuestasAsignadosEmpresa = [];
            PropuestasEmpresaCRService.getPropuestasAsignadasEmpresa(id).then(
                function (result) {
                    $scope.propuestasAsignadosEmpresa = result.data;
                },
                function (err) {
                    toastr.error(err.data);
                });
            $scope.proyectosAsignadosEmpresa = [];
            ProyectosEmpresaCRService.getProyectosAsignadosEmpresa(id).then(
                function (result) {
                    $scope.proyectosAsignadosEmpresa = result.data;
                },
                function (err) {
                    toastr.error(err);
                });
            $scope.oportunidadNegocioEmpresa = [];
        }


        $scope.delete = function (convenio, $uibModalInstance) {
            AliadosCRService.deleteConvenio(convenio.convenioId).then(
                function (result) {
                    var idx = ($scope.conveniosM.indexOf(convenio));
                    $scope.conveniosM.splice(idx, 1);

                    toastr.success(result.data);
                    $uibModalInstance.dismiss('close');
                },
                function (err) {
                    toastr.error(err.data.message);
                })
        };

        $scope.deleteAct = function (actividad, $uibModalInstance) {
            AliadosCRService.deleteActividad(actividad.actividadAdicionalId).then(
                function (result) {
                    var idx = ($scope.actividadesM.indexOf(actividad));
                    $scope.actividadesM.splice(idx, 1);

                    toastr.success(result.data);
                    $uibModalInstance.dismiss('close');
                },
                function (err) {
                    toastr.error(err.data.message);
                })
        };

        $scope.preguntaEliminar = function (convenio) {


            $scope.descripcionRow = convenio.noConvenio;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        $scope.delete(convenio, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.preguntaEliminarAct = function (actividad) {
            $scope.descripcionRow = actividad.descripcion;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        $scope.deleteAct(actividad, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        //Buscar Contacto
        $scope.ContactoSeleccionada = {};
        $scope.vercontacto = false;
        $scope.openContacto = function () {
            $scope.vinculo = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/ContactosFilterGet.html',
                controller: 'ContactosFilterGetCtrl',
                resolve: {
                    institucion: function () {
                        $scope.vercontacto = false;
                        return $scope.vinculo;
                    }
                },
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                var duplicidad = $scope.verificaDuplicidadContacto(selectedItem);
                if (duplicidad) {
                    toastr.error("El contacto ya se encuentra registrado");
                    return false;
                } else {
                    $scope.listaContactos.push(selectedItem);
                    $scope.aliados.contacto.nombreCompleto = selectedItem.nombreCompleto;
                    //$scope.aliados.contactoId = selectedItem.contactoId;
                    $scope.aliados.nombre = selectedItem.nombreCompleto;
                    $scope.aliados.contacto.correo = selectedItem.correo;
                    $scope.ContactoSeleccionada = selectedItem;
                    $scope.aliadoForm.$setDirty();
                }
            });
        }

        //verificamos que el contacto a registrar no exista ya en la lista
        $scope.verificaDuplicidadContacto = function (contacto) {
            for (var c = 0; c < $scope.listaContactos.length; c++) {
                if ($scope.listaContactos[c].nombreCompleto == contacto.nombreCompleto) {
                    return true;
                }
            }

        }

        //Actualiza los datos del aliado
        $scope.saveAliado = function () {

            if ($scope.aliadoForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } if ($scope.listaContactos.length==0) {
                toastr.error("Agregue un contacto por lo menos");
                return false;
            }
            else {
                $scope.desactivar = true;
                $scope.aliados.listaContactos = $scope.listaContactos;
                AliadosCRService.update($scope.aliados)
                    .then(
                    function (result) {
                        $scope.desactivar = false;
                        toastr.success(result.data);
                        $rootScope.globalRegresar();
                        // $state.go("aliadosGet");
                    },
                    function (err) {
                        toastr.error(err.data);
                        $scope.desactivar = false;
                    });
            }
        };

        $scope.saveAliado2 = function () {

            if ($scope.aliados.descripcion != "") {
                AliadosCRService.update($scope.aliados).then();
            }

        };

        $scope.cargarAliadosInfo();

    }
})();