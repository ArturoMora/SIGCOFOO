(function () {
    "use strict";

    angular
        .module("ineelMT")
        .controller("CalifResultadosFinancierosAddCtrl", ["AuthService", '$scope', 'CalifResultadosFinancierosService', 'globalGet', '$state','comunService', CalifResultadosFinancierosAddCtrl]);
    function CalifResultadosFinancierosAddCtrl(AuthService,$scope, CalifResultadosFinancierosService, globalGet, $state,comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;
        $scope.aux = "probando";
        //Agregar Software
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.registro.nombre, "origen": "MT.califResultadosF" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        var Registro = {
                            "Nombre": $scope.registro.nombre,
                            "NombreCorto": $scope.registro.nombreCorto,
                            "FechaAlta": new Date(),
                            "Estado": 1
                        };
                        CalifResultadosFinancierosService.create(Registro).then(
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