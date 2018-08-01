(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("planNegocioEdit", ['AuthService', '$scope', '$rootScope', 'solicitudesGIService',
            'planNegocioService', '$uibModal', '$timeout', 'correoNotificacionService', 'comunService',
            'bitacoraSolicitudService', 'MenuService', 'adjuntarArchivo', 'tipoAccesoService', 'buscarPropuestaFactory',
            '$state', planNegocioEdit]);

    function planNegocioEdit(AuthService, $scope, $rootScope, solicitudesGIService,
        planNegocioService, $uibModal, $timeout, correoNotificacionService, comunService,
        bitacoraSolicitudService, MenuService, adjuntarArchivo, tipoAccesoService, buscarPropuestaFactory,
        $state) {
        $scope.rolId = MenuService.getRolId();
        window.scrollTo(0, 0);
        $scope.accion = '';
        $scope.autoresPNE = [];
        $scope.planNegocioEvolArchivosNew = [];
        $scope.autoresPNENew = [];
        $scope.gerenciasAux = [];
        $scope.ArchivosAux = [];
        $scope.registro = {};
        $scope.registro.proyectoNombre = "";
        $scope.propuesta = {};
        var id = $rootScope.getGlobalID();
        $scope.authentication = AuthService.authentication;
        $scope.nombreLogin = AuthService.authentication.nombreCompleto;

        $scope.verproyecto = false;
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
            }); $scope.desabilitar = false;
        }

        $scope.eliminar = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }


        planNegocioService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                if ($scope.registro.proyecto != null) { $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre; } 
                if ($scope.registro.propuesta != null) {
                    $scope.propuesta = $scope.registro.propuesta;
                    $scope.propuesta.nombre = $scope.propuesta.nombreTecnico;
                    $scope.propuesta.propuestaClave = $scope.registro.propuestaClave;
                }

                for (var i = 0; i < $scope.registro.planNegocioEvolAutores.length; i++) {
                    var autAux = {
                        'clavePersona': $scope.registro.planNegocioEvolAutores[i].clavePersona,
                        'nombreCompleto': $scope.registro.planNegocioEvolAutores[i].nombre,
                        'planNegocioEvolutivoId': $scope.registro.planNegocioEvolAutores[i].planNegocioEvolutivoId,
                        'id': $scope.registro.planNegocioEvolAutores[i].id
                    };
                    $scope.autoresPNE.push(autAux);
                }
                //$scope.autoresPNE. = $scope.registro.planNegocioEvolAutores;
            },
            function (error) {
                toastr.error(error);
            });

        //obtener tipo de acceso
        tipoAccesoService.get().then(
            function (result) {
                $scope.tiposAccesos = result.data;
            }, function (error) {
                toastr.error(error);
            });

        $scope.verproyecto = false;
        
        $scope.openUser = function () {
        // $scope.filtraPersonalActivo=true;  
           var modalInstance = $uibModal.open({  
               size: 'lg',
               templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
               controller: 'PersonasFilterGetCtrl',
               scope: $scope
           });
           modalInstance.result.then(function (item) {

            //Verifica que no exista el autor dentro de la vieja lista
            if($scope.autoresPNE.length>0){
                for(var c=0; c<$scope.autoresPNE.length; c++){
                    if($scope.autoresPNE[c].clavePersona==item.clavePersona){
                        toastr.error("No se permiten duplicados");
                        return false;
                    }
                }
            }  

            //Verifica que no exista el autor dentro de la nueva lista
            if($scope.autoresPNENew.length>0){
                for (var index = 0; index < $scope.autoresPNENew.length; index++) {
                    if($scope.autoresPNENew[index].clavePersona==item.clavePersona){
                        toastr.error("No se permiten duplicados");
                        return false;
                    }
                    
                }
                
            }else{
                $scope.autoresPNENew.push(item);
                $scope.ValidForm.$setDirty();
            }
            
           });
        }

        $scope.eliminar = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }


        $scope.$watch("propuesta", function (newValue, oldValue) {
            
            try {
                $scope.registro.propuestaClave = $scope.propuesta.propuestaClave;
            } catch (err) { }
        });
        $scope.quitarPropuesta = function () {
            $scope.registro.propuestaClave = null;
            $scope.propuesta = null;
        }

        $scope.eliminararea = function (registro) {
            var idx = ($scope.registro.planNegocioEvolGerencias.indexOf(registro));
            registro.claveUnidad = "eliminar";
            $scope.gerenciasAux.push(registro)
            $scope.registro.planNegocioEvolGerencias.splice(idx, 1);
        };

        $scope.eliminaradjunto = function (registro) {
            var idx = ($scope.planNegocioEvolArchivosNew.indexOf(registro));
            registro.adjunto.nombre = "eliminar";
            $scope.ArchivosAux.push(registro)
            $scope.planNegocioEvolArchivosNew.splice(idx, 1);
        };

        $scope.eliminarautor = function (registro) {
            
            var idx = ($scope.autoresPNENew.indexOf(registro));
            for (var i = 0; i < $scope.registro.planNegocioEvolAutores.length; i++) {
                if ($scope.registro.planNegocioEvolAutores[i].id == registro.id) {
                    $scope.registro.planNegocioEvolAutores[i].nombre = "eliminar";
                }
            }

            $scope.autoresPNENew.splice(idx, 1);
        };

        //adjunto
        $scope.getFileDetails = function (adjunto) {
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'GI' };
                    var aux = {
                        'adjunto': Adjunto
                    };
                    if ($scope.planNegocioEvolArchivosNew.length > 0) {
                        for (var i = 0; i < $scope.planNegocioEvolArchivosNew.length; i++) {
                            if (aux.adjunto.nombre == $scope.planNegocioEvolArchivosNew[i].adjunto.nombre) {
                                toastr.warning("El archivo ya existe");
                                $(":file").filestyle('clear');
                                return false;
                            }
                        }
                    }
                    $scope.planNegocioEvolArchivosNew.push(aux);
                    $scope.ValidForm.$setDirty();
                    $(":file").filestyle('clear');
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }


        $scope.actualizar = function () {
            
            if ($scope.propuesta != null) {
                $scope.registro.propuestaClave = $scope.propuesta.propuestaClave;
            } else {
                $scope.registro.propuestaClave = null;
            }

            if (($scope.registro.propuestaClave == undefined || $scope.registro.propuestaClave == null) && ($scope.registro.proyectoId == undefined || $scope.registro.proyectoId == null)) {
                toastr.error("Seleccione un proyecto y/o una propuesta");
                return false;
            }
            
            if ($scope.registro.planNegocioEvolGerencias == undefined || $scope.registro.planNegocioEvolGerencias == null || $scope.registro.planNegocioEvolGerencias == 0) {
                toastr.error("Agregue al menos una gerencia");
                return false;
            }
            
            for (var i = 0; i < $scope.gerenciasAux.length; i++) {
                $scope.registro.planNegocioEvolGerencias.push($scope.gerenciasAux[i]);
            }
            
            
            for (var i = 0; i < $scope.planNegocioEvolArchivosNew.length; i++) {
                
                var adjunto = {
                    id: 0,
                    adjuntoId: 0,
                    planNegocioEvolutivoId: id,
                    adjunto: {
                        adjuntoId: 0,
                        moduloId: "GI",
                        nombre: $scope.planNegocioEvolArchivosNew[i].adjunto.nombre,
                        RutaCompleta: $scope.planNegocioEvolArchivosNew[i].adjunto.RutaCompleta
                    }

                };

                $scope.registro.planNegocioEvolArchivos.push(adjunto);
            }
            
            for (var i = 0; i < $scope.autoresPNENew.length; i++) {
                var autor = {
                    id: 0,
                    clavePersona: $scope.autoresPNENew[i].clavePersona,
                    nombre: $scope.autoresPNENew[i].nombreCompleto,
                    planNegocioEvolutivoId: id
                };
                $scope.registro.planNegocioEvolAutores.push(autor);
            }

            $scope.registro.estadoFlujoId = 2;
            $scope.registro
            planNegocioService.update($scope.registro).then(
                function (result) { 
                    toastr.success(result.data);
                },
                function (err) {
                    console.error(err);
                    $scope.desabilitar = false;
                });
        };


        $scope.validar = function () {
            
            if ($scope.propuesta != null) {
                $scope.registro.propuestaClave = $scope.propuesta.propuestaClave;
            } else {
                $scope.registro.propuestaClave = null;
            }

            if (($scope.registro.propuestaClave == undefined || $scope.registro.propuestaClave == null) && ($scope.registro.proyectoId == undefined || $scope.registro.proyectoId == null)) {
                toastr.error("Seleccione un proyecto y/o una propuesta");
                return false;
            }
            
            if ($scope.registro.planNegocioEvolGerencias == undefined || $scope.registro.planNegocioEvolGerencias == null || $scope.registro.planNegocioEvolGerencias == 0) {
                toastr.error("Agregue al menos una gerencia");
                return false;
            }
            
            for (var i = 0; i < $scope.gerenciasAux.length; i++) {
                $scope.registro.planNegocioEvolGerencias.push($scope.gerenciasAux[i]);
            }
            
            
            for (var i = 0; i < $scope.planNegocioEvolArchivosNew.length; i++) {
                
                var adjunto = {
                    id: 0,
                    adjuntoId: 0,
                    planNegocioEvolutivoId: id,
                    adjunto: {
                        adjuntoId: 0,
                        moduloId: "GI",
                        nombre: $scope.planNegocioEvolArchivosNew[i].adjunto.nombre,
                        RutaCompleta: $scope.planNegocioEvolArchivosNew[i].adjunto.RutaCompleta
                    }

                };

                $scope.registro.planNegocioEvolArchivos.push(adjunto);
            }
            
            for (var i = 0; i < $scope.autoresPNENew.length; i++) {
                var autor = {
                    id: 0,
                    clavePersona: $scope.autoresPNENew[i].clavePersona,
                    nombre: $scope.autoresPNENew[i].nombreCompleto,
                    planNegocioEvolutivoId: id
                };
                $scope.registro.planNegocioEvolAutores.push(autor);
            }

            $scope.registro.estadoFlujoId = 2;
            $scope.registro
            planNegocioService.update($scope.registro).then(
                function (result) {
                    
                    var Solicitud = {
                        "ClavePersona": $scope.registro.clavePersona,
                        "TipoInformacionId": 31,
                        "InformacionId": $scope.registro.planNegocioEvolutivoId,
                        "FechaSolicitud": new Date(),
                        "EstadoFlujoId": 8,
                        "idRol": 4,
                        "ClaveUnidadAut": $scope.registro.propuesta.unidadOrganizacionalId,
                        "tipoPersonal_Id": 'Sin Definir'
                    };

                    if ($scope.registro.proyecto != null) {
                        Solicitud.ClaveUnidadAut = $scope.registro.proyecto.unidadOrganizacionalId;
                    }
                    
                    solicitudesGIService.AddSolicitud(Solicitud).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": result.data,
                                "FechaMovimiento": new Date('dd/MM/yyyy'),
                                "ClavePersona": $scope.registro.clavePersona,
                                "Descripcion": "Se envió la solicitud",
                                "EstadoFlujoId": 1,
                                "idRol": $scope.rolId
                            }
                            bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                            var Mail = {
                                "Modulo": "Gestión de la Innovación",
                                "Empleado": $scope.nombreLogin,
                                "Seccion": "Plan de Negocio Evolutivo",
                                "TipoCorreo": "SolicitudGerenteGI",
                                "ClavePersona": $scope.registro.clavePersona,
                                "Descripcion1": $scope.registro.propuesta.unidadOrganizacionalId
                            }
                            correoNotificacionService.mailNotificacion(Mail);
                            toastr.success("Solicitud Enviada!");
                            $state.go("planNegocioEvolutivo");
                        })
                },
                function (err) {
                    console.error(err);
                    $scope.desabilitar = false;
                });
        };



    }
})();