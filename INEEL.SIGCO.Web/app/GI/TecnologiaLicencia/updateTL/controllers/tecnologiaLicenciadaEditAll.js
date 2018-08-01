(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("tecnologiaLicenciadaEditAll", ['AuthService', '$scope', 'MenuService',
            "$stateParams", "$rootScope", "$state",  tecnologiaLicenciadaEditConstant]);

    function tecnologiaLicenciadaEditConstant(AuthService, $scope, MenuService,
        $stateParams, $rootScope, $state) {
        window.scrollTo(0, 0);
        var id = $rootScope.getGlobalID();
        var id2 = $rootScope.getGlobalID2();
        if (id2 == undefined || id2 == null || id2 == '') {
            $state.go("tecnologiaLicenciada");
        }
        $scope.registro = {};
        $scope.pago = {};
        $scope.leccion = {};
        $scope.rolId = MenuService.getRolId();

        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        //Extraer informacion del usuario//
        $scope.modo = [{ id: "GER", name: "Gerencia Técnica" }];
        if ($scope.authentication.userprofile.claveUnidad == 55) {
            $scope.modo.push({ id: "GCyDN", name: "GCyDN" });
        }
        if ($scope.rolId == 1030) {
            $scope.modo.push({ id: "GAJ", name: "GAJ" });
        }

        
        ///redireccionar:
        if ($scope.modo.length == 1) {
            $state.go("tecnologiaLicenciadaEditConstant");
        }
        
        $scope.redirect = function (tip) {
           
            if (tip.id == "GCyDN") {
                $state.go("tecnologiaLicenciadaEdit");
            } else if (tip.id == "GAJ") {
                $state.go("tecnologiaLicenciadaDetailsGAJ");
            } else if (tip.id =="GER"){
                $state.go("tecnologiaLicenciadaEditConstant");
            }
        }

    }
})();