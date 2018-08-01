(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("AliadosVigentesGetCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "AliadosCRService",
        "$uibModal",
        "MenuService",
        AliadosVigentesGetCtrl
        ]);

    function AliadosVigentesGetCtrl(AuthService, $scope, $state, AliadosCRService, $uibModal, MenuService) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };


        $scope.authentication = AuthService.authentication;
        $scope.rolId = MenuService.getRolId();;
        $scope.tablavisible = false;
        $scope.loading = true;
        $scope.dtInstance = {};

        AliadosCRService.GetAllConveniosVigentes().then(
            function (result) {

                if (typeof result.data !== 'undefined' && result.data != null) {
                    $scope.aliados = result.data;
                    $scope.loading = false;
                    $scope.tablavisible = true;
                }

            },
            function (err) {
                console.error("No se han podido cargar los registros");
            }
            );


        $scope.detalleAliados = function (idReg) {
            $state.go("aliadoDetails", { id: idReg });
        }

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
                                "aliadoId": id,
                                "estado": _estado
                            };
                        } else {
                            registro = {
                                "aliadoId": id,
                                "estado": _estado
                            };
                        }
                       AliadosCRService.UpdateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                        $scope.dtInstance._renderer.rerender();
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.aliados.length; i++) {
                            if ($scope.aliados[i].aliadoId == id) {
                                $scope.aliados[i].estado = estado;
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