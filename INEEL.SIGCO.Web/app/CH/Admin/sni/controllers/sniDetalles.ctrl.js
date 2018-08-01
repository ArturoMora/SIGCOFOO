(function () {
    "use strict";
    angular
        .module("ineelCH")
        .directive('numbersOnly', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attr, ngModelCtrl) {
                    function fromUser(text) {
                        if (text) {
                            var transformedInput = text.replace(/[^0-9]/g, '');

                            if (transformedInput !== text) {
                                ngModelCtrl.$setViewValue(transformedInput);
                                ngModelCtrl.$render();
                            }
                            return transformedInput;
                        }
                        return undefined;
                    }
                    ngModelCtrl.$parsers.push(fromUser);
                }
            };
        })
        .controller("sniDetallesCtrl"
            , ['AuthService'
                , '$scope', '$rootScope'
                , 'SNIService'
                , 'globalGet'
                , 'uploadFileACH'
                , '$state'
                , '$filter'
                , '$stateParams'
                , 'MenuService'
                , sniDetallesCtrl]);

    function sniDetallesCtrl(AuthService, $scope, $rootScope,
        SNIService, globalGet, uploadFileACH, $state, $filter, $stateParams, MenuService) {
        $scope.rolId = MenuService.getRolId();
        if ($scope.rolId != 1 && $scope.rol != 1026) { toastr.error("No Autorizado"); $state.go("home"); return false; }
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        
        $scope.justificacion = messageDefaultAprobacionAdminCH_ + "";
        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de un nuevo nivel SNI con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de un nuevo nivel SNI con la siguiente justificación: " + $scope.justificacion + " ? ";
        //Cada vez que el usuario cambia la justificacion se actualiza el mensaje  //antes de esto el mensaje era estatico
        $scope.$watch("justificacion", function(newValue, oldValue){
            if(newValue !== oldValue){
                $scope.aprobacionQ="";
                $scope.rechazoQ="";
                $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de un nuevo nivel SNI con la siguiente justificación: " + $scope.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de un nuevo nivel SNI con la siguiente justificación: " + $scope.justificacion + " ? ";
            }
        })
        


        //Variable API
        var API = globalGet.get("api");
        $scope.registrosni = {};
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        $scope.registrosni.sNIId = id;
        //Parametros
        $scope.editAdmin = $stateParams.id2;
        var id = $stateParams.id;
        var id2 = $stateParams.id2;
        //get usuario
        //Extraer informacion del usuario//
        $scope.fechaValidacionHoyMax = new Date();

        SNIService.getnivelSNI().then(
            function (resultadoNivelesSNI) {
                $scope.nivelesSNI = resultadoNivelesSNI.data;
            }
        );
        SNIService.getareaSNI().then(
            function (resultadoAreasSNI) {
                $scope.areasSNI = resultadoAreasSNI.data;
            }
        );
        //Obtene sni
        SNIService.getsnibyid(id).then(
            function (result) {
                $scope.registrosni = result.data;
                $scope.registro = result.data;
                //Valores adicionales
                SNIService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.registrosni.nombreCompleto = result.data.nombreCompleto;
                        $scope.registro.nombrePersona = result.data.nombreCompleto;
                        $scope.registro.clavePersona = result.data.clavePersona;
                        $scope.registro.claveUnidadAut = result.data.claveUnidad;
                    });

                if ($scope.registrosni.fechaValidacion == null) {
                    $scope.FechaValidacionAux = new Date();
                } else {
                    $scope.FechaValidacionAux = new Date($scope.registrosni.fechaValidacion);
                }
                if ($scope.registrosni.fechaIngreso != null) {
                    $scope.registrosni.fechaIngreso = new Date($scope.registrosni.fechaIngreso);
                }
                if ($scope.registrosni.fechaInicioNombramiento != null) {
                    $scope.registrosni.fechaInicioNombramiento = new Date($scope.registrosni.fechaInicioNombramiento);
                }
                if ($scope.registrosni.fechaTerminoNombramiento != null) {
                    $scope.registrosni.fechaTerminoNombramiento = new Date($scope.registrosni.fechaTerminoNombramiento);
                }
                if ($scope.registrosni.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
            })
        ///////////////////////////////////////////////////////////////
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
                    
                    $scope.registrosni.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.sniEdit.$setDirty();
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

            SNIService.AddSolicitud(Solicitud).then(
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
                    SNIService.AddBitacoraSolicitud(Bitacora).then(function (resultBitacora) {
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
            var registro = {
                "solicitudId": id2,
                "estadoFlujoId": 3
            }
            $scope.registrosni.estadoFlujoId = 3;
            $scope.registrosni.fechaValidacion = $scope.FechaValidacionAux;
            SNIService.updateValidacion($scope.registrosni).then(
                function (result) {
                    toastr.success("Solicitud Aprobada!");
                    SNIService.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: " + $scope.justificacion,
                                "EstadoFlujoId": registro.estadoFlujoId,
                                "idRol": 1
                            }
                            SNIService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada";
                            SNIService.mailNotificacion(Mail);
                            $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                        })
                },
                function (err) {
                    $scope.desactivar = false;
                    console.error(err);
                });
        }
        $scope.sniedit = function (opc) {
            if ($scope.sniEdit.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if ($scope.justificacion == null && opc != 1) {
                    toastr.error("Escriba una justificación");
                    return false;
                }
                //Validar fecha de inicio
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                if ($scope.registrosni.fechaInicioNombramiento > $scope.hoy) {
                    toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                if ($scope.registrosni.fechaInicioNombramiento >= $scope.registrosni.fechaTerminoNombramiento) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }
                if ($scope.registrosni.fechaIngreso > $scope.registrosni.fechaInicioNombramiento) {
                    toastr.error("La fecha de ingreso debe ser menor a la de inicio");
                    return false;
                }
                $scope.desactivar = true;
                // if ($scope.registrosni.adjunto != null) {
                //     $scope.registrosni.adjuntoId = $scope.registrosni.adjunto.adjuntoId;
                // } else {
                //     $scope.registrosni.adjuntoId = null;
                // }


                for (var i = 0; i < $scope.areasSNI.length; i++) {
                    if ($scope.registrosni.areaSNIId == $scope.areasSNI[i].areaSNIId) {
                        $scope.tipoAux = $scope.areasSNI[i].descripcion;
                    }
                }
                for (var i = 0; i < $scope.nivelesSNI.length; i++) {
                    if ($scope.registrosni.nivelSNIId == $scope.nivelesSNI[i].nivelSNIId) {
                        $scope.NivelAux = $scope.nivelesSNI[i].descripcion;
                    }
                }


                var Mail = {
                    "Modulo": "Capital Humano",
                    "Empleado": $scope.registrosni.nombreCompleto,
                    "Seccion": "SNI",
                    "TipoCorreo": 2,
                    "ClavePersona": $scope.registrosni.clavePersona,
                    "Descripcion1": "<b>Nivel SNI:</b> " + $scope.NivelAux + "<br/>",
                    "Descripcion2": "<b>Área SNI:</b> " + $scope.tipoAux + "<br/>",
                    "Descripcion3": "<b>Número de Expediente:</b> " + $scope.registrosni.numeroExpediente + "<br/>",
                    "Descripcion4": "<b>Número de Curriculum Vitae único (CVU):</b> " + $scope.registrosni.numeroCVU,
                    "Justificacion": $scope.justificacion,
                    "Estado": ""
                }
                if ($scope.editAdmin == "1") {
                    if (CrearSolicitudSinoExiste(Mail, opc, $scope.registro,
                        $scope.registro.sniId, 2) > 0) {
                        
                    }
                }
                switch (opc) {
                    case 1:
                        // Guardar registro por default cuando se agrega un registro el estdo del flujo es 1
                        var registro = {
                            "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                            "FechaInicioNombramiento": $scope.registrosni.fechaInicioNombramiento,
                            "FechaTerminoNombramiento": $scope.registrosni.fechaTerminoNombramiento,
                            "NivelSNIId": $scope.registrosni.nivelSNIId,
                            "SNIId": id
                        }
                        SNIService.ValidaRegistroDuplicado(registro).then(
                            function (res) {
                                if(res.data){
                                    toastr.warning("Intente cambiar el nivel de SNI o las fechas de inicio o término");
                                    toastr.warning("Ya existe el registro!");
                                    $scope.desactivar = false;
                                    return false;
                                }
                                $scope.registrosni.estadoFlujoId = 2;
                                SNIService.updatesni($scope.registrosni).then(
                                    function (result) {
                                        if (result.data.adjuntoId != null) {
                                            $scope.registrosni.adjunto.adjuntoId = result.data.adjuntoId;
                                            $scope.registrosni.adjuntoId = result.data.adjuntoId;
                                            $scope.regFile = false;
                                        } else {
                                            $scope.registrosni.adjunto = null;
                                            $scope.registrosni.adjuntoId = null;
                                            $scope.regFile = true;
                                            // if (result.data.adjunto != null) {
                                            //     $scope.registrosni.adjunto.adjuntoId = result.data.adjunto.adjuntoId;
                                            //     $scope.registrosni.adjuntoId = result.data.adjunto.adjuntoId;
                                            //     $scope.regFile = false;
                                            // } else {
                                            //     $scope.registrosni.adjunto = null;
                                            //     $scope.registrosni.adjuntoId = null;
                                            //     $scope.regFile = true;
                                            // }
                                        }
                                        $scope.sniEdit.$setPristine();
                                        toastr.success("Registro Actualizado");
                                        $scope.desactivar = false;

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
                        var registro = {
                            "solicitudId": id2,
                            "estadoFlujoId": 1
                        }
                        $scope.registrosni.estadoFlujoId = 1;
                        SNIService.updatesni($scope.registrosni).then(
                            function (result) {
                                toastr.success("Solicitud Rechazada!");
                                SNIService.updateSolicitud(registro).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": registro.solicitudId,
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                            "Descripcion": "Rechazado por: " + $scope.justificacion,
                                            "EstadoFlujoId": 2,
                                            "idRol": 1
                                        }
                                        SNIService.AddBitacoraSolicitud(Bitacora);
                                        Mail.Estado = "Rechazada";
                                        SNIService.mailNotificacion(Mail);
                                        $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                                    })

                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);
                            });
                        break;
                }

            }
        }
        $scope.deleteFile = function () {
            $scope.registrosni.adjunto.nombre = "eliminar";
            //SNIService.updatesni($scope.registrosni);
            //toastr.success("Archivo Eliminado!");
            $scope.registrosni.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            $scope.sniEdit.$setDirty();
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }

        $scope.clean = function () {
            $scope.registrosni.fechaIngreso = null;
        }
    }
})();