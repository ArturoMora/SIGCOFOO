(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("ExtractoProfesionalCtrlAdd", ['AuthService', '$scope','$rootScope', 'ExtractoProfesionalService',
            '$state', 'comunService','comunDetailsService','$uibModalInstance', ExtractoProfesionalCtrlAdd]);
    function ExtractoProfesionalCtrlAdd(AuthService, $scope,$rootScope, ExtractoProfesionalService,
        $state, comunService,comunDetailsService,$uibModalInstance) {
        $scope.authentication = AuthService.authentication;
        $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        $scope.registro = { ClaveEmpleado: $scope.clavePersona, nombre: $scope.nombreEmpleado };

         $scope.cancelar = function () {
            $uibModalInstance.dismiss('cancel');
        }

        comunDetailsService.getExtractoById($scope.clavePersona).then(
            function (result) {
                $scope.extractoProfesional = {};
                if(result.data != null){
                $scope.extractoProfesional = result.data;
                $scope.registro.Extracto = $scope.extractoProfesional.extracto;
                }

            },
            function (err) {
                $scope.extractoProfesional = {};
                toastr.error("No se han podido cargar los datos de extracto profesional");
            }
        );
        
        //Agregar ExtractoProfesional
        $scope.save = function () {
            ExtractoProfesionalService.Add($scope.registro).then(
            function (result) {
                $scope.variable = result.data;                
                toastr.success(result.data);
                $uibModalInstance.close ($scope.registro.Extracto);
            },
            function (error) {
                toastr.error("Error al crear el registro");
                $scope.variable = [];
            }
        );

            
        }
    }
})();