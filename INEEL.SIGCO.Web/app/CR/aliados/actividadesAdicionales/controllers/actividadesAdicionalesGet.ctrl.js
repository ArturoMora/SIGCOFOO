(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ActividadesAdicionalGetCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "ActividadesAdicionalCRService",
        "DTOptionsBuilder",
        "$uibModal",
        ActividadesAdicionalGetCtrl
        ]);

    function ActividadesAdicionalGetCtrl(AuthService, $scope, $state, $stateParams, ActividadesAdicionalCRService, DTOptionsBuilder, $uibModal) {
        $scope.authentication = AuthService.authentication;
        $scope.loading = true;
        $scope.dtInstance = {};
        ActividadesAdicionalCRService.getActividadesAdicional().then(
            function (result) {
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].estado == "1") {
                        result.data[i].estado = true;
                    } else {
                        result.data[i].estado = false;
                    }
                }
                $scope.actividadesAdicional = result.data;
                $scope.loading = false;

                $scope.dtOptions = DTOptionsBuilder
                        .newOptions()
                        .withOption('responsive', true);
            },
            function (err) {
                console.error("No se han podido cargar los registros");
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
                                "actividadAdicionalId": id,
                                "estado": _estado
                            };
                        } else {
                            registro = {
                                "actividadAdicionalId": id,
                                "estado": _estado
                            };
                        }
                        ActividadesAdicionalCRService.UpdateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                        $scope.dtInstance._renderer.rerender();
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.actividadesAdicional.length; i++) {
                            if ($scope.actividadesAdicional[i].actividadAdicionalId == id) {
                                $scope.actividadesAdicional[i].estado = estado;
                            }
                        }
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

        //$scope.delete = function (areaInvestigacion, $uibModalInstance) {
        //    AreasInvestigacionCRService.delete(areaInvestigacion.areaInvestigacionId).then(
        //          function (result) {
        //              var idx = $scope.areasInvestigacion.indexOf(areaInvestigacion)
        //              $scope.areasInvestigacion.splice(idx, 1);
        //              toastr.success(result.data);
        //              $uibModalInstance.dismiss('cancel');
        //          },
        //          function (err) {
        //              console.error(err);
        //              toastr.error(err.data.message);
        //          });
        //}

        //$scope.open = function (areaInvestigacion) {
        //    var modalInstance = $uibModal.open({
        //        templateUrl: 'app/CR/areasInvestigacion/areaInvestigacionDelete.html',
        //        controller: function ($uibModalInstance) {
        //            $scope.ok = function () {
        //                $scope.delete(areaInvestigacion, $uibModalInstance);
        //                $uibModalInstance.dismiss('cancel');
        //            };

        //            $scope.cancel = function () {
        //                $uibModalInstance.dismiss('cancel');
        //            };
        //        },
        //        scope: $scope
        //    });
        //}
    }


})();