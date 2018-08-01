(function () {
    "use strict";

    var app = angular.module("ineelPI");

    app.controller("ramasgetCtrl", [
        "$scope"
        , "CatalogosPIService"
        , "$uibModal"
        , ramasgetCtrl]);
    function ramasgetCtrl($scope, CatalogosPIService, $uibModal) {

        $scope.ramas = [];
        //obtener registros
        CatalogosPIService.getramas().then(
            function (result) {
                $scope.ramas = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de ramas");
            }
        );

        //Guardar estado
        $scope.cambiarestado = function (rama) {

            CatalogosPIService.updaterama(rama).then(
                function (success) {
                    toastr.success(success.data)
                },
                function (err) {
                    toastr.error(err.data.message);
                    $scope.cancel(rama);
                }
            );
        }

        $scope.cancel = function(rama){
            var pos = $scope.ramas.indexOf(rama);
            $scope.ramas[pos].estado = !rama.estado;
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
})();