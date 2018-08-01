(function () {
    "use strict";

    var app = angular.module("ineelCH");

    app.controller("PaisCtrlGet", ["AuthService", "$scope", "PaisService", "$uibModal", "DTOptionsBuilder", PaisCtrlGet]);
    function PaisCtrlGet(AuthService, $scope, PaisService, $uibModal, DTOptionsBuilder) {
        $scope.dtInstance = {};
        //Variables de carga
        $scope.loading = true;
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //obtener registros
        PaisService.getAll().then(
            function (result) {
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].estado == "1") {
                        result.data[i].estado = true;
                    } else {
                        result.data[i].estado = false;
                    }
                }
                $scope.registrospaises = result.data;
                $scope.loading = false;

                $scope.dtOptions = DTOptionsBuilder
                 .newOptions()
                 .withOption('responsive', true);
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de Países");
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
                                "paisID": id,
                                "estado": _estado
                            };
                        PaisService.UpdateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                        $scope.dtInstance._renderer.rerender();
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.registrospaises.length; i++) {
                            if ($scope.registrospaises[i].paisID == id) {
                                $scope.registrospaises[i].estado = estado;
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