(function () {
    "use strict";
    angular
        .module("ineelCH")
        .directive('validNumber', function () {
            return {
                require: '?ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {

                    element.on('keydown', function (event) {
                        var keyCode = []
                        if (attrs.allowNegative == "true") {
                            keyCode = [8, 9, 36, 35, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 109, 110, 173, 190, 189];
                        }
                        else {
                            var keyCode = [8, 9, 36, 35, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 173, 190];
                        }


                        if (attrs.allowDecimal == "false") {

                            var index = keyCode.indexOf(190);


                            if (index > -1) {
                                keyCode.splice(index, 1);
                            }

                        }

                    })
                    ngModelCtrl.$parsers.push(function (text) {
                        var oVal = ngModelCtrl.$modelValue;
                        var nVal = ngModelCtrl.$viewValue;
                        
                        if (parseFloat(nVal) != nVal) {

                            if (nVal === null || nVal === undefined || nVal == '' || nVal == '-') oVal = nVal;

                            ngModelCtrl.$setViewValue(oVal);
                            ngModelCtrl.$render();
                            return oVal;
                        }
                        else {
                            var decimalCheck = nVal.split('.');
                            if (!angular.isUndefined(decimalCheck[1])) {
                                if (attrs.decimalUpto)
                                    decimalCheck[1] = decimalCheck[1].slice(0, attrs.decimalUpto);
                                else
                                    decimalCheck[1] = decimalCheck[1].slice(0, 2);
                                nVal = decimalCheck[0] + '.' + decimalCheck[1];
                            }

                            ngModelCtrl.$setViewValue(nVal);
                            ngModelCtrl.$render();
                            return nVal;
                        }
                    });
                }
            };
        })
        .controller("idiomasDetallesCtrl", ['AuthService', '$scope', '$rootScope',
            'IdiomasService', "IdiomaService", '$state', "$stateParams", 'uploadFileACH', 'globalGet', 'MenuService', idiomasDetallesCtrl]);
    function idiomasDetallesCtrl(AuthService, $scope, $rootScope,
        IdiomasService, IdiomaService, $state, $stateParams, uploadFileACH, globalGet, MenuService) {
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
        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de un nuevo idioma con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de un nuevo idioma con la siguiente justificación: " + $scope.justificacion + " ? ";
        //Cada vez que el usuario cambia la justificacion se actualiza el mensaje  //antes de esto el mensaje era estatico
        $scope.$watch("justificacion", function(newValue, oldValue){
            if(newValue !== oldValue){
                $scope.aprobacionQ="";
                $scope.rechazoQ="";
                $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de un nuevo idioma con la siguiente justificación: " + $scope.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de un nuevo idioma con la siguiente justificación: " + $scope.justificacion + " ? ";
            }
        })



        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        $scope.editAdmin = $stateParams.id2;
        var id = $stateParams.id;
        var id2 = $stateParams.id2;
        //get usuario
        //Extraer informacion del usuario//
        //$scope.FechaValidacionAux = new Date();
        $scope.registroidiomas = {};
        $scope.authentication = AuthService.authentication;
        $scope.registroidiomas.claveEmpleado = AuthService.authentication.userprofile.clavePersona;
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;

        IdiomaService.getAll().then(
            function (result) {
                $scope.catalogoidiomas = result.data;
            }, function (error) {
                toastr.error("No se ha podido cargar el catálogo de idiomas ");
                console.error(err);
            });

        //IdiomasService.getcetificaciones().then(
        //    function (result) {
        //        $scope.catalogocertificaion = result.data;
        //    }, function (error) {
        //        toastr.error("No se ha podido cargar el catálogo de certificaciones ");
        //        console.error(err);
        //    });

        IdiomasService.getbyid(id).then(
            function (result) {
                $scope.registroidiomas = result.data;
                $scope.registro = result.data;

                IdiomasService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.registroidiomas.nombreCompleto = result.data.nombreCompleto;
                        $scope.registro.nombrePersona = result.data.nombreCompleto;
                        $scope.registro.clavePersona = result.data.clavePersona;
                        $scope.registro.claveUnidadAut = result.data.claveUnidad;
                    });

                if ($scope.registroidiomas.fechaValidacion == null) {
                    $scope.FechaValidacionAux = new Date();
                } else {
                    $scope.FechaValidacionAux = new Date($scope.registroidiomas.fechaValidacion);
                }
                IdiomasService.getcetificacionesAll($scope.registroidiomas.idiomaId).then(
                    function (result) {
                        $scope.catalogocertificaion = result.data;
                    }, function (error) {
                        toastr.error("No se ha podido cargar el catalogo de certificaciones ");
                        console.error(err);
                    });
                $scope.registroidiomas.fechaAcreditacion = new Date($scope.registroidiomas.fechaAcreditacion);
                if ($scope.registroidiomas.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de idiomas.");
            }
        );

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
                ext: "pdf;doc;docx", /* pdf;doc;docx;ppt */
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
                    $scope.registroidiomas.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.idiomasform.$setDirty();
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

            IdiomasService.AddSolicitud(Solicitud).then(
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
                    IdiomasService.AddBitacoraSolicitud(Bitacora).then(function (resultBitacora) {
                        return id2;
                    }, function (error) {
                        return 0;
                    });
                    if (opc == 2) {
                        
                        apruebaAdminCHfunction(Mail, id2);
                    }

                }, function (error) {
                    toastr.error("problema al registrar la bitácora");

                    return 0;
                });
        }
        function apruebaAdminCHfunction(Mail, id2) {
            var registro = {
                "solicitudId": id2,
                "estadoFlujoId": 3
            }
            $scope.registroidiomas.estadoFlujoId = 3;
            $scope.registroidiomas.fechaValidacion = $scope.FechaValidacionAux;
            IdiomasService.updateValidacion($scope.registroidiomas).then(
                function (result) {
                    toastr.success("Solicitud Aprobada!");
                    $scope.desactivar = false;
                    IdiomasService.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: " + $scope.justificacion,
                                "EstadoFlujoId": registro.estadoFlujoId,
                                "idRol": 1
                            }
                            IdiomasService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada";
                            IdiomasService.mailNotificacion(Mail);
                            $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                        })
                },
                function (err) {
                    $scope.desactivar = false;
                    console.error(err);
                });
        }
        $scope.idiomasedit = function (opc) {
            if ($scope.idiomasform.$invalid || $scope.registroidiomas.porcentajeGradoDominio == 0 || $scope.registroidiomas.porcentajeConversacion == 0 || $scope.registroidiomas.porcentajeEscritura == 0 || $scope.registroidiomas.porcentajeLectura == 0) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                if ($scope.justificacion == null && opc != 1) {
                    toastr.error("Escriba una justificación");
                    return false;
                }

                for (var i = 0; i < $scope.catalogoidiomas.length; i++) {
                    if ($scope.catalogoidiomas[i].idiomaId == $scope.registroidiomas.idiomaId) {
                        $scope.idiomaselect = $scope.catalogoidiomas[i].descripcion;
                    }
                }

                for (var i = 0; i < $scope.catalogocertificaion.length; i++) {
                    if ($scope.catalogocertificaion[i].certificacionId == $scope.registroidiomas.certificacionId) {
                        $scope.certificadoselect = $scope.catalogocertificaion[i].descripcion;
                    }
                }

                var Mail = {
                    "Modulo": "Capital Humano",
                    "Empleado": $scope.registroidiomas.nombreCompleto,
                    "Seccion": "Idiomas",
                    "TipoCorreo": 2,
                    "ClavePersona": $scope.registroidiomas.clavePersona,
                    "Descripcion1": "<b>Idioma:</b> " + $scope.idiomaselect + "<br/>",
                    "Descripcion2": "<b>Tipo de certificación :</b> " + $scope.certificadoselect,
                    "Descripcion3": "",
                    "Descripcion4": "",
                    "Justificacion": $scope.justificacion,
                    "Estado": ""
                }
                $scope.desactivar = true;
                if ($scope.registroidiomas.adjunto != null) {
                    $scope.registroidiomas.adjuntoId = $scope.registroidiomas.adjunto.adjuntoId;
                } else {
                    $scope.registroidiomas.adjuntoId = null;
                }

                if ($scope.editAdmin == "1") {
                    if (CrearSolicitudSinoExiste(Mail, opc, $scope.registro,
                        $scope.registro.idiomasId, 5) > 0) {

                    }
                }
                switch (opc) {
                    case 1:

                        // Guardar registro por default cuando se agrega un registro el estdo del flujo es 1
                        var registro = {
                            "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                            "IdiomaId": $scope.registroidiomas.idiomaId,
                            "FechaAcreditacion": $scope.registroidiomas.fechaAcreditacion,
                            "IdiomasId": id
                        };

                        IdiomasService.ValidaRegistroDuplicado(registro).then(
                            function (res) {
                                if (res.data) {
                                    toastr.warning("Intente cambiar el idioma o la fecha de acreditación");
                                    toastr.warning("Ya existe el registro!");
                                    $scope.desactivar = false;
                                    return false;
                                }
                                $scope.registroidiomas.estadoFlujoId = 2;
                                IdiomasService.update($scope.registroidiomas).then(
                                    function (result) {
                                        if (result.data.adjuntoId != null) {
                                            $scope.registroidiomas.adjunto.adjuntoId = result.data.adjuntoId;
                                            $scope.registroidiomas.adjuntoId = result.data.adjuntoId;
                                            $scope.regFile = false;
                                        } else {
                                            $scope.registroidiomas.adjunto = null;
                                            $scope.registroidiomas.adjuntoId = null;
                                            $scope.regFile = true;
                                            // if (result.data.adjunto != null) {
                                            //     $scope.registroidiomas.adjunto.adjuntoId = result.data.adjunto.adjuntoId;
                                            //     $scope.registroidiomas.adjuntoId = result.data.adjunto.adjuntoId;
                                            //     $scope.regFile = false;
                                            // } else {
                                            //     $scope.registroidiomas.adjunto = null;
                                            //     $scope.registroidiomas.adjuntoId = null;
                                            //     $scope.regFile = true;
                                            // }
                                        }
                                        $scope.idiomasform.$setPristine();
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
                        $scope.registroidiomas.estadoFlujoId = 1;
                        IdiomasService.update($scope.registroidiomas).then(
                            function (result) {
                                toastr.success("Solicitud Rechazada!");
                                IdiomasService.updateSolicitud(registro).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": registro.solicitudId,
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                            "Descripcion": "Rechazado: " + $scope.justificacion,
                                            "EstadoFlujoId": 2,
                                            "idRol": 1
                                        }
                                        IdiomasService.AddBitacoraSolicitud(Bitacora);
                                        Mail.Estado = "Rechazada";
                                        IdiomasService.mailNotificacion(Mail);
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

        $scope.certificados = function (id) {

            IdiomasService.getcetificacionesAll(id).then(
                function (result) {
                    
                    $scope.catalogocertificaion = result.data;
                    if ($scope.catalogocertificaion.length == 1) {
                        $scope.registroidiomas.certificacionId = 7;
                    }
                }, function (error) {
                    toastr.error("No se ha podido cargar el catalogo de certificaciones ");
                    console.error(err);
                });


        }

        $scope.deleteFile = function () {
            $scope.registroidiomas.adjunto.nombre = "eliminar";
            //IdiomasService.update($scope.registroidiomas);
            //toastr.success("Archivo Eliminado!");
            $scope.registroidiomas.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            $scope.idiomasform.$setDirty();
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }
    }

})();