(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("ideaInnovadoraEdit", ['AuthService', '$scope', '$rootScope', 'solicitudesGIService',
            'IdeainnovadoraService', '$uibModal', '$timeout', 'correoNotificacionService',
            'bitacoraSolicitudService','MenuService', 'adjuntarArchivo',
            '$state', IdeaInnovadoraEdit]);

    function IdeaInnovadoraEdit(AuthService, $scope, $rootScope,solicitudesGIService,
        IdeainnovadoraService, $uibModal, $timeout,correoNotificacionService,
        bitacoraSolicitudService,MenuService,adjuntarArchivo,
        $state) {
        $scope.rolId = MenuService.getRolId();
        window.scrollTo(0, 0);
        $scope.accion = '';
        $scope.pendientesEliminarSave = [];
        $scope.proponentes = [];
        $scope.auxColabora = [];
        $scope.contadorProponentes = 0;
        $scope.registro = {};
        var id = $rootScope.getGlobalID();
        $scope.authentication = AuthService.authentication;

        $scope.evaluacionGerencia=function(){
            IdeainnovadoraService.ComentariosSolicitudAModificar($scope.registro.ideaInnovadoraId).then(
                function(res){
                    $scope.comentariosGerencia= res.data;
                },function(err){
                    console.log(err);
                }
            );
        }

        IdeainnovadoraService.getbyid(id).then(
            function (result) {
                IdeainnovadoraService.Persona(result.data.clavePersona).then(
                   function (result) {
                       $scope.registro.nombrePersona = result.data.nombreCompleto;
                   });
                $scope.registro = result.data;
                if ($scope.registro.adjuntoId == null) { $scope.regFile = true; } else { $scope.regFile = false; $scope.archivos = 1; }

                $scope.evaluacionGerencia();
                //Obtener proponentes
                IdeainnovadoraService.getProponentes($scope.registro.ideaInnovadoraId).then(
                            function (result) {
                                $scope.proponentes = result.data;
                                $scope.contadorProponentes = $scope.proponentes.length;
                                //obtener contribucion
                                IdeainnovadoraService.getAllContribucion().then(
                                    function (result) {
                                        $scope.contribucion = result.data;
                                        for (var p = 0; p < $scope.proponentes.length; p++) {
                                            var x = 0;
                                        //var aux = $scope.proponentes[p].contribucionProponenteId;
                                        if ($scope.contribucion[x].id == 0) {
                                                $scope.r = $scope.contribucion[x].id;
                                                $scope.auxColabora.push($scope.contribucion[x]);
                                                $scope.contribucion.splice(x, 1);
                                            } else { x++ }
                                        }
                                    },
                                    function (err) {
                                        toastr.error(err);
                                    });
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
            } else if (opt =="validarAdmin"){
                $scope.validar();
            } else { alert("Opción incorrecta"); };
        }

        $scope.actualizar = function () {
            if($scope.proponentes.length==0){
                toastr.error("Agregue por lo menos un proponente");
                return false;
            }
            for (var i = 0; i < $scope.pendientesEliminarSave.length; i++) {
                $scope.proponentes.push($scope.pendientesEliminarSave[i]);
            }
            var reg = {
                'IdeaInnovadora': $scope.registro,
                'ListaAutores': $scope.proponentes
            }
            $scope.registro.comunidad=null;
            IdeainnovadoraService.update(reg).then(
                function (result) {
                    toastr.success("Registro Actualizado");
                    $state.reload();
                },
                function (err) {
                 
                    console.error(err);
                    toastr.error("Error al actualizar");
                    $state.reload();
                });
        }
        

        //Agregar proponente
        $scope.add_proponente = function () {
            if ($scope.proponente.contribucion.id != undefined) {
                var Registro = {
                    "clavePersona": $scope.proponente.clavePersona,
                    "contribucionProponenteId": $scope.proponente.contribucion.id,
                    "contribucionProponente": { 'contribucion': $scope.proponente.contribucion.contribucion },
                    "persona": $scope.proponente.nombrePersona
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
                if ($scope.auxColabora[i].id == registro.contribucionProponenteId) {
                    $scope.contribucion.push($scope.auxColabora[i]);
                }
            }
            
            if (registro.ideaInnovadoraId != null || registro.ideaInnovadoraId != undefined) {
                registro.persona = "eliminar";
                $scope.pendientesEliminarSave.push(registro);
            } 
            var idx = ($scope.proponentes.indexOf(registro));
            $scope.proponentes.splice(idx, 1);
            $scope.auxColabora.splice(idx, 1);
            $scope.ValidForm.$setDirty();
        };
        // validar
        $scope.validar = function () {
            
            if ($scope.proponentes.length==0) {
                toastr.error("Agregue un proponente!");
                return false;
            }
            var principal = 0;
            for (var p = 0; p < $scope.proponentes.length; p++) {
                if ($scope.proponentes[p].contribucionProponenteId==0) {
                    principal++;
                }
            }
            if(principal==0){
                toastr.error("Agregue el proponente principal!");
                return false;
            }
        ///////////////////////////////////////////////
            $scope.registro.estadoFlujoId = 14;
            for (var i = 0; i < $scope.pendientesEliminarSave.length; i++) {
                $scope.proponentes.push($scope.pendientesEliminarSave[i]);
            }
            
            $scope.registro.comunidad = null;
            var reg = {
                'IdeaInnovadora': $scope.registro,
                'ListaAutores': $scope.proponentes
            }

            
            $scope.coautores="";
            for(var c=0; c< $scope.proponentes.length; c++){
                $scope.coautores+= $scope.proponentes[c].clavePersona+",";
            }

            IdeainnovadoraService.update(reg).then(
            function (result) {
                
                var Solicitud = {
                    "ClavePersona": $scope.registro.clavePersona,
                    "TipoInformacionId": 28,
                    "InformacionId": $scope.registro.ideaInnovadoraId,
                    "FechaSolicitud": new Date(),
                    "EstadoFlujoId": 14,
                    "idRol":1028,
                    "ClaveUnidadAut": '',
                    "tipoPersonal_Id": 'Sin Definir'
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
                            "Empleado": $scope.registro.nombrePersona,
                            "Seccion": "Idea Innovadora",
                            "TipoCorreo": "SolicitudAdminGI",
                            "ClavePersona": $scope.registro.clavePersona,
                            "coautores" : $scope.coautores
                        }
                        // correoNotificacionService.mailNotificacion(Mail);
                        correoNotificacionService.mailNotificacionConCoautores(Mail);
                        toastr.success("Solicitud Enviada!");
                        $state.go("ideaInnovadora");
                    })
               
            },
            function (err) {
                console.error(err);
                $state.reload();
            });

        }

        $scope.getFileDetails = function (adjunto) {
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '12').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'GI' };
                    $scope.registro.adjunto = Adjunto;
                    $scope.ValidForm.$setDirty();
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }

        $scope.deleteFile = function () {
            //$scope.registro.adjunto.nombre = "eliminar";
            ////DAExternoService.update($scope.registro);
            //toastr.success("Archivo Eliminado!");
            //$scope.registro.adjuntoId = null;
            $scope.registro.adjunto = null;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }

        $scope.$watch("registro.comunidad", function (newValue, oldValue) {
            
            if (newValue === oldValue) {
                return;
            }
            $scope.registro.comunidadPracticaId = $scope.registro.comunidad.comunidadId;
        });  
    }
})();