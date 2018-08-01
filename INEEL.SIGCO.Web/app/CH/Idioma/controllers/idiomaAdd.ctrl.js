(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("IdiomaCtrlAdd", ['AuthService', '$scope', 'IdiomaService', 'globalGet', '$state','comunService', IdiomaCtrlAdd]);
    function IdiomaCtrlAdd(AuthService, $scope, IdiomaService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        //Agregar Ambito
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.idioma.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.idioma.descripcion.replace(/\n/g, "");
                $scope.idioma.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "idiomas" };
                comunService.ValidacionExist(registro).then(function (result)
                {
                    $scope.existente = result.data;
                    if ($scope.existente == true)
                    {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.idioma.fechaEfectiva = new Date();
                        $scope.idioma.estado = 1;
                        $scope.desactivar = true;
                        IdiomaService.Add($scope.idioma).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.IdiomaGet");
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