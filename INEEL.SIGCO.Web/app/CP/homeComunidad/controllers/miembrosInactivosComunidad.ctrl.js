(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("MiembrosInactivosComunidadCtrl", [
            "AuthService",
            "$scope",
            "$filter",
            "$stateParams",
            "MiembrosCPService",       
            "$uibModal",
            MiembrosInactivosComunidadCtrl
        ]);

    function MiembrosInactivosComunidadCtrl(AuthService, $scope, $filter, $stateParams, MiembrosCPService,  $uibModal) {
        $scope.authentication = AuthService.authentication;
        $scope.comunidad_id = $stateParams.id;
        
//NOTA: para modificar el comportamiento de miembros inactivos referirse a miembrosComunidad.ctrl.js, el william asi lo dejo

        MiembrosCPService.getMiembrosByComunidadInactivos($scope.comunidad_id).then(
            function (result) {
                $scope.miembros = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros");
            }
         );
        
        $scope.dardeAlta = function (obj) {
        
            obj.aceptacion = true;
          
            MiembrosCPService.update(obj).then(
               function (result) {
                   var idx = ($scope.miembros.indexOf($scope.objetoEliminar));
                   $scope.miembros.splice(idx, 1);
                   toastr.success("Registro actualizado correctamente!");
               },
               function (err) {
                   toastr.error("No se han podido actualizar el registro");
               });

        }

     

    }

})();