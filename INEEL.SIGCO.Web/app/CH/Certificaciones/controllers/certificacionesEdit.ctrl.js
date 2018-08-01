(function () {
    "use strict";

    var app = angular.module("ineelCH");
    app.controller("CertificacionesCtrlEdit", ['AuthService', '$scope', 'CertificacionesService', 'globalGet', '$state', '$stateParams', 'comunService', CertificacionesCtrlEdit]);
    function CertificacionesCtrlEdit(AuthService, $scope, CertificacionesService, globalGet, $state, $stateParams, comunService) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;

        //Obtene ambito
        CertificacionesService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
                $scope.excepcion = $scope.registro.descripcion.replace(/ /g, "").replace(/\n/g, "");
            },
            function (err) {
                console.error(err);
            });

        CertificacionesService.IdiomagetById().then(
            function (result) {
                $scope.idiomas = result.data;
            }, function (error) {
                toastr.error("No se ha podido cargar el catalogo de idiomas ");
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.ValidacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var sinEspacios = $scope.registro.descripcion.replace(/ /g, "").replace(/\n/g, "");
                var sinEnter = $scope.registro.descripcion.replace(/\n/g, "");
                $scope.registro.descripcion = sinEnter;
                var registro = { "dato": sinEspacios, "origen": "certificacion", "excepcion": $scope.excepcion };
                comunService.ValidacionExist(registro).then(function (result) {
                    $scope.existente = result.data;
                    if ($scope.existente == true) {
                        toastr.warning("El registro ya existe!");
                        return false;
                    } else {
                        $scope.desactivar = true;
                        CertificacionesService.Update($scope.registro).then(
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