(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("FondoProgramaDetailsCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$stateParams",
            "FondosProgramaCRService",
            FondoProgramaDetailsCtrl
        ]);

    function FondoProgramaDetailsCtrl(AuthService, $scope, $state, $stateParams, FondosProgramaCRService) {
        $scope.fondoPrograma_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;


        FondosProgramaCRService.getFondoProgramaFKById($scope.fondoPrograma_id).then(
            function (result) {
                $scope.fondosPrograma = result.data;
                $scope.proyectosFondo();
            },
            function (err) {
                console.error(err);
            });

        $scope.proyectosFondo = function () {
            FondosProgramaCRService.GetProyectosByFondo($scope.fondoPrograma_id).then(
                function (result) {
                    $scope.proyectos = result.data;
                },
                function (err) {
                    console.error(err);
                });
        }



        //Consultar estado
        $scope.consultaEstado = function (estado) {
            var _estado;

            if (estado) {
                _estado = "Activo";
            } else {
                _estado = "Inactivo";
            }
            return _estado;
        }

        //ObtenerTematicas Para checks
        FondosProgramaCRService.getAreasTematicasChecks().then(
            function (result) {
                $scope.areasTematicas = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de Tem&aacute;ticas ");
            });

        //ObtenerSitiosWeb Por Fondo Programa
        FondosProgramaCRService.getSitiosWebFP().then(
            function (result) {
                $scope.sitiosWeb = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los Sitios Web ");
            });
    }
})();