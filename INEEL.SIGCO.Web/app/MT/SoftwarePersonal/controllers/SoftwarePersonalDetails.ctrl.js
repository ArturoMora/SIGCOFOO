(function () {
    "use strict";

    angular
    .module("ineel.controllers")
    .controller("SoftwarePersonalDetails", ["$rootScope",
        "$scope",
        "$state",
        "$stateParams",
        "softwarePersonalService", 'DTOptionsBuilder', 'comunService', 'AuthService',
        '$uibModal', 'AdminMT', 'MenuService',"IndicadoresMTService",
        SoftwarePersonalDetails
    ]);

    function SoftwarePersonalDetails($rootScope,$scope, $state, $stateParams, softwarePersonalService, DTOptionsBuilder, comunService, AuthService,
        $uibModal, AdminMT, MenuService, IndicadoresMTService) {
        var id = $stateParams.id;
        var tipoInformacion = 20; //20: Software
        $scope.esAutor = false;
        $scope.solicitudExistente = false;
        $scope.SoftwarePersonal = {};
        $scope.publico = false;
        $scope.autorizado = false;          
        $scope.jefeHiperonimo = false;
        $scope.authentication = AuthService.authentication;

      

        if ($rootScope.parametros == 'undefined' || $rootScope.parametros == null || $rootScope.parametros == undefined || $rootScope.parametros == "undefined") {
            $scope.TituloMiga = "";
        } else {
            if ($rootScope.parametros.nombreM == "Mi software") {
                $scope.TituloMiga = "/" + $rootScope.parametros.nombreM;
            } else {
                $scope.TituloMiga = "/Buscar software";
            }
        }



        if ($rootScope.parametrosSOFTAA1MT == 'undefined' || $rootScope.parametrosSOFTAA1MT == null || $rootScope.parametrosSOFTAA1MT == undefined || $rootScope.parametrosSOFTAA1MT == "undefined") {

        } else {
            $rootScope.parametrosSOFTAA1MT = $rootScope.parametrosSOFTAA1MT;

        }



        //var esAdmin = MenuService.getMenuMT()[0].idRol == AdminMT;
        var esAdmin = MenuService.getRolId() == AdminMT;

        $scope.EsAdministrador = esAdmin;

        var personaId = AuthService.authentication.userprofile.clavePersona;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);

        $scope.isJefe = function () {
            
            $scope.jefeHiperonimo = esAdmin;
            if ($scope.jefeHiperonimo == true) {
                $scope.publico = true;
            }

            if ($scope.SoftwarePersonal.tipoAcceso == 1) {
                $scope.publico = true;
            }


            var empleado = "";
            
            if (($scope.SoftwarePersonal.proyecto.numjefeProyecto != null && $scope.SoftwarePersonal.proyecto.numjefeProyecto == personaId) || esAdmin) {
                $scope.jefeHiperonimo = true;
                $scope.publico = true;
            } else {

            var Jerarquia = {
                UnidadOrganizacionalId: $scope.SoftwarePersonal.proyecto.unidadOrganizacionalId,
                JefeHiperonimo: personaId
            };
            comunService.isJefeHiperonimoByUnidadOrganizacionalId(Jerarquia).then(
                function (result) {
                    $scope.jefeHiperonimo = result.data;
                    if ($scope.publico==false && $scope.SoftwarePersonal.tipoAcceso != 1) {
                        $scope.publico = result.data;
                    }
                    $scope.solicitudPendiente();
                },
                function (error) { }
            );
        }


        }
        $scope.isAutor = function () {
            if ($scope.SoftwarePersonal.autores != null) {
                for (var i = 0; i < $scope.SoftwarePersonal.autores.length; i++) {
                    if ($scope.SoftwarePersonal.autores[i].claveAutor == personaId) {
                        $scope.esAutor = true;
                        return true;
                    }
                }
            }
            return false;
        }

        $scope.solicitudPendiente = function () {
            if ($scope.publico != true) {
                if ($scope.isAutor()) {
                    $scope.publico = true;
                }else{
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
        softwarePersonalService.GetByIdDetails(id).then(
            function (result) {
                $scope.SoftwarePersonal = result.data;
                $scope.isJefe();
                $scope.isAutor();

            },
            function (err) {
                $rootScope.globalError(err);
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
                "UnidadOrganizacionalId": $scope.SoftwarePersonal.proyecto.unidadOrganizacionalId,
                "justificacion": justificacion
            };

            // console.log("Guardar bitacora acceso");
            // console.log(bitacora);

            comunService.AddBitacoraSolicitudesAcceso(bitacora).then(
                function (result) { $scope.EnviarCorreo(justificacion, Tipo, Texto, estado); },
                function (error) { console.error(err); }
            );
            
        }

        $scope.EnviarCorreo = function (justificacion, Tipo, Texto) {
            var Mail = {
                "Modulo": "Memoria Tecnológica",
                "Empleado": $scope.authentication.userprofile.nombreCompleto,
                "Seccion": "MT / Software",
                "justificacion": justificacion,
                "Descripcion1": Texto,
                "TipoCorreo": Tipo,
                "UnidadOrganizacionalId": $scope.SoftwarePersonal.proyecto.unidadOrganizacionalId,
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
                "unidadAutorizadoraId": $scope.SoftwarePersonal.proyecto.unidadOrganizacionalId,
                "estadoFlujoId": estado,
                "moduloId": "MT"
            };

            // console.log("Guardar solicitud de acceso");
            // console.log(solicitud);

            //TODO:AQUI me quede1
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
            var dProyecto = $scope.SoftwarePersonal.proyecto.proyectoId.concat(" - ").concat($scope.SoftwarePersonal.proyecto.nombre)
            $scope.message = "Acceso al OC Software con el nombre <b>" + $scope.SoftwarePersonal.nombre + "</b> del proyecto " + dProyecto;
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
                "ocID": "SOFTW"
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