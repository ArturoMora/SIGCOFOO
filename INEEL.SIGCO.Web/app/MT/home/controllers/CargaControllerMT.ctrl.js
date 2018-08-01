(function () {
    'use strict';
    angular
        .module("ineelMT")
        .controller('CargaControllerMT', ['$scope',
            'AuthService', 'NuevoOCService', 'SolicitudesMTService',
            'DTOptionsBuilder', '$filter', 'MenuService', 'comunCountService', 'comunService', CargaControllerMT]);

    function CargaControllerMT($scope, AuthService, NuevoOCService, SolicitudesMTService,
        DTOptionsBuilder, $filter, MenuService, comunCountService, comunService) {

        $scope.model = {
            informesTF: 0, software: 0, articulos: 0,
            ponencias: 0, capitulos: 0, informeBecarios: 0,
            insumos: 0, cursos: 0, leccionesAp: 0,
            libros: 0
        };

        $scope.modulo = "MT";
        $scope.idRol = MenuService.getRolId();
        $scope.authentication = AuthService.authentication;
        var ClavePersona = $scope.authentication.userprofile.clavePersona;


        $scope.nuevosOCs = [];
        $scope.AccesoITF = [];
        //NuevoOCService.GetAllOfFirstDayOfWeekMODULO("MT").then(
        NuevoOCService.GetTopByMODULO($scope.modulo, 10).then(
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
                // console.log(result);
            },
            function (error) {
                $scope.nuevosOCs = [];
                console.log(error);
            }
        );

        comunCountService.MT.countITF(4).then(
            function (result) { $scope.model.informesTF = result.data; },
            function (error) { $scope.model.informesTF = 0; }
        );

        comunCountService.MT.countInformeBec(3).then(
            function (result) { $scope.model.informeBecarios = result.data; },
            function (error) { $scope.model.informeBecarios = 0; }
        );
        //se considera 4: el estatus del itf:
        comunCountService.MT.countInsumos(4).then(
            function (result) { $scope.model.insumos = result.data; },
            function (error) { $scope.model.insumos = 0; }
        );
        comunCountService.MT.LAproy(4).then(
            function (result) { $scope.model.leccionesAp = result.data; },
            function (error) { $scope.model.leccionesAp = 0; }
        );

        comunCountService.MT.countPonencia(3).then(
            function (result) { $scope.model.ponencias = result.data; },
            function (error) { $scope.model.ponencias = 0; }
        );

        comunCountService.MT.countCursoInterno(3).then(
            function (result) { $scope.model.cursos = result.data; },
            function (error) { $scope.model.cursos = 0; }
        );

        comunCountService.MT.countPublicacion(3).then(
            function (result) { $scope.model.articulos = result.data; },
            function (error) { $scope.model.articulos = 0; }
        );

        comunCountService.MT.countCapitulos(3).then(
            function (result) { $scope.model.capitulos = result.data; },
            function (error) { $scope.model.capitulos = 0; }
        );
        comunCountService.MT.countSoftware(3).then(
            function (result) { $scope.model.software = result.data; },
            function (error) { $scope.model.software = 0; }
        );
        comunService.getOfUrl("http://b-dig.iie.org.mx/cgi-bin/WWWISIS/wwwisis.exe/%5bin=libMT22.in%5d").then(
            function (result) { $scope.model.libros = result.data; },
            function (error) { $scope.model.libros = 102 }
        );

    

    }
}());