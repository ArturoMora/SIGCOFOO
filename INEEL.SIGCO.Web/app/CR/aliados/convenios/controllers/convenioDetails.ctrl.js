(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ConvenioDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "AliadosCRService",
        "DTOptionsBuilder",
        ConvenioDetailsCtrl
        ]);

    function ConvenioDetailsCtrl(AuthService, $scope, $state, $stateParams, AliadosCRService, DTOptionsBuilder) {
        //var id = $rootScope.idConv; //$stateParams.id;
        $scope.convenio_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt');

        $scope.areasM = [];
        $scope.adjuntos = [];


        AliadosCRService.getConvenio($scope.convenio_id).then(
            function (result) {
                
                $scope.convenios = result.data;
                $scope.areasM = $scope.convenios.areaConvenio;
                $scope.adjuntos = $scope.convenios.adjuntoPorConvenio;
            },
            function (err) {
                console.error(err);
            });

        //Guardar estado
        $scope.consultaEstado = function (estado) {
            var _estado;
            
            if (estado == true) {
                _estado = "Activo";
            } else if (estado == false) {
                _estado = "Inactivo";
            }
            return _estado;
         }
    }
})();



