(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("AgregaComentariosLineamientosCtrl", [
            "AuthService",
            "$scope",
            "$stateParams",
            "$rootScope",
            "$filter",
            "MenuService",
            "LineamientosCPService",
            "MiembrosCPService",
            AgregaComentariosLineamientosCtrl
        ]);

    function AgregaComentariosLineamientosCtrl(AuthService, $scope, $stateParams, $rootScope, $filter,MenuService, LineamientosCPService, MiembrosCPService) {
        $scope.comentariosLCP = {};
        $scope.auth = AuthService.authentication;
        $scope.regresar = function () {
            $rootScope.globalRegresar();
        }

        $scope.usuario = MenuService.getVariable("datosCP");
        if ($scope.usuario === null) {
            $scope.regresar();
        }
        MenuService.deleteVariable("datosCP");

        $scope.agregaRegistro = function () {
           
            $scope.comentariosLCP.idMiembro = $scope.usuario.rol.datosMiembro.miembroId;
            $scope.comentariosLCP.idLineamiento = $stateParams.id;
            $scope.comentariosLCP.fechaRegistro = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            LineamientosCPService.createComentario($scope.comentariosLCP).then(function (result) {

                $scope.form.$setPristine();
                toastr.success(result.data);
               $scope.regresar();

            },function(err) {
               toastr.error("Error al crear el registro");
               console.log(err);
           });
       }

      

        //$scope.obtenerMiembro();
    }

})();