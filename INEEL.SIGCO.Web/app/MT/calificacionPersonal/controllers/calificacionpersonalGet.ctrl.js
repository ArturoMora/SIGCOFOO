﻿(function () {
    "use strict";

    angular
        .module("ineelMT")
        .controller("CalificacionPersonalGetCtrl", ["AuthService", "$scope", "CalificacionPersonalService", "$uibModal", "DTOptionsBuilder", CalificacionPersonalGetCtrl]);
    function CalificacionPersonalGetCtrl(AuthService, $scope, CalificacionPersonalService, $uibModal, DTOptionsBuilder) {
        //Obtener los servicios de autenticacion
        $scope.loading = true;
        $scope.authentication = AuthService.authentication;
        //obtener registros
        CalificacionPersonalService.getAll().then(
            function (result) {
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].estado == "1") {
                        result.data[i].estado = true;
                    } else {
                        result.data[i].estado = false;
                    }
                }
                $scope.registros = result.data;
                $scope.loading = false;

                $scope.dtOptions = DTOptionsBuilder
                 .newOptions()
                 .withOption('responsive', true);
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de CalificacionPersonal");
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
            $scope.aux = $scope.descripcionRow;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + pagina + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if (estado == true) {
                            registro = {
                                "calificacionPersonalId": id,
                                "estado": _estado
                            };
                        } else {
                            registro = {
                                "calificacionPersonalId": id,
                                "estado": _estado
                            };
                        }
                        CalificacionPersonalService.UpdateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.registros.length; i++) {
                            if ($scope.registros[i].calificacionPersonalId == id) {
                                $scope.registros[i].estado = estado;
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