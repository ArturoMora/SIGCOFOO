(function () {
    'use strict';
    angular
        .module("ineelPI")
        .controller('derechosautorCtrl', [
            '$scope'
            , '$state'
            , 'MenuService'
            , 'DerechosAutorService'
            , 'DTOptionsBuilder'
            , 'DTColumnDefBuilder'
            , '$filter'
            , 'CatalogosPIService'
            , derechosautorCtrl]);

    function derechosautorCtrl($scope, $state, MenuService, DerechosAutorService, DTOptionsBuilder, DTColumnDefBuilder, $filter, CatalogosPIService) {
        $scope.derechosautor = [];
        $scope.grafica = {};
        $scope.rolid = MenuService.getRolId();
        $scope.busqueda = false;
        $scope.da = {};
        $scope.paramsDT = {};
        $scope.limpia = false;


        CatalogosPIService.getramasactivas().then(
            function (response) {
                $scope.ramas = response.data;
            },
            function (error) {
                toastr.error(error.message);
            }
        );



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
            if (($scope.da.fechaFinalComparacion != null || $scope.da.fechaFinalComparacion != undefined) && //en caso de que el usuario escriba las fechas manualmente
                ($scope.da.fechaInicioComparacion != null || $scope.da.fechaInicioComparacion != undefined)) {

                $scope.da.busquedaFecha='ok';
            }
            if (($scope.da.fechaInicioComparacion != null && $scope.da.fechaFinalComparacion != null) && $scope.da.fechaInicioComparacion > $scope.da.fechaFinalComparacion) {
                toastr.error("Favor de introducir un rango válido de fechas");
                return false;
            }
            DerechosAutorService.GetAllPropiedadInstitutoReporte($scope.da).then(function (res) {
                $scope.busqueda = true;
                $scope.datos3 = res.data;
            }, function (err) {
                toastr.error("Error al cargar los datos de derechos de autor");
                console.log(err);
            });


        }


        //Recuperamos los parametros de la BUSQUEDA del usuario
        $scope.da = MenuService.getVariable('busquedaDA');
        if ($scope.da == null) {
            $scope.da = {};
            $scope.paramsDT.displayStart = 0; //reiniciamos el parametro de filtrado en DT
        } else {

            $scope.paramsDT = JSON.parse(localStorage.getItem('tableDerechosAutorConsulta' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }

            $scope.buscar();
            MenuService.deleteVariable('busquedaDA');
        }

        //Para referencias sobre las opciones del datatables https://datatables.net/reference/option/buttons
        $scope.dtOptions = DTOptionsBuilder.newOptions().withButtons([
            {
                extend: 'excelHtml5',
                text: '<i class="fa fa-download"></i> Descargar Excel',
                className: 'btn btn-success',
                title: 'ResultadosBusquedaDA',
                exportOptions: { //define que columnas exportar de la tabla
                    columns: [0, 1, 2, 3, 4, 5, 6]
                }
            }])
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart)
            .withOption('order', [0, 'asc'])
            .withDOM('lftr<"default"pB>i');

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([5]).withOption('type', 'date')
        ];

        function stateSaveCallback(settings, data) {
            var stado = $('#tableDerechosAutorConsulta').DataTable().state();
            localStorage.setItem('tableDerechosAutorConsulta' + window.location.pathname, JSON.stringify(stado))
        }

        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null && $scope.limpia) {
                $scope.paramsDT = {};
                $scope.paramsDT.displayStart = 0;
                $scope.limpia = false;
                return $scope.paramsDT;
            }
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('tableDerechosAutorConsulta' + window.location.pathname))
            }

        }



        $scope.detalleRegistro = function (id) {
            MenuService.setVariable('busquedaDA', $scope.da);
            $state.go('detallederechoautor', { id: id });

        }

        $scope.editarRegistro = function (id) {
            MenuService.setVariable('busquedaDA', $scope.da);
            $state.go('editarderechoautor', { id: id });
        }


        $scope.reset = function () {
            $scope.busqueda = false;
            $scope.da = {};
            $scope.fechaInicioComparacion = null;
            $scope.fechaFinalComparacion = null;
            $scope.unidadOselect = null;
            $scope.limpia = true;

            //$('#tableDerechosAutorConsulta').DataTable().state.clear();
            //var table = $('#tableDerechosAutorConsulta').DataTable().state();
            //table.search.search = "";
            //table.start = 0;

        };

        DerechosAutorService.getdatosgrafica().then(
            function (response) {
                $scope.datos = response.data;
                setValuesForGraph();
            }
            , function (error) {
                toastr.error(error.data.message);
            });

        function setValuesForGraph() {
            var labels = [];
            var datos = [];

            $filter('orderBy')($scope.datos, 'anio');
            angular.forEach($scope.datos, function (value, key) {
                labels.push(value.anio);
                datos.push(value.numeroDA);
            });

            $scope.grafica.labels = labels;
            $scope.grafica.datos = { name: "Derechos de autor generados", type: "bar", data: datos };

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