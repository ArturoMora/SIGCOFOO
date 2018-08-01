(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("TipoConvenioGetCtrl",[
        "$scope",
        "$state",
        "$stateParams",
        "TipoConvenioCRService",
        "$uibModal",
        TipoConvenioGetCtrl
        ]);

    function TipoConvenioGetCtrl($scope, $state, $stateParams, TipoConvenioCRService, $uibModal) {
        $scope.loading = true;
        //$scope.estado = true;
        //$scope.tipoConvenio = [];
        TipoConvenioCRService.getAll()
            .then(
                function (result) {
                    for (var i = 0; i < result.data.length; i++) {
                        if (result.data[i].estado == "1") {
                            result.data[i].estado = true;
                        } else {
                            result.data[i].estado = false;
                        }
                    }
                    $scope.tipoConvenio = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    console.error(err);
                });

        $scope.saveEstado = function (id, estado, descripcion) {
            $scope.descripcionRow = descripcion;
            var pagina;
            var _estado;
            var registro;
            if (estado == true) {
                pagina = "Active";
                _estado = 1;
            } else {
                pagina = "Delete";
                _estado = 0;
            }

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + pagina + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if (estado == true) {
                            registro = {
                                "convenioId": id,
                                "estado": _estado
                            };
                        } else {
                            registro = {
                                "convenioId": id,
                                "estado": _estado
                            };
                        }
                        TipoConvenioCRService.UpdateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.tipoConvenio.length; i++) {
                            if ($scope.tipoConvenio[i].convenioId == id) {
                                $scope.tipoConvenio[i].estado = estado;
                            }
                        }
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

    }


})();