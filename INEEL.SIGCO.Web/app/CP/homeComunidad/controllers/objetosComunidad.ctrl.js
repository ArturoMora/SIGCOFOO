(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("ObjetosComunidadCtrl", [
            "AuthService",
            "$scope",
            "CategoriaSitioService",
            "$uibModal",
            ObjetosComunidadCtrl
        ]);

    function ObjetosComunidadCtrl(AuthService, $scope, $uibModal) {
        $scope.authentication = AuthService.authentication;
      

      

    }

})();