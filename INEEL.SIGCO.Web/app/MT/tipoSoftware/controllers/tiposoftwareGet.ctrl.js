(function () {
    "use strict";
     angular
        .module("ineelMT")
        .controller("TipoSoftwareGetCtrl", ["AuthService", "$scope", "TipoSoftwareService", "$uibModal", "DTOptionsBuilder", "$state", TipoSoftwareGetCtrl]);
     function TipoSoftwareGetCtrl(AuthService, $scope, TipoSoftwareService, $uibModal, DTOptionsBuilder, $state) {
        //Obtener los servicios de autenticacion
        $scope.loading = true;
        $scope.authentication = AuthService.authentication;
        //obtener registros
        TipoSoftwareService.getAll().then(
            function (result) {
                $scope.registrossoftware = result.data;
                $scope.loading = false;
                $scope.dtOptions = DTOptionsBuilder
                 .newOptions()
                 .withOption('responsive', true);
            },
            function (err) {
                toastr.error("No se han podido cargar los registros");
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
                _estado = true;
            } else {
                pagina = "Delete";
                _estado = false;
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + pagina + '.html',
                controller: function ($uibModalInstance){
                    $scope.ok = function () {
                        if (estado == true) {
                            registro = {
                                "TipoSoftwareId": id,
                                "estado": _estado
                            };
                        } else {
                            registro = {
                                "TipoSoftwareId": id,
                                "estado": _estado
                            };
                        }
                        TipoSoftwareService.UpdateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.registrossoftware.length; i++) {
                            if ($scope.registrossoftware[i].tipoSoftwareId == id) {
                                $scope.registrossoftware[i].estado = estado;
                            }
                        }
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

        $scope.detalleSoftware = function (idReg) {
            $state.go("TipoSoftwareDetails", { id: idReg });
        }

    }
})();