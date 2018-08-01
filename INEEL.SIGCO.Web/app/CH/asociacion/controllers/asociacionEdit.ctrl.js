(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("AsociacionesCtrlEdit", ['AuthService', '$scope', '$rootScope', 'AsociacionesService', 'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH",'$uibModal', AsociacionesCtrlEdit]);

    function AsociacionesCtrlEdit(AuthService, $scope, $rootScope, AsociacionesService, globalGet, $state, $filter, $stateParams, uploadFileACH,$uibModal) {
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
        //var id = $rootScope.idG;
        var id = $rootScope.getGlobalID();
        $scope.asociacion = {};
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        AsociacionesService.getAsociaciones()
                    .then(
                    function (result) {
                        $scope.asociaciones = result.data;
                    },
                    function (err) {
                        console.error(err);
                    });
        $scope.registro = {};
        //obtener el registro a editar
        $scope.registro = {};
        AsociacionesService.GetById(id).then(
            function (result) {
                $scope.asociacion = result.data;
                AsociacionesService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.asociacion.nombreCompleto = result.data.nombreCompleto;
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                    $scope.registro.clavePersona = result.data.clavePersona;
                });
                
                $scope.asociacionselect = $scope.asociacion.asociacion;
                $scope.asociacion.fechaInicio = new Date($scope.asociacion.fechaInicio);
                $scope.asociacion.fechaTermino = new Date($scope.asociacion.fechaTermino);
                if ($scope.asociacion.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
            },
            function (error) {
                toastr.error(error);
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
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.asociacion.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.asociacionForm.$setDirty();
                }
            });
           
        }


        $scope.regresar=function(){
            $state.go("fichapersonal.asociacion", { seccion: 'asociacion' });
        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////

        //modal asociaciones
        $scope.openAsociaciones = function () {
            $scope.desabilitar = true;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listaasociaciones.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.asociacion = {};
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $scope.asociacion = item;
                        $uibModalInstance.close($scope.asociacion);
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.asociacionselect = selectedItem;
                $scope.asociacion.asociacionId = selectedItem.asociacionId;
                $scope.asociacionForm.$setDirty();
            });
            $scope.desabilitar = false;
        }

        //editarregistro

        $scope.save = function () {
            if ($scope.asociacion.estadoFlujoId == 3) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/vistasGenericas/modificarValidados.html', controller: function ($uibModalInstance) {
                        $scope.ok = function () {
                            $scope.saveF();
                            $uibModalInstance.dismiss('cancel'); $scope.dtInstance._renderer.rerender();
                        }; $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
                    }, scope: $scope
                });
            } else {
                $scope.saveF();
            }
        }

        $scope.saveF = function () {
            if ($scope.asociacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            //Validacion Fechas
            $scope.hoy = new Date();
            $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
            if ($scope.asociacion.fechaInicio > $scope.hoy) {
                toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                return false;
            }
            //if ($scope.asociacion.fechaTermino > $scope.hoy) {
            //    toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
            //    return false;
            //}
            if ($scope.asociacion.fechaInicio >= $scope.asociacion.fechaTermino) {
                toastr.error("La fecha de inicio debe ser menor a la de término");
                return false;
            }
            if ($scope.editarGestion == 0) {
                $scope.asociacion.estadoFlujoId = 1;
            }
            /////////////////
            $scope.desabilitar = true;
            var registro={
                "ClavePersona": $scope.registro.clavePersona,
                "AsociacionId": $scope.asociacion.asociacionId,
                "FechaInicio": $scope.asociacion.fechaInicio,
                "FechaTermino": $scope.asociacion.fechaTermino,
                "AsociacionesId": id
            };

            AsociacionesService.ValidaRegistroDuplicado(registro).then(
                function(res){
                    if(res.data){
                        toastr.warning("Intente cambiar la asociación asociada o las fechas de inicio y término");
                        toastr.warning("Ya existe el registro!");
                        $scope.desabilitar = false;        
                        return false;
                    }
                    AsociacionesService.update($scope.asociacion).then(
                        function (result) {
                            if (result.data.adjuntoId != null) {
                                $scope.asociacion.adjunto.adjuntoId = result.data.adjuntoId;
                                $scope.asociacion.adjuntoId = result.data.adjuntoId;
                                $scope.regFile = false;
                            } else {
                                $scope.asociacion.adjunto = null;
                                $scope.asociacion.adjuntoId = null;
                                $scope.regFile = true;
                                // if (result.data.adjunto != null) {
                                //     $scope.asociacion.adjunto.adjuntoId = result.data.adjunto.adjuntoId;
                                //     $scope.asociacion.adjuntoId = result.data.adjunto.adjuntoId;
                                //     $scope.regFile = false;
                                // } else {
                                //     $scope.asociacion.adjunto = null;
                                //     $scope.asociacion.adjuntoId = null;
                                //     $scope.regFile = true;
                                // }
                            }
                            toastr.success("Registro Actualizado");
                            $scope.asociacionForm.$setPristine();
                            $scope.desabilitar = false;
                        },
                        function (err) {
                            console.error(err);
                            $scope.desabilitar = false;
                        });
                },function(err){
                    console.log(err);
                }
            );
            

        }

        $scope.validar = function () {
            try {
                if ($scope.asociacionForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    //Validacion Fechas
                    $scope.hoy = new Date();
                    $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                    if ($scope.asociacion.fechaInicio > $scope.hoy) {
                        toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                        return false;
                    }
                    //if ($scope.asociacion.fechaTermino > $scope.hoy) {
                    //    toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
                    //    return false;
                    //}
                    if ($scope.asociacion.fechaInicio >= $scope.asociacion.fechaTermino) {
                        toastr.error("La fecha de inicio debe ser menor a la de término");
                        return false;
                    }
                    /////////////////
                    //$scope.save();
                    var Registro = {
                        "asociacionesId": $scope.asociacion.asociacionesId,
                        "estadoFlujoId": 2
                    };
                    //Cambiar el estado del registro
                    $scope.desabilitar = true;
                    $scope.asociacion.estadoFlujoId = 2;
                    AsociacionesService.update($scope.asociacion).then(
                                    function (result) {
                                        var Solicitud = {
                                            "ClavePersona": $scope.asociacion.clavePersona,
                                            "TipoInformacionId": 3,
                                            "InformacionId": $scope.asociacion.asociacionesId,
                                            "FechaSolicitud": new Date(),
                                            "EstadoFlujoId": 2,
                                            "titulo": $scope.asociacionselect.descripcion
                                        }
                                        AsociacionesService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        //Bitacora
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.asociacion.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        AsociacionesService.AddBitacoraSolicitud(Bitacora);
                                        ////////////////
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.asociacion.nombreCompleto,
                                            "Seccion": "Asociaciones",
                                            "TipoCorreo": 1,
                                            "ClavePersona": $scope.asociacion.clavePersona
                                        }
                                        AsociacionesService.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");

                                        $state.go("fichapersonal.asociacion", { seccion: 'asociacion' });
                                    })
                                    },
                                    function (err) {
                                        $scope.desabilitar = false;
                                        console.error(err);
                                    });
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        }

        $scope.deleteFile = function () {
            $scope.asociacion.adjunto.nombre = "eliminar";
            //AsociacionesService.update($scope.asociacion);
            //toastr.success("Archivo Eliminado!");
            $scope.asociacion.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }
    }
})();