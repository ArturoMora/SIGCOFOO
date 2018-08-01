/// <reference path="../ProyectoItfGet.html" />
/*AYUDA:
personasService nombre de factory en empleado.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("SolicitudAccesoITFCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "AuthService", "itfsService",
        "MenuService", "SolicitudesMTService","$uibModal",
        SolicitudAccesoITFCtrl]);

    function SolicitudAccesoITFCtrl($scope, $state, $stateParams, AuthService,
        itfsService, MenuService, SolicitudesMTService, $uibModal) {
        $scope.authentication = AuthService.authentication;
        $scope.registros = [];
        $scope.cargaInicial = function () {
            SolicitudesMTService
                .GetAccesoITFByClaveUnidad($scope.authentication.userprofile.claveUnidad).then(
                        function (result) {
                            $scope.registros = result.data;
                        },
                        function (error) { }
                );
        }
        $scope.cargaInicial();
        $scope.aprobar = function (elem) {
            // alert("aprobar");
            $scope.idRol = MenuService.getRolId();
            $scope.datos = {
                SolicitudAccesoITFId: elem.solicitudAccesoITFId,
                justificacion: "",
                InformeTecnicoFinalId: elem.informeTecnicoFinal.informeTecnicoFinalId,
                ClavePersonaSolicitante: $scope.authentication.userprofile.clavePersona,
                ClaveUnidadDelSolicitante: $scope.authentication.userprofile.claveUnidad,
                EstadoFlujoId: 10,
                idRol: $scope.idRol,
                confirma: false
            };
            var correo = {};
            console.log("ACHelem:");
            console.log($scope.elem);
            correo.Modulo = "Memoria Tecnológica";
            //correo.TipoCorreo = "ApruebaRechazaGerenteITF";
            correo.TipoCorreo = "AprobacionAccesoAITF";
            correo.Descripcion1 = "<b>Solicitud de ACCESO a Informe T&eacute;cnico Final</b><br/>";
            correo.Descripcion3 = "<br/>Proyecto: " + elem.informeTecnicoFinal.proyecto.nombre + "<br/>No: " + elem.informeTecnicoFinal.proyecto.proyectoId;
            correo.Descripcion2 = "<h3>Solicitud de acceso aprobada</h3><br/>";
            correo.ClavePersona = elem.clavePersonaSolicitante;

            SolicitudesMTService.AprobarAccesoITF($scope.datos).then(
                function (result) {
                    console.log("result AprobarAccesoITF");
                    console.log(result);
                    toastr.success("Solicitud aprobada exitoxamente");
                    itfsService.sendCorreo(correo).then(
                        function (result) { },
                        function (error) {
                            console.log(error);
                        }
                    );
                    $scope.cargaInicial();
                },
                function (error) {
                    console.log("error AprobarAccesoITF");
                    console.log(error);
                    $scope.cargaInicial();

                }
            );
        }
        $scope.rechazar = function (elem) {
            // alert("rechazar");
            $scope.elem = elem;
                $scope.modalResult = {};

                $scope.result = {};
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    templateUrl: 'app/MT/solicitudesMT/DenegarRechazarAccesoITF.html',
                    controller: 'DenegarRechazarAccesoITF',
                    resolve: {
                        result: function () {
                            return $scope.datos;
                        }
                    },
                    scope: $scope
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.modalResult = selectedItem;
                    // alert(selectedItem.confirma);
                    $scope.cargaInicial();
                });

            
        }

    }

})();