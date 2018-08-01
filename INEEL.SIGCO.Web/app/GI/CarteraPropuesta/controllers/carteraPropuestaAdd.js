(function () {
    'use strict';
    angular
        .module("ineelGI")
        .controller('carteraPropuestaAdd', ['$scope', 'AuthService', 'MenuService',
            'comunCountService', 'ngFabForm', 'carteraPropuestaService',
            '$state', '$uibModal', 'adjuntarArchivo',
            'buscarPropuestaFactory', 'buscarIdeaFactory', 'tipoAccesoService', 'planNegocioService', carteraPropuestaAdd]);

    function carteraPropuestaAdd($scope, AuthService, MenuService,
        comunCountService, ngFabForm, carteraPropuestaService,
        $state, $uibModal, adjuntarArchivo,
        buscarPropuestaFactory, buscarIdeaFactory, tipoAccesoService, planNegocioService) {
        $scope.authentication = AuthService.authentication;
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        $scope.registroPropuesta = {};
        $scope.propuesta = false;
        $scope.ideaSelect = false;
        $scope.itemPropuesta = {};

        $scope.registroPlan = {};
        $scope.registroPlan.planNegocioEvolArchivos = [];
        $scope.unidades = [];
        $scope.autoresPNE = [];


        $scope.buscarPropuesta = function () {
            buscarPropuestaFactory.buscarPropuesta().then(
                function (result) {
                    if (result.unidadOrganizacionalId == null) {
                        toastr.error("No se ecuentra la unidad organizacional asociada a esta propuesta", "Esta propuesta no se puede seleccionar");
                        return false;
                    }

                    $scope.propuesta = true;
                    $scope.itemPropuesta = result;
                    $scope.registroPropuesta.nombreTecnico = $scope.itemPropuesta.titulo;
                    $scope.registroPropuesta.claveProponentePrincipal = $scope.itemPropuesta.claveEmpPropuesta;
                    $scope.registroPropuesta.empresaPromotorNombre = $scope.itemPropuesta.empresa;
                    $scope.registroPropuesta.empresaPromotorClave = $scope.itemPropuesta.empresaId;
                    $scope.registroPropuesta.unidadOrganizacionalId = $scope.itemPropuesta.unidadOrganizacionalId;
                    carteraPropuestaService.getUnidadOrganizacional($scope.registroPropuesta.unidadOrganizacionalId).then(
                        function (result) {

                            $scope.registroPropuesta.nombreUnidadOrganizacional = result.data.nombreUnidad;
                        }, function (error) { console.log(error); });

                    $scope.registroPropuesta.propuestaId = $scope.itemPropuesta.propuestaId;
                    $scope.registroPropuesta.clavePersona = $scope.ClavePersonaLogin;
                    $scope.registroPropuesta.estadoFlujoId = 1;
                    $scope.registroPropuesta.nombrePersona = $scope.itemPropuesta.nombrePersona;
                    $scope.ValidForm1.$setDirty();
                },
                function (error) { console.log(error); }
            );
        }


        $scope.openUser = function () {
            // $scope.filtraPersonalActivo=true;  
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (item) {

                //Verifica que no exista el autor dentro de la nueva lista
                if ($scope.autoresPNE.length > 0) {
                    for (var c = 0; c < $scope.autoresPNE.length; c++) {
                        if ($scope.autoresPNE[c].clavePersona == item.clavePersona) {
                            toastr.error("No se permiten duplicados");
                            return false;
                        }
                    }
                } else {
                    $scope.autoresPNE.push(item);
                }

            });
        }

        $scope.getFileDetails = function (adjunto) {
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'GI' };
                    $scope.registroPropuesta.Adjunto = Adjunto;
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }

        tipoAccesoService.get().then(
            function (result) {
                $scope.tiposAccesos = result.data;
            }, function (error) {
                toastr.error(error);
            });

        carteraPropuestaService.getAllSegmentoMercado().then(
            function (result) {
                $scope.SegmentosMercado = result.data;
            }, function (error) {
                toastr.error(error);
            });


        $scope.itemIdea = {};
        $scope.buscarIdea = function () {
            buscarIdeaFactory.buscarIdea().then(
                function (result) {

                    $scope.itemIdea = result;
                    $scope.ideaSelect = true;
                    $scope.registroPropuesta.ideaInnovadoraId = $scope.itemIdea.ideaInnovadoraId;
                },
                function (error) { console.log(error); }
            );
        };


        $scope.propuestainternafunction = function () {
            if ($scope.registroPropuesta.propuestaInterna == 'false') {
                $scope.registroPropuesta.ideaInnovadoraId = null;
                $scope.itemIdea = null;
                $scope.ideaSelect = false;
            }
            if ($scope.registroPropuesta.propuestaInterna == 'true') {
                $scope.expression = 'col-md-6 col-sm-6 col-xs-6';
                $scope.requeridoPNE = true;
            } else {
                $scope.expression = 'col-md-12 col-sm-12 col-xs-12';
                $scope.requeridoPNE = false;
            }
        };

        $scope.agregar = function () {

            if ($scope.propuesta == false) {
                toastr.error("Seleccione una propuesta");
                return false;
            }
            //validaciones del pne
            // if ($scope.registroPropuesta.propuestaInterna == "true") {

                // $scope.registroPlan.estadoFlujoId = 1;
                // $scope.registroPlan.planNegocioEvolAutores = [];
                // for (var i = 0; i < $scope.autoresPNE.length; i++) {
                //     var aux = { 'clavePersona': $scope.autoresPNE[i].clavePersona, 'nombre': $scope.autoresPNE[i].nombreCompleto };
                //     $scope.registroPlan.planNegocioEvolAutores.push(aux);
                // }
                // if ($scope.registroPlan.planNegocioEvolAutores == undefined || $scope.registroPlan.planNegocioEvolAutores == null || $scope.registroPlan.planNegocioEvolAutores.length == 0) {
                //     toastr.error("Agregue al menos un autor del plan de negocio evolutivo");
                //     return false;
                // }
                // if ($scope.registroPlan.planNegocioEvolGerencias == undefined || $scope.registroPlan.planNegocioEvolGerencias == null || $scope.registroPlan.planNegocioEvolGerencias == 0) {
                //     toastr.error("Agregue al menos una unidad organizacional del plan de negocio evolutivo");
                //     return false;
                // }
                // if ($scope.registroPlan.planNegocioEvolArchivos == undefined || $scope.registroPlan.planNegocioEvolArchivos == null || $scope.registroPlan.planNegocioEvolArchivos == 0) {
                //     toastr.error("Adjunte al menos una evidencia del plan de negocio evolutivo");
                //     return false;
                // }

            // }
            ///////////////////////
            $scope.registroPlan.clavePersona = $scope.ClavePersonaLogin;
            carteraPropuestaService.add($scope.registroPropuesta).then(
                function (result) {
                    if ($scope.registroPropuesta.propuestaInterna == "true") {
                        $scope.registroPlan.propuestaClave = result.data;
                        $scope.registroPlan.estadoFlujoId = 1;
                        $scope.registroPlan.tipoAcceso = 2;
                        if ($scope.autoresPNE.length > 0) {
                            $scope.registroPlan.planNegocioEvolAutores = [];
                            for (var i = 0; i < $scope.autoresPNE.length; i++) {
                                var aux = { 'clavePersona': $scope.autoresPNE[i].clavePersona, 'nombre': $scope.autoresPNE[i].nombreCompleto };
                                $scope.registroPlan.planNegocioEvolAutores.push(aux);
                            }
                        }

                        planNegocioService.add($scope.registroPlan).then(
                            function (result) {
                                toastr.success(result.data);
                                $state.go("carteraPropuestas");
                            },
                            function (err) {
                                console.error(err);
                                $scope.desabilitar = false;
                            });
                    } else {
                        toastr.success("Registro creado exitosamente");
                        $state.go("carteraPropuestas");
                    }
                },
                function (error) { console.log(error); }
            );
        };

        ////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////Código del plan de negocio evolutivo//////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////Buscar Proyecto
        $scope.verproyecto = false;
        $scope.openProyecto = function () {
            $scope.desabilitar = true; $scope.proyectoSelect = {}; var modalInstance = $uibModal.open({
                size: 'lg', templateUrl: 'app/vistasGenericas/buscarProyecto.html', controller: 'ProyectosFilterGetCtrl',
                resolve: { proyectoSelect: function () { $scope.verproyecto = false; return $scope.proyectoSelect; } }, scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                toastr.clear();
                comunService.PersonalProyecto_GetByClave($scope.registroPlan.clavePersona, selectedItem.proyectoId).then(
                    function (result) {
                        console.log(result.data); if (result.data != null && result.data.length > 0) {
                            console.log(result.data.length);
                            toastr.warning(selectedItem.nombre, "Ya se encuentra como participante del proyecto");
                        } else {
                            $scope.elemento = selectedItem;
                            $scope.registroPlan.proyectoNombre = selectedItem.nombre;
                            $scope.registroPlan.proyectoId = selectedItem.proyectoId;
                        }
                    }, function (err) { toastr.error(err); console.error(err); return; });
            }); $scope.desabilitar = false;
        }

        $scope.eliminar = function () {
            $scope.registroPlan.proyectoNombre = null;
            $scope.registroPlan.proyectoId = null;
        }


        //
        $scope.$watch("propuesta", function (newValue, oldValue) {

            try {
                $scope.registroPlan.propuestaClave = $scope.propuesta.propuestaClave;
            } catch (err) { }
        });

        $scope.quitarPropuesta = function () {
            $scope.registroPlan.propuestaClave = null;
            $scope.propuesta = null;
        }

        $scope.eliminararea = function (registro) {
            var idx = ($scope.registroPlan.planNegocioEvolGerencias.indexOf(registro));
            $scope.registroPlan.planNegocioEvolGerencias.splice(idx, 1);
        };

        $scope.eliminaradjunto = function (registro) {
            var idx = ($scope.registroPlan.planNegocioEvolArchivos.indexOf(registro));
            $scope.registroPlan.planNegocioEvolArchivos.splice(idx, 1);
        };

        $scope.eliminarautor = function (registro) {
            var idx = ($scope.autoresPNE.indexOf(registro));
            $scope.autoresPNE.splice(idx, 1);
        };

        //adjunto
        $scope.getFileDetailsD = function (adjunto) {

            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'GI' };
                    var aux = {
                        'adjunto': Adjunto
                    };

                    if ($scope.registroPlan.planNegocioEvolArchivos.length > 0) {
                        for (var i = 0; i < $scope.registroPlan.planNegocioEvolArchivos.length; i++) {
                            if (aux.adjunto.nombre == $scope.registroPlan.planNegocioEvolArchivos[i].adjunto.nombre) {
                                toastr.warning("El archivo ya existe");
                                //$(":file").filestyle('clear');
                                $("#filesGralD").filestyle('clear');
                                return false;
                            }
                        }
                    }

                    $scope.registroPlan.planNegocioEvolArchivos.push(aux);
                    //$(":file").filestyle('clear');
                    $("#filesGralD").filestyle('clear');
                },
                function (error) {
                    //$(":file").filestyle('clear');
                    $("#filesGralD").filestyle('clear');
                }
            );
        }

        //obtener tipo de acceso
        tipoAccesoService.get().then(
            function (result) {
                $scope.tiposAccesos = result.data;
                $scope.registroPlan.tipoAcceso = 2;
                // console.log(result.data);
            }, function (error) {
                toastr.error(error);
            });
    }
}());