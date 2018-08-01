(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("TipoBecaCtrlAdd", ['AuthService', '$scope', 'TipoBecaService', 'globalGet', '$state','comunService', TipoBecaCtrlAdd]);
    function TipoBecaCtrlAdd(AuthService, $scope, TipoBecaService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.TipoBecaForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.tipobeca.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.tipobeca.descripcion.replace(/\n/g, "");
                $scope.tipobeca.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "tipobeca" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.tipobeca.fechaEfectiva = new Date();
                        $scope.tipobeca.estado = 1;
                        $scope.desactivar = true;
                        TipoBecaService.Add($scope.tipobeca).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.TipoBecaGet");
                                        },
                                        function (err) {
                                            $scope.desactivar = false;
                                            console.error(err);
                                        });
                    }
                });
               
            }
        }
    }
})();