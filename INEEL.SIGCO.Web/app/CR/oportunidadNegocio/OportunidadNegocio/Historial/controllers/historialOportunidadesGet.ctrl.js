(function () {
    'use strict';
    angular
        .module("ineelCR")
        .controller('HistorialOportunidadesCtrl', [
            '$rootScope',
            '$scope',
            'MenuService',
            'DTOptionsBuilder',
            'OportunidadNegocioCRService',
            HistorialOportunidadesCtrl
        ]);

    function HistorialOportunidadesCtrl($rootScope, $scope, MenuService, DTOptionsBuilder, OportunidadNegocioCRService) {

        $scope.oportunidadHistorica = [];
        $scope.oportunidades = [];

        $scope.PaginaReferencia1 = "historialOportunidades";

        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('order', [3, 'desc']);

        OportunidadNegocioCRService.getOportunidadesDonnut().then(
            function (result) {
                $scope.oportunidades = result.data;
            },
            function (err) {
                toastr.error(err.data);
        });
        
        $rootScope.parametros = {};
        $scope.pagRef = function () {
            $rootScope.parametros.pag = "historialOportunidades";
        }

        function removeAccents(data) {
            return data
                .replace(/έ/g, 'ε')
                .replace(/[ύϋΰ]/g, 'υ')
                .replace(/ό/g, 'ο')
                .replace(/ώ/g, 'ω')
                .replace(/ά/g, 'α')
                .replace(/[ίϊΐ]/g, 'ι')
                .replace(/ή/g, 'η')
                .replace(/\n/g, ' ')
                .replace(/á/g, 'a')
                .replace(/é/g, 'e')
                .replace(/í/g, 'i')
                .replace(/ó/g, 'o')
                .replace(/ú/g, 'u')
                .replace(/ê/g, 'e')
                .replace(/î/g, 'i')
                .replace(/ô/g, 'o')
                .replace(/è/g, 'e')
                .replace(/ï/g, 'i')
                .replace(/ü/g, 'u')
                .replace(/ã/g, 'a')
                .replace(/õ/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/ì/g, 'i');
        }


        var searchType = jQuery.fn.DataTable.ext.type.search;

        searchType.string = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data) :
                    data;
        };

        searchType.html = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data.replace(/<.*?>/g, '')) :
                    data;
        };

    }
}());
