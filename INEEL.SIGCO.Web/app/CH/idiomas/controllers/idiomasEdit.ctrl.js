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
        .controller("idiomasEditCtrl", ['AuthService', '$scope', '$rootScope', 'IdiomasService', "IdiomaService", '$state', "$stateParams", 'globalGet', 'uploadFileACH', '$filter', '$uibModal', idiomasEditCtrl]);
    function idiomasEditCtrl(AuthService, $scope, $rootScope, IdiomasService, IdiomaService, $state, $stateParams, globalGet, uploadFileACH, $filter, $uibModal) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        window.scrollTo(0, 0)
        var API = globalGet.get("api");
        $scope.editarGestion = 0;
        $scope.idGF = $rootScope.GestionFichasClave;
        if ($scope.idGF != null) {
            $scope.editarGestion = 1;
        }
        $scope.urlDescarga = API + "Descarga/GetFile";
        //$scope.id = $rootScope.idG;
        $scope.id = $rootScope.getGlobalID();
        //get usuario
        //Extraer informacion del usuario//
        $scope.registroidiomas = {};
        $scope.authentication = AuthService.authentication;

        IdiomaService.getAll().then(
            function (result) {
                $scope.catalogoidiomas = result.data;
            }, function (error) {
                toastr.error("No se ha podido cargar el catalogo de idiomas ");
                console.log(err);
            });

        //IdiomasService.getcetificaciones().then(
        //    function (result) {
        //        $scope.catalogocertificaion = result.data;
        //    }, function (error) {
        //        toastr.error("No se ha podido cargar el catalogo de certificaciones ");
        //        console.error(err);
        //    });
        $scope.registro = {};
        IdiomasService.getbyid($scope.id).then(
            function (result) {
                $scope.registroidiomas = result.data;
                IdiomasService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.registroidiomas.nombreCompleto = result.data.nombreCompleto;
                        $scope.registro.nombrePersona = $scope.registroidiomas.nombreCompleto;
                        $scope.registro.clavePersona = $scope.registroidiomas.clavePersona;
                    });



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

        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 45) {
                    return false;
                }
            });
        });
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
        $scope.certificados = function (id) {

            IdiomasService.getcetificacionesAll(id).then(
                function (result) {

                    $scope.catalogocertificaion = result.data;
                    if ($scope.catalogocertificaion.length == 1) {
                        $scope.registroidiomas.certificacionId = 7;
                    }
                }, function (error) {
                    toastr.error("No se ha podido cargar el catalogo de certificaciones ");
                    console.log(error);
                });


        }


        $scope.idiomasedit = function () {
            if ($scope.registroidiomas.estadoFlujoId == 3) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/vistasGenericas/modificarValidados.html', controller: function ($uibModalInstance) {
                        $scope.ok = function () {
                            $scope.idiomaseditF();
                            $uibModalInstance.dismiss('cancel'); $scope.dtInstance._renderer.rerender();
                        }; $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
                    }, scope: $scope
                });
            } else {
                $scope.idiomaseditF();
            }
        }


        $scope.idiomaseditF = function () {
            if ($scope.idiomasform.$invalid || $scope.registroidiomas.porcentajeGradoDominio == 0 || $scope.registroidiomas.porcentajeConversacion == 0 || $scope.registroidiomas.porcentajeEscritura == 0 || $scope.registroidiomas.porcentajeLectura == 0) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                /////////////////
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                if ($scope.registroidiomas.fechaAcreditacion > $scope.hoy) {
                    toastr.error("La fecha de acreditación debe ser menor a " + $scope.hoyString);
                    return false;
                }
                
                // Guardar registro 
                //por default cuando se agrega un registro el estdo del flujo es 1
                $scope.desabilitar = true;
                var registro = {
                    "ClavePersona": $scope.registro.clavePersona,
                    "IdiomaId": $scope.registroidiomas.idiomaId,
                    "FechaAcreditacion": $scope.registroidiomas.fechaAcreditacion,
                    "IdiomasId": $scope.id
                };

                IdiomasService.ValidaRegistroDuplicado(registro).then(
                    function (res) {
                        if(res.data){
                            toastr.warning("Intente cambiar el idioma o la fecha de acreditación");
                            toastr.warning("Ya existe el registro!");
                            $scope.desabilitar = false;    
                            return false;
                        }
                        if ($scope.editarGestion == 0) {
                            $scope.registroidiomas.estadoFlujoId = 1;
                        }
                        
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
                                toastr.success("Registro Actualizado");
                                $scope.desabilitar = false;
                                $scope.idiomasform.$setPristine();
                            },
                            function (err) {
                                console.error(err);
                                $scope.desabilitar = false;
                            });
                    }, function (err) {
                        console.log(err);
                    }
                );

            }
        }

        $scope.regresar = function () {
            $state.go("fichapersonal.idiomas", ({ seccion: 'idiomas' }))
        }

        $scope.validar = function () {
            try {
                if ($scope.idiomasform.$invalid || $scope.registroidiomas.porcentajeGradoDominio == 0 || $scope.registroidiomas.porcentajeConversacion == 0 || $scope.registroidiomas.porcentajeEscritura == 0 || $scope.registroidiomas.porcentajeLectura == 0) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    /////////////////
                    $scope.hoy = new Date();
                    $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                    if ($scope.registroidiomas.fechaAcreditacion > $scope.hoy) {
                        toastr.error("La fecha de acreditación debe ser menor a " + $scope.hoyString);
                        return false;
                    }
                    var Registro = {
                        "idiomasId": $scope.registroidiomas.idiomasId,
                        "estadoFlujoId": 2
                    };
                    //$scope.idiomasedit();
                    //Cambiar el estado del registro
                    $scope.registroidiomas.estadoFlujoId = 2;
                    IdiomasService.update($scope.registroidiomas).then(
                        function (result) {
                            var Solicitud = {
                                "ClavePersona": $scope.registroidiomas.clavePersona,
                                "TipoInformacionId": 5,
                                "InformacionId": $scope.registroidiomas.idiomasId,
                                "FechaSolicitud": new Date(),
                                "EstadoFlujoId": 2,
                                "titulo": $scope.registroidiomas.idioma.descripcion
                            }
                            IdiomasService.AddSolicitud(Solicitud).then(
                                function (result) {
                                    var Bitacora = {
                                        "SolicitudId": result.data,
                                        "FechaMovimiento": new Date(),
                                        "ClavePersona": $scope.registroidiomas.clavePersona,
                                        "Descripcion": "Se envió la solicitud",
                                        "EstadoFlujoId": 1
                                    }
                                    IdiomasService.AddBitacoraSolicitud(Bitacora);
                                    var Mail = {
                                        "Modulo": "Capital Humano",
                                        "Empleado": $scope.registroidiomas.nombreCompleto,
                                        "Seccion": "Idiomas",
                                        "TipoCorreo": 1,
                                        "ClavePersona": $scope.registroidiomas.clavePersona
                                    }
                                    IdiomasService.mailNotificacion(Mail);
                                    toastr.success("Solicitud Enviada!");
                                    $state.go("fichapersonal.idiomas", { seccion: 'idiomas' });
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
            $scope.registroidiomas.adjunto.nombre = "eliminar";
            //IdiomasService.update($scope.registroidiomas);
            //toastr.success("Archivo Eliminado!");
            $scope.registroidiomas.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }
    }

})();