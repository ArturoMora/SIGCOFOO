(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("productoInnovadorDetailsProyecto", ['AuthService', '$scope', 'ComunServiceProyectos', "$stateParams",   productoInnovadorDetailsProyecto]);

    function productoInnovadorDetailsProyecto(AuthService, $scope, ComunServiceProyectos, $stateParams) {
       
        $scope.registro = {};
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//

        //obtener el registro a mostrar
        ComunServiceProyectos.getdetallesProductosInnovadores($stateParams.id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (error) {
                toastr.error(error);
                console.log(error);
            });
    }
})();