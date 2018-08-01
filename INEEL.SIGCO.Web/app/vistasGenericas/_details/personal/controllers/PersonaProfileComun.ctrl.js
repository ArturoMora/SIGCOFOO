
(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("PersonaProfileComunCtrl", ['AuthService', '$rootScope', '$scope',
             'globalGet', '$state', '$stateParams', "comunDetailsService", "$uibModalInstance",
             PersonaProfileComunCtrl]);

    function PersonaProfileComunCtrl(AuthService,$rootScope, $scope,
         globalGet, $state, $stateParams, comunDetailsService, $uibModalInstance) {
        var empleadoId = AuthService.authentication.userprofile.clavePersona;
        var clavePersona = $scope.personaIDSearch;
        comunDetailsService.getPersonaById(clavePersona).then(
            function (result) {
                $scope.persona = result.data;

                //$scope.setImagen($scope.persona.adjuntoId);
                $scope.loading = false;
            },
            function (err) {
                $scope.persona = {};
                toastr.error("No se han podido cargar los registros de la persona solicitada");
            }
        );

       


        comunDetailsService.getExtractoById(clavePersona).then(
             function (result) {
                 //console.log("ex:");
                 //console.log(result);
                 $scope.extractoProfesional = result.data;
                 if ($scope.extractoProfesional == null) {
                     //$scope.extractoProfesional = { extracto: null };
                 } else {
                     $scope.extractoProfesional.extracto = $scope.extractoProfesional.extracto.replace(/\n/g, '<br/>')
                 }

             },
             function (err) {
                 $scope.extractoProfesional = {};
                 toastr.error("No se han podido cargar los datos de extracto profesional");
             }
        );
        $scope.AptitudesEmpleadoCant = 0;
        $scope.adicionales = 0;
        $scope.loadList = function () {
            
            comunDetailsService.AptitudesEmpleado_GetAllByEmpleado(clavePersona, empleadoId).then(
                 function (result) {

                     setTimeout(function () {
                         $scope.$apply(function () {
                             $scope.validando = false;
                             $scope.AptitudesEmpleado = result.data;
                             $scope.AptitudesEmpleadoCant = $scope.AptitudesEmpleado.length;
                             if ($scope.AptitudesEmpleadoCant > 3)
                                 $scope.adicionales = $scope.AptitudesEmpleadoCant - 3;
                             setTimeout(function () {
                                //  $scope.toogle();
                             }, 500);
                         });

                     }, 1000);

                 },
                 function (err) {
                     $scope.AptitudesEmpleado = [];
                     $scope.AptitudesEmpleadoCant = 0;
                     $scope.validando = false;
                     toastr.error("No se han podido cargar los datos de Aptitudes Empleado");
                 }
            );
        }
        $scope.loadList();
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

    }

})();