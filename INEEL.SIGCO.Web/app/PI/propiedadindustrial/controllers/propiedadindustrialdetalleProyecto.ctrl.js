(function () {
    'use strict';
    angular
        .module("ineel.controllers")
        .controller('propiedadindustrialdetalleProyectoCtrl', ['AuthService', '$scope', 'ComunServiceProyectos', "$stateParams", "globalGet", "$rootScope", "$state", "$filter", propiedadindustrialdetalleProyectoCtrl]);

    function propiedadindustrialdetalleProyectoCtrl(AuthService, $scope, ComunServiceProyectos, $stateParams, globalGet, $rootScope, $state, $filter) {
        var id = $stateParams.id;
        window.scrollTo(0, 0);

        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        $scope.authentication = AuthService.authentication;

        $scope.volver = function () {
            $rootScope.globalRegresar();
        }

        $scope.autoresExternos = {};

        ComunServiceProyectos.getDetallesPropiedadIndustrial(id).then(
                 function (result) {
                                $scope.registro = result.data;
                     $scope.autoresExternos = $filter('filter')(result.data.inventores, { clavePersona: 'Externo' });

                     $scope.registro = result.data;
                     if ($scope.registro.adjunto == null) {
                         $scope.regFile = true;
                         $scope.archivos = 1;
                     }

                 },
                 function (error) {
                     toastr.error(error);

                 });

    }
}());