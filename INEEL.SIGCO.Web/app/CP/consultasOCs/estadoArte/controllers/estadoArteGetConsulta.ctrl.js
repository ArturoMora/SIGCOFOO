(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("EstadoArteGetConsultaCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "DTOptionsBuilder",
            "DTColumnDefBuilder",
            "EstadoArteCPService",
            EstadoArteGetConsultaCtrl
        ]);

    function EstadoArteGetConsultaCtrl(AuthService, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder, EstadoArteCPService) {
        $scope.authentication = AuthService.authentication;
        $scope.busqueda = false;
        $scope.arte = {};
        $scope.limpia = false;

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDOM('lftrpi');

        $scope.buscar = function () {
            if (($scope.arte.fechaInicioComparacion != null || $scope.arte.fechaInicioComparacion != undefined) &&  //en caso de que la fecha de inicio esta definida pero no la final
                ($scope.arte.fechaFinalComparacion == null || $scope.arte.fechaFinalComparacion == undefined)) {

                $scope.arte.fechaFinalComparacion = new Date();
                $scope.arte.busquedaFecha='ok';
            }
            if (($scope.arte.fechaFinalComparacion != null || $scope.arte.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.arte.fechaInicioComparacion == null || $scope.arte.fechaInicioComparacion == undefined)) {

                $scope.arte.fechaInicioComparacion = new Date(1975, 10, 25);
                $scope.arte.busquedaFecha='ok';
            }
            if (($scope.arte.fechaFinalComparacion != null || $scope.arte.fechaFinalComparacion != undefined) && //en caso de que se ingrese le fecha manual
                ($scope.arte.fechaInicioComparacion != null || $scope.arte.fechaInicioComparacion != undefined)) {

                $scope.arte.busquedaFecha='ok';
            }
            if(($scope.arte.fechaInicioComparacion!=null && $scope.arte.fechaFinalComparacion!=null) && $scope.arte.fechaInicioComparacion> $scope.arte.fechaFinalComparacion){
                toastr.error("Favor de introducir un rango válido de fechas");
                return false;
            }
            EstadoArteCPService.getAllConsultaPorOC($scope.arte).then(
                function (result) {
                    $scope.busqueda = true;
                    $scope.estadoArte = result.data;

                },
                function (err) {
                    toastr.error("No se han podido cargar los registros");
                    console.log(err);
                });
        }

        // $scope.dtColumnDefs = [
        //     DTColumnDefBuilder.newColumnDef([0,1]).withOption('type', 'string') //definimos el tipo de datos de cada columna
        //
        // ];

        $scope.reset = function () {
            $scope.busqueda = false;
            $scope.limpia = false;
            $scope.arte = {};
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
