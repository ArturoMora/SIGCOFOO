(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("EstudiosEspecializadosGetConsultaCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "EstudiosEspecializadosCPService",
            EstudiosEspecializadosGetConsultaCtrl
        ]);

    function EstudiosEspecializadosGetConsultaCtrl(AuthService, $scope,$state, EstudiosEspecializadosCPService) {
        $scope.authentication = AuthService.authentication;
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        $scope.param = {};
        $scope.busqueda = false;

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
            if (($scope.param.fechaFinalComparacion != null || $scope.param.fechaFinalComparacion != undefined) && //en caso de que se ingrese le fecha manual
                ($scope.param.fechaInicioComparacion != null || $scope.param.fechaInicioComparacion != undefined)) {

                $scope.param.busquedaFecha='ok';
            }
            if(($scope.param.fechaInicioComparacion!=null && $scope.param.fechaFinalComparacion!=null) && $scope.param.fechaInicioComparacion> $scope.param.fechaFinalComparacion){
                toastr.error("Favor de introducir un rango válido de fechas");
                return false;
            }

            EstudiosEspecializadosCPService.getAllConsultaPorOC($scope.param).then(
                function (result) {
                    $scope.estudios = result.data;
                    $scope.busqueda = true;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros");
                    console.log(err);
                });
        }
        


        $scope.reset = function () {
            $scope.busqueda = false;
            $scope.param = {};
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