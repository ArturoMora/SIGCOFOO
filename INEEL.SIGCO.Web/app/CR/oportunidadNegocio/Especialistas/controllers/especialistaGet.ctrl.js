(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("EspecialistaGetCtrl", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$stateParams",
        "DTOptionsBuilder",
        "$uibModal",
        "OportunidadNegocioCRService",
         EspecialistaGetCtrl
    ]);

    function EspecialistaGetCtrl(AuthService, $filter, $scope, $state, $stateParams, DTOptionsBuilder, $uibModal, OportunidadNegocioCRService) {
        $scope.authentication = AuthService.authentication;
        var pagina;
        $scope.especialistas = [];
        $scope.especialista = {};
        $scope.status = {};

        $scope.recargar = function () {
            OportunidadNegocioCRService.getPersonasByIdRol().then(
                function (result) {
                    $scope.especialistas = result.data;
                    
                },
                function (err) {
                    console.error(err);
                }
            );
        }

        $scope.buscarEspecialista = function () {
            var modalInstance = $uibModal.open({
                size:'lg',
                templateUrl: 'app/vistasGenericas/PersonasEspecialistaGet.html',
                controller: 'PersonasEspecialistasGetCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selected) {
               
                $scope.especialista = selected;
            });
        }

        $scope.agregarEspecialista = function () {
           
            var resgitroRolEspecialista = {
                "clavePersona": $scope.especialista.clavePersona,
                "rupersona": $scope.especialista.ruPersona,
                "estado": 1,
                "fechaEfectiva": $scope.especialista.fechaEfectiva,
            }

            OportunidadNegocioCRService.AddEspecialista(resgitroRolEspecialista).then(
                    function (result) {
                        toastr.success(result.data);
                        $scope.especialista.nombreCompleto = null;
                        $scope.recargar();
                    },
                    function (err) {
                        console.error(err);
                    }
                );
        }

        $scope.editarEspecialista = function (id, status) {
            debugger;
            var _estado = id.estado;
            if (status == true) {
                pagina = "Active";
                _estado = 1;
            } else {
                pagina = "Delete";
                _estado = 0;
            }

            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/registroLogico' + pagina + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        debugger;
                        id.estado = _estado;
                        $scope.especialista = id;
                        OportunidadNegocioCRService.editarEspecialista($scope.especialista).then(
                            function (success) {
                                $scope.recargar();
                            },
                            function (err) {
                                toastr.error(err);
                            }
                        );
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                        $scope.recargar();
                    };
                },
                scope: $scope
            });
        }

        $scope.eliminarRegistro = function (id) {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        OportunidadNegocioCRService.eliminarEspecialista(id).then(
                            function (result) {
                                toastr.success(result.data);
                                $scope.recargar();
                            },
                            function (err) {
                                toastr.error(err);
                            }
                        );
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                        $scope.recargar();
                    };
                },
                scope: $scope
            });
        }

        $scope.recargar();
    }
})();
