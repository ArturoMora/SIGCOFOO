/*AYUDA:
personasService nombre de factory en empleado.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("SolicitudAccesoITFModalCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "AuthService", "itfsService", "MenuService",
        "$uibModalInstance", SolicitudAccesoITFModalCtrl]);

    function SolicitudAccesoITFModalCtrl($scope, $state, $stateParams,AuthService, itfsService,MenuService,
         $uibModalInstance) {
        $scope.authentication = AuthService.authentication;
        $scope.idRol = MenuService.getRolId();
        $scope.datos = {
            justificacion: "",
            InformeTecnicoFinalId: $scope.itf.informeTecnicoFinalId,
            ClavePersonaSolicitante: $scope.authentication.userprofile.clavePersona,
            ClaveUnidadDelSolicitante: $scope.authentication.userprofile.claveUnidad,
            EstadoFlujoId: 8,
            idRol: $scope.idRol,
            confirma:false
        };
        //8 'Revisión Gerente' CreateSolicitudAccesoITF
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        

        $scope.ok = function () {

            itfsService.CreateSolicitudAccesoITF($scope.datos).then(
                    function (result) {
                        
                        var correo = {};
                        correo.Modulo = "Memoria Tecnológica";
                        correo.Empleado = $scope.authentication.userprofile.nombre + ' ' + $scope.authentication.userprofile.apellidoPaterno + ' ' + $scope.authentication.userprofile.apellidoMaterno;
                        correo.TipoCorreo = "CreateSolicitudAccesoITF";
                        correo.Descripcion1 = "<b>Solicitud de acceso a Informe T&eacute;cnico Final</b><br/>";
                        correo.Descripcion2 = "Proyecto: " + $scope.itf.proyecto.nombre;
                        correo.Justificacion = $scope.datos.justificacion;
                        correo.ClavePersona = $scope.datos.ClavePersonaSolicitante;
                        correo.UnidadOrganizacional = $scope.authentication.userprofile.unidadOrganizacional;
                        toastr.success("Solicitud registrada correctamente");
                        itfsService.CorreoCreateSolicitudAccesoITF(correo).then(
                            function (result) { },
                            function (error) { }
                        );
                    },
                    function (err) {
                        try{
                            toastr.error(err.data.exceptionMessage);
                        }catch(e){}
                        console.error(err);
                       
                    });


            $scope.datos.confirma = true;
            $uibModalInstance.close($scope.datos);
        }

    }


})();