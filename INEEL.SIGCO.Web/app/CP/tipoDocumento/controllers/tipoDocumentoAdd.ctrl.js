(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("TipoDocumentoAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "TipoDocumentoCPService",
        "comunService",
        TipoDocumentoAddCtrl
        ]);

    function TipoDocumentoAddCtrl(AuthService, $scope, $state, $filter, TipoDocumentoCPService, comunService) {
        $scope.authentication = AuthService.authentication;
        $scope.AddDocumento = function () {

            if ($scope.form.$invalid) {
                //toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = { "dato": $scope.tipoDocumento.nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "TipoDocumento" };
                comunService.ValidacionExistCP(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente) {
                        toastr.warning("El registro ya existe");
                        return false;
                    } else {
                        var tipoDocumento = {
                            "nombre": $scope.tipoDocumento.nombre.replace(/\n/g, ""),
                            "descripcion": $scope.tipoDocumento.descripcion,
                            "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                            "autor": AuthService.authentication.nombreCompleto,
                            "estado": 1
                        };
                        TipoDocumentoCPService.create(tipoDocumento).then(
                        function (result) {
                            toastr.success(result.data);
                            $state.go("TipoDocumentoGetAll");
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