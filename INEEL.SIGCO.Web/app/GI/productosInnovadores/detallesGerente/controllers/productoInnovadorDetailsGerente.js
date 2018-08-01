(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("productoInnovadorDetailsGerente", ['AuthService', '$scope', '$rootScope', 'solicitudesGIService',
            'productoInnovadorService', '$uibModal', '$timeout', 'correoNotificacionService', 'comunService',
            'bitacoraSolicitudService', 'MenuService', 'adjuntarArchivo', 'carteraPropuestaService', 'productoHistorialFI',
            '$state', productoInnovadorDetailsGerente]);

    function productoInnovadorDetailsGerente(AuthService, $scope, $rootScope, solicitudesGIService,
        productoInnovadorService, $uibModal, $timeout, correoNotificacionService, comunService,
        bitacoraSolicitudService, MenuService, adjuntarArchivo, carteraPropuestaService,productoHistorialFI,
        $state) {
        $scope.rolId = MenuService.getRolId();
        window.scrollTo(0, 0);
        $scope.accion = '';
        $scope.proponentes = [];
        $scope.auxColabora = [];
        $scope.registro = {};
        $scope.pendientesEliminarSave = [];
        var id = $rootScope.getGlobalID();
        $scope.soliId = $rootScope.getGlobalID2();
        $scope.authentication = AuthService.authentication;
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        productoInnovadorService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                productoInnovadorService.Persona(result.data.clavePersona).then(
                   function (result) {
                       $scope.registro.nombrePersona = result.data.nombreCompleto;
                   });
                if ($scope.registro.proyecto != null) { $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre; } 
                //Obtener proponentes
                for (var i = 0; i < $scope.registro.productoAutores.length; i++) {
                    var a = {
                        'clavePersona': $scope.registro.productoAutores[i].clavePersona,
                        'nombre': $scope.registro.productoAutores[i].nombre,
                        'contribucion': $scope.registro.productoAutores[i].contribucionAutor.contribucion,
                        'contribucionId': $scope.registro.productoAutores[i].contribucionId,
                        'productoId': $scope.registro.productoAutores[i].productoId,
                        'id': $scope.registro.productoAutores[i].id,
                    }
                    $scope.proponentes.push(a);
                }
                //$scope.proponentes = $scope.registro.productoAutores;
                //obtener contribucion
                productoInnovadorService.getAllContribucion().then(
                    function (result) {
                        
                        $scope.contribucion = result.data;
                        for (var p = 0; p < $scope.proponentes.length; p++) {
                            if ($scope.proponentes[p].contribucionId == 0) {
                                for (var b = 0; b < $scope.contribucion.length; b++) {
                                    if ($scope.contribucion[b].id == 0) {
                                        $scope.r = $scope.contribucion[b].id;
                                        $scope.auxColabora.push($scope.contribucion[b]);
                                        $scope.contribucion.splice(b, 1);
                                    }
                                }


                            }
                        }
                    },
                    function (err) {
                        toastr.error(err);
                    });
            },
            function (error) {
                toastr.error(error);
            });

        //Buscar proponente
        //$scope.proponentes = [];
        $scope.proponente = {};
        $scope.auxColabora = [];
        $scope.PersonaSeleccionada = {};
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
                $scope.PersonaSeleccionada = selectedItem;
                $scope.proponente.clavePersona = $scope.PersonaSeleccionada.clavePersona;
                $scope.proponente.nombrePersona = $scope.PersonaSeleccionada.nombreCompleto;
                $scope.userAdd = true;
                $scope.ValidForm.$setDirty();
            });
        }


        //actualizar
        $scope.submitForm = function (opt) {
            if (opt == "actualizar") {
                $scope.actualizar();
            } else if (opt == "aprobar") {
                $scope.validar();
            } else { $scope.rechazar(); };
        }

        $scope.actualizar = function () {

            $scope.registro.productoAutores = [];
            $scope.registro.productoAutores = $scope.proponentes;
            for (var a = 0; a < $scope.pendientesEliminarSave.length; a++) {
                $scope.registro.productoAutores.push($scope.pendientesEliminarSave[a]);
            }
            if ($scope.registro.productoAutores == undefined || $scope.registro.productoAutores == null || $scope.registro.productoAutores == 0) {
                toastr.error("Agregue al menos un autor");
                return false;
            }

            productoInnovadorService.update($scope.registro).then(
                function (result) {
                    
                    var Bitacora = {
                        "SolicitudId": $scope.soliId,
                        "FechaMovimiento": new Date('dd/MM/yyyy'),
                        "ClavePersona": $scope.registro.clavePersona,
                        "Descripcion": "Se actualizo la solicitud",
                        "EstadoFlujoId": 8,
                        "idRol": $scope.rolId
                    }
                    bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                    toastr.success("Registro Actualizado");
                    $state.reload();
                },
                function (err) {

                    console.error(err);
                    toastr.error("Error al actualizar");
                    $state.reload();
                });
        }
        //var recargar=function(){ $state.reload();};

        //Agregar proponente
        $scope.add_proponente = function () {
            if ($scope.proponente.contribucion.id != undefined) {
                var Registro = {
                    "clavePersona": $scope.proponente.clavePersona,
                    "contribucionId": $scope.proponente.contribucion.id,
                    "contribucion": $scope.proponente.contribucion.contribucion,
                    "nombre": $scope.proponente.nombrePersona
                }
                $scope.userAdd = false;
                for (var i = 0; i < $scope.proponentes.length; i++) {
                    if ($scope.proponentes[i].clavePersona == Registro.clavePersona) {
                        toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de proponentes!");
                        $scope.PersonaSeleccionada.clavePersona = null;
                        $scope.proponente = {};
                        return false;
                    }
                }
                
                $scope.PersonaSeleccionada = null;
                $scope.proponentes.push(Registro);
                for (var i = $scope.contribucion.length - 1; i >= 0; i--) {
                    
                    if (($scope.contribucion[i].id == $scope.proponente.contribucion.id) && ($scope.proponente.contribucion.id == 0)) {
                        $scope.auxColabora.push($scope.contribucion[i]);
                        $scope.contribucion.splice(i, 1);
                    }
                }
                {
                    $scope.proponente.clavePersona = undefined
                    $scope.proponente.contribucion = undefined
                    $scope.proponente.nombrePersona = undefined
                }
            } else {
                toastr.error("Agregar contribución al proponente");
            }

        }

        //Eliminar proponente
        $scope.eliminarProponente = function (registro) {
            
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucionId) {
                    $scope.contribucion.push($scope.auxColabora[i]);
                }
            }
            
            if (registro.productoId != null || registro.productoId != undefined) {
                registro.nombre = "eliminar";
                $scope.pendientesEliminarSave.push(registro);
            }
            var idx = ($scope.proponentes.indexOf(registro));
            $scope.proponentes.splice(idx, 1);
            $scope.auxColabora.splice(idx, 1);
            $scope.ValidForm.$setDirty();
        };

        ///segmento
        carteraPropuestaService.getAllSegmentoMercado().then(
            function (result) {
                $scope.SegmentosMercado = result.data;
            }, function (error) {
                toastr.error(error);
            });
        ///factores
        productoInnovadorService.getAllFactoresInnovacion().then(
            function (result) {
                $scope.Factores = result.data;
            }, function (error) {
                toastr.error(error);
            });

        $scope.eliminar = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
            $scope.registro.unidadOrganizacionalId = null;
            $scope.ValidForm.$setDirty();
        }

        $scope.openProyecto = function () {
            $scope.desabilitar = true; $scope.proyectoSelect = {}; var modalInstance = $uibModal.open({
                size: 'lg', templateUrl: 'app/vistasGenericas/buscarProyecto.html', controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                resolve: { proyectoSelect: function () { $scope.verproyecto = false; return $scope.proyectoSelect; } }, scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                toastr.clear();
                $scope.elemento = selectedItem;
                $scope.registro.proyectoNombre = selectedItem.nombre;
                $scope.registro.proyectoId = selectedItem.proyectoId;
                $scope.registro.unidadOrganizacionalId = selectedItem.claveUnidad;
                $scope.registro.proyecto.numjefeProyecto = selectedItem.numjefeProyectos;
                // comunService.PersonalProyecto_GetByClave($scope.registro.clavePersona, selectedItem.proyectoId).then(
                //     function (result) {
                //         console.log(result.data); if (result.data != null && result.data.length > 0) {
                //             console.log(result.data.length);
                //             toastr.warning(selectedItem.nombre, "Ya se encuentra como participante del proyecto");
                //         } else {
                //             $scope.elemento = selectedItem;
                //             $scope.registro.proyectoNombre = selectedItem.nombre;
                //             $scope.registro.proyectoId = selectedItem.proyectoId;
                //             $scope.registro.unidadOrganizacionalId = selectedItem.claveUnidad;
                //             $scope.registro.proyecto.numjefeProyecto = selectedItem.numjefeProyectos;
                //         }
                //     }, function (err) { toastr.error(err); console.error(err); return; });
            }); 
            $scope.desabilitar = false;
            $scope.ValidForm.$setDirty();
        }


        //validar
        $scope.validar = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            if ($scope.proponentes.length == 0) {
                toastr.error("Agregue un proponente!");
                return false;
            }
            var principal = 0;
            for (var p = 0; p < $scope.proponentes.length; p++) {
                if ($scope.proponentes[p].contribucionId == 0) {
                    principal++;
                }
            }
            if (principal == 0) {
                toastr.error("Agregue el proponente principal!");
                return false;
            }
            
            ///////////////////////////////////////////////
            $scope.registro.estadoFlujoId = 3;

            $scope.registro.productoAutores = [];
            $scope.registro.productoAutores = $scope.proponentes;
            for (var a = 0; a < $scope.pendientesEliminarSave.length; a++) {
                $scope.registro.productoAutores.push($scope.pendientesEliminarSave[a]);
            }
            //for (var i = 0; i < $scope.pendientesEliminarSave.length; i++) {
            //    $scope.proponentes.push($scope.pendientesEliminarSave[i]);
            //}
            $scope.registro.Movimiento = "El Gerente aprueba el producto y avala el factor de innovación " + $scope.registro.factorInnovacion.descripcion;
            productoInnovadorService.update($scope.registro).then(
            function (result) {
                
                var Solicitud = {
                    "ClavePersona": $scope.registro.clavePersona,
                    "TipoInformacionId": 30,
                    "InformacionId": $scope.registro.productoId,
                    "FechaSolicitud": new Date(),
                    "EstadoFlujoId": 10,
                    "idRol": 4,
                    "ClaveUnidadAut": "",
                    "tipoPersonal_Id": 'Sin Definir'                    
                }
                solicitudesGIService.AddSolicitud(Solicitud).then(
                    function (result) {

                        var comentario= {
                            "ProductoId": $scope.registro.productoId,
                            "SolicitudId":result.data,
                            "ComentarioGerencia": $scope.justificacion,
                            "EvaluacionGerencia": $scope.registro.factorInnovacion.descripcion,
                            "etapaEvaluacion" : 'Gerencia'
                        };
                        productoHistorialFI.AddComentario(comentario).then(function (res){},
                        function(err){
                            toastr.error("Error al guardar la evaluación de la gerencia");
                            console.log(err);
                        });

                        var Bitacora = {
                            "SolicitudId": result.data,
                            "FechaMovimiento": new Date('dd/MM/yyyy'),
                            "ClavePersona": $scope.ClavePersonaLogin,
                            "Descripcion": "Se aprobó la solicitud",
                            "EstadoFlujoId": 8,
                            "idRol": $scope.rolId,
                            "justificacion": $scope.justificacion
                        }
                        bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora).then(
                            function(result){},
                            function (error) { console.log(error);}
                        );
                        var Mail = {
                            "Modulo": "Gestión de la Innovación",
                            "Empleado": $scope.registro.nombrePersona,
                            "Seccion": "Producto Innovador",
                            "TipoCorreo": "AprobarRechazarGerenteGI",
                            "ClavePersona": $scope.registro.clavePersona,
                            "Descripcion1": $scope.registro.proyecto.numjefeProyecto,
                            "Descripcion2": $scope.justificacion,
                            "Estado": "Aprobada",
                            "NombreProyecto": $scope.registro.proyectoNombre,
                            "OC": $scope.registro.nombreTecnico

                        }
                        correoNotificacionService.mailNotificacion(Mail);
                        toastr.success("Solicitud aprobada!");
                        $state.go("solicitudesGI");
                    })

            },
            function (err) {
                console.error(err);
                toastr.success("Error al aprobar");
                $state.reload();
            });

        }


        //validar
        $scope.rechazar = function () {

            //if ($scope.proponentes.length == 0) {
            //    toastr.error("Agregue un proponente!");
            //    return false;
            //}
            var principal = 0;
            for (var p = 0; p < $scope.proponentes.length; p++) {
                if ($scope.proponentes[p].contribucionId == 0) {
                    principal++;
                }
            }
            //if (principal == 0) {
            //    toastr.error("Agregue el proponente principal!");
            //    return false;
            //}
            ///////////////////////////////////////////////
            $scope.registro.estadoFlujoId = 1;

            $scope.registro.productoAutores = [];
            $scope.registro.productoAutores = $scope.proponentes;
            for (var a = 0; a < $scope.pendientesEliminarSave.length; a++) {
                $scope.registro.productoAutores.push($scope.pendientesEliminarSave[a]);
            }
            //for (var i = 0; i < $scope.pendientesEliminarSave.length; i++) {
            //    $scope.proponentes.push($scope.pendientesEliminarSave[i]);
            //}
            $scope.registro.Movimiento= "El Gerente rechaza (regresa) la solicitud";
            productoInnovadorService.update($scope.registro).then(
            function (result) {
                
                var Solicitud = {
                    "ClavePersona": $scope.registro.clavePersona,
                    "TipoInformacionId": 30,
                    "InformacionId": $scope.registro.productoId,
                    "FechaSolicitud": new Date(),
                    "EstadoFlujoId": 15,
                    "idRol": "",
                    "ClaveUnidadAut": "",
                    "tipoPersonal_Id": 'Sin Definir'                    
                }
                solicitudesGIService.AddSolicitud(Solicitud).then(
                    function (result) {
                        var Bitacora = {
                            "SolicitudId": result.data,
                            "FechaMovimiento": new Date('dd/MM/yyyy'),
                            "ClavePersona": $scope.ClavePersonaLogin,
                            "Descripcion": "Se rechazó la solicitud",
                            "EstadoFlujoId": 8,
                            "idRol": $scope.rolId,
                            "justificacion": $scope.justificacion
                        }
                        bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                        var Mail = {
                            "Modulo": "Gestión de la Innovación",
                            "Empleado": $scope.registro.nombrePersona,
                            "Seccion": "Producto Innovador",
                            "TipoCorreo": "AprobarRechazarGerenteGI",
                            "ClavePersona": $scope.registro.clavePersona,
                            "Descripcion1": $scope.registro.proyecto.numjefeProyecto,
                            "Descripcion2": $scope.justificacion,
                            "Estado": "Rechazada",
                            "NombreProyecto": $scope.registro.proyectoNombre,
                            "OC": $scope.registro.nombreTecnico
                        }
                        correoNotificacionService.mailNotificacion(Mail);
                        toastr.success("Solicitud rechazada!");
                        $state.go("solicitudesGI");
                    })

            },
            function (err) {
                console.error(err);
                $state.reload();
            });

        }

    }
})();