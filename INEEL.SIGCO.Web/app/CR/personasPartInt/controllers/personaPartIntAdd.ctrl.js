(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("PersonaPartIntAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "$filter",
        "$uibModal",
        "PersonasPartIntCRService",
        "PaisesService",
        PersonaPartIntAddCtrl
        ]);

    function PersonaPartIntAddCtrl(AuthService, $scope, $state, $stateParams, $filter, $uibModal, PersonasPartIntCRService, PaisesService) {
        $scope.authentication = AuthService.authentication;
        $scope.personaPartInt = {};



        //Buscar Contacto
        $scope.ContactoSeleccionada = {};
        $scope.vercontacto = false;
        $scope.openContacto = function () {
            $scope.vinculo = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/ContactosGetGral.html',
                controller: 'ContactosGetGralCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.contacto = selectedItem.nombreCompleto;

                $scope.personaPartInt.contactoId = selectedItem.contactoId;
               
                $scope.form.$setDirty();
                $scope.ContactoSeleccionada = selectedItem;
            });
        }

        //obtener lista de NaturalezasInteraccionEstado
        PersonasPartIntCRService.getNaturalezasInteraccionEstado().then(
             function (result) {
                 $scope.naturalezasInteraccion = result.data;
             },
            function (err) {
                toastr.error("No se ha podido cargar los registros");
            }
        );

     

        $scope.AddPersonaPartInt = function () {
            
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                
                var registro = {
                    "nombre": $scope.contacto,
                    "descripcion": $scope.personaPartInt.descripcion,
                    "fechaRegistro": new Date(),
                    "estado": 1,
                    "contactoId": $scope.personaPartInt.contactoId,
                    "naturalezaInteraccionId": $scope.personaPartInt.naturalezaInteraccionId
                }
                                                                
                PersonasPartIntCRService.create(registro).then(
                  function (result) {
                            
                            toastr.success(result.data);
                            $state.go($scope.globalRegresar());
                  },
                  function(err) {
                            toastr.error(err.data.message);
                            console.error(err.data);
                            $scope.desactivar = false;
                  }
                );
            }
        }
    }
})();