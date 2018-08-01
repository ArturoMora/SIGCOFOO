(function () {
    'use strict';
    angular
        .module("ineelPI")
        .controller('historialpinagregarCtrl', [
            '$scope'
            , '$rootScope'
            , '$stateParams'
            , 'adjuntarArchivo'
            , 'PropiedadIndustrialService'
            , historialpinagregarCtrl]);

    function historialpinagregarCtrl($scope, $rootScope, $stateParams, adjuntarArchivo, PropiedadIndustrialService) {
        $scope.historia = {};
        $scope.historia.propiedadIndustrialId= $stateParams.id ;        

        $scope.getFileDetails = function (adjunto) {
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'PI' };
                    $scope.historia.adjunto = Adjunto;
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }

        $scope.guardahistorial = function () {

            PropiedadIndustrialService.createhistorialpi($scope.historia).then(
                function (result) {
                    toastr.success(result.data);
                    $rootScope.globalRegresar();
                },
                function (error) {
                    toastr.error(error.message);
                }
            );
        }

    }
}());