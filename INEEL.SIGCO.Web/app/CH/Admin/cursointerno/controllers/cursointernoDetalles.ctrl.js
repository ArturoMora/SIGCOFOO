(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("cursointernoDetallesCtrl", ['AuthService', '$scope', '$rootScope', 'CursoInternoCHService', 'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH", "$uibModal", "DTOptionsBuilder", 'MenuService', cursointernoDetallesCtrl]);

    function cursointernoDetallesCtrl(AuthService, $scope, $rootScope, CursoInternoCHService, globalGet, $state, $filter, $stateParams, uploadFileACH, $uibModal, DTOptionsBuilder, MenuService) {
        var API = globalGet.get("api");
        $scope.rolId = MenuService.getRolId(); 
        if ($scope.rolId != 1 && $scope.rol!=1026 && $scope.rol!=19) { toastr.error("No Autorizado"); $state.go("home"); return false; }

        //var id = $stateParams.id;
        //var id2 = $stateParams.id2;
        $scope.editAdmin = $stateParams.id2;
        var id = $rootScope.getGlobalID();
        var id2 = $rootScope.getGlobalID2();
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;

        $scope.justificacion = messageDefaultAprobacionAdminCH_ + "";

        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de éste curso interno con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea rechazar el registro de éste curso interno con la siguiente justificación: " + $scope.justificacion + " ? ";
        //Cada vez que el usuario cambia la justificacion se actualiza el mensaje  //antes de esto el mensaje era estatico
        $scope.$watch("justificacion", function(newValue, oldValue){
            if(newValue !== oldValue){
                $scope.aprobacionQ="";
                $scope.rechazoQ="";
                $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de éste curso interno con la siguiente justificación: " + $scope.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea rechazar el registro de éste curso interno con la siguiente justificación: " + $scope.justificacion + " ? ";
            }
        })



        $scope.registro = {};
        $scope.AutoresIIE = [];
        $scope.auxColabora = [];
        $scope.AutoresExt = [];
        $scope.contador = 0;
        $scope.tasklist = [];
        $scope.archivosEliminados = [];
        $scope.archivosAdjuntos = [];
        $scope.ligasEliminadas = [];
        $scope.AutoresExtEliminados = [];
        $scope.AutoresIIEEliminados = [];
        $scope.urlDescarga = API + "Descarga/GetFileCurso";
        //$scope.FechaValidacionAux = new Date();
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        $scope.sitiosWebNuevos = [];


        //obtener el registro a editar
        CursoInternoCHService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                CursoInternoCHService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;

                    $scope.registro.clavePersona = result.data.clavePersona;
                    $scope.registro.claveUnidadAut = result.data.claveUnidad;
                });
                $scope.autorIIE = {};

                if ($scope.registro.fechaValidacion == null) {
                    $scope.FechaValidacionAux = new Date();
                } else {
                    $scope.FechaValidacionAux = new Date($scope.registro.fechaValidacion);
                }
                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                }
                if ($scope.registro.fechaCurso != null) {
                    $scope.registro.fechaCurso = new Date($scope.registro.fechaCurso);
                }
                if ($scope.registro.fechaTermino != null) {
                    $scope.registro.fechaTermino = new Date($scope.registro.fechaTermino);
                }
                if ($scope.registro.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
                CursoInternoCHService.getByObj($scope.registro.cursoInternoId).then(
                function (result) {
                    $scope.AutoresIIE = result.data;
                    for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                        $scope.contador = $scope.contador + $scope.AutoresIIE[i].contribucion;
                    }

                });
                CursoInternoCHService.getExt($scope.registro.cursoInternoId).then(
                function (result) {
                    $scope.AutoresExt = result.data;
                });
                CursoInternoCHService.getAdjuntos($scope.registro.cursoInternoId).then(
                function (result) {
                    $scope.archivosAdjuntos = result.data;
                });
            },
            function (error) {
                toastr.error(error);
            });
        CursoInternoCHService.getTipoCurso().then(
             function (result) {
                 $scope.cursos = result.data;
             },
            function (err) {
                toastr.error("No se ha podido cargar el catálogo de tipo de cursos.");
            }
            );
        //////////////////////Buscar persona////////////
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
                $scope.autorIIE.clavePersona = $scope.PersonaSeleccionada.clavePersona;
                $scope.autorIIE.nombrePersona = $scope.PersonaSeleccionada.nombreCompleto;
                $scope.userAdd = true;
                $scope.ValidForm.$setDirty();
            });
        }
        /////////////////////////Buscar Proyecto
        //Buscar Proyecto
        //$scope.ProyectoSeleccionado = {};
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
        //////////////////////Buscar persona////////////
        $scope.PersonaSeleccionada = {};
        $scope.open = function () {
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
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
           
            //Que no exita el adjunto
            var igual = 0;
            var contador = 0;
            for (contador = 0; contador < $scope.archivosAdjuntos.length; contador++) {
                if (adjunto.files[0].name == $scope.archivosAdjuntos[contador].nombre) {
                    igual = 1;
                }
            }
           
            if (igual > 0) {
                toastr.error("El adjunto ya existe");
                adjunto = '';
                $("#filesGral").filestyle('clear');
                return;
            }
            else {
               
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
                        console.log("result:");
                        console.log(result);
                        if (!result.error) {
                            transferComplete(result);
                            $("#filesGral").filestyle('clear');
                        } else {
                            toastr.error(result.message);
                            $("#filesGral").filestyle('clear');
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        $("#filesGral").filestyle('clear');
                        toastr.error(error);
                    }
                });
            }
        }


        function transferComplete(result) {

            $scope.$apply(function () {
                if (result.error === false) {
                    
                    $scope.registro.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    var cont = 0;

                    for (var op = 0; op < $scope.archivosAdjuntos.length; op++) {
                        if ($scope.archivosAdjuntos[op].nombre == result.nameFile) {
                            $scope.buscarArchivos();
                            cont++;
                            return;
                        }
                    }


                    var RegistroFiles = {
                        "RutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        "ModuloId": $scope.registro.adjunto.moduloId,
                        "CursoInternoId": $scope.registro.cursoInternoId
                    }
                    $scope.archivosAdjuntos.push(RegistroFiles)
                    
                    $scope.ValidForm.$setDirty();
                    $scope.existFile = 1;
                }
            });
           
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

            CursoInternoCHService.AddSolicitudCH(Solicitud).then(
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
                    CursoInternoCHService.AddBitacoraSolicitud(Bitacora).then(function (resultBitacora) {
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
            $scope.registro.estadoFlujoId = 3;
            $scope.registro.fechaValidacion = $scope.FechaValidacionAux;
            if ($scope.registro.fechaCurso > $scope.registro.fechaTermino && ($scope.registro.fechaTermino != null)) {
                toastr.error("La fecha de inicio debe ser menor a la de término");
                return false;
            } else {
                if ($scope.registro.perteneceCP == true) {
                    var registro = {
                        "solicitudId": id2,
                        "estadoFlujoId": 3
                    }
                    CursoInternoCHService.update($scope.registro).then(
                        function (result) {
                            toastr.success("Solicitud Aprobada!");
                            CursoInternoCHService.updateSolicitudCH(registro).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": registro.solicitudId,
                                        //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                        "FechaMovimiento": new Date(),
                                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                        "Descripcion": "Aprobado : " + $scope.justificacion,
                                        "EstadoFlujoId": registro.estadoFlujoId,
                                        "idRol": 19
                                    }
                                    CursoInternoCHService.AddBitacoraSolicitud(Bitacora);
                                    Mail.Estado = "Aprobada"
                                    CursoInternoCHService.mailNotificacionConCoautores(Mail);
                                    if ($scope.registro.perteneceCP == true) {
                                        $rootScope.globalRegresar(); //$state.go("solicitudescp");
                                    } else {
                                        $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                                    }
                                })
                        },
                        function (err) {
                            $scope.desactivar = false;
                            console.error(err);
                        });
                } else {
                    var registro = {
                        "solicitudId": id2,
                        "estadoFlujoId": 3
                    }
                    CursoInternoCHService.update($scope.registro).then(
                        function (result) {
                            toastr.success("Solicitud Aprobada!");
                            CursoInternoCHService.updateSolicitudCH(registro).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": registro.solicitudId,
                                        //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                        "FechaMovimiento": new Date(),
                                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                        "Descripcion": "Aprobado : " + $scope.justificacion,
                                        "EstadoFlujoId": registro.estadoFlujoId,
                                        "idRol": 1
                                    }
                                    CursoInternoCHService.AddBitacoraSolicitud(Bitacora);
                                    Mail.Estado = "Aprobada"
                                    CursoInternoCHService.mailNotificacionConCoautores(Mail);
                                    if ($scope.registro.perteneceCP == true) {
                                        $rootScope.globalRegresar(); //$state.go("solicitudescp");
                                    } else {
                                        $rootScope.globalRegresar(); //$state.go("solicitudesrh"); 
                                    }
                                })
                        },
                        function (err) {
                            $scope.desactivar = false;
                            console.error(err);
                        });
                }
            }
        }
        //obtener el registro a editar
        $scope.save = function (opc) {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if ($scope.AutoresIIE.length == 0) {
                    toastr.error("Ingrese por lo menos un autor interno");
                    return false;
                }
                
                if ($scope.justificacion == null && opc != 1) {
                    toastr.error("Escriba una justificación");
                    return false;
                }

                $scope.listaCoAutores="";
                for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                    $scope.listaCoAutores += $scope.AutoresIIE[i].clavePersona + ",";
                }


                var Mail = {
                    "Modulo": "Capital Humano",
                    "Empleado": $scope.registro.nombrePersona,
                    "Seccion": "Cursos Impartidos",
                    "TipoCorreo": "NotificacionResultadoCP",
                    "ClavePersona": $scope.registro.clavePersona,
                    "Descripcion1": "<b>Titulo:</b> " + $scope.registro.titulo + "<br/>",
                    "Descripcion2": "<b>Descripción:</b> " + $scope.registro.descripcion + "<br/>",
                    "Descripcion3": "<b>Tipo de curso:</b> " + $scope.registro.tipoCurso.descripcion + "<br/>",
                    "Descripcion4": "",
                    "Justificacion": $scope.justificacion,
                    "Estado": "",
                    "coautores": $scope.listaCoAutores,
                }
                $scope.desactivar = true;
                if ($scope.registro.adjunto != null) {
                    $scope.registro.adjuntoId = $scope.registro.adjunto.adjuntoId;
                } else {
                    $scope.registro.adjuntoId = null;
                }

                if ($scope.editAdmin == "1") {

                    if ($scope.registro.perteneceCP) {
                        if (CrearSolicitudSinoExiste(Mail, opc, $scope.registro,
                            $scope.registro.cursoInternoId, 18) > 0) {
                            
                        }
                    } else {
                        if (CrearSolicitudSinoExiste(Mail, opc, $scope.registro,
                            $scope.registro.cursoInternoId, 17) > 0) {
                            
                        }
                    }

                }
                
                for (var i = 0; i < $scope.archivosEliminados.length; i++) {
                    $scope.archivosAdjuntos.push($scope.archivosEliminados[i]);
                }
                CursoInternoCHService.updateFiles($scope.archivosAdjuntos);
                for (var i = 0; i < $scope.ligasEliminadas.length; i++) {
                    $scope.registro.sitioWebCurso.push($scope.ligasEliminadas[i]);
                }
                for (var i = 0; i < $scope.AutoresExtEliminados.length; i++) {
                    $scope.AutoresExt.push($scope.AutoresExtEliminados[i]);
                }
                CursoInternoCHService.updateAutoresExternos($scope.AutoresExt);
                for (var i = 0; i < $scope.AutoresIIEEliminados.length; i++) {
                    $scope.AutoresIIE.push($scope.AutoresIIEEliminados[i]);
                }
                CursoInternoCHService.updateAutoresInternos($scope.AutoresIIE);
                switch (opc) {
                    case 1:
                        $scope.registro.estadoFlujoId = 1;
                        if ($scope.registro.perteneceCP == 1) {
                            $scope.registro.perteneceCP = true;
                        } else { $scope.registro.perteneceCP = false; }
                        
                        if ($scope.registro.fechaCurso > $scope.registro.fechaTermino && ($scope.registro.fechaTermino != null)) {
                            toastr.error("La fecha de inicio debe ser menor a la de término");
                            return false;
                        } else {
                            CursoInternoCHService.update($scope.registro).then(
                                                        function (result) {
                                                            if (result.data.adjuntoId != null) {
                                                                $scope.registro.adjunto.adjuntoId = result.data.adjuntoId;
                                                                $scope.registro.adjuntoId = result.data.adjuntoId;
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
                                                            $scope.desactivar = false;
                                                            $state.reload();
                                                            
                                                        },
                                            function (err) {
                                                $scope.desactivar = false;
                                                console.error(err);
                                            });
                        }
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
                        $scope.registro.estadoFlujoId = 1
                        if ($scope.registro.fechaCurso > $scope.registro.fechaTermino && ($scope.registro.fechaTermino != null)) {
                            toastr.error("La fecha de inicio debe ser menor a la de término");
                            return false;
                        } else {
                            if ($scope.registro.perteneceCP == true) {
                                var registro = {
                                    "solicitudId": id2,
                                    "estadoFlujoId": 1
                                }

                                CursoInternoCHService.update($scope.registro).then(
                                    function (result) {
                                        toastr.success("Solicitud Rechazada!");
                                        CursoInternoCHService.updateSolicitudCH(registro).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": registro.solicitudId,
                                            //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                            "Descripcion": "Rechazado por: " + $scope.justificacion,
                                            "EstadoFlujoId": 2,
                                            "idRol": 19
                                        }
                                        CursoInternoCHService.AddBitacoraSolicitud(Bitacora);
                                        Mail.Estado = "Rechazada"
                                        CursoInternoCHService.mailNotificacionConCoautores(Mail);
                                        if ($scope.registro.perteneceCP == true) {
                                            $rootScope.globalRegresar(); //$state.go("solicitudescp");
                                        } else {
                                            $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                                        }
                                    })
                                    },
                                    function (err) {
                                        $scope.desactivar = false;
                                        console.error(err);
                                    });
                            } else {
                                var registro = {
                                    "solicitudId": id2,
                                    "estadoFlujoId": 1
                                }
                                CursoInternoCHService.update($scope.registro).then(
                                    function (result) {
                                        toastr.success("Solicitud Rechazada!");
                                        CursoInternoCHService.updateSolicitudCH(registro).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": registro.solicitudId,
                                            //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                            "Descripcion": "Rechazado por: " + $scope.justificacion,
                                            "EstadoFlujoId": 2,
                                            "idRol": 1
                                        }
                                        CursoInternoCHService.AddBitacoraSolicitud(Bitacora);
                                        Mail.Estado = "Rechazada"
                                        CursoInternoCHService.mailNotificacionConCoautores(Mail);
                                        if ($scope.registro.perteneceCP == true) {
                                            $rootScope.globalRegresar(); //$state.go("solicitudescp");
                                        } else {
                                            $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                                        }
                                    })
                                    },
                                    function (err) {
                                        $scope.desactivar = false;
                                        console.error(err);
                                    });
                            }
                        }

                        break;
                }
            }
        }


        $scope.deleteFile = function () {
            $scope.registro.adjunto.nombre = "eliminar";
            //CursoInternoCHService.update($scope.registro);
            //toastr.success("Archivo Eliminado!");
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }

        $scope.add_user = function () {
            var Registro = {
                "cursoInternoId": $scope.registro.cursoInternoId,
                "clavePersona": $scope.autorIIE.clavePersona,
                "nombreCompleto": $scope.autorIIE.nombrePersona

            }
            for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                if ($scope.AutoresIIE[i].clavePersona == Registro.clavePersona) {
                    toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                    return false;
                }
            }
            
            $scope.userAdd = false;
            $scope.autorIIE = {};
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

        }

        $scope.eliminarAutor = function (registro) {
            $scope.descripcionRow = registro.nombreCompleto;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {

                        $scope.delete(registro, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.delete = function (registro) {
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            if (registro.autorInternoCursoInternoId != undefined) {
                registro.nombreCompleto = "eliminar"
                $scope.AutoresIIEEliminados.push(registro);
            }

            var idx = ($scope.AutoresIIE.indexOf(registro));
            $scope.AutoresIIE.splice(idx, 1);
            var porcentaje = parseInt(registro.contribucion);
            $scope.contador = $scope.contador - porcentaje;
        };

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }

        $scope.add_File = function () {
            $scope.archivosAdjuntos.push($scope.registro.adjunto);
            $scope.registro.adjunto = null;
            $scope.existFile = 0;
        }


        $scope.eliminarFile = function (registro) {
            if (registro.adjuntoCursosId != undefined) {
                registro.nombre = "eliminar";
                $scope.archivosEliminados.push(registro);
            }
            var idx = ($scope.archivosAdjuntos.indexOf(registro));
            $scope.archivosAdjuntos.splice(idx, 1);
            

        }

        $scope.eliminar = function (registro) {
            //alert("eliminar");
            var idx = ($scope.tasklist.indexOf(registro));
            $scope.tasklist.splice(idx, 1);
        };

        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.finalDateComparacion = new Date($scope.registro.fechaCurso);
            if ($scope.finalDateComparacion > $scope.fechaActual) {
                toastr.error("Fecha de inicio del congreso deber ser menor a la de hoy");
                $scope.registro.fechaCurso = "";
                return false;
            }
        }
        $scope.addLiga = function () {
            if ($scope.registro) { //se hace esta comparación para comprobar que no es undefined
                
                var liga = $scope.registro.descripcionLiga;
                var idx = -1;
                if (liga != "" && liga != undefined) {
                    for (var contador = 0; contador < $scope.registro.sitioWebCurso.length; contador++) {
                        if ($scope.registro.sitioWebCurso[contador].url == liga) {
                            var idx = contador;
                        }
                    }
                    var idx2 = $scope.registro.sitioWebCurso.indexOf(liga);
                    if (idx > -1 || idx2 > -1) {
                        toastr.error("La Liga de acceso indicada ya se encuentra asociada a la convocatoria, indique otra");
                    }
                        // is newly selected
                    else {
                        var urlnew = {
                            url: liga,
                            autor: $scope.nombreEmpleado,
                            estado: true,
                            cursoInternoId: id
                        };
                        $scope.registro.sitioWebCurso.push(urlnew);
                    }
                }
                else {
                    toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
                }
            }
            else {
                toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
            }
            $scope.registro.descripcionLiga = '';
        }
        //Eliminar el archivo adjunto
        $scope.eliminarUrl = function (registro) {

            if (registro.sitioWebCursoInternoId != undefined) {
                registro.url = "eliminar";
                $scope.ligasEliminadas.push(registro);
            }

            var idx = ($scope.registro.sitioWebCurso.indexOf(registro));
            $scope.registro.sitioWebCurso.splice(idx, 1);


        }


        $scope.add_userExt = function () {
            if ($scope.autorExt.nombreCompleto != null && $scope.autorExt.institucion != null) {
                $scope.autorExt.cursoInternoId = $scope.registro.cursoInternoId;

                for (var i = 0; i < $scope.AutoresExt.length; i++) {
                    if (($scope.AutoresExt[i].nombreCompleto == $scope.autorExt.nombreCompleto) && ($scope.AutoresExt[i].institucion == $scope.autorExt.institucion)) {
                        toastr.error("El autor " + $scope.autorExt.nombreCompleto + " ya existe dentro de la tabla de autores!");
                        $scope.addExt = true;
                        $scope.autorExt = {};
                        return false;
                    }
                }

                $scope.addExt = false;
                
                $scope.AutoresExt.push($scope.autorExt);

                $scope.autorExt = {};
                $scope.ValidForm.$setDirty();

                //});
            } else {
                toastr.error("Complete los datos requeridos del autor externo");
            }
        }


        $scope.deleteExt = function (registro) {
            if (registro.autorExternoCursoInternoId != undefined) {
                registro.nombreCompleto = "eliminar"
                $scope.AutoresExtEliminados.push(registro);
            }

            var idx = ($scope.AutoresExt.indexOf(registro));
            $scope.AutoresExt.splice(idx, 1);
            $scope.auxColabora.splice(idx, 1);
        };

        $scope.clean = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }
    }
})();