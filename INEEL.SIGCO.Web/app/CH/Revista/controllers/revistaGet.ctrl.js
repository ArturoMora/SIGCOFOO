(function () {
    "use strict";

    var app = angular.module("ineelCH");

    app.controller("RevistaCtrlGet", ["AuthService", "$scope", "RevistaService", "$uibModal", "DTOptionsBuilder", RevistaCtrlGet]);
    function RevistaCtrlGet(AuthService, $scope, RevistaService, $uibModal, DTOptionsBuilder) {
        $scope.dtInstance = {};
        //Variables de carga
        $scope.loading = true;
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //obtener registros
        RevistaService.getAll().then(
            function (result) {
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].estado == "1") {
                        result.data[i].estado = true;
                    } else {
                        result.data[i].estado = false;
                    }
                }
                $scope.registrosrevistas = result.data;
                $scope.loading = false;

                $scope.dtOptions = DTOptionsBuilder
                 .newOptions()
                 .withOption('responsive', true).
                    withOption('deferRender', true);
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de Revistas");
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
                                "revistaId": id,
                                "estado": _estado
                            };
                        RevistaService.UpdateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                        $scope.dtInstance._renderer.rerender();
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.registrosrevistas.length; i++) {
                            if ($scope.registrosrevistas[i].revistaId == id) {
                                $scope.registrosrevistas[i].estado = estado;
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