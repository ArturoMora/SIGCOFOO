(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("productoInnovadorDetails", ['AuthService', '$scope', 'productoInnovadorService', "$stateParams",  "$rootScope", productoInnovadorDetails]);

    function productoInnovadorDetails(AuthService, $scope, productoInnovadorService, $stateParams, $rootScope) {
        window.scrollTo(0, 0)

        var id = $stateParams.id;
        if (id == undefined || id == null || id == '') {
            id = $rootScope.getGlobalID();
        }
        // $scope.registro = {};
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//

        //obtener el registro a mostrar
        
        productoInnovadorService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (error) {
                toastr.error(error);
            });
    }
})();