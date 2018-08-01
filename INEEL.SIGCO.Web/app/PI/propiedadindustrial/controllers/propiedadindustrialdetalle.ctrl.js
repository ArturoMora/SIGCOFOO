(function () {
    'use strict';
    angular
        .module("ineelPI")
        .controller('propiedadindustrialdetalleCtrl', ['AuthService', '$scope', 'PropiedadIndustrialService', "$stateParams", "globalGet", "$rootScope", "$state", "$filter", propiedadindustrialdetalleCtrl]);

    function propiedadindustrialdetalleCtrl(AuthService, $scope, PropiedadIndustrialService, $stateParams, globalGet, $rootScope, $state, $filter) {
        var id = $stateParams.id;
        window.scrollTo(0, 0);

        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        $scope.authentication = AuthService.authentication;

        $scope.volver = function () {
            $rootScope.globalRegresar();
        }

        $scope.autoresExternos = {};

        PropiedadIndustrialService.getbyidPropiedadIndustrial(id).then(
                 function (result) {
                     // PIExternoService.Persona(result.data.clavePersona).then(
                     // function (result) {
                     //     $scope.registro.nombrePersona = result.data.nombreCompleto;
                     // });
                     // PIExternoService.getByPIExterno(result.data.piExternoId).then(
                     // function (result) {
                     //     $scope.autoriie = result.data;
                     // });
                     // PIExternoService.getByPIExternoExt(result.data.piExternoId).then(
                     //function (result) {
                     //    $scope.autorexterno = result.data;
                     //});

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