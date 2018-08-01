(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ProveedoresGetCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "ProveedoresCRService",
        "DTOptionsBuilder",
        "$uibModal",
        ProveedoresGetCtrl
        ]);

    function ProveedoresGetCtrl(AuthService, $scope, $state, $stateParams, ProveedoresCRService, DTOptionsBuilder, $uibModal) {
        $scope.authentication = AuthService.authentication;
        $scope.loading = true;
        $scope.dtInstance = {};
        ProveedoresCRService.getProveedores().then(
            function (result) {
                for (var i = 0; i < result.data.length; i++) {
                    if (result.data[i].estado == "1") {
                        result.data[i].estado = true;
                    } else {
                        result.data[i].estado = false;
                    }
                }
                $scope.proveedores = result.data;
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
                                "proveedorId": id,
                                "estado": _estado
                            };
                        } else {
                            registro = {
                                "proveedorId": id,
                                "estado": _estado
                            };
                        }
                       ProveedoresCRService.UpdateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                        $scope.dtInstance._renderer.rerender();
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.proveedores.length; i++) {
                            if ($scope.proveedores[i].proveedorId == id) {
                                $scope.proveedores[i].estado = estado;
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