(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("AreaInvestigacionAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "AreasInvestigacionCRService",
        "comunService",
        AreaInvestigacionAddCtrl
        ]);

    function AreaInvestigacionAddCtrl(AuthService, $scope, $state,  $filter, AreasInvestigacionCRService,comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.AddAreaInvestigacion = function() {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.areaInvestigacion.nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "AreaInvestigacion" };
                comunService.ValidacionExistCR(registro).then(function(result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe");
                        return false;
                    } else {
                        var areaInvestigacion = {
                            "nombre": $scope.areaInvestigacion.nombre.replace(/\n/g, ""),
                            "descripcion": $scope.areaInvestigacion.descripcion,
                            "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                            "autor": AuthService.authentication.nombreCompleto,
                            "estado": 1,

                        };
                        AreasInvestigacionCRService.create(areaInvestigacion)
                            .then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("areasInvestigacionGet");
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