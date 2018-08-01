(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("GruposColegiadoPartIntGetCtrl", [
            "AuthService",
            "$scope",
            "GruposColegiadoPartIntCRService",
            "$uibModal",
            GruposColegiadoPartIntGetCtrl
        ]);

    function GruposColegiadoPartIntGetCtrl(AuthService, $scope, GruposColegiadoPartIntCRService, $uibModal) {
        $scope.authentication = AuthService.authentication;

     
        GruposColegiadoPartIntCRService.getGruposColegiadoPartInt().then(
            function (result) {              
                $scope.gruposColegiadoPartInt = result.data;
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