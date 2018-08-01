/*AYUDA:
personasService nombre de factory en empleado.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("SolicitudConJustificacionMTctrl", [
        "$scope",
        "$state",
        "$stateParams",
        "AuthService", "MenuService",
        "$uibModalInstance", SolicitudConJustificacionMTctrl]);

    function SolicitudConJustificacionMTctrl($scope, $state, $stateParams,AuthService,MenuService,
         $uibModalInstance) {
        
             $scope.mostrarB1 = false;
             $scope.mostrarB2 = false;

        if ($scope.datosDeModal == undefined) {
            $scope.datosDeModal={}
        }
        $scope.datosDeModal.ok1 = false;
        $scope.datosDeModal.ok2 = false;
        $scope.datosDeModal.justificacion = "";
        $scope.datosDeModal.clasificacionSignatura = "";
        $scope.datosDeModal.numInforme = "";
        try{
            $scope.datosDeModal.clasificacionSignatura = $scope.itf.clasificacionSignatura;
            $scope.datosDeModal.numInforme = $scope.itf.numInforme;
            //TODO: checar la asignación
        }catch(e){}
        
        
        if ($scope.datosDeModal.msg1 != undefined && $scope.datosDeModal.msg1.length>1) {
            $scope.mostrarB1 = true;
        }
        if ($scope.datosDeModal.msg2 != undefined && $scope.datosDeModal.msg2.length > 1) {
            $scope.mostrarB2 = true;
        }

        $scope.authentication = AuthService.authentication;
        $scope.idRol = MenuService.getRolId();      
        
        $scope.cancel = function () {            
            $uibModalInstance.dismiss('cancel');
        }
        
        $scope.ok1 = function () {
            $scope.datosDeModal.ok1 = true;
            $uibModalInstance.close($scope.datosDeModal);
        }
        $scope.ok2 = function () {
            $scope.datosDeModal.ok2 = true;
            $uibModalInstance.close($scope.datosDeModal);
        }
    }


})();