/*AYUDA:
personasService nombre de factory en empleado.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("DenegarRechazarAccesoITF", [
        "$scope",
        "$state",
        "$stateParams",
        "AuthService", "itfsService", "MenuService", "SolicitudesMTService",
        "$uibModalInstance", DenegarRechazarAccesoITF]);

    function DenegarRechazarAccesoITF($scope, $state, $stateParams,AuthService, itfsService,MenuService,SolicitudesMTService,
         $uibModalInstance) {
        $scope.authentication = AuthService.authentication;
        $scope.idRol = MenuService.getRolId();
        //9 denegado, 6 modificación
        $scope.datos = {
            SolicitudAccesoITFId: $scope.elem.solicitudAccesoITFId,
            justificacion: "",
            InformeTecnicoFinalId: $scope.elem.informeTecnicoFinal.informeTecnicoFinalId,
            ClavePersonaSolicitante: $scope.authentication.userprofile.clavePersona,
            ClaveUnidadDelSolicitante: $scope.authentication.userprofile.claveUnidad,
            EstadoFlujoId: 9,
            idRol: $scope.idRol,
            confirma: false
        };
        var correo = {};
        console.log("ACHelem:");
        console.log($scope.elem);
        correo.Modulo = "Memoria Tecnológica";        
        //correo.TipoCorreo = "ApruebaRechazaGerenteITF";
        correo.TipoCorreo = "rechazoAccesoAITF";        
        correo.Descripcion1 = "<b>Solicitud de ACCESO a Informe T&eacute;cnico Final</b><br/>";
        correo.Descripcion3 = "<br/>Proyecto: " + $scope.elem.informeTecnicoFinal.proyecto.nombre + "<br/>No: " + $scope.elem.informeTecnicoFinal.proyecto.proyectoId;
        correo.Descripcion2 = "<h3>Solicitud de acceso rechazada</h3><br/>";
        correo.Justificacion = $scope.datos.justificacion;
        correo.ClavePersona = $scope.elem.clavePersonaSolicitante;

        $scope.localDenegar = function () {
            $scope.datos.EstadoFlujoId = 9;
            SolicitudesMTService.DenegarAccesoITF($scope.datos).then(
            function (result) {
                console.log("result DenegarAccesoITF");
                console.log(result);
                toastr.success("Solicitud denegada exitoxamente");
                correo.Justificacion = $scope.datos.justificacion;
                itfsService.sendCorreo(correo).then(
                    function (result) { },
                    function (error) {
                        console.log(error);
                    }
                );
                $scope.cargaInicial();
            },
            function (error) {
                console.log("error DenegarAccesoITF");
                console.log(error);
                $scope.cargaInicial();

            }
        );
        }
        $scope.localRechazoCondicional = function () {
            $scope.datos.EstadoFlujoId = 6;
            SolicitudesMTService.RechazoCondicionalAccesoITF($scope.datos).then(
            function (result) {
                console.log("result RechazoCondicionalAccesoITF");
                console.log(result);
                toastr.success("Solicitud rechazada exitoxamente");
                $scope.cargaInicial();
            },
            function (error) {
                console.log("error RechazoCondicionalAccesoITF");
                console.log(error);
                $scope.cargaInicial();

            }
        );
        }
        //8 'Revisión Gerente' CreateSolicitudAccesoITF
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        

        $scope.Denegar = function () {
            $scope.localDenegar();
            $uibModalInstance.close($scope.datos);
        }

        $scope.Rechazar = function () {
            $scope.localRechazoCondicional();            
            $uibModalInstance.close($scope.datos);
        }

    }


})();