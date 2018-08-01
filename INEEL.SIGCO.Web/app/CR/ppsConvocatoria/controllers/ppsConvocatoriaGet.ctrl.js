(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("PPsConvocatoriaGetCtrl", [
            "$scope",
            "$state",
            "DTOptionsBuilder",
            "FondosProgramaCRService",
            PPsConvocatoriaGetCtrl
        ]);

    function PPsConvocatoriaGetCtrl($scope, $state, DTOptionsBuilder, FondosProgramaCRService) {
        $scope.fondos = [];

        FondosProgramaCRService.getAllPPbyFondo().then(
            function (result) {
                $scope.fondos = result.data;

            },
            function (err) {
                console.error("No se han podido cargar los registros");
            }
        );

        $scope.paramsDT = JSON.parse(localStorage.getItem('ProyectosFondosTabla' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);

        //Por cada accion del Datatable se ejecuta este callback
        function stateSaveCallback(settings, data) {
            var stado = $('#ProyectosFondosTabla').DataTable().state();
            localStorage.setItem('ProyectosFondosTabla' + window.location.pathname, JSON.stringify(stado))
        }

        //En conjunto con el callback anterior se guarda y recupera el state del datatatable
        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('ProyectosFondosTabla' + window.location.pathname))
            }

        }

        function removeAccents(data) {
            return data
                .replace(/έ/g, 'ε').replace(/[ύϋΰ]/g, 'υ').replace(/ό/g, 'ο')
                .replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/[ίϊΐ]/g, 'ι')
                .replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/á/g, 'a')
                .replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o')
                .replace(/ú/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i')
                .replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i')
                .replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o')
                .replace(/ç/g, 'c').replace(/ì/g, 'i');
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