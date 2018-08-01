(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("HomeComunidadGetCtrl", [
            "AuthService",
            "$rootScope",
            "$scope",
            "$state",
            "$stateParams",
            "$uibModal",
            "MenuService",
            "ComunidadesCPService",
            "RolesUsuarioCPService",
            HomeComunidadGetCtrl
        ]);

    function HomeComunidadGetCtrl(AuthService, $rootScope, $scope, $state, $stateParams, $uibModal, MenuService, ComunidadesCPService, RolesUsuarioCPService) {
        $scope.authentication = AuthService.authentication;
        $scope.datosMiembro = {};
        $scope.rol = {};
        
        //obtener clave de usuario
        $scope.userLogin = AuthService.authentication.userprofile.clavePersona;

        $scope.modificoLiderOSecretario = 0;

        var datosUsuarioComunidad = {
            "id": $stateParams.id,
            "claveEmpleado": $scope.userLogin
        }

        $scope.cargaModalLineamientosComunidad = function () {
            $scope.idComunidad = $stateParams.id;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/modalesCP/LineamientosComunidad/confirmacionLineamientosComunidad.html',
                controller: 'ConfirmacionLineamientosComunidadCtrl',
                scope: $scope
            });
        }


        $scope.getRolPersonaCP = function () {
            RolesUsuarioCPService.getRolesUsuario(datosUsuarioComunidad)
                .then(function(res) {
                        $scope.now = new Date();
                        $scope.rol = res;
                        if (!$scope.rol.datosMiembro.aceptacion && $scope.rol.lider) {
                            $scope.cargaModalLineamientosComunidad();
                        }
                        //if (!$scope.rol.datosMiembro.aceptacion && $scope.rol.secretario) {
                        //    $scope.cargaModalLineamientosComunidad();
                        //}
                        //console.log(res);
                    },
                    function(err) {
                        toastr.error("Error al obtener los permisos del usuario");
                        console.log(err);
                    });
        }

        $scope.cargaComunidad = function () {
            $scope.now = new Date();
            ComunidadesCPService.getById($stateParams.id).then(
                function (result) {
                    $scope.comunidad = result.data;                 
                }, function (err) {
                    toastr.error("No se han podido cargar los registros de la comunidad");
                    console.log(err);
                });
        }
        


        $scope.configuracionComunidad = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/modalesCP/AdministracionComunidad/AdministracionComunidad.html',
                controller: 'AdministracionComunidadCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                             
                $scope.cargaComunidad();
                
                $scope.getRolPersonaCP();
                $scope.now = new Date();
            });
        };

        $scope.getRolPersonaCP();
        $scope.cargaComunidad();
        

    }

})();