(function () {
    "use strict";

    angular
        .module("ineelMT")
        .controller("TipoCursoGetCtrl", ["AuthService", "$scope", "TipoCursoService", "$uibModal", "DTOptionsBuilder", "$state", TipoCursoGetCtrl]);
    function TipoCursoGetCtrl(AuthService, $scope, TipoCursoService, $uibModal, DTOptionsBuilder, $state) {
        $scope.loading = true;
        $scope.authentication = AuthService.authentication;
        //obtener registros
        TipoCursoService.getAll().then(
            function (result) {
                $scope.registroscurso = result.data;
                $scope.loading = false;
                $scope.dtOptions = DTOptionsBuilder
                 .newOptions()
                 .withOption('responsive', true);
            },
            function (err) {
                toastr.error("No se han podido cargar los registros");
            }
            );

        $scope.detalleCurso= function (idReg) {
            $state.go("TipoCursoDetails", { id: idReg });
        }

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
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        if (estado == true) {
                            registro = {
                                "TipoCursoId": id,
                                "estado": _estado
                            };
                        } else {
                            registro = {
                                "TipoCursoId": id,
                                "estado": _estado
                            };
                        }
                        TipoCursoService.UpdateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.registroscurso.length; i++) {
                            if ($scope.registroscurso[i].tipoCursoId == id) {
                                $scope.registroscurso[i].estado = estado;
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