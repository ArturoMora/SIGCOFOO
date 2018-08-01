(function () {
    "use strict";

    var app = angular.module("ineelGI");

    app.controller("configuracionPeriodo", ["AuthService", "$scope", "configuracionPeriodoService", "$uibModal", "DTOptionsBuilder",'$state', configuracionPeriodo]);
    function configuracionPeriodo(AuthService, $scope, configuracionPeriodoService, $uibModal, DTOptionsBuilder, $state) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        $scope.dtInstance = {};
        //Variables de carga
        $scope.loading = true;
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //obtener registros
        configuracionPeriodoService.getAll().then(
            function (result) {
                $scope.registros = result.data;
                $scope.loading = false;

                $scope.dtOptions = DTOptionsBuilder
                 .newOptions()
                 .withOption('responsive', true);
                configuracionPeriodoService.getExistActivo().then(
                    function (result) {
                        $scope.activo = result.data;
                    });

            },
            function (err) {
                toastr.error("No se han podido cargar los registros de configuracion de periodo");
            }
            );


        //Guardar estado
        $scope.saveEstado = function (id, estado, descripcion) {
            debugger;
            $scope.descripcionRow = descripcion;
            var pagina;
            //var _estado;
            var registro;
            if (estado == true) {
                pagina = "Active";
                //_estado = 1;
            } else {
                pagina = "Delete";
                //_estado = 0;
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + pagina + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        registro = {
                            "periodoFIId": id,
                            "estado": estado
                        }

                        configuracionPeriodoService.UpdateEstado(registro).then(
                            function (result) {
                                configuracionPeriodoService.getExistActivo().then(
                             function (result) {
                                 $scope.activo = result.data;
                             });
                            });
                        for (var i = 0; i < $scope.registros.length; i++) {
                            if ($scope.registros[i].estado == true) {
                                $scope.registros[i].estado = false;
                            }
                        }
                        for (var i = 0; i < $scope.registros.length; i++) {
                            if ($scope.registros[i].periodoFIId == id) {
                                $scope.registros[i].estado = estado;
                            }
                        }

                        
                        $uibModalInstance.dismiss('cancel');
                        $scope.dtInstance._renderer.rerender();
                        
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.registros.length; i++) {
                            if ($scope.registros[i].periodoFIId == id) {
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