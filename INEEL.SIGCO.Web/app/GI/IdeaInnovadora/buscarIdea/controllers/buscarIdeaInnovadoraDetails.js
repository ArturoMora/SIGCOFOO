(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("buscarIdeaInnovadoraDetails", ['AuthService', '$scope', '$stateParams', 'IdeainnovadoraService', "$rootScope", "MenuService", "comiteService", "miembrosGEService", "solicitudesGIService", "bitacoraSolicitudService", "$state", "correoNotificacionService", "EvaluadorIdeaService", "tipoAccesoService", buscarIdeaInnovadoraDetails]);

    function buscarIdeaInnovadoraDetails(AuthService, $scope, $stateParams, IdeainnovadoraService, $rootScope, MenuService, comiteService, miembrosGEService, solicitudesGIService, bitacoraSolicitudService, $state, correoNotificacionService, EvaluadorIdeaService, tipoAccesoService) {
        var id = $stateParams.id;
        if (id === undefined || id == null || id == "") {
            id = $rootScope.getGlobalID();
        }
        
        var id2 = $rootScope.getGlobalID2();
        window.scrollTo(0, 0)
        $scope.rolId = MenuService.getRolId();
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        $scope.notificados = [];
        $scope.comiteselect = {};
        $scope.comiteexist = {};
        $scope.showEval = true;
        $scope.descargaEvidencia = false;
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar
        IdeainnovadoraService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                IdeainnovadoraService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                });

                if ($scope.rolId != 1028 && $scope.rolId != 1029) {
                    IdeainnovadoraService.getDetailsAcceso($scope.registro.ideaInnovadoraId, $scope.ClavePersonaLogin).then(
                        function (result) {
                            if (result.data == true) {
                                $scope.descargaEvidencia = true;
                            }});
                } else {
                    //En caso de ser Administrador GI o Evaluador
                    $scope.descargaEvidencia = true;
                }

            }, function (error) {
                toastr.error(error);
            });

        //Obtener comentarios
        EvaluadorIdeaService.getComentarios(id).then(
            function (result) {
                $scope.comentariosIdea = result.data;
            }, function (error) {
                toastr.error(error);
            });
        //obtener comite
        comiteService.get().then(
            function (result) {
                $scope.comites = result.data;
            }, function (error) {
                toastr.error(error);
            });
        //obtener tipo de acceso
        tipoAccesoService.get().then(
            function (result) {
                $scope.tiposAccesos = result.data;
            }, function (error) {
                toastr.error(error);
            });

        //proponentes
        IdeainnovadoraService.getProponentes(id).then(
                            function (result) {
                                $scope.proponentes = result.data;
                               
                            });

    }
})();