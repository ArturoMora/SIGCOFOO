(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("tecnologiaLicenciadaDetails", ['AuthService', '$scope', 'tecnologiaLicenciadaService', "$stateParams", "$rootScope", tecnologiaLicenciadaDetails]);

    function tecnologiaLicenciadaDetails(AuthService, $scope, tecnologiaLicenciadaService, $stateParams, $rootScope) {
        window.scrollTo(0, 0)
        
        // var id = $stateParams.id;
        // if (id == undefined || id == null || id == '') {
        //     id = $rootScope.getGlobalID();
        // }
        // $scope.registro = {};
        
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//

        //obtener el registro a mostrar
        tecnologiaLicenciadaService.getbyid($stateParams.id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (error) {
                toastr.error(error);
            });
    }
})();