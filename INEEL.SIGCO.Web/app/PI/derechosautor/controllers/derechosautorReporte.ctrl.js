(function () {
    'use strict';
    angular
        .module("ineelPI")
        .controller('derechosautorReporteCtrl', [
            '$scope'
            , '$state'
            , 'MenuService'
            , 'DerechosAutorService'
            , 'DTColumnDefBuilder'
            , 'DTOptionsBuilder'
            , 'CatalogosPIService'
            , derechosautorReporteCtrl]);

    function derechosautorReporteCtrl($scope, $state, MenuService, DerechosAutorService, DTColumnDefBuilder, DTOptionsBuilder, CatalogosPIService) {
        $scope.busqueda = false;
        $scope.derechosautor = [];

        $scope.rolid = MenuService.getRolId();
        $scope.da = {};
        //$scope.datePicker = getRangoDeFechaDefault(0,0,5);

        CatalogosPIService.getramasactivas().then(
            function (response) {
                $scope.ramas = response.data;
            },
            function (error) {
                toastr.error(error.message);
            }
        );

        $scope.dtOptions = DTOptionsBuilder.newOptions().withButtons([
            {
                extend: 'excelHtml5',
                text: '<i class="fa fa-download"></i> Descargar Excel',
                className: 'btn btn-success',
                title: 'reporteBusquedaDA',
                exportOptions: { //define que columnas exportar de la tabla
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                }
            }])
            .withOption('order', [8, 'desc'])
            .withDOM('ftr<"default"pB>i');

        //$scope.dtColumnDefs = [
        //    DTColumnDefBuilder.newColumnDef([8]).withOption('type', 'date')
        //];

        $scope.detalleRegistro = function (id) {
            MenuService.setVariable('busquedaDA', $scope.da);
            $state.go('detallederechoautor', { id: id });

        }
        $scope.buscar = function () {
            if (($scope.da.fechaInicioComparacion != null || $scope.da.fechaInicioComparacion != undefined) &&  //en caso de que la fecha de inicio esta definida pero no la final
                ($scope.da.fechaFinalComparacion == null || $scope.da.fechaFinalComparacion == undefined)) {

                $scope.da.fechaFinalComparacion = new Date();
                $scope.da.busquedaFecha="ok";
            }
            if (($scope.da.fechaFinalComparacion != null || $scope.da.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.da.fechaInicioComparacion == null || $scope.da.fechaInicioComparacion == undefined)) {

                $scope.da.fechaInicioComparacion = new Date(1975, 10, 25);
                $scope.da.busquedaFecha="ok";
            }
            if (($scope.da.fechaFinalComparacion != null || $scope.da.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.da.fechaInicioComparacion != null || $scope.da.fechaInicioComparacion != undefined)) {

                $scope.da.busquedaFecha="ok";
            }
            if (($scope.da.fechaInicioComparacion != null && $scope.da.fechaFinalComparacion != null) && $scope.da.fechaInicioComparacion > $scope.da.fechaFinalComparacion) {
                toastr.error("Favor de introducir un rango válido de fechas");
                return false;
            }
            DerechosAutorService.GetAllPropiedadInstitutoReporte($scope.da).then(function (res) {
                $scope.busqueda = true;
                $scope.datos = res.data;
            }, function (err) {
                toastr.error("Error al cargar los datos de derechos de autor");
                console.log(err);
            });
        }




        $scope.reset = function () {
            $scope.busqueda = false;
            $scope.da = {};
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