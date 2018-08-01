(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("PersonaPartIntEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "$uibModal",
        "PersonasPartIntCRService",
        "PaisesService",
        PersonaPartIntEditCtrl
        ]);

    function PersonaPartIntEditCtrl(AuthService, $scope, $state, $stateParams, $uibModal, PersonasPartIntCRService, PaisesService) {

        $scope.authentication = AuthService.authentication;
        $scope.personasPartInt_id = $stateParams.id;
        //$scope.personasPartInt = {};
        //var estadoId = 0;
        //var paisId = 16;

        PersonasPartIntCRService.getPersonaPartIntFKById($scope.personasPartInt_id).then(
            function (result) {
                $scope.personasPartInt = result.data;


            },
            function (err) {
                console.error(err);
            });
        

     

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
                $scope.personasPartInt.contactoId = selectedItem.contactoId;
                
                $scope.ContactoSeleccionada = selectedItem;
            });
        }
        



        $scope.savePersonaPartInt = function () {

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
               
                PersonasPartIntCRService.update($scope.personasPartInt)
                    .then(
                        function(result) {
                            toastr.success(result.data);
                            $scope.form.$setPristine();
                            //$state.go("personasPartIntGet");
                        },
                        function(err) {
                            console.error(err);
                            //$scope.desactivar = false;
                        });
            }
        };

        

        //obtener lista de fuentes de financiamiento
        PersonasPartIntCRService.getNaturalezasInteraccionEstado().then(
             function (result) {
                 $scope.naturalezasInteraccion = result.data;
             },
            function (err) {
                toastr.error("No se ha podido cargar los registros");
            }
        );


    }
})();