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
        .controller("sniEditCtrl"
        , ['AuthService'
        , '$scope'
        , '$rootScope'
        , 'SNIService'
        , 'globalGet'
        , 'uploadFileACH'
        , '$state'
        , '$filter'
        , '$stateParams'
        , '$uibModal'
        , sniEditCtrl]);

    function sniEditCtrl(AuthService, $scope, $rootScope, SNIService, globalGet, uploadFileACH, $state, $filter, $stateParams, $uibModal) {
        //Variable API
        window.scrollTo(0, 0)
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        $scope.editarGestion = 0;
        $scope.idGF = $rootScope.GestionFichasClave;
        if ($scope.idGF != null) {
            $scope.editarGestion = 1;
        }
        var API = globalGet.get("api");
        $scope.registrosni = {};
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //obtener clave de usuario
        //obtener nombre de usuario     
        $scope.registrosni.sNIId = id;
        //Parametros
        //var id = $rootScope.idG;
        var id = $rootScope.getGlobalID();

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
        $scope.registro = {};
        //Obtene sni
        SNIService.getsnibyid(id).then(
            function (result) {
                //Valores adicionales
                SNIService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registrosni.nombreCompleto = result.data.nombreCompleto;
                    $scope.registro.nombrePersona = $scope.registrosni.nombreCompleto;
                    $scope.registro.clavePersona = $scope.registrosni.clavePersona;
                });
                $scope.registrosni = result.data;
                if ($scope.registrosni.fechaIngreso != null) {
                    $scope.registrosni.fechaIngreso = new Date($scope.registrosni.fechaIngreso);
                }
                $scope.registrosni.fechaInicioNombramiento = new Date($scope.registrosni.fechaInicioNombramiento);
                if ($scope.registrosni.fechaTerminoNombramiento != null) {
                    $scope.registrosni.fechaTerminoNombramiento = new Date($scope.registrosni.fechaTerminoNombramiento);
                }
                if ($scope.registrosni.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }

                

            });
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
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
                    $scope.registrosni.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                }
            });

        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        $scope.sniedit = function () {
            if ($scope.registrosni.estadoFlujoId == 3) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/vistasGenericas/modificarValidados.html', controller: function ($uibModalInstance) {
                        $scope.ok = function () {
                            $scope.snieditF();
                            $uibModalInstance.dismiss('cancel'); $scope.dtInstance._renderer.rerender();
                        }; $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
                    }, scope: $scope
                });
            } else {
                $scope.snieditF();
            }
        }

        $scope.snieditF = function () {
            if ($scope.sniEdit.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                //Validacion Fechas
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');

                if ($scope.registrosni.fechaInicioNombramiento > $scope.hoy) {
                    toastr.error("La fecha de inicio del nombramiento debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }

                if ($scope.registrosni.fechaTerminoNombramiento > $scope.hoy) {
                    toastr.error("La fecha de término del nombramiento debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }

                if ($scope.registrosni.fechaIngreso > $scope.hoy) {
                    toastr.error("La fecha de ingreso al SNI debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }

                if ($scope.registrosni.fechaInicioNombramiento >= $scope.registrosni.fechaTerminoNombramiento) {
                    toastr.error("La fecha de inicio del nombramiento debe ser menor a la de término");
                    return false;
                }
                if ($scope.registrosni.fechaIngreso > $scope.registrosni.fechaInicioNombramiento) {
                    toastr.error("La fecha de ingreso debe ser menor a la de inicio del nombramiento");
                    return false;
                }

                

                /////////////////
                //Validar fecha de inicio
                $scope.desabilitar = true;
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
                            $scope.desabilitar = false; 
                            return false;
                        }
                        if ($scope.editarGestion == 0) {
                            $scope.registrosni.estadoFlujoId = 1;
                        }
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
                                toastr.success("Registro Actualizado");
                                $scope.sniEdit.$setPristine();
                                $scope.desabilitar = false;
                            },
                            function (err) {
                                $scope.desabilitar = false;
                                console.error(err);
                            });
                    }, function (err) {
                        console.log(err);
                    }
                );


            }
        }

        $scope.validar = function () {
            try {
                if ($scope.sniEdit.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    //Validacion Fechas
                    $scope.hoy = new Date();
                    $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');

                    if ($scope.registrosni.fechaInicioNombramiento > $scope.hoy) {
                        toastr.error("La fecha de inicio del nombramiento debe estar comprendida hasta " + $scope.hoyString);
                        return false;
                    }

                    if ($scope.registrosni.fechaTerminoNombramiento > $scope.hoy) {
                        toastr.error("La fecha de término del nombramiento debe estar comprendida hasta " + $scope.hoyString);
                        return false;
                    }

                    if ($scope.registrosni.fechaIngreso > $scope.hoy) {
                        toastr.error("La fecha de ingreso al SNI debe estar comprendida hasta " + $scope.hoyString);
                        return false;
                    }

                    if ($scope.registrosni.fechaInicioNombramiento >= $scope.registrosni.fechaTerminoNombramiento) {
                        toastr.error("La fecha de inicio del nombramiento debe ser menor a la de término");
                        return false;
                    }
                    if ($scope.registrosni.fechaIngreso > $scope.registrosni.fechaInicioNombramiento) {
                        toastr.error("La fecha de ingreso debe ser menor a la de inicio del nombramiento");
                        return false;
                    }
                    /////////////////
                    var Registro = {
                        "sniId": $scope.registrosni.sniId,
                        "estadoFlujoId": 2
                    };
                    //$scope.sniedit();
                    $scope.registrosni.estadoFlujoId = 2;
                    //Cambiar el estado del registro
                    SNIService.updatesni($scope.registrosni).then(
                                    function (result) {
                                        var Solicitud = {
                                            "ClavePersona": $scope.registrosni.clavePersona,
                                            "TipoInformacionId": 2,
                                            "InformacionId": $scope.registrosni.sniId,
                                            "FechaSolicitud": new Date(),
                                            "EstadoFlujoId": 2,
                                            "titulo": $scope.registrosni.nivelSNI.descripcion
                                        }
                                        SNIService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.registrosni.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        SNIService.AddBitacoraSolicitud(Bitacora);
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registrosni.nombreCompleto,
                                            "Seccion": "SNI",
                                            "TipoCorreo": 1,
                                            "ClavePersona": $scope.registrosni.clavePersona
                                        }
                                        SNIService.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        $state.go("fichapersonal.sni", { seccion: 'sni' });
                                    })
                                    },
                                    function (err) {
                                        $scope.desabilitar = false;
                                        console.error(err);
                                        $rootScope.globalRegresar();
                                    });
                }
            } catch (e) {
                console.log(e);
                throw e;
            }

        }
        $scope.deleteFile = function () {
            $scope.registrosni.adjunto.nombre = "eliminar";
            //SNIService.updatesni($scope.registrosni);
            //toastr.success("Archivo Eliminado!");
            $scope.registrosni.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }

        $scope.clean = function () {
            $scope.registrosni.fechaIngreso = null;
        }

        $scope.regresar = function () {
            $state.go("fichapersonal.sni", { seccion: 'sni' });
        }

    }
})();