(function () {
    "use strict";

    angular
    .module("ineelMT")
    .controller("BuscarInsumosDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "buscarInsumosService",
        "globalGet",
        "$uibModal",
        "comunService",
        "AdminMT",
        "MenuService","$rootScope","IndicadoresMTService",
        BuscarInsumosDetailsCtrl
    ]);

    function BuscarInsumosDetailsCtrl(AuthService, $scope, $state, $stateParams, buscarInsumosService, globalGet, $uibModal, comunService, AdminMT, MenuService, $rootScope, IndicadoresMTService) {
        var publico = 1;
        var reservado = 2;
        var id = $stateParams.id;
        var tipoInformacion = 22; //22: Insumo
        $scope.publico = false;
        $scope.controlAcceso = "Reservado";
        var esAdmin = MenuService.getRolId() == AdminMT; //MenuService.getMenuMT()[0].idRol == AdminMT;
        $scope.solicitudExistente = false;
        $scope.registro = {};
        $scope.publico = false;
        $scope.autorizado = false;
        $scope.jefeHiperonimo = false;
        $scope.authentication = AuthService.authentication;
        var personaId = AuthService.authentication.userprofile.clavePersona;
        var roles = AuthService.authentication.userprofile.roles;
        var API = globalGet.get("api");

        //$scope.urlDescarga = API.concat("Descarga/GetFile");
        $scope.urlDescarga = API + "Descarga/GetFile";


        if ($rootScope.parametrosInsumosMT == 'undefined' || $rootScope.parametrosInsumosMT == null || $rootScope.parametrosInsumosMT == undefined || $rootScope.parametrosInsumosMT == "undefined") {

        } else {
            $rootScope.parametrosInsumosMT = $rootScope.parametrosInsumosMT;

        }


        $scope.isJefe = function () {
        
            $scope.jefeHiperonimo = esAdmin;
            if ($scope.jefeHiperonimo==true) {
                $scope.publico = true;
            }

           
            if ($scope.registro.tipoAcceso == 1) {
                $scope.publico = true;
            }
            var empleado = "";

            if (($scope.registro.informeTecnicoFinal.proyecto.numjefeProyecto != null && $scope.registro.informeTecnicoFinal.proyecto.numjefeProyecto == personaId) || esAdmin) {
                $scope.jefeHiperonimo = true;
                $scope.publico = true;
            } else {
                var Jerarquia = {
                    UnidadOrganizacionalId: $scope.registro.informeTecnicoFinal.proyecto.unidadOrganizacionalId,
                    JefeHiperonimo: personaId
                };
                comunService.isJefeHiperonimoByUnidadOrganizacionalId(Jerarquia).then(
                    function (result) {
                        $scope.jefeHiperonimo = result.data;
                        if ($scope.publico==false && $scope.registro.tipoAcceso != 1) {
                            $scope.publico = result.data;
                        }
                        $scope.solicitudPendiente();
                    },
                    function (error) { }
                );
            }


        }
        $scope.solicitudPendiente = function () {
            if ($scope.publico != true) {
                if (false) { //$scope.isAutor() 
                    $scope.publico = true;
                } else {
                    comunService.existeSolicitudByPersonaInformOCIdANDestadoFlujo(personaId, id, 8).then(
                        function (result) {
                            $scope.solicitudExistente = result.data;

                            if ($scope.solicitudExistente != true) {
                                comunService.existeSolicitudByPersonaInformOCIdANDestadoFlujo(personaId, id, 10).then(
                                function (result) {

                                    if (result.data != true)
                                        $scope.publico = false;
                                    else if (result.data == true) {
                                        $scope.publico = true;
                                        $scope.autorizado = true;
                                    }
                                },
                                function (error) { }
                            );
                            }
                        },
                        function (error) { }
                    );
                }
            }
        }

        buscarInsumosService.getInsumo(id).then(
            function (result) {
                $scope.registro = result.data;
                
               
                if ($scope.registro.tipoAccesoIns == 1)  //False es privado, True es publico || 1 publico 2 reservado
                {
                    $scope.publico = true;
                    $scope.controlAcceso = "Publico";

                } else {
                    $scope.isJefe();
                }
            },
            function (err) {
                console.error(err);
            });
        $scope.GuardarBitacoraAcceso = function (idNewSolicitudAcceso, justificacion, Tipo, Texto, estado) {
            //EstadoFlujoId	Descripcion :: //2	Revisión
            
            var bitacora = {
                "solicitudAccesoId": idNewSolicitudAcceso,
                "fechaMovimiento": new Date(),
                "clavePersona": personaId,
                "descripcion": "Se envió la solicitud",
                "estadoFlujoId": estado,
                "rolAutorizador": 4,
                "UnidadOrganizacionalId": $scope.registro.informeTecnicoFinal.proyecto.unidadOrganizacionalId,
                "justificacion": justificacion
            };
            comunService.AddBitacoraSolicitudesAcceso(bitacora).then(
                function (result) { debugger; $scope.EnviarCorreo(justificacion, Tipo, Texto, estado); },
                function (error) { }
            );
        }
        $scope.EnviarCorreo = function (justificacion, Tipo, Texto) {
           
            var Mail = {
                "Modulo": "Memoria Tecnológica",
                "Empleado": $scope.authentication.userprofile.nombreCompleto,
                "Seccion": "MT / Insumo",
                "justificacion": justificacion,
                "Descripcion1": Texto,
                "TipoCorreo": Tipo,
                "UnidadOrganizacionalId": $scope.registro.informeTecnicoFinal.proyecto.unidadOrganizacionalId,
                "Subject": "Solicitud de acceso"
            };
            //tipo accesoGEN funciona para cualquier notificación dirigida al responsable de una unidad org
            comunService.mailNotificacion(Mail);
        }
        $scope.GuardarSolicitudAcceso = function (justificacion, Tipo, Texto, estado) {
         
            var solicitud = {
                "clavePersonaSolicitante": personaId,
                "tipoInformacionId": tipoInformacion,
                "informacionOCId": id,
                "fechaSolicitud": new Date(),
                "unidadAutorizadoraId": $scope.registro.informeTecnicoFinal.proyecto.unidadOrganizacionalId,
                "estadoFlujoId": estado,
                "moduloId": "MT"
            };
            //TODO:AQUI me quede
            comunService.solicitarAcceso(solicitud).then(
                function (result) {
                 
                    toastr.success("Solicitud enviada");
                    $scope.GuardarBitacoraAcceso(result.data.solicitudAccesoId, justificacion, Tipo, Texto, estado);
                    //$scope.EnviarCorreo(justificacion, Tipo, Texto, estado);

                    $scope.solicitudExistente = true;

                },
                function (err) {
                    toastr.error("Problema al enviar la solicitud");
                    console.error(err);
                });
        }

        $scope.solicitarAcceso = function () {
           
            var dProyecto = $scope.registro.informeTecnicoFinal.proyecto.proyectoId.concat(" - ").concat($scope.registro.informeTecnicoFinal.proyecto.nombre)
            $scope.message = "Acceso al OC Insumo <b>" + $scope.registro.descripcionIns + "</b> del proyecto " + dProyecto;
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
        }


        $scope.registraAcceso = function () {

          
            var datos = {
                "claveEmpleado": AuthService.authentication.userprofile.clavePersona,
                "fecha": new Date(),
                "modulo": "MT",
                "ocID": "INSUM"
            }

            IndicadoresMTService.AddAccesoModulosOC(datos).then(
                function (result) {
                    //$scope.soliResult = result.data;
                },
                function (error) {
                    toastr.error(error);
                });
        }

        $scope.registraAcceso();

    }
})();