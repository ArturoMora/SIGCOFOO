(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("ExpertosInactivosComunidadCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$stateParams",
            "$uibModal",
            "globalGet",
            "$http",
            "$compile",
            "authInterceptorService",
            "MiembrosCPService",
            ExpertosInactivosComunidadCtrl
        ]);
    
    function ExpertosInactivosComunidadCtrl(AuthService, $scope, $state, $stateParams, $uibModal, globalGet, $http, $compile, authInterceptorService, MiembrosCPService) {
        $scope.authentication = AuthService.authentication;
        $scope.comunidad_id = $stateParams.id;
              
        // NO SE ELIMINA DE LA BD SOLO SE ACTUALIZA 
        $scope.dardeAlta= function (obj) {
      
            if ($scope.objetoEliminar.tipoExperto == 2) {
              //EXTERNO

            } else {
                //INTENO 
                MiembrosCPService.update($scope.obj).then(
                   function (result) {
                       var idx = ($scope.miembros.indexOf(obj));
                       $scope.miembros.splice(idx, 1);
                   },
                   function (err) {
                       toastr.error("No se han podido dar de baja al experto");
                   });
            }
            $scope.objetoEliminar = {};
        }



        //obtener expertos registrados en la comunidad
        $scope.obtenExpertos = function () {
            MiembrosCPService.obtenExpertosPorComunidad($scope.comunidad_id).then(
                function (response) {
                    $scope.expertos = response.data;          
                },
                function (error) {
                    toastr.warning(error.data.message);
                }
            );        
        };
       

     
        $scope.obtenExpertos();
        
      
     
    }

})();