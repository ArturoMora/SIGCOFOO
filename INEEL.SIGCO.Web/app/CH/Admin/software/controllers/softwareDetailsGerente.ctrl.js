(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("softwareDetailsGerenteCtrl", ['AuthService', '$scope', 'softwareservice', 'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH", "$uibModal", "DTOptionsBuilder", "$rootScope", "comunService", 'MenuService', softwareDetailsGerenteCtrl]);

    function softwareDetailsGerenteCtrl(AuthService, $scope, softwareservice, globalGet, $state, $filter, $stateParams, uploadFileACH, $uibModal, DTOptionsBuilder, $rootScope, comunService, MenuService) {
        $scope.rolId = MenuService.getRolId(); if ($scope.rolId != 4) { toastr.error("No Autorizado"); $state.go("home"); return false; }

        var API = globalGet.get("api");

           

        var id = $rootScope.getGlobalID();
        var id2 = $rootScope.getGlobalID2();


        $scope.clavePersona = $rootScope.setGlobalClavePersonaSoftware;
        $scope.editablesss = $rootScope.detallemostrar;
        $scope.authentication = AuthService.authentication;


        $scope.justificacion="";
        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de un nuevo reconocimiento con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de un nuevo reconocimento con la siguiente justificación: " + $scope.justificacion + " ? ";
        //Cada vez que el usuario cambia la justificacion se actualiza el mensaje  //antes de esto el mensaje era estatico

        $scope.$watch("justificacion", function (newValue, oldValue) {

            $scope.desactivar = true;
            if(newValue !== oldValue){
                $scope.aprobacionQ="";
                $scope.rechazoQ="";
                $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de un nuevo reconocimiento con la siguiente justificación: " + $scope.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de un nuevo reconocimento con la siguiente justificación: " + $scope.justificacion + " ? ";
            }
        })


      


        softwareservice.getbyid(id).then(
            function (result) {
                $scope.SoftwarePersonal = result.data;
                softwareservice.Persona($scope.clavePersona).then(
                function (result) {
                    $scope.SoftwarePersonal.nombrePersona = result.data.nombreCompleto;
                });
            },
            function (error) {
                toastr.error(error);
            });


        $scope.save = function (opc) {


            if ($scope.justificacion == null && opc != 1) {
                toastr.error("Escriba una justificación");
                return false;
            }


            if ($scope.justificacion.length < 0 || $scope.justificacion == "" ) {
                toastr.error("Escriba una justificación");
                return false;
            }

            console.log("justificacion ");
            console.log($scope.justificacion);

            var Mail = {
                "Modulo": "Memoria Tecnológica",
                "Empleado": $scope.SoftwarePersonal.nombrePersona,
                "Seccion": "Software",
                "TipoCorreo": "NotificacionesGerente",
                "ClavePersona": $scope.clavePersona,
                "Descripcion1": "<b>Software:</b> " + $scope.SoftwarePersonal.nombre + "<br/>",
                "Descripcion2": "<b>Tipo de Software:</b> " + $scope.SoftwarePersonal.tipoSoftware.nombre + "<br/>",
                "Descripcion3": "<b>Proyecto:</b> " + $scope.SoftwarePersonal.proyecto.nombre + "<br/>",
                "Descripcion4": "",
                "Justificacion": $scope.justificacion,
                "Estado": ""
            }

            switch (opc) {
                case 1:
                    var registro = {
                        "solicitudId": id2,
                        "estadoFlujoId": 3
                    }
                    $scope.SoftwarePersonal.estadoFlujoId = 3;
                    $scope.SoftwarePersonal.fechaValidacion = new Date();
                    //$scope.registro.fechaValidacion = $scope.FechaValidacionAux;

                    softwareservice.updateEstado($scope.SoftwarePersonal).then(
                        function (result) {
                            toastr.success("Solicitud Aprobada!");
                            softwareservice.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: " + $scope.justificacion,
                                "EstadoFlujoId": 8,
                                "idRol": 4
                            }
                            softwareservice.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada"
                            softwareservice.mailNotificacion(Mail);
                            $state.go("solicitudesrh");
                        })
                        },
                        function (err) {
                            $scope.desactivar = false;
                            console.error(err);
                        });
                    break;
                case 2:
                    var registro = {
                        "solicitudId": id2,
                        "estadoFlujoId": 1
                    }
                    $scope.SoftwarePersonal.estadoFlujoId = 1
                    softwareservice.updateEstado($scope.SoftwarePersonal).then(
                        function (result) {
                            toastr.success("Solicitud Rechazada!");
                            softwareservice.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Rechazado: " + $scope.justificacion,
                                "EstadoFlujoId": 8,
                                "idRol": 4
                            }
                            softwareservice.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Rechazada"
                            softwareservice.mailNotificacion(Mail);
                            $state.go("solicitudesrh");
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
})();