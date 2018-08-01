(function () {
    'use strict';
    angular
        .module("ineelPI")
        .controller('historialpineditarCtrl', [
            '$scope'
            , '$stateParams'
            , '$uibModal'
            , 'adjuntarArchivo'
            , 'PropiedadIndustrialService'
            , historialpineditarCtrl]);

    function historialpineditarCtrl($scope, $stateParams, $uibModal, adjuntarArchivo, PropiedadIndustrialService) {
        $scope.historia = {};
        $scope.historialid = $stateParams.id;

        $scope.cargadatos = function () {

            PropiedadIndustrialService.gethistorialbyid($scope.historialid).then(
                function (response) {
                    $scope.historia = response.data;
                    if ($scope.historia.fechaAccion != null) {
                        $scope.historia.fechaAccion = new Date($scope.historia.fechaAccion);
                    }
                },
                function (error) {
                    toastr.error(error.message);
                }
            );
        }
        $scope.cargadatos();


        $scope.actualizarregistro = function () {
            PropiedadIndustrialService.updatehistorialpi($scope.historia).then(
                function (result) {
                    toastr.success(result.data);
                    $scope.cargadatos();
                },
                function (error) {
                    toastr.error(error.message);
                }
            );
        }




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

        $scope.deleteFile = function () {
            $scope.historia.adjunto = null;
            $scope.historia.adjuntoId = null;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }

    }
}());