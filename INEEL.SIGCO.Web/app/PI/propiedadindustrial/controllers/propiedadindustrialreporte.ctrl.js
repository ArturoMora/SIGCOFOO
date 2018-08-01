(function () {
    'use strict';
    angular
        .module("ineelPI")
        .controller('propiedadindustrialreporteCtrl', [
            '$scope'
            , '$state'
            , 'MenuService'
            , 'PropiedadIndustrialService'
            , 'DTOptionsBuilder'
            , 'CatalogosPIService'
            , propiedadindustrialreporteCtrl]);

    function propiedadindustrialreporteCtrl($scope, $state, MenuService, PropiedadIndustrialService, DTOptionsBuilder, CatalogosPIService) {
        $scope.pis = [];
        $scope.rolid = MenuService.getRolId();
        $scope.busqueda = false;

        CatalogosPIService.gettipospinactivos().then(
            function (result) {
                $scope.tipos = result.data;
            }, function (error) {
                toastr.error(error.data.message);
            });

        CatalogosPIService.getestadosdelprocesoactivos().then(
            function (result) {
                $scope.piados = result.data;
            }, function (error) {
                toastr.error(error.data.message);
            });

        $scope.dtOptions = DTOptionsBuilder.newOptions().withButtons([
            {
                extend: 'excelHtml5',
                text: '<i class="fa fa-download"></i> Descargar Excel',
                className: 'btn btn-success',
                title: 'reporteBusquedaPI'
            }])
            .withDOM('ftr<"default"pB>i');

        $scope.detalleRegistro = function (id) {
            MenuService.setVariable('busquedaPI', $scope.pi);
            $state.go('propiedadindustrialdetalle', { id: id });
        }

        $scope.buscar = function () {

            if (($scope.pi.fechaInicioComparacion != null || $scope.pi.fechaInicioComparacion != undefined) &&  //en caso de que la fecha de inicio este definida pero no la final
                ($scope.pi.fechaFinalComparacion == null || $scope.pi.fechaFinalComparacion == undefined)) {

                $scope.pi.fechaFinalComparacion = new Date();
                $scope.pi.busquedaFecha="ok";
            }
            if (($scope.pi.fechaFinalComparacion != null || $scope.pi.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.pi.fechaInicioComparacion == null || $scope.pi.fechaInicioComparacion == undefined)) {

                $scope.pi.fechaInicioComparacion = new Date(1975, 10, 25);
                $scope.pi.busquedaFecha="ok";
            }
            if (($scope.pi.fechaFinalComparacion != null || $scope.pi.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.pi.fechaInicioComparacion != null || $scope.pi.fechaInicioComparacion != undefined)) {

                $scope.pi.busquedaFecha="ok";
            }
            if (($scope.pi.fechaInicioComparacion != null && $scope.pi.fechaFinalComparacion != null) && $scope.pi.fechaInicioComparacion > $scope.pi.fechaFinalComparacion) {
                toastr.error("Favor de introducir un rango válido de fechas");
                return false;
            }
            PropiedadIndustrialService.getpireporte($scope.pi)
                .then(function (result) {
                    $scope.busqueda = true;
                    $scope.datos = result.data;
                }, function (err) {
                    toastr.error("Error al cargar los datos de propiedad industrial");
                    console.log(err);
                });

        }

        $scope.reset = function () {
            $scope.busqueda = false;
            $scope.pi = {};
            $scope.fechaInicioComparacion = null;
            $scope.fechaFinalComparacion = null;
            $scope.unidadOselect = null;
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
}());