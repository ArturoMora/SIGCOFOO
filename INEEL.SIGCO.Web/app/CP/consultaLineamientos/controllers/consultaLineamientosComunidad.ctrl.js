(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("ConsultaLineamientosComunidadCtrl", [
            "AuthService",
            "$scope",
            "$rootScope",
            "MenuService",
            "$stateParams",
            "RolesUsuarioCPService",
            "LineamientosCPService",
            ConsultaLineamientosComunidadCtrl
        ]);

    function ConsultaLineamientosComunidadCtrl(AuthService, $scope, $rootScope, MenuService, $stateParams, RolesUsuarioCPService, LineamientosCPService) {
        $scope.comunidadId = $stateParams.id;
        $scope.lineamientosComunidad = {};
        $scope.rol = {};
        $scope.datosOk = false;

        if ($stateParams.id != 0 || MenuService.getRolId()==1027) {
            var datosUsuarioComunidad = {
                "id": $scope.comunidadId,
                "claveEmpleado": AuthService.authentication.userprofile.clavePersona
            }

            RolesUsuarioCPService.getRolesUsuario(datosUsuarioComunidad)
                .then(function(res) {
                        $scope.rol = res;
                        $scope.datosOk = true;
                        $scope.datosComunidad = { 'rol': res, 'idCP': $scope.comunidadId };
                        MenuService.setVariable("datosCP", $scope.datosComunidad);
                    },
                    function(err) {
                        toastr.error("Error al obtener los permisos del usuario");
                        console.log(err);
                    });
        } else {
            $scope.rol.invitado = true;
        }
        


        LineamientosCPService.getAll().then(function(result) {
            $scope.lineamientos = result.data;
        },function(err) {
            toastr.error("Error al cargar los registros de lineamientos");
            console.log(err);
        });

        $scope.regresar = function () {
            $rootScope.globalRegresar();
        }

    }

})();