(function () {
    "use strict";

    angular.module("ineelMT")
            .controller("EstadoSolicitudEditCtrl", ['AuthService', '$scope', 'EstadoSolicitudService', 'globalGet', '$state', '$stateParams', EstadoSolicitudEditCtrl]);
    function EstadoSolicitudEditCtrl(AuthService, $scope, EstadoSolicitudService, globalGet, $state, $stateParams) {
        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //Parametros
        var id = $stateParams.id;
        //Obtene ambito
        EstadoSolicitudService.getById(id).then(
            function (result) {
                $scope.estado = result.data;
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
                EstadoSolicitudService.Update($scope.estado).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("EstadoSolicitud");
                                },
                                function (err) {
                                    console.error(err);
                                });
            }
        }
    }
})();