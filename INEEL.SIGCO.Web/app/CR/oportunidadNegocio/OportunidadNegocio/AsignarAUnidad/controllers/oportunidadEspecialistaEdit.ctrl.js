
(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("OportunidadEspecialistaEditCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$uibModal",
        'globalGet',
        'MenuService',
        'FileUploader',
        'uploadFileACH',
        "$stateParams",
        "DTOptionsBuilder",
        "ContactosCRService",
        "OportunidadNegocioCRService",
         OportunidadEspecialistaEditCtrl
    ]);

    function OportunidadEspecialistaEditCtrl(AuthService, $filter, $scope, $state, $uibModal, globalGet, MenuService, FileUploader, uploadFileACH, $stateParams, DTOptionsBuilder, ContactosCRService, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;
        
        $scope.datePicker50 = getRangoDeFechaDefault(0, 0, 50);
        // desdel el 75 a 50 años de la fecha actual

        $scope.noEmpleado = AuthService.authentication.userprofile.clavePersona;
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        $scope.tiposEventos = [];
        $scope.tasklist = [];
        $scope.tasklistA = [];
        $scope.adjuntosRuta = [];
        $scope.adjuntosNombre = [];
        $scope.medios = [];
        $scope.eventos = [];
        $scope.evento = {};
        $scope.oportunidad = {};
        $scope.oportunidad.AdjuntoPorOportunidad = [];
        $scope.adjuntosDelete = [];
        var nombreEstado;
        var comentarios;

        $scope.PaginaReferencia = "misOportunidadesAsignadas";
       
        $scope.adjuntos = [];
        $scope.contacto = {};
        var id;
        var idMedioComunicacion;
        var API = globalGet.get("api");
        $scope.adjuntosA = [];

        $scope.menuState = {}
        $scope.menuState.show = false;
        $scope.idRol = MenuService.getRolId();
        $scope.oportunidadNegocioId = $stateParams.id;

        OportunidadNegocioCRService.getEstadosON().then(
          function (result) {
              $scope.estadosON = result.data;
          },
          function (err) {
              toastr.error(err);
          }
       );

        OportunidadNegocioCRService.getOportunidad($scope.oportunidadNegocioId).then(
        function (result) {
            $scope.oportunidad = result.data;
            $scope.oportunidad.fecha = new Date($scope.oportunidad.fecha);
            $scope.contacto = $scope.oportunidad.contacto;
            $scope.contacto.nombreEmpresa = $scope.oportunidad.empresa.nombreEmpresa;
            $scope.oportunidadHistorica = result.data;

            if ($scope.idRol == 1025) {
                $scope.menuState.show = true;
            }
            if ($scope.oportunidad.evento != null) {
                $scope.nombreEvento = $scope.oportunidad.evento.nombreEvento;
            }

            $scope.EstadoActualOn = $scope.oportunidad.estadoONId;
        },
        function (err) {
            toastr.error(err);
        });

        $scope.saveOportunidad = function () {
            if ($scope.oportunidadEditForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                ;
                $scope.oportunidad.adjuntoPorOportunidad = $scope.tasklist;
                $scope.oportunidad.adjuntosDelete = $scope.adjuntosDelete;
                OportunidadNegocioCRService.updateOportunidadEspecialista($scope.oportunidad).then(
                    function (result) {
                        toastr.success(result.data);
                        $state.go("misOportunidadesAsignadas");
                    },
                    function (err) {
                        toastr.error(data.InnerException.Message);
                    });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            var propiedades = {
                file: adjunto.files[0],
                ext: "*", /* pdf;doc;docx;ppt */
                type: Date.now(),// '*', /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            //pueden utilizar la misma API para los diferentes modulos: API + "FileUploadMT/UploadFiles/"
            uploadFileACH.upload(propiedades,
            function (err, result) {
                if (!err) {
                    if (!result.error) {
                        transferComplete(result);
                        $(":file").filestyle('clear');
                    } else {
                        toastr.error(result.message);
                        $(":file").filestyle('clear');
                    }
                } else {
                    var error = err.message || "Error al adjuntar";
                    toastr.error(error);
                    $(":file").filestyle('clear');
                }
            });
        };

        $scope.deleteTaskAdjunto = function (index) {
            $scope.tasklist.splice(index, 1);
            angular.element("input[type='file']").val(null);
            $scope.oportunidadEditForm.$setDirty();
        }

        $scope.deleteTaskAdjuntoOld = function (index, id) {
            $scope.oportunidad.adjuntoPorOportunidad.splice(index, 1);
            angular.element("input[type='file']").val(null);
            $scope.adjuntosDelete.push(id);
            $scope.oportunidadEditForm.$setDirty();
        }
        // CONFIRMATION.        
        function transferComplete(result) {
            $scope.$apply(function () {
                $scope.siguienteIG = false;
                if (!result.error) {
                    var idx5 = $scope.adjuntosA.indexOf(result.nameFile.toString);
                    if (idx5 > -1) {
                        toastr.error("El archivo ya ha sido anexado anteriormente, indique otro");
                    }
                    else {
                        $scope.tasklist.push(
                            {
                                "nameFile": result.nameFile,
                                "fullpath": result.fullPathFile,
                                "oportunidadNegocioId": $scope.oportunidadNegocioId,
                                "Autor": $scope.nombreEmpleado,
                                "Adjunto": 
                                    {
                                        "Nombre": result.nameFile,
                                        "RutaCompleta": result.fullPathFile
                                    }
                            });
                    $scope.oportunidadEditForm.$setDirty();
                    }
                }
            });
        }

        $scope.actualizar = function () {

            /*
            debugger;
            if ($scope.oportunidad.estadoONId == 3) {
                $scope.oportunidad.estadoFlujoONId = 3
            }

            if ($scope.oportunidad.estadoONId == 2) {
                $scope.oportunidad.estadoFlujoONId = 14
            }
            */

           // $scope.message = "¿Deseas cancelar la oportunidad?";
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CR/oportunidadNegocio/OportunidadNegocio/SeguimientoOportunidad/CambioEstado.html',
                controller: 'CambioEstadoCtrl',
                scope: $scope

            });
            modalInstance.result.then(function (selectedItem) {

            });
        }

        $scope.guardar = function () {
            //debugger;
            //var edo = $scope.oportunidad.estadoONId;
            //switch (edo) {
            //    case 3:
            //        if ($scope.oportunidad.porQueCancela == null || $scope.oportunidad.porQueCancela == "") {
            //            toastr.error("Debe escribir el motivo de la cancelaci\u00f3n");
            //            return;
            //        }
            //        break
            //    case 4:
            //        if ($scope.oportunidad.tituloPropuesta == null || $scope.oportunidad.tituloPropuesta == ""){
            //            toastr.error("Debe escribir el titulo de la propuesta");
            //            return;
            //        }
            //        if ($scope.oportunidad.noIniciativa == null || $scope.oportunidad.noIniciativa == ""
            //            && $scope.oportunidad.noPropuesta == null || $scope.oportunidad.noPropuesta == "") {
            //            toastr.error("Debe escribir no. iniciativa o no. propuesta");
            //            return;
            //        }
            //        break
            //    case 2:
            //        if ($scope.oportunidad.porQueSuspende == null || $scope.oportunidad.porQueSuspende == ""
            //            || $scope.oportunidad.fechaReactivacion == null || $scope.oportunidad.fechaReactivacion == "") {
            //            toastr.error("Debe ingresar motivo y fecha para suspender la oportunidad");
            //            return;
            //        }
            //        break
            //    default:
            //}

            //if ($scope.oportunidad.estadoONId == 3) {
                $scope.actualizar();
            //}
        }

        $scope.enviarCorreos = function () {
            var estado = $scope.oportunidad.estadoONId;
            switch (estado) {
                case 1:
                    nombreEstado = "Seguimiento";
                    break
                case 2:
                    nombreEstado = "Suspendida Temporalmente";
                    break
                case 3:
                    nombreEstado = "Cancelada";
                    break
                case 4:
                    nombreEstado = "En Iniciativa o Propuesta";
                    break
                default:

            }

            $scope.datosCorreos();
            //notificar Especialista
            var MailEspecialista = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.nombreEmpleado,
                "Descripcion3": nombreEstado,
                "Descripcion4": comentarios,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de Negocio modificada por investigador",
                "ClavePersona": $scope.oportunidad.especialista,
                "TipoCorreo": "SeguimientoNotificarEstadoEspecialista"
            }
            OportunidadNegocioCRService.mailNotificacion(MailEspecialista);

            //notificar al empleado
            if ($scope.oportunidad.notificar == true) {
                var MailEmpleado = {
                    "Modulo": "Capital Relacional",
                    "Empleado": $scope.oportunidad.autor,
                    "Descripcion1": $scope.oportunidad.nombreOportunidad,
                    "Descripcion2": $scope.nombreEmpleado,
                    "Descripcion3": nombreEstado,
                    "Descripcion4": comentarios,
                    "Seccion": "Oportunidad de Negocios",
                    "tituloON": " - Oportunidad de Negocio   modificada por investigador",
                    "ClavePersona": $scope.oportunidad.claveEmpleado,
                    "TipoCorreo": "SeguimientoNotificarEstadoEmpleado"
                }
                OportunidadNegocioCRService.mailNotificacion(MailEmpleado);
            }
            //notificar responsable de unidad
            var MailResponsable = {

                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.nombreEmpleado,
                "Descripcion3": nombreEstado,
                "Descripcion4": comentarios,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de Negocio modificada por investigador",
                "ClavePersona": $scope.oportunidad.responsable,
                
                "TipoCorreo": "SeguimientoNotificarEstadoResponsable"
            }
            OportunidadNegocioCRService.mailNotificacion(MailResponsable);

            //notificar al administrador
            var MailAdministrador = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.oportunidad.autor,
                "Descripcion1": $scope.oportunidad.nombreOportunidad,
                "Descripcion2": $scope.nombreEmpleado,
                "Descripcion3": nombreEstado,
                "Descripcion4": comentarios,
                "Seccion": "Oportunidad de Negocios",
                "tituloON": " - Oportunidad de Negocio modificada por investigador",
                //"ClavePersona": $scope.oportunidad.responsable,
                "TipoCorreo": "SeguimientoNotificarEstadoAdministrador"
            }
            OportunidadNegocioCRService.mailNotificacion(MailAdministrador);
        }

        $scope.datosCorreos = function () {
            switch ($scope.oportunidad.estadoONId) {
                case 2:
                    comentarios = $scope.oportunidad.porQueSuspende;
                    break;
                case 3:
                    comentarios = $scope.oportunidad.porQueCancela;
                    break;
                case 4:
                    comentarios = $scope.oportunidad.tituloPropuesta;
                    break;
                default:

            }
        }


    }
})();

