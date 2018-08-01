(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("TipoInsumoGetCtrl", ["AuthService", "$scope", "TipoInsumoService", "$uibModal", "DTOptionsBuilder", TipoInsumoGetCtrl]);
    function TipoInsumoGetCtrl(AuthService, $scope, TipoInsumoService, $uibModal, DTOptionsBuilder) {
        $scope.loading = true;
        $scope.authentication = AuthService.authentication;

        TipoInsumoService.getAll()
            .then(
                function (result) {
                   
                    $scope.tipoInsumo = result.data;
                    $scope.loading = false;
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('responsive', true);
                },
                function(error) {
                    toastr.error("No se han podido cargar los registros");
                });

       

        //Guardar estado
        $scope.saveEstado = function (id, estado, descripcion) {
            debugger;
            $scope.descripcionRow = descripcion;
            var pagina;
            var _estado;
            var registro;
            if (estado == true) {
                pagina = "Active";
                _estado = true;
            } else {
                pagina = "Delete";
                _estado = false;
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + pagina + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if (estado == true) {
                            registro = {
                                "TipoInsumoId": id,
                                "EstadoDisponible": _estado
                            };
                        } else {
                            registro = {
                                "TipoInsumoId": id,
                                "EstadoDisponible": _estado
                            };
                        }
                        TipoInsumoService.UpdateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.tipoInsumo.length; i++) {
                            if ($scope.tipoInsumo[i].tipoInsumoId == id) {
                                $scope.tipoInsumo[i].estadoDisponible = estado;
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