(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("buscarPropuestaDetail", ['AuthService', '$scope', 'carteraPropuestaService', "$stateParams", "globalGet", "$rootScope", "MenuService", "solicitudesGIService", "bitacoraSolicitudService", "correoNotificacionService", "$state","planNegocioService", buscarPropuestaDetail]);

    function buscarPropuestaDetail(AuthService, $scope, carteraPropuestaService, $stateParams, globalGet, $rootScope, MenuService, solicitudesGIService, bitacoraSolicitudService, correoNotificacionService, $state, planNegocioService) {
        window.scrollTo(0, 0);
        $scope.rolId = MenuService.getRolId();
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        var id = $stateParams.id;
        if(id==undefined || id==null || id==''){
            id = $rootScope.getGlobalID();
        }
        $scope.id2 = $rootScope.getGlobalID2();
        //var id = $stateParams.id; //id no de la propuesta si no de la Idea, asumiendo que es una idea por propuesta
        //$scope.id2 = $stateParams.id2;
        $scope.registroPropuesta = {};
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        debugger;
        //obtener el registroPropuesta a mostrar
        $scope.descargaEvidencia = false;
        carteraPropuestaService.getPropuestaConIdeaByIdIdentity(id).then(
            function (result) {

                $scope.registroPropuesta = result.data;
                if ($scope.registroPropuesta.propuestaInterna == 'true' || $scope.registroPropuesta.propuestaInterna == true) {
                    $scope.expression = 'col-md-6 col-sm-6 col-xs-6';
                    $scope.requeridoPNE = true;
                } else {
                    $scope.expression = 'col-md-12 col-sm-12 col-xs-12';
                    $scope.requeridoPNE = false;
                }
                planNegocioService.getbyidPropuesta($scope.registroPropuesta.id).then(
                    function (result) {
                        debugger;
                        $scope.registro = result.data;
                        if ($scope.registro.adjunto == null) {
                            $scope.regFile = true;
                        } else {
                            $scope.regFile = false;
                            $scope.archivos = 1;
                        }
                    },
                    function (error) {
                        toastr.error(error);
                    });
                carteraPropuestaService.getDetailsAcceso($scope.registroPropuesta.id, $scope.ClavePersonaLogin).then(
                    function (result) {
                        if (result.data==true) {
                            $scope.descargaEvidencia = true;
                        }
                    }
                    );
                carteraPropuestaService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registroPropuesta.nombrePersona = result.data.nombreCompleto;
                });
            },
            function (error) {
                toastr.error(error);
            });
    }
})();