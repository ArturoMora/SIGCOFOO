(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("publicacionDetallesCtrl", ['AuthService', '$scope', '$rootScope', 'PublicacionService', 'RevistaService', 'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH", "$uibModal", "DTOptionsBuilder", "MenuService", publicacionDetallesCtrl]);

    function publicacionDetallesCtrl(AuthService, $scope, $rootScope, PublicacionService, RevistaService, globalGet, $state, $filter, $stateParams, uploadFileACH, $uibModal, DTOptionsBuilder, MenuService) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        $scope.rolId = MenuService.getRolId();
        if ($scope.rolId != 1 && $scope.rol != 1026) { toastr.error("No Autorizado"); $state.go("home"); return false; }

        $scope.justificacion = messageDefaultAprobacionAdminCH_ + "";
        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de un nuevo artículo con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de un nuevo artículo con la siguiente justificación: " + $scope.justificacion + " ? ";
        //Cada vez que el usuario cambia la justificacion se actualiza el mensaje  //antes de esto el mensaje era estatico
        $scope.$watch("justificacion", function(newValue, oldValue){
            if(newValue !== oldValue){
                $scope.aprobacionQ="";
                $scope.rechazoQ="";
                $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de un nuevo artículo con la siguiente justificación: " + $scope.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de un nuevo artículo con la siguiente justificación: " + $scope.justificacion + " ? ";
            }
        })

        $scope.AutoresIIERegistrados = "";


        var API = globalGet.get("api");
        //var id = $stateParams.id;
        //var id2 = $stateParams.id2;
        $scope.editAdmin = $stateParams.id2;
        var id = $rootScope.getGlobalID();
        var id2 = $rootScope.getGlobalID2();

        $scope.autoresIntEliminados = [];
        $scope.autoresExtEliminados = [];
        $scope.registro = {};
        $scope.AutoresIIE = [];
        $scope.auxColabora = [];
        $scope.AutoresExt = [];
        $scope.urlDescarga = API + "Descarga/GetFile";
        //$scope.FechaValidacionAux = new Date();
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //obtener el registro a editar


      


        PublicacionService.getbyid(id).then(
            function (result) {
                PublicacionService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.registro.nombrePersona = result.data.nombreCompleto;
                        $scope.registro.clavePersona = result.data.clavePersona;
                        $scope.registro.claveUnidadAut = result.data.claveUnidad;
                        if ($scope.editAdmin === "1") {
                            ////alert(id2);
                        }
                    });
                $scope.autorIIE = {};
                $scope.catNum = [{
                    "id": "1",
                    "descripcion": " 1er",
                    "lugar": 1
                }, {
                    "id": "2",
                    "descripcion": " 2do",
                    "lugar": 2
                }, {
                    "id": "3",
                    "descripcion": " 3er",
                    "lugar": 3
                }, {
                    "id": "4",
                    "descripcion": " 4to",
                    "lugar": 4
                }, {
                    "id": "5",
                    "descripcion": " 5to",
                    "lugar": 5
                }, {
                    "id": "6",
                    "descripcion": " 6to",
                    "lugar": 6
                }, {
                    "id": "7",
                    "descripcion": " 7mo",
                    "lugar": 7
                }, {
                    "id": "8",
                    "descripcion": " 8vo",
                    "lugar": 8
                }, {
                    "id": "9",
                    "descripcion": " 9no",
                    "lugar": 9
                }, {
                    "id": "10",
                    "descripcion": "10mo",
                    "lugar": 10
                }];
                $scope.registro = result.data;
                if ($scope.registro.fechaValidacion == null) {
                    $scope.FechaValidacionAux = new Date();
                } else {
                    $scope.FechaValidacionAux = new Date($scope.registro.fechaValidacion);
                }
                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                }

                // VARIABLES PARA VENTANA MODAL
                $scope.registro.revistaSelect = $scope.registro.revista;
                $scope.registro.revistanombreSelect = $scope.registro.revista.revistaNombre;

                $scope.revistaset = $scope.registro.revista;


                $scope.registro.fechaPublicacion = new Date($scope.registro.fechaPublicacion);
                var array = $scope.registro.paginas.split('-');
                $scope.registro.paginasde = array[0];
                $scope.registro.paginashasta = array[1];
                $scope.registro.fechaInicio = new Date($scope.registro.fechaInicio);
                if ($scope.registro.fechaTermino != null) {
                    $scope.registro.fechaTermino = new Date($scope.registro.fechaTermino);
                }

                if ($scope.registro.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
                var count = 1;
                PublicacionService.getByPublicacion($scope.registro.publicacionId).then(
                    function (result) {
                        $scope.AutoresIIE = result.data;
                        for (var p = 0; p < $scope.AutoresIIE.length; p++) {
                            var auxCat = $scope.catNum.length;
                            var x = 0;
                            do {
                                var aux = "" + $scope.AutoresIIE[p].contribucion + "";
                                if ($scope.catNum[x].id == aux) {
                                    $scope.r = $scope.catNum[x].id;
                                    $scope.auxColabora.push($scope.catNum[x]);
                                    $scope.catNum.splice(x, 1);
                                } else { x++ }

                            } while ($scope.r != aux);
                        }
                    });
                PublicacionService.getByPublicacionExt($scope.registro.publicacionId).then(
                    function (result) {
                        $scope.AutoresExt = result.data;
                        for (var p = 0; p < $scope.AutoresExt.length; p++) {
                            var auxCat = $scope.catNum.length;
                            var x = 0;
                            do {
                                var aux = "" + $scope.AutoresExt[p].contribucion + "";
                                if ($scope.catNum[x].id == aux) {
                                    $scope.r = $scope.catNum[x].id;
                                    $scope.auxColabora.push($scope.catNum[x]);
                                    $scope.catNum.splice(x, 1);
                                } else { x++ }

                            } while ($scope.r != aux);
                        }
                    });
            },
            function (error) {
                toastr.error(error);
            });

        PublicacionService.getRevistas().then(
            function (result) {
                $scope.revistas = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar el catálogo de revistas.");
            }
        );

        PublicacionService.getAmbitos().then(
            function (result) {
                $scope.ambitos = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar el catálogo de ámbitos.");
            }
        );

        PublicacionService.getNiveles().then(
            function (result) {
                $scope.niveles = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Niveles de Artículo.");
            }
        );
        PublicacionService.getEstados().then(
            function (result) {
                $scope.publicaciones = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Estados de Artículo.");
            }
        );



        $scope.PersonaSeleccionada = {};
        $scope.openAutor = function () {
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
                $scope.ValidForm.$setDirty();
            });
        }



        $scope.verproyecto = false;
        $scope.openProyecto = function () {
            $scope.desabilitar = true;
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarProyecto.html',
                controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                resolve: {
                    proyectoSelect: function () {
                        $scope.verproyecto = false;
                        return $scope.proyectoSelect;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.registro.proyectoNombre = selectedItem.nombre;
                $scope.registro.proyectoId = selectedItem.proyectoId;
                $scope.ValidForm.$setDirty();
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
        }
       
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            $scope.files = null;
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            $scope.archivos = adjunto.files.length;
            
            // $scope.uploadFiles();
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
                        $("#filesGral").filestyle('clear');
                        toastr.error(error);
                    }
                    
                });
        };
        function transferComplete(result) {
          

            $scope.$apply(function () {
                if (result.error === false) {
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.registro.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.ValidForm.$setDirty();
                }
            });

        }


        $scope.openRevistas = function () {
            $scope.desabilitar = true;
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listarevistas.html',
                controller: 'listarevistasCtrl',
                resolve: {
                    proyectoSelect: function () {
                        $scope.verproyecto = false;
                        return $scope.proyectoSelect;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.registro.revistaSelect = selectedItem;
                $scope.registro.revistanombreSelect = selectedItem.revistaNombre;
                $scope.ValidForm.$setDirty();
            });
            $scope.desabilitar = false;
        }
                
        $scope.cargarRevistaAgregada = function (revista) {


            RevistaService.getByNombre(revista).then(
                function (result) {



                    $scope.registro.revistaSelect = result.data;
                    $scope.registro.revistanombreSelect = $scope.registro.revistaSelect.revistaNombre;

                },
                function (err) {
                    toastr.error("Hubo un error en la obtención de los datos de la revista solicitada");
                }
            );


        }
        
        //#endregion info gral
        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.finalDateComparacion = new Date($scope.registro.fechaPublicacion);
            if ($scope.finalDateComparacion > $scope.fechaActual) {
                toastr.error("Fecha de publicación deber ser menor a la de hoy");
                $scope.registro.fechaPublicacion = "";
                return false;
            };

            $scope.minimo = new Date("1975/11/25");
            if ($scope.finalDateComparacion < $scope.minimo) {
                toastr.error("Fecha de publicación deber ser mayor a 25/11/1975");
                $scope.registro.fechaPublicacion = "";
                return false;
            };
        }

        function CrearSolicitudSinoExiste(Mail, opc, registro, registroID, tipoInformacionID) {

            var Solicitud = {
                "ClavePersona": $scope.registro.clavePersona,
                "TipoInformacionId": tipoInformacionID,
                "InformacionId": registroID,
                "FechaSolicitud": new Date(),
                "EstadoFlujoId": 3,
                "ClaveUnidadAut": $scope.registro.claveUnidadAut
            };

            PublicacionService.AddSolicitud(Solicitud).then(
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
                    PublicacionService.AddBitacoraSolicitud(Bitacora).then(function (resultBitacora) {
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

            //alert("id2 case2: " + id2);
            var registro = {
                "solicitudId": id2,
                "estadoFlujoId": 3
            }

            $scope.registro.estadoFlujoId = 3;
            $scope.registro.fechaValidacion = $scope.FechaValidacionAux;

            PublicacionService.update($scope.registro).then(
                function (result) {
                    toastr.success("Solicitud Aprobada!");
                    PublicacionService.updateSolicitud(registro).then(
                        function (result) {
                            //alert(" registro.solicitudId: " + registro.solicitudId);
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: " + $scope.justificacion,
                                "EstadoFlujoId": registro.estadoFlujoId,
                                "idRol": 1
                            }
                            PublicacionService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada"
                            PublicacionService.mailNotificacionConCoautores(Mail);
                            // Mail.TipoCorreo = "NotificacionGerenteviaAdmin";
                            // PublicacionService.mailNotificacionConCoautores(Mail);
                            
                            $rootScope.globalRegresar();//$state.go("solicitudesrh");
                            //});
                        })
                },
                function (err) {
                    $scope.desactivar = false;
                    console.error(err);
                });
        };
        ///////////////////////////////////////////////////////////////
        //obtener el registro a editar
        $scope.save = function (opc) {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if (parseInt($scope.registro.paginasde) >= parseInt($scope.registro.paginashasta)) {
                    toastr.error("Rango de páginas incorrecto");
                    return false;
                }
                if ($scope.justificacion == null && opc != 1) {
                    toastr.error("Escriba una justificación");
                    return false;
                }
                if ($scope.AutoresIIE.length == 0) {
                    toastr.error("Ingrese al menos un autor interno.");
                    return false;
                }



                $scope.registro.revistaId = $scope.registro.revistaSelect.revistaId;
                $scope.registro.revista.revistaNombre = $scope.registro.revistaSelect.revistaNombre;           //$scope.selectedrevista.originalObject.revistaNombre;
                $scope.registro.paginas = $scope.registro.paginasde + "-" + $scope.registro.paginashasta;

                for (var i = 0; i < $scope.niveles.length; i++) {
                    if ($scope.niveles[i].nivelPublicacionId == $scope.registro.nivelPublicacionId) {
                        $scope.registro.nivelPublicacion = $scope.niveles[i];
                    }
                }
                for (var i = 0; i < $scope.publicaciones.length; i++) {
                    if ($scope.publicaciones[i].estadoPublicacionId == $scope.registro.estadoPublicacionId) {
                        $scope.registro.estadoPublicacion = $scope.publicaciones[i];
                    }
                }


                for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                    $scope.AutoresIIERegistrados = $scope.AutoresIIERegistrados + $scope.AutoresIIE[i].clavePersona + ",";
                }

                if ($scope.registro.revistaSelect != undefined) {
                    var Mail = {
                        "Modulo": "Capital Humano",
                        "Empleado": $scope.registro.nombrePersona,
                        "Seccion": "Artículos",
                        "TipoCorreo": 2,
                        "ClavePersona": $scope.registro.clavePersona,
                        "Descripcion1": "<b>Revista:</b> " + $scope.registro.revista.revistaNombre + "<br/>",
                        "Descripcion2": "<b>Titulo de Artículo:</b> " + $scope.registro.tituloPublicacion + "<br/>",
                        "Descripcion3": "<b>Nivel de Artículo:</b> " + $scope.registro.nivelPublicacion.descripcion + "<br/>",
                        "Descripcion4": "<b>Estado de Artículo:</b> " + $scope.registro.estadoPublicacion.descripcion,
                        "Estado": "",
                        "Justificacion": $scope.justificacion,
                        "coautores": $scope.AutoresIIERegistrados,
                        "SeccionID": 1
                    }

                   

                    $scope.desactivar = true;
                    if ($scope.registro.adjunto != null) {
                        $scope.registro.adjuntoId = $scope.registro.adjunto.adjuntoId;
                    } else {
                        $scope.registro.adjuntoId = null;
                    }

                    if ($scope.editAdmin == "1") {
                        if (CrearSolicitudSinoExiste(Mail, opc, $scope.registro, $scope.registro.publicacionId, 11) > 0) {
                            
                        }
                    }



                    for (var i = 0; i < $scope.autoresIntEliminados.length; i++) {
                        $scope.AutoresIIE.push($scope.autoresIntEliminados[i]);
                    }
                    PublicacionService.updateAutoresInt($scope.AutoresIIE);

                    for (var i = 0; i < $scope.autoresExtEliminados.length; i++) {
                        $scope.AutoresExt.push($scope.autoresExtEliminados[i]);
                    }
                    PublicacionService.updateAutoresExt($scope.AutoresExt);



                    switch (opc) {
                        case 1:

                            $scope.registro.estadoFlujoId = 1;
                            var registro={
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "RevistaId": $scope.registro.revistaId,
                                "FechaPublicacion": $scope.registro.fechaPublicacion,
                                "Paginas": $scope.registro.paginas,
                                "PublicacionId": $scope.registro.publicacionId
                            };
                            /*****Validacion de registros duplicados */
                            PublicacionService.ValidaRegistroDuplicado(registro).then(
                                function (res) {
                                    if (res.data) {
                                        toastr.warning("Intente cambiar la revista asociada, la fecha de publicación o el número de páginas", "Ya existe el registro!",{
                                            timeOut: 10000,
                                        });
                                        
                                        return false;
                                    }
                                    PublicacionService.update($scope.registro).then(
                                        function (result) {
                                            if (result.data.adjuntoId != null) {
                                                $scope.registro.adjunto.adjuntoId = result.data.adjuntoId;
                                                $scope.registro.adjuntoId = result.data.adjuntoId;
                                                $scope.regFile = false;
                                            } else {
                                                $scope.registro.adjunto = null;
                                                $scope.registro.adjuntoId = null;
                                                $scope.regFile = true;
                                                // if (result.data.adjunto != null) {
                                                //     $scope.registro.adjunto.adjuntoId = result.data.adjunto.adjuntoId;
                                                //     $scope.registro.adjuntoId = result.data.adjunto.adjuntoId;
                                                //     $scope.regFile = false;
                                                // } else {
                                                //     $scope.registro.adjunto = null;
                                                //     $scope.registro.adjuntoId = null;
                                                //     $scope.regFile = true;
                                                // }
                                            }
                                            toastr.success("Registro Actualizado");
                                            $scope.desactivar = false;
                                            $scope.ValidForm.$setPristine();
                                        },
                                        function (err) {
                                            $scope.desactivar = false;
                                            console.error(err);
                                        });
                                }, function (err) {
                                    console.log(err);
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
                                "solicitudId": id2,
                                "estadoFlujoId": 1
                            }
                            $scope.registro.estadoFlujoId = 1

                            PublicacionService.update($scope.registro).then(
                                function (result) {
                                    toastr.success("Solicitud Rechazada!");
                                    PublicacionService.updateSolicitud(registro).then(
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
                                            PublicacionService.AddBitacoraSolicitud(Bitacora);
                                            Mail.Estado = "Rechazada"
                                            PublicacionService.mailNotificacionConCoautores(Mail);
                                            // Mail.TipoCorreo = "NotificacionGerenteviaAdmin";
                                            // PublicacionService.mailNotificacionConCoautores(Mail);
                                            $rootScope.globalRegresar(); //$state.go("solicitudesrh");

                                        })
                                },
                                function (err) {
                                    $scope.desactivar = false;
                                    console.error(err);
                                });
                            break;
                    }
                } else { toastr.error("Seleccione una Revista!"); }
            }
        }


        $scope.deleteFile = function () {
            $scope.registro.adjunto.nombre = "eliminar";
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
            $scope.ValidForm.$setDirty();
        }

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }

        $scope.add_user = function () {
            if ($scope.autorIIE.contribucion != undefined) {
                var Registro = {
                    "publicacionId": $scope.registro.publicacionId,
                    "clavePersona": $scope.autorIIE.clavePersona,
                    "contribucion": $scope.autorIIE.contribucion,
                    "estado": 1,
                    "nombreCompleto": $scope.autorIIE.nombrePersona

                }

                for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                    if ($scope.AutoresIIE[i].clavePersona == Registro.clavePersona) {
                        toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                        return false;
                    }
                }


                //PublicacionService.AddUser(Registro).then(
                //                    function (result) {
                $scope.userAdd = false;
                $scope.autorIIE = {};
                //Registro.autorIIEPublicacionId = result.data.autorIIEPublicacionId;
                $scope.PersonaSeleccionada = null;
                $scope.AutoresIIE.push(Registro);

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

        $scope.delete = function (registro) {
            
            registro.ClavePersona = "eliminar";
            $scope.autoresIntEliminados.push(registro);
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            var idx = ($scope.AutoresIIE.indexOf(registro));
            $scope.AutoresIIE.splice(idx, 1);
        };

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }
       
        $scope.add_userExt = function () {
            if ($scope.autorExt.nombre != null && $scope.autorExt.institucion != null && $scope.autorExt.contribucion != undefined) {
                $scope.autorExt.publicacionId = $scope.registro.publicacionId;
                for (var i = 0; i < $scope.AutoresExt.length; i++) {
                    if (($scope.AutoresExt[i].nombre == $scope.autorExt.nombre) && ($scope.AutoresExt[i].institucion && $scope.autorExt.institucion)) {
                        toastr.error("El autor " + $scope.autorExt.nombre + " ya existe dentro de la tabla de autores!");
                        $scope.addExt = true;
                        return false;
                    }
                }
                //PublicacionService.AddUserExt($scope.autorExt).then(
                //                    function (result) {
                $scope.addExt = false;
                //$scope.autorExt.autorPublicacionExtId = result.data.autorPublicacionExtId;
                $scope.AutoresExt.push($scope.autorExt);
                //Eliminar del drop
                for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                    if ($scope.catNum[i].id == $scope.autorExt.contribucion) {
                        $scope.auxColabora.push($scope.catNum[i]);
                        $scope.catNum.splice(i, 1);
                    }
                }
                $scope.autorExt = {};
                $scope.ValidForm.$setDirty();

                //});
            } else {
                toastr.error("Complete los datos requeridos del autor externo");
            }
        }

        $scope.deleteExt = function (registro) {
         
            registro.nombre = "eliminar";
            $scope.autoresExtEliminados.push(registro);
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            var idx = ($scope.AutoresExt.indexOf(registro));
            $scope.AutoresExt.splice(idx, 1);
            $scope.ValidForm.$setDirty();
           
        };

        $scope.clean = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }
    }
})();