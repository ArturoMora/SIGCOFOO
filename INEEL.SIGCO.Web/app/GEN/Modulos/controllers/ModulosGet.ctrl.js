/*AYUDA:
FooEntitiesService nombre de factory en RolesGet.service.js
*/

(function () {
    "use strict";
    var app = angular.module("ineelGEN");
    app.controller("ModulosGetCtrl", ["$scope", "ModulosService", "$uibModal", "DTOptionsBuilder", ModulosGetCtrl]);

    function ModulosGetCtrl($scope, ModulosService, $uibModal, DTOptionsBuilder) {

        //Variables de carga
        $scope.loading = true;
        //Obtener los servicios de autenticacion
        //$scope.authentication = AuthService.authentication;
        //obtener registros
        ModulosService.getAll().then(
            function (result) {

                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].estado == "1") {
                        result.data[i].estado = true;
                    } else {
                        result.data[i].estado = false;
                    }
                }

                $scope.registrosModulos = result.data;
                $scope.loading = false;

            },
            function (err) {
                toastr.error("No se han podido cargar los módulos registrados en el sistema");
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
                            "moduloId": id,
                            "estado": _estado
                        };
                        ModulosService.UpdateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                        $scope.dtInstance._renderer.rerender();
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.registrosModulos.length; i++) {
                            if ($scope.registrosModulos[i].moduloId == id) {
                                $scope.registrosModulos.estado = estado;
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