(function () {
    "use strict";

    var app = angular.module("ineelPI");

    app.controller("tipopingetCtrl", [
        "$scope"
        , "CatalogosPIService"
        , "$uibModal"
        , tipopingetCtrl]);
    function tipopingetCtrl($scope, CatalogosPIService, $uibModal) {

        $scope.tipospin = [];
        //obtener registros
        CatalogosPIService.gettipospin().then(
            function (result) {
                $scope.tipospin = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de tipos de propiedad industrial");
            }
        );

        //Guardar estado
        $scope.cambiarestado = function (tipopin) {

            CatalogosPIService.updatetipopin(tipopin).then(
                function (success) {
                    toastr.success(success.data)
                },
                function (err) {
                    toastr.error(err.data.exceptionMessage);
                    $scope.cancel();
                }
            );
        }

        $scope.cancel = function(tipopin){
            var pos = $scope.tipospin.indexOf(tipopin);
            $scope.tipospin[pos].estado = !tipopin.estado;
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