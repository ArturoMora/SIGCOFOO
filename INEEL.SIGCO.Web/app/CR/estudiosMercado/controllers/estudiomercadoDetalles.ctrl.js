(function () {
    "use strict";
    angular
        .module("ineelCR")
        .controller("estudiosmercadoCtrlDetalles", ['AuthService', '$scope', 'EstudioMercadoService', "$rootScope", "globalGet", "comunService","$uibModal","MenuService","$stateParams","$location", estudiosmercadoCtrlDetalles]);

    function estudiosmercadoCtrlDetalles(AuthService, $scope, EstudioMercadoService, $rootScope, globalGet, comunService, $uibModal, MenuService, $stateParams, $location) {
        $scope.idRol = MenuService.getRolId();
        var API = globalGet.get("api");
        var personaId = AuthService.authentication.userprofile.clavePersona;
        $scope.urlDescarga = API + "Descarga/GetFile";
        var id;
        id = $rootScope.getEMId;
        if (id == null) {
            id = $stateParams.id;
        }

        $scope.permiso = 0;

        $scope.esAutor = false;

        $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;

        var busquedaAcceso = {
            "clavePersonaSolicitante": $scope.clavePersona,
            "tipoInformacionId": 23,
            "informacionOCId": id,
            "moduloId": "CR"
        };

        EstudioMercadoService.accesoArchivo(busquedaAcceso).then(
            function (result) {
                $scope.permiso = result.data;
            },
            function (error) {
                toastr.error(error);
        });


        $scope.autores = [];
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        EstudioMercadoService.getById(id).then(
            function (result) {
                $scope.registro = result.data;


                var Jerarquia = {
                    UnidadOrganizacionalId: $scope.registro.claveUnidad,
                    JefeHiperonimo: $scope.clavePersona
                };

                comunService.isJefeHiperonimoByUnidadOrganizacionalId(Jerarquia).then(
                    function (result) {
                        $scope.esjefe = result.data;
                    },
                    function (error) { }
                );


              
                EstudioMercadoService.autores(id).then(
                    function (result) {

                       
                        $scope.autores = result.data;
                        $scope.esAutor = $scope.eresAutor();

                    },
                    function (err) {
                        toastr.error("No se ha podido cargar el Estudio de Mercado.");
                    }
                );

            },
            function (error) {
                toastr.error(error);
            });



        $scope.eresAutor = function () {
                       
            for (var i = 0; i < $scope.autores.length; i++) {
                if ($scope.clavePersona == $scope.autores[i].clavePersona) {
                    return true;
                } else {
                    return false;
                } 
            }

        }

        $scope.acceso = function () {
            $scope.message = "Acceso al archivo adjunto del Estudio de Mercado del tema <b>" + $scope.registro.tema + "</b> ";
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/SolicitarAccesoGenerico.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function (justificacion) {
                        $scope.var = modalInstance.result;
                        //Enviar Correo     
                        var Tipo = "accesoGEN";
                        var estado = 8;// 8,9,10
                        //var Texto = "solicita descargar los archivos adjuntos de cursos relacionadas al proyecto <b> ";
                        //$scope.EnviarCorreo(justificacion, Tipo, Texto, estado);
                        $uibModalInstance.dismiss('cancel');
                        var Texto = $scope.message + "<br/>";

                        $scope.GuardarSolicitudAcceso(justificacion, Tipo, Texto, estado);
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };
        
        $scope.GuardarSolicitudAcceso = function (justificacion, Tipo, Texto, estado) {
            var solicitud = {
                "clavePersonaSolicitante": personaId,
                "tipoInformacionId": 23,
                "informacionOCId": id,
                "fechaSolicitud": new Date(),
                "unidadAutorizadoraId": $scope.registro.claveUnidad,
                "estadoFlujoId": estado,
                "moduloId": "CR"
            };
           
            comunService.solicitarAcceso(solicitud).then(
                function (result) {
                    toastr.success("Solicitud enviada");
                    $scope.GuardarBitacoraAcceso(result.data.solicitudAccesoId, justificacion, Tipo, Texto, estado);
                    //$scope.EnviarCorreo(justificacion, Tipo, Texto, estado);
                  
                    EstudioMercadoService.accesoArchivo(busquedaAcceso).then(
                     function (result) {
                         $scope.permiso = result.data;
                     },
                    function (error) {
                        toastr.error(error);
                    });
                    $scope.solicitudExistente = true;

                },
                function (err) {
                    toastr.error("Problema al enviar la solicitud");
                    console.error(err);
                });
        }

        $scope.GuardarBitacoraAcceso = function (idNewSolicitudAcceso, justificacion, Tipo, Texto, estado) {
            //EstadoFlujoId	Descripcion :: //2	Revisión
            var bitacora = {
                "solicitudAccesoId": idNewSolicitudAcceso,
                "fechaMovimiento": new Date(),
                "clavePersona": personaId,
                "descripcion": "Se envió la solicitud",
                "estadoFlujoId": estado,
                "rolAutorizador": 4,
                "UnidadOrganizacionalId": $scope.registro.claveUnidad,
                "justificacion": justificacion
            };
            comunService.AddBitacoraSolicitudesAcceso(bitacora).then(
                function (result) { $scope.EnviarCorreo(justificacion, Tipo, Texto, estado); },
                function (error) { }
            );
        }

        $scope.EnviarCorreo = function (justificacion, Tipo, Texto) {
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.authentication.userprofile.nombreCompleto,
                "Seccion": "CR / Estudio de Mercado",
                "justificacion": justificacion,
                "Descripcion1": Texto,
                "TipoCorreo": Tipo,
                "UnidadOrganizacionalId": $scope.registro.claveUnidad,
                "Subject": "Solicitud de acceso"
            };
            //tipo accesoGEN funciona para cualquier notificación dirigida al responsable de una unidad org
            comunService.mailNotificacion(Mail);
        }

        $scope.regresar = function () {
            var absUrl = $location.absUrl();
            var arrayUrl = absUrl.split("IndexCR.html");
            var host = arrayUrl[0];
            var to = "sigco.html#/SolicitudesAcceso"
            window.location = host + to;
        }

      

    }
})();