(function () {
    "use strict";
    angular
        .module("ineelCR")
        .controller("TematicaAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "TematicaCRService",
        "comunService",
        TematicaAddCtrl
        ]);

    function TematicaAddCtrl(AuthService, $scope, $state,  $filter, TematicaCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.AddTematica = function () {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.tematica.nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "Tematicas" };
                comunService.ValidacionExistCR(registro)
                    .then(function(result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                            var tematica = {
                                "nombre": $scope.tematica.nombre.replace(/\n/g, ""),
                                "descripcion": $scope.tematica.descripcion,
                                "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                                "autor": AuthService.authentication.nombreCompleto,
                                "estado": 1,

                            };
                            TematicaCRService.create(tematica)
                                .then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.go("tematicaGet");
                                    },
                                    function (err) {
                                        toastr.error(err.data.message);
                                        console.error(err.data);
                                    });
                        }
                    });
                
            }

        }
    }
})();