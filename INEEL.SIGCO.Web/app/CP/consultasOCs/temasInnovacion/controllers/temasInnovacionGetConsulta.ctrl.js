(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("TemasInnovacionGetConsultaCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "TemasInnovacionCPService",
            TemasInnovacionGetConsultaCtrl
        ]);

    function TemasInnovacionGetConsultaCtrl(AuthService, $scope, $state, TemasInnovacionCPService) {
        $scope.authentication = AuthService.authentication;
        $scope.busq = {};

        $scope.buscar = function () {
            if (($scope.busq.fechaInicioComparacion != null || $scope.busq.fechaInicioComparacion != undefined) &&  //en caso de que la fecha de inicio esta definida pero no la final
                ($scope.busq.fechaFinalComparacion == null || $scope.busq.fechaFinalComparacion == undefined)) {

                $scope.busq.fechaFinalComparacion = new Date();
                $scope.busq.busquedaFecha = 'ok';
            }
            if (($scope.busq.fechaFinalComparacion != null || $scope.busq.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.busq.fechaInicioComparacion == null || $scope.busq.fechaInicioComparacion == undefined)) {

                $scope.busq.fechaInicioComparacion = new Date(1975, 10, 25);
                $scope.busq.busquedaFecha = 'ok';
            }
            if (($scope.busq.fechaFinalComparacion != null || $scope.busq.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.busq.fechaInicioComparacion != null || $scope.busq.fechaInicioComparacion != undefined)) {

                $scope.busq.busquedaFecha = 'ok';
            }
            if (($scope.busq.fechaInicioComparacion != null && $scope.busq.fechaFinalComparacion != null) && $scope.busq.fechaInicioComparacion > $scope.busq.fechaFinalComparacion) {
                toastr.error("Favor de introducir un rango válido de fechas");
                return false;
            }
            TemasInnovacionCPService.getAllConsultaPorOC($scope.busq).then(
                function (result) {
                    $scope.temas = result.data;
                    $scope.busqueda = true;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros");
                    console.log(err);
                });
        }


        $scope.reset = function () {
            $scope.busqueda = false;
            $scope.busq = {};
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