(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("CertificacionesCtrlAdd", ['AuthService', '$scope', 'CertificacionesService', 'globalGet', '$state','comunService', CertificacionesCtrlAdd]);
    function CertificacionesCtrlAdd(AuthService, $scope, CertificacionesService, globalGet, $state, comunService) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;
        CertificacionesService.IdiomagetById().then(
           function (result) {
               $scope.catalogoidiomas = result.data;
           }, function (error) {
               toastr.error("No se ha podido cargar el catalogo de idiomas ");
               console.error(err);
           });
        //Agregar Ambito
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.registro.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.registro.descripcion.replace(/\n/g, "");
                $scope.registro.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "certificacion" };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.registro.fechaEfectiva = new Date();
                        $scope.registro.estado = 1;
                        $scope.desactivar = true;
                        CertificacionesService.Add($scope.registro).then(
                                        function (result) {
                                            toastr.success(result.data);
                                            $state.go("catalogosrh.certificaciones");
                                        },
                                        function (err) {
                                            console.error(err);
                                            $scope.desactivar = false;
                                        });
                    }
                });

            }
        }
    }
})();