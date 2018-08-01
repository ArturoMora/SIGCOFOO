(function () {
    "use strict";

    angular
        .module("ineelMT")
        .controller("CalificacionClienteGetCtrl", ["AuthService", "$scope", "CalificacionClienteService", "$uibModal", "DTOptionsBuilder", CalificacionClienteGetCtrl]);

    function CalificacionClienteGetCtrl(AuthService, $scope, CalificacionClienteService, $uibModal, DTOptionsBuilder) {
        //Obtener los servicios de autenticacion
        $scope.loading = true;
        $scope.authentication = AuthService.authentication;
        //obtener registrosclienteregistroscliente
        CalificacionClienteService.getAll().then(
            function (result) {
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].estado == "1") {
                        result.data[i].estado = true;
                    } else {
                        result.data[i].estado = false;
                    }
                }
                $scope.registroscliente = result.data;
                $scope.loading = false;

                $scope.dtOptions = DTOptionsBuilder
                 .newOptions()
                 .withOption('responsive', true);
            },
            function (err) {
                toastr.error("No se han podido cargar los registroscliente de CalificacionCliente");
            }
            );

        //Guardar estado
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
                                "calificacionClienteId": id,
                                "estado": _estado
                            };
                        } else {
                            registro = {
                                "calificacionClienteId": id,
                                "estado": _estado
                            };
                        }
                        CalificacionClienteService.UpdateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.registroscliente.length; i++) {
                            if ($scope.registroscliente[i].calificacionClienteId == id) {
                                $scope.registroscliente[i].estado = estado;
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