(function () {
    'use strict';
    angular
        .module("ineelCR")
        .controller('CargaControllerCR', ['$scope',
            'AuthService', 'NuevoOCService', 'DTOptionsBuilder', '$filter', 'MenuService', 'comunCountService', CargaControllerCR]);

    function CargaControllerCR($scope, AuthService, NuevoOCService, DTOptionsBuilder, $filter, MenuService, comunCountService) {
        $scope.modulo = "CR";
        $scope.authentication = AuthService.authentication;
        var ClavePersona = $scope.authentication.userprofile.clavePersona

        $scope.idRol = MenuService.getRolId();
        $scope.nuevosOCs = [];
        $scope.model = {
            clientes: 0,
            proveedores: 0,
            redExpertos: 0,
            estudiosMercado: 0,
            oportunidadNegocio: 0,

            competidores: 0,
            aliados: 0,
            fuentesFinan: 0,
            partesInteresadas: 0,
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
                // console.log(result);
            },
            function (error) {
                $scope.nuevosOCs = [];
                console.log(error);
            }
        );
        comunCountService.CR.countCompetidor(true).then(
            function (result) { $scope.model.competidores = result.data; },
            function (error) { $scope.model.competidores = 0; }
        );
        comunCountService.CR.countAliado(true).then(
            function (result) { $scope.model.aliados = result.data; },
            function (error) { $scope.model.aliados = 0; }
        );

        comunCountService.CR.countFuenteFinanciamiento(true, "SIGCO,AMBOS").then(
            function (result) { $scope.model.fuentesFinan = result.data; },
            function (error) { $scope.model.fuentesFinan = 0; }
        );
        comunCountService.CR.countGrupoColegiadoPartInt(true).then(
            function (result) { $scope.model.partesInteresadas = result.data; },
            function (error) { $scope.model.partesInteresadas = 0; }
        );
        comunCountService.CR.countExpertos(false).then( //pendiente considerar el estado en el backend y bd
            function (result) { $scope.model.redExpertos = result.data; },
            function (error) { $scope.model.redExpertos = 0; }
        );

        comunCountService.CR.countOportunidadNegocio(12, 1).then(
            function (result) { $scope.model.oportunidadNegocio = result.data; },
            function (error) { $scope.model.oportunidadNegocio = 0; }
        );
        comunCountService.CR.EstudiosMercado(true).then( //el estado no se considera, queda preparado
            function (result) { $scope.model.estudiosMercado = result.data; },
            function (error) { $scope.model.estudiosMercado = 0; }
        );
        comunCountService.CR.countClientesUnidades().then( //el estado no se considera, queda preparado
            function (result) { $scope.model.clientes = result.data; },
            function (error) { $scope.model.clientes = 0; }
        );



    }
}());