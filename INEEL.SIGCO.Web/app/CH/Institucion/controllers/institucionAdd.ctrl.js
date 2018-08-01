(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("InstitucionCtrlAdd", ['AuthService', '$scope', 'InstitucionService', '$state','comunService', InstitucionCtrlAdd]);
    function InstitucionCtrlAdd(AuthService, $scope, InstitucionService, $state, comunService) {
        //Variable API
        $scope.loading = true;
        $scope.paises = [];
        $scope.authentication = AuthService.authentication;
        
        //Obtener Paises
        InstitucionService.GetPaises().then(
                function (result) {
                    $scope.paises = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    console.error(err);
                });


        //Agregar Ambito
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.instituto.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.instituto.descripcion.replace(/\n/g, "");
                $scope.instituto.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "instituto" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.instituto.fechaEfectiva = new Date();
                        $scope.instituto.estado = 1;
                        $scope.desactivar = true;
                        InstitucionService.Add($scope.instituto).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.InstitucionGet");
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