(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("PersonasPartIntGetCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
         "$uibModal",
        "PersonasPartIntCRService",    
         PersonasPartIntGetCtrl
        ]);

    function PersonasPartIntGetCtrl(AuthService, $scope, $state, $stateParams, $uibModal, PersonasPartIntCRService) {
        $scope.authentication = AuthService.authentication;
      
        PersonasPartIntCRService.getPersonasPartIntAllFKs().then(
            function (result) {               
              $scope.personasPartInt = result.data;
            },
            function (err) {
                console.error("No se han podido cargar los registros");
            }
         );

        //Guardar estado
        $scope.saveEstado = function (obj) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (obj.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        PersonasPartIntCRService.UpdateEstado(obj).then(function (result) {
                            console.log(result.data);
                        }, function (err) {
                            $scope.cancel();
                        });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.personasPartInt.indexOf(obj));
                        $scope.personasPartInt[idx].estado = !$scope.personasPartInt[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }


        $scope.deleteP = function (obj) {
            var index = $scope.personasPartInt.indexOf(obj);
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                   
                    $scope.ok = function () {
                        PersonasPartIntCRService.delete(obj.personaPartIntId)
                        .then(
                            function (result) {
                                toastr.success("Registro eliminado exitosamente!");
                                $scope.personasPartInt.splice(index, 1);

                            },
                            function (err) {
                                console.error(err);
                            });
                        $uibModalInstance.dismiss('close');
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };




       
    }


})();