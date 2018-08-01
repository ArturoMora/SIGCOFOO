(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("CarreraCtrlGet", ["AuthService", "$scope", "CarreraService","$uibModal","DTOptionsBuilder", CarreraCtrlGet]);
    function CarreraCtrlGet(AuthService, $scope, CarreraService, $uibModal, DTOptionsBuilder) {
        $scope.dtInstance = {};
        //Variables de carga
        $scope.loading = true;
        ////obtener registros
        CarreraService.getAll().then(
            function (result) {
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].estado == "1") {
                        result.data[i].estado = true;
                    } else {
                        result.data[i].estado = false;
                    }
                }
                $scope.registroscarreras = result.data;
                $scope.loading = false;

                $scope.dtOptions = DTOptionsBuilder
                 .newOptions()
                 .withOption('responsive', true);
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de Carrera");
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
                        registro = {
                            "carreraId": id,
                            "estado": _estado
                        };
                        CarreraService.UpdateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                        $scope.dtInstance._renderer.rerender();
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.registroscarreras.length; i++) {
                            if ($scope.registroscarreras[i].carreraId == id) {
                                $scope.registroscarreras[i].estado = estado;
                            }
                        }
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
            //var modalInstance = $uibModal.open({
            //    templateUrl: 'app/vistasGenericas/registroLogicoDelete.html',
            //    controller: function ($uibModalInstance) {
            //        $scope.ok = function () {
            //            if (estado == true) {
            //                estado = 1;
            //            } else {
            //                estado = 0;
            //            }
            //            var registro = {
            //                "carreraId": id,
            //                "estado": estado
            //            };
            //            CarreraService.UpdateEstado(registro);
            //            $uibModalInstance.dismiss('cancel');
            //        };
            //        $scope.cancel = function () {
            //            if (estado == true) {
            //                estado = false;
            //            } else {
            //                estado = true;
            //            }
            //            for (var i = 0; i < $scope.registroscarreras.length; i++) {
            //                if ($scope.registroscarreras[i].carreraId == id) {
            //                    $scope.registroscarreras[i].estado = estado;
            //                }
            //            }
            //            $uibModalInstance.dismiss('cancel');
            //        };
            //    },
            //    scope: $scope
            //});

        }

    }
})();