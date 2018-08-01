(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("distincionEditCtrl"
            , ['AuthService'
                , '$scope'
                , '$rootScope'
                , 'DistincionService'
                , 'globalGet'
                , 'FileUploader'
                , '$state'
                , '$filter'
                , '$stateParams'
                , 'uploadFileACH'
                , '$uibModal'
                , distincionEditCtrl]);
    function distincionEditCtrl(AuthService, $scope, $rootScope, DistincionService, globalGet, FileUploader, $state, $filter, $stateParams, uploadFileACH, $uibModal) {
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
        $scope.distincion = {};
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Extraer informacion del usuario//
        $scope.authentication = AuthService.authentication;
        //Parametros
        //var id = $rootScope.idG;
        var id = $rootScope.getGlobalID();
        //Obtene distincion
        $scope.registro = {};
        DistincionService.getbyid(id).then(
            function (result) {
                DistincionService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.distincion.nombreCompleto = result.data.nombreCompleto;
                        $scope.registro.nombrePersona = $scope.distincion.nombreCompleto;
                        $scope.registro.clavePersona = $scope.distincion.clavePersona;
                    });
                $scope.distincion = result.data;
                $scope.distincion.fechaDistincion = new Date(result.data.fechaDistincion);
                if ($scope.distincion.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
            },
            function (err) {
                console.error(err);
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
                    $scope.DistincionForm.$setDirty();    
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
                    $scope.distincion.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                }
            });

        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        $scope.distincionedit = function () {
            if ($scope.distincion.estadoFlujoId == 3) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/vistasGenericas/modificarValidados.html', controller: function ($uibModalInstance) {
                        $scope.ok = function () {
                            $scope.distincionedit2();
                            $uibModalInstance.dismiss('cancel'); $scope.dtInstance._renderer.rerender();
                        }; $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
                    }, scope: $scope
                });
            } else {
                $scope.distincionedit2();
            }
        }

        $scope.regresar = function () {
            $state.go("fichapersonal.distincion", { seccion: 'distincion' });
        }


        $scope.distincionedit2 = function () {
            if ($scope.DistincionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                $scope.fechaActual = new Date();
                if ($scope.distincion.fechaDistincion > $scope.fechaActual) {
                    var date = new Date();
                    $scope.ddMMyyyy = $filter('date')(new Date(), 'dd/MM/yyyy');
                    toastr.error("La fecha de otorgamiento debe ser menor a " + $scope.ddMMyyyy);
                } else {
                    if ($scope.editarGestion == 0) {
                        $scope.distincion.estadoFlujoId = 1;
                    }
                    $scope.desabilitar = true;
                    var registro = {
                        "ClavePersona": $scope.distincion.clavePersona,
                        "FechaDistincion": $scope.distincion.fechaDistincion,
                        "DistincionId": id
                    };

                    DistincionService.ValidaRegistroDuplicado(registro).then(
                        function (res) {
                            if(res.data){
                                toastr.warning("Intente cambiar las fechas de distinción");
                                toastr.warning("Ya existe el registro!");
                                $scope.desabilitar = false;
                                return false;
                            }
                            DistincionService.distincionedit($scope.distincion).then(
                                function (result) {
                                    if (result.data.adjuntoId != null) {
                                        $scope.distincion.adjunto.adjuntoId = result.data.adjuntoId;
                                        $scope.distincion.adjuntoId = result.data.adjuntoId;
                                        $scope.regFile = false;
                                    } else {
                                        $scope.distincion.adjunto = null;
                                        $scope.distincion.adjuntoId = null;
                                        $scope.regFile = true;
                                        // if (result.data.adjunto != null) {
                                        //     $scope.distincion.adjunto.adjuntoId = result.data.adjunto.adjuntoId;
                                        //     $scope.distincion.adjuntoId = result.data.adjunto.adjuntoId;
                                        //     $scope.regFile = false;
                                        // } else {
                                        //     $scope.distincion.adjunto = null;
                                        //     $scope.distincion.adjuntoId = null;
                                        //     $scope.regFile = true;
                                        // }
                                    }
                                    $scope.DistincionForm.$setPristine();
                                    toastr.success("Registro Actualizado");
                                    $scope.desabilitar = false;
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
        }


        $scope.validar = function () {
            try {
                if ($scope.DistincionForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    if ($scope.DistincionForm.$invalid) {
                        toastr.error("Complete los datos requeridos");
                        return false;
                    } else {
                        var Registro = {
                            "distincionId": $scope.distincion.distincionId,
                            "estadoFlujoId": 2
                        };
                        //$scope.distincionedit();

                        //Cambiar el estado del registro
                        $scope.distincion.estadoFlujoId = 2;
                        DistincionService.distincionedit($scope.distincion).then(
                                        function (result) {
                                           
                                            var Solicitud = {
                                                "ClavePersona": $scope.distincion.clavePersona,
                                                "TipoInformacionId": 4,
                                                "InformacionId": $scope.distincion.distincionId,
                                                "FechaSolicitud": new Date(),
                                                "EstadoFlujoId": 2,
                                                "titulo": $scope.distincion.reconocimiento
                                            }
                                            DistincionService.AddSolicitud(Solicitud).then(
                                        function (result) {
                                            
                                            var Bitacora = {
                                                "SolicitudId": result.data,
                                                "FechaMovimiento": new Date(),
                                                "ClavePersona": $scope.distincion.clavePersona,
                                                "Descripcion": "Se envió la solicitud",
                                                "EstadoFlujoId": 1
                                            }
                                           
                                            DistincionService.AddBitacoraSolicitud(Bitacora);
                                           
                                            var Mail = {
                                                "Modulo": "Capital Humano",
                                                "Empleado": $scope.distincion.nombreCompleto,
                                                "Seccion": "Reconocimientos",
                                                "TipoCorreo": 1,
                                                "ClavePersona": $scope.distincion.clavePersona
                                            }
                                            
                                            DistincionService.mailNotificacion(Mail);
                                            toastr.success("Solicitud Enviada!");
                                            $state.go("fichapersonal.distincion", { seccion: 'distinciones' });
                                        })
                                        },
                                        function (err) {
                                            $scope.desabilitar = false;
                                            console.error(err);
                                            $rootScope.globalRegresar();
                                        });
                    }
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        }

        $scope.deleteFile = function () {
            $scope.distincion.adjunto.nombre = "eliminar";
            // DistincionService.distincionedit($scope.distincion);
            // toastr.success("Archivo Eliminado!");
            $scope.distincion.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
            $scope.DistincionForm.$setDirty();    
        }
    }
})();