(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("MapasRutaGetConsultaCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "MapasRutaCPService",
            MapasRutaGetConsultaCtrl
        ]);

    function MapasRutaGetConsultaCtrl(AuthService, $scope,$state, MapasRutaCPService) {
        $scope.authentication = AuthService.authentication;
        $scope.busqueda = false;
        $scope.param = {};

        $scope.buscar = function () {
            if (($scope.param.fechaInicioComparacion != null || $scope.param.fechaInicioComparacion != undefined) &&  //en caso de que la fecha de inicio esta definida pero no la final
                ($scope.param.fechaFinalComparacion == null || $scope.param.fechaFinalComparacion == undefined)) {

                $scope.param.fechaFinalComparacion = new Date();
                $scope.param.busquedaFecha='ok';
            }
            if (($scope.param.fechaFinalComparacion != null || $scope.param.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.param.fechaInicioComparacion == null || $scope.param.fechaInicioComparacion == undefined)) {

                $scope.param.fechaInicioComparacion = new Date(1975, 10, 25);
                $scope.param.busquedaFecha='ok';
            }
            if (($scope.param.fechaFinalComparacion != null || $scope.param.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.param.fechaInicioComparacion != null || $scope.param.fechaInicioComparacion != undefined)) {

                $scope.param.busquedaFecha='ok';
            }
            if(($scope.param.fechaInicioComparacion!=null && $scope.param.fechaFinalComparacion!=null) && $scope.param.fechaInicioComparacion> $scope.param.fechaFinalComparacion){
                toastr.error("Favor de introducir un rango válido de fechas");
                return false;
            }
            MapasRutaCPService.getAllConsultaPorOC($scope.param).then(
                function (result) {
                    $scope.mapas = result.data;
                    $scope.busqueda = true;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros");
                    console.error(err);
                });
        }



        $scope.reset = function () {
            $scope.param = {};
            $scope.busqueda = false;
            $scope.fechaInicioComparacion = null;
            $scope.fechaFinalComparacion = null;

            
        };


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