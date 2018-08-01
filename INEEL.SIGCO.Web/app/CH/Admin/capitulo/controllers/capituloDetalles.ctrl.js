(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("capituloDetallesCtrl", ['AuthService', '$scope', '$rootScope', 'CapituloService', 'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH", "$uibModal", "DTOptionsBuilder", 'MenuService', capituloDetallesCtrl]);

    function capituloDetallesCtrl(AuthService, $scope, $rootScope, CapituloService, globalGet, $state, $filter, $stateParams, uploadFileACH, $uibModal, DTOptionsBuilder, MenuService) {
        var API = globalGet.get("api");
        $scope.rolId = MenuService.getRolId(); 
        if ($scope.rolId != 1 && $scope.rol!=1026 ) { toastr.error("No Autorizado"); $state.go("home"); return false; }

        $scope.editAdmin = $stateParams.id2;
        var id = $stateParams.id;
        var id2 = $stateParams.id2;


        $scope.justificacion = messageDefaultAprobacionAdminCH_ + "";
    
        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de éste capítulo de libro con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de éste capítulo de libro con la siguiente justificación: " + $scope.justificacion + " ? ";
        //Cada vez que el usuario cambia la justificacion se actualiza el mensaje  //antes de esto el mensaje era estatico
        $scope.$watch("justificacion", function(newValue, oldValue){
            if(newValue !== oldValue){
                $scope.aprobacionQ="";
                $scope.rechazoQ="";
                $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de éste capítulo de libro con la siguiente justificación: " + $scope.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de éste capítulo de libro con la siguiente justificación: " + $scope.justificacion + " ? ";
            }
        })



        //var id = $rootScope.getGlobalID();
        //var id2 = $rootScope.getGlobalID2();
        if (id2 == undefined || id2 == null || id2 == '') {
            toastr.error("parámetros  incorrectos");
            $rootScope.globalRegresar();
        }

        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        $scope.editoresEliminados = [];
        $scope.autoresExternosEliminados = [];
        $scope.autoresInternosEliminados = [];
        $scope.registro = {};
        $scope.AutoresIIE = [];
        $scope.auxColabora = [];
        $scope.AutoresExt = [];
        $scope.urlDescarga = API + "Descarga/GetFile";
        $scope.FechaValidacionAux = new Date();
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;

        //obtener el registro a editar
        CapituloService.getbyid(id).then(
           function (result) {
               $scope.paisanterior = result.data.pais;
               $scope.autorIIE = {};
               $scope.catNum = [{
                   "id": "1",
                   "descripcion": " 1er"
               }, {
                   "id": "2",
                   "descripcion": " 2do"
               }, {
                   "id": "3",
                   "descripcion": " 3er"
               }, {
                   "id": "4",
                   "descripcion": " 4to"
               }, {
                   "id": "5",
                   "descripcion": " 5to"
               }, {
                   "id": "6",
                   "descripcion": " 6to"
               }, {
                   "id": "7",
                   "descripcion": " 7mo"
               }, {
                   "id": "8",
                   "descripcion": " 8vo"
               }, {
                   "id": "9",
                   "descripcion": " 9no"
               }, {
                   "id": "10",
                   "descripcion": "10mo"
               }];

               $scope.registro = result.data;

               var start = new Date($scope.registro.year);
               $scope.registro.year = start.getFullYear().toString();



               CapituloService.Persona(result.data.clavePersona).then(
               function (result) {
                   $scope.nombrePersona = result.data.nombreCompleto;
                   $scope.registro.nombrePersona = result.data.nombreCompleto;
                   $scope.registro.clavePersona = result.data.clavePersona;
                   $scope.registro.claveUnidadAut = result.data.claveUnidad;
               });


               $scope.pais = parseInt($scope.registro.pais);
               //$scope.AutoresIIE = result.data.autorInternoCapitulo;
               for (var p = 0; p < $scope.registro.autorInternoCapitulo.length; p++) {
                   var auxCat = $scope.catNum.length;
                   var x = 0;
                   do {
                       var aux = "" + $scope.registro.autorInternoCapitulo[p].contribucion + "";
                       if ($scope.catNum[x].id == aux) {
                           $scope.r = $scope.catNum[x].id;
                           $scope.auxColabora.push($scope.catNum[x]);
                           $scope.catNum.splice(x, 1);
                       } else { x++ }

                   } while ($scope.r != aux);
               }

               //$scope.AutoresExt = result.data.autorExternoCapitulo;
               for (var p = 0; p < $scope.registro.autorExternoCapitulo.length; p++) {
                   var auxCat = $scope.catNum.length;
                   var x = 0;
                   do {
                       var aux = "" + $scope.registro.autorExternoCapitulo[p].contribucion + "";
                       if ($scope.catNum[x].id == aux) {
                           $scope.r = $scope.catNum[x].id;
                           $scope.auxColabora.push($scope.catNum[x]);
                           $scope.catNum.splice(x, 1);
                       } else { x++ }

                   } while ($scope.r != aux);
               }

               //$scope.editores = result.data.editoresCapitulo;

               CapituloService.ValidarExistencia($scope.registro.capitulosId).then(function (result) {
                   $scope.validacion = result.data;
               });

               if ($scope.registro.adjuntoId == null) {
                   $scope.regFile = true;
               }
               else {
                   $scope.regFile = false;
                   $scope.archivos = 1;
               }
           },
           function (error) {
               toastr.error(error);
           }
        );

        CapituloService.getPaises().then(
            function (result) {
                $scope.paises = result.data;
            },
            function (err) {
                toastr.error(err);
            }
        );

        //////////////////////Buscar persona////////////
        $scope.PersonaSeleccionada = {};
        $scope.ModificaPais = function () {
            $scope.registro.pais = $scope.pais;
        }

        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            $scope.files = null;
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            $scope.archivos = adjunto.files.length;

            var propiedades = {
                file: adjunto.files[0],
                ext: "*", /* pdf;doc;docx;ppt */
                type: '*', /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }

            uploadFileACH.upload(propiedades,
            function (err, result) {

                if (!err) {

                    if (!result.error) {
                        transferComplete(result);
                    } else {
                        toastr.error(result.message);
                    }
                } else {
                    var error = err.message || "Error al adjuntar";
                    toastr.error(error);
                }

            });
        };

        function transferComplete(result) {

            
            $scope.$apply(function () {
                if (result.error === false) {

                    $scope.registro.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                }
            });

        }

        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        function CrearSolicitudSinoExiste(Mail, opc, registro, registroID, tipoInformacionID) {

            var Solicitud = {
                "ClavePersona": $scope.registro.clavePersona,
                "TipoInformacionId": tipoInformacionID,
                "InformacionId": registroID,
                "FechaSolicitud": new Date(),
                "EstadoFlujoId": 3,
                "ClaveUnidadAut": $scope.registro.claveUnidadAut
            };

            CapituloService.AddSolicitud(Solicitud).then(
                function (result) {

                    id2 = result.data;

                    var Bitacora = {
                        "SolicitudId": result.data,
                        "FechaMovimiento": new Date(),
                        "ClavePersona": $scope.authentication.userprofile.clavePersona,
                        "Descripcion": "Gestión de Ficha",
                        "EstadoFlujoId": $scope.registro.estadoFlujoId,
                        "idRol": 1
                    }
                    CapituloService.AddBitacoraSolicitud(Bitacora).then(function (resultBitacora) {
                        return id2;
                    }, function (error) {
                        return 0;
                    });
                    if (opc == 2) {
                        
                        apruebaAdminCHfunction(Mail, id2);
                    }

                }, function (error) {
                    toastr.error("problema al registrar la bitácora");
                    console.log(error);
                    return 0;
                });
        }
        function apruebaAdminCHfunction(Mail, id2) {
            if ($scope.justificacion == null) {
                toastr.error("Escriba una justificación");
                return false;
            }
            var registro = {
                "capitulosId": id,
                "estadoFlujoId": 3
            }
            $scope.registro.estadoFlujoId = 3;
            $scope.registro.fechaValidacion = $scope.FechaValidacionAux;

            CapituloService.update($scope.registro).then(
                function (result) {
                    var registro = {
                        "solicitudId": id2,
                        "estadoFlujoId": 3
                    }
                    toastr.success("Solicitud Aprobada!");
                    CapituloService.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: " + $scope.justificacion,
                                "EstadoFlujoId": registro.estadoFlujoId,
                                "idRol": 1
                            }
                            CapituloService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada"
                            ///////////////////////////////////////
                            CapituloService.mailNotificacionConCoautores(Mail);
                            // Mail.TipoCorreo = "NotificacionGerenteviaAdmin"
                            // CapituloService.mailNotificacion(Mail);
                            $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                           
                        })
                },
                function (err) {
                    $scope.desactivar = false;
                    console.error(err);
                });
        }
        //obtener el registro a editar
        $scope.save = function (opc) {
            
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if ($scope.justificacion == null && opc != 1) {
                    toastr.error("Escriba una justificación");
                    return false;
                }
                if ($scope.registro.year.length == 4) {
                    
                    var fecha = $scope.registro.year + "/01/01";
                    var d = new Date(fecha);

                    $scope.listaCoAutores="";
                    for (var i = 0; i < $scope.registro.autorInternoCapitulo.length; i++) {
                        $scope.listaCoAutores += $scope.registro.autorInternoCapitulo[i].clavePersona + ",";
                    }

                    debugger;
                    $scope.registro.year = d;
                    var Mail = {
                        "Modulo": "Memoria Tecnológica",
                        "Empleado": $scope.nombrePersona,
                        "Seccion": "Capítulo de Libro",
                        "TipoCorreo": 2,
                        "ClavePersona": $scope.registro.clavePersona,
                        "Descripcion1": "<b>Título de Libro:</b> " + $scope.registro.tituloLibro + "<br/>",
                        "Descripcion2": "<b>Título de Capítulo:</b> " + $scope.registro.tituloCapitulo + "<br/>",
                        "Descripcion3": "<b>Editorial:</b> " + $scope.registro.editorial + "<br/>",
                        "Descripcion4": "<b>Estado de Capítulo:</b> " + $scope.registro.estadoFlujo.descripcion,
                        "Estado": "",
                        "Justificacion": $scope.justificacion,
                        "SeccionID": 1,
                        "coautores": $scope.listaCoAutores,
                    }
                    $scope.desactivar = true;
                    
                    if ($scope.editAdmin == "1") {
                        if (CrearSolicitudSinoExiste(Mail, opc, $scope.registro,
                            $scope.registro.capitulosId, 19) > 0) {
                            
                        }
                    }
                    
                    for (var i = 0; i < $scope.editoresEliminados.length; i++) {
                        $scope.registro.editoresCapitulo.push($scope.editoresEliminados[i]);
                    }

                    for (var i = 0; i < $scope.autoresExternosEliminados.length; i++) {
                        $scope.registro.autorExternoCapitulo.push($scope.autoresExternosEliminados[i]);
                    }

                    for (var i = 0; i < $scope.autoresInternosEliminados.length; i++) {
                        $scope.registro.autorInternoCapitulo.push($scope.autoresInternosEliminados[i]);
                    }

                    switch (opc) {
                        case 1:

                            $scope.registro.estadoFlujoId = 1;
                            CapituloService.update($scope.registro).then(
                                            function (result) {
                                                if (result.data.adjuntoId != null) {
                                                    $scope.registro.adjunto.adjuntoId = result.data.adjuntoId;
                                                    $scope.regFile = false;
                                                } else {
                                                    if (result.data.adjunto != null) {
                                                        $scope.registro.adjunto.adjuntoId = result.data.adjunto.adjuntoId;
                                                        $scope.registro.adjuntoId = result.data.adjunto.adjuntoId;
                                                        $scope.regFile = false;
                                                    } else {
                                                        $scope.registro.adjunto = null;
                                                        $scope.registro.adjuntoId = null;
                                                        $scope.regFile = true;
                                                    }
                                                }
                                                toastr.success("Registro Actualizado");
                                                $scope.registro.year = d.getFullYear().toString();
                                                $scope.desactivar = false;
                                                $state.reload();
                                            },
                                            function (err) {
                                                $scope.desactivar = false;
                                                console.error(err);
                                            }
                            );

                            break;
                        case 2:

                            if ($scope.editAdmin != "1")
                                apruebaAdminCHfunction(Mail, id2);
                            break;
                        case 3:
                            if ($scope.justificacion == null) {
                                toastr.error("Escriba una justificación");
                                return false;
                            }
                            var registro = {
                                "capitulosId": id,
                                "estadoFlujoId": 1
                            }
                            $scope.registro.estadoFlujoId = 1

                            CapituloService.update($scope.registro).then(
                                function (result) {
                                    toastr.success("Solicitud Rechazada!");
                                    var registro = {
                                        "solicitudId": id2,
                                        "estadoFlujoId": 1
                                    }
                                    CapituloService.updateSolicitud(registro).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": registro.solicitudId,
                                        //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                        "FechaMovimiento": new Date(),
                                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                        "Descripcion": "Rechazado: " + $scope.justificacion,
                                        "EstadoFlujoId": 2,
                                        "idRol": 1
                                    }
                                    CapituloService.AddBitacoraSolicitud(Bitacora);
                                    Mail.Estado = "Rechazada"
                                    ///////////////////////////////////////
                                    CapituloService.mailNotificacionConCoautores(Mail);
                                    // Mail.TipoCorreo = "NotificacionGerenteviaAdmin"
                                    // CapituloService.mailNotificacion(Mail);
                                    $rootScope.globalRegresar(); //$state.go("solicitudesrh");

                                })
                                },
                                function (err) {
                                    $scope.desactivar = false;
                                    console.error(err);
                                });
                            break;
                    }
                } else { toastr.error("Año invalido!"); }
            }
        }


        $scope.continueFunction = function () {
            $state.reload();
        }

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;
        }


        $scope.add_userExt = function () {
            if ($scope.autorExt.nombre != null && $scope.autorExt.institucion != null && $scope.autorExt.contribucion != undefined) {
                $scope.autorExt.capitulosId = $scope.registro.capitulosId;

                for (var i = 0; i < $scope.registro.autorExternoCapitulo.length; i++) {
                    if (($scope.registro.autorExternoCapitulo[i].nombre == $scope.autorExt.nombre) && ($scope.registro.autorExternoCapitulo[i].institucion == $scope.autorExt.institucion)) {
                        toastr.error("El autor " + $scope.autorExt.nombre + " ya existe dentro de la tabla de autores!");
                        $scope.addExt = true;
                        $scope.autorExt = {};
                        return false;
                    }
                }
                //CapituloService.AddUserExt($scope.autorExt).then(
                //                    function (result) {
                $scope.addExt = false;
                //$scope.autorExt = result.data;
                $scope.registro.autorExternoCapitulo.push($scope.autorExt);
                //Eliminar del drop
                for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                    if ($scope.catNum[i].id == $scope.autorExt.contribucion) {
                        $scope.auxColabora.push($scope.catNum[i]);
                        $scope.catNum.splice(i, 1);
                    }
                }
                $scope.autorExt = {};
                //});
            } else {
                toastr.error("Complete los datos requeridos del autor externo");
            }
        }

        $scope.deleteExt = function (registro) {

            registro.nombre = "eliminar";
            $scope.autoresExternosEliminados.push(registro);

            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }

            var idx = ($scope.registro.autorExternoCapitulo.indexOf(registro));
            $scope.registro.autorExternoCapitulo.splice(idx, 1);
        };

        $scope.addEditor = function () {
            if ($scope.descripcioneditor) { //se hace esta comparación para comprobar que no es undefined

                var idx = -1
                var editor = $scope.descripcioneditor;
                if (editor != "" && editor != undefined) {
                    for (var cont = 0; cont < $scope.registro.editoresCapitulo.length; cont++) {
                        if ($scope.registro.editoresCapitulo[cont].editor_Nombre == editor) {
                            idx = 1;
                        }
                    }
                    //var idx = $scope.editores.indexOf(editor);
                    if (idx > -1) {
                        toastr.error("El editor ya se encuentra asociado, indique otro");
                        $scope.descripcioneditor = ''
                    }
                    else {

                        var Registro = {
                            "editoresCapituloId": 0,
                            "capitulosId": $scope.registro.capitulosId,
                            "editor_Nombre": editor
                        }
                        
                        $scope.registro.editoresCapitulo.push(Registro);
                        //});

                        $scope.descripcioneditor = "";
                    }
                }
                else {
                    toastr.error("Se requiere un editor");
                }
            } else {
                toastr.error("Se requiere un editor");
            }
        };

        $scope.deleteEditor = function (registro) {
            registro.editor_Nombre = "eliminar";
            $scope.editoresEliminados.push(registro);
            var idx = ($scope.registro.editoresCapitulo.indexOf(registro));
            $scope.registro.editoresCapitulo.splice(idx, 1);
        };


        $scope.delete = function (registro) {

            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            registro.nombreCompleto = "eliminar";
            $scope.autoresInternosEliminados.push(registro);

            var idx = ($scope.registro.autorInternoCapitulo.indexOf(registro));
            $scope.registro.autorInternoCapitulo.splice(idx, 1);
        };

        $scope.add_user = function () {

            if ($scope.autorIIE.contribucion != undefined) {
                var Registro = {
                    "capitulosId": $scope.registro.capitulosId,
                    "clavePersona": $scope.autorIIE.clavePersona,
                    "contribucion": $scope.autorIIE.contribucion,
                    "estado": 1,
                    "nombreCompleto": $scope.autorIIE.nombrePersona
                }

                for (var i = 0; i < $scope.registro.autorInternoCapitulo.length; i++) {
                    if ($scope.registro.autorInternoCapitulo[i].clavePersona == Registro.clavePersona) {
                        toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                        return false;
                    }
                }


                $scope.userAdd = false;
                $scope.autorIIE = {};

                $scope.PersonaSeleccionada = null;
                $scope.registro.autorInternoCapitulo.push(Registro);

                //Eliminar del drop
                for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                    if ($scope.catNum[i].id == Registro.contribucion) {
                        $scope.auxColabora.push($scope.catNum[i]);
                        $scope.catNum.splice(i, 1);
                    }
                }
                //});
            } else {
                toastr.error("Complete los datos requeridos del autor");
            }
        }

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
                $scope.autorIIE.clavePersona = $scope.PersonaSeleccionada.clavePersona;
                $scope.autorIIE.nombrePersona = $scope.PersonaSeleccionada.nombreCompleto;
                $scope.userAdd = true;
            });
        }

        $scope.deleteFile = function () {
            $scope.registro.adjunto.nombre = "eliminar";
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);

        }

    }
})();