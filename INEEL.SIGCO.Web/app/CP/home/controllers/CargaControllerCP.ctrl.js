(function () {
    'use strict';
    angular
        .module("ineelCP")
        .controller('CargaControllerCP', ['$scope',
            'AuthService', 'NuevoOCService', 'DTOptionsBuilder', '$filter', 'MenuService', 'comunCountService', CargaControllerCR]);

    function CargaControllerCR($scope, AuthService, NuevoOCService, DTOptionsBuilder, $filter, MenuService, comunCountService) {
        
        $scope.modulo = "CP";
        $scope.authentication = AuthService.authentication;
        var ClavePersona = $scope.authentication.userprofile.clavePersona

        $scope.idRol = MenuService.getRolId();
        $scope.nuevosOCs = [];
        $scope.model = {
            comunidadesPractica: 0,
            estadoArte: 0,
            temasInnovacion: 0,            
            informesAnuales: 0,

            mapasRuta: 0,
            estudiosEspecializados: 0,
            planAnual: 0,
            lineamientosComunidades: 0,
        };
        //TODO: pendiente contabilizar y setear los atributos de  $scope.model
        NuevoOCService.GetTopByMODULO($scope.modulo, 15).then(
            function (result) {
                $scope.nuevosOCs = [];
                var tmp = result.data;

                if (tmp != null) {
                    var black = false;
                    for (var i = 0; i < tmp.length; i++) {
                        black = $filter('BlackListOC')(tmp[i].ocs.oCsRolesBlackList, $scope.idRol);
                        if (!black) {
                            $scope.nuevosOCs.push(tmp[i]);
                        }
                    }
                }
                
            },
            function (error) {
                $scope.nuevosOCs = [];
                console.log(error);
            }
        );
        comunCountService.CP.countComunidadesActivas().then(
            function (result) { $scope.model.comunidadesPractica = result.data; },
            function (error) { $scope.model.comunidadesPractica = 0; }
        );
        comunCountService.CP.CountEstadoArte().then(
            function (result) { $scope.model.estadoArte = result.data; },
            function (error) { $scope.model.estadoArte = 0; }
        );

        comunCountService.CP.CountTemasInnovacion().then(
            function (result) { $scope.model.temasInnovacion = result.data; },
            function (error) { $scope.model.temasInnovacion = 0; }
        );
        comunCountService.CP.CountInformesAnuales().then(
            function (result) { $scope.model.informesAnuales = result.data; },
            function (error) { $scope.model.informesAnuales = 0; }
        );
        comunCountService.CP.CountMapasRuta().then( 
            function (result) { $scope.model.mapasRuta = result.data; },
            function (error) { $scope.model.mapasRuta = 0; }
        );

        comunCountService.CP.CountEstudiosEspecializados().then(
            function (result) { $scope.model.estudiosEspecializados = result.data; },
            function (error) { $scope.model.estudiosEspecializados = 0; }
        );
        comunCountService.CP.CountPlanAnual().then( 
            function (result) { $scope.model.planAnual = result.data; },
            function (error) { $scope.model.planAnual = 0; }
        );
        comunCountService.CP.CountLineamientosComunidades().then( 
            function (result) { $scope.model.lineamientosComunidades = result.data; },
            function (error) { $scope.model.lineamientosComunidades = 0; }
        );


        // function removeAccents(data) {
        //     return data
        //         .replace(/έ/g, 'ε')
        //         .replace(/[ύϋΰ]/g, 'υ')
        //         .replace(/ό/g, 'ο')
        //         .replace(/ώ/g, 'ω')
        //         .replace(/ά/g, 'α')
        //         .replace(/[ίϊΐ]/g, 'ι')
        //         .replace(/ή/g, 'η')
        //         .replace(/\n/g, ' ')
        //         .replace(/á/g, 'a')
        //         .replace(/é/g, 'e')
        //         .replace(/í/g, 'i')
        //         .replace(/ó/g, 'o')
        //         .replace(/ú/g, 'u')
        //         .replace(/ê/g, 'e')
        //         .replace(/î/g, 'i')
        //         .replace(/ô/g, 'o')
        //         .replace(/è/g, 'e')
        //         .replace(/ï/g, 'i')
        //         .replace(/ü/g, 'u')
        //         .replace(/ã/g, 'a')
        //         .replace(/õ/g, 'o')
        //         .replace(/ç/g, 'c')
        //         .replace(/ì/g, 'i');
        // }

        //la funcion removeAccents esta accesible de manera global en el archivo globalINEEL.js
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