(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("ConfirmacionLineamientosComunidadCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$filter",
            "$uibModalInstance",
            "LineamientosCPService",
            "MiembrosCPService",
            ConfirmacionLineamientosComunidadCtrl
        ]);

    function ConfirmacionLineamientosComunidadCtrl(AuthService, $scope, $state, $filter, $uibModalInstance, LineamientosCPService, MiembrosCPService) {
        $scope.userLogin = AuthService.authentication.userprofile.clavePersona;
        
        LineamientosCPService.getAll().then(function (result) {
            $scope.lineamientos = result.data;
        }, function (err) {
            toastr.error("Error al cargar los registros de lineamientos");
            console.log(err);
        });

        $scope.cancel = function () {
            $state.go("comunidadesGet");
        }

        $scope.ok = function () {
            
            var miembro = {
                "MiembroId": $scope.rol.datosMiembro.miembroId,
                "Aceptacion": true,
                "FechaAceptacion": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                "idCP": $scope.idComunidad
            };
            MiembrosCPService.updateAceptacionLineamientos(miembro)
                .then(function(result) {
                        toastr.success("Bienvenido a la comunidad!");
                        $uibModalInstance.close();
                    },
                    function(err) {
                        toastr.error("Error al aceptar los términos");
                        console.log(err);
                    });
        }

    }

})();