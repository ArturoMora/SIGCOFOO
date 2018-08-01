(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("tipounidadCtrlAdd", ['$rootScope', '$scope', 'unidadfamiliaService', 'tipoareaService', 'globalGet', '$state', '$stateParams', tipounidadCtrlAdd]);

    function tipounidadCtrlAdd($rootScope, $scope, unidadfamiliaService, tipoareaService, globalGet, $state, $stateParams) {

        var id = $stateParams.id;
        $scope.id = $stateParams.id;


        $scope.nombreunidadorg;
        $scope.periodosel;
        $scope.idunidadfam;

        $scope.clave;
        $scope.puesto;
        $scope.fecha;
       

        if (typeof $rootScope.parametros !== 'undefined')
            if ($rootScope.parametros.periodo !== null || typeof $rootScope.parametros.periodo !== 'undefined') {

                $scope.nombreunidadorg = $rootScope.parametros.unidad;
                $scope.periodosel      = $rootScope.parametros.periodo;
                $scope.idunidadfam = parseInt($rootScope.parametros.unidadfamiliaid);

                $scope.clave = $rootScope.parametros.clave;
                $scope.puesto = $rootScope.parametros.puesto;               
           }
       


        tipoareaService.getAll().then(
            function (result) {    
                $scope.areastipo = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los tipos de áreas registrados en el sistema");
            }
        );


        $scope.save = function () {
            var ActualizaRegistro = {
                "familiaUnidadId": $scope.idunidadfam,
                "tipoAreaId": $scope.tipoAreaId,
                "unidad": $scope.clave,
                "nomUnidad": $scope.nombreunidadorg,
                "familiaPuestosId":  $scope.puesto ,
                "periodo": $scope.periodosel,
           
                "estado": 1
            }
                        
            unidadfamiliaService.update(ActualizaRegistro).then(
                       function (result) {
                           toastr.success(result.data);
                           $state.go("tipounidad");
                       },
                       function (err) {
                           console.error(err);
                       }
                );
           
        }

   

       


    }

})();