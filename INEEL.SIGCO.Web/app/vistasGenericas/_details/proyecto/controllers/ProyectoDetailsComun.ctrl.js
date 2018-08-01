(function () {
    "use strict";

    angular
    .module("ineel.controllers")
    .controller("ProyectoDetailsComunCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$stateParams",
        "globalGet",
        "$http",
        'comunService',
        ProyectoAsignadoDetailsCtrl
    ]);

    function ProyectoAsignadoDetailsCtrl(AuthService, $filter, $scope, $state, $stateParams, globalGet, $http, comunService) {
        debugger;
        
        var id = $stateParams.id;
        var API = globalGet.get("api");
        var service = {};
        // Get Proyecto
        service.getProyectoEmpresaAsignado = function (proyectoId) {
            var endpoint = API + "ProyectosEmpresa/GetAsignado/" + proyectoId;
            //var endpoint = API + "Proyectos/GetByIdFKs/" + proyectoId;
            return $http.get(endpoint);
        };
        service.getDetailEmpresa = function (empresaId) {
            var endpoint = API + "Empresas/GetEmpresa/" + empresaId;
            return $http.get(endpoint);
        }

        $scope.proyecto = {};
        $scope.empresa = {};

        service.getProyectoEmpresaAsignado(id).then(
        function (result) {
            $scope.proyecto = result.data;
            $scope.setEmpresa($scope.proyecto.empresa.empresaId);
            $scope.setUnidadProryecto($scope.proyecto.unidadOrganizacionalId);
        },
        function (err) {
            $scope.proyecto = {};
            toastr.error(data.exceptionMessage);
        });
        $scope.setEmpresa = function (idEmpresa) {
            service.getDetailEmpresa(idEmpresa).then(
            function (result) {
                $scope.empresa = result.data;
                debugger;
            },
            function (err) {
                console.error(err);
            });
        }
        $scope.setUnidadProryecto = function (idUnidad) {        
            comunService.UnidadOrganizacional.GetNameById(idUnidad).then(
                function (result) {
                    $scope.proyecto.unidadOrganizacional = result.data;
                },
                function (err) {
                    toastr.error(data.exceptionMessage);
                });
        }
        
    }
})();