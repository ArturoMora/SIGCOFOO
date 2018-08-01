(function () {
    "use strict";

    angular.module("ineelMT")
            .controller("CalifResultadosFinancierosEditCtrl", [ "AuthService", '$scope', 'CalifResultadosFinancierosService', 'globalGet', '$state', '$stateParams','comunService', CalifResultadosFinancierosEditCtrl]);
    function CalifResultadosFinancierosEditCtrl(AuthService, $scope, CalifResultadosFinancierosService, globalGet, $state, $stateParams,comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtene ambito
        CalifResultadosFinancierosService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
                $scope.excepcion = $scope.registro.nombre;
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.registro.nombre, "origen": "MT.califResultadosF", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {

                        CalifResultadosFinancierosService.Update($scope.registro).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("CalifResultadosFinancierosGet");
                                        },
                                        function (err) {
                                            console.error(err);
                                        });
                    }
                });}}
    }
})();