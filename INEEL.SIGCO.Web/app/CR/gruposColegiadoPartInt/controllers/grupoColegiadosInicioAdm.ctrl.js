(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("GruposColegiadosInicioAdmCtrl", [
            "AuthService",
            "$scope",
            "GruposColegiadoPartIntCRService",
            "PersonasPartIntCRService",
               "$uibModal",
            GruposColegiadosInicioAdmCtrl
        ]);

    function GruposColegiadosInicioAdmCtrl(AuthService, $scope, GruposColegiadoPartIntCRService, PersonasPartIntCRService, $uibModal) {
        $scope.authentication = AuthService.authentication;
       

        GruposColegiadoPartIntCRService.getGruposColegiadoPartInt().then(
            function (result) {
                $scope.gruposColegiadoPartInt = result.data;
            },
            function (err) {
                console.error("No se han podido cargar los registros");
            }
        );

        PersonasPartIntCRService.getPersonasPartIntAllFKs().then(
           function (result) {
                            
               $scope.personasPartInt = result.data;

           },
           function (err) {
               console.error("No se han podido cargar los registros");
           }
        );



        $scope.saveEstadoGP = function (obj) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (obj.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        GruposColegiadoPartIntCRService.UpdateEstado(obj).then(function (result) {
                            console.log(result.data);
                        }, function (err) {
                            $scope.cancel();
                        });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.gruposColegiadoPartInt.indexOf(obj));
                        $scope.gruposColegiadoPartInt[idx].estado = !$scope.gruposColegiadoPartInt[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }



        //Guardar estado
        $scope.saveEstadoP = function (obj) {
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


        $scope.deleteGP = function (obj) {
            var index = $scope.gruposColegiadoPartInt.indexOf(obj);
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        GruposColegiadoPartIntCRService.deleteIntegranteGrupoExterno(obj.grupoColegiadoPartIntId)
                        .then(
                            function (result) {
                               
                               GruposColegiadoPartIntCRService.deleteIntegranteGrupoInterno(obj.grupoColegiadoPartIntId)
                               .then(
                                     function (result) {

                                        GruposColegiadoPartIntCRService.delete(obj.grupoColegiadoPartIntId)
                                       .then(
                                           function (result) {
                                               toastr.success("Registro eliminado exitosamente!");
                                               $scope.gruposColegiadoPartInt.splice(index, 1);
                                           },
                                           function (err) {
                                               console.error(err);
                                        });

                               },
                               function (err) {
                                  console.error(err);
                               });
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