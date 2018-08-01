(function () {
    "use strict";

    var app = angular.module("ineel.controllers");

    app.controller("tipoPago", ["AuthService", "$scope", "TipoPagoService", "$uibModal", "DTOptionsBuilder", "DTColumnBuilder", "DTColumnDefBuilder", tipoPago]);
    function tipoPago(AuthService, $scope, TipoPagoService, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        $scope.dtInstance = {};
        //Variables de carga
        $scope.loading = true;
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //obtener registros
        TipoPagoService.getAll().then(
            function (result) {
                $scope.registros = result.data;

                $scope.dtOptions = DTOptionsBuilder
                 .newOptions()
                 .withOption('responsive', true);
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de Tipo de Pagos");
            });

        $scope.cambiar = function (registro) {
            TipoPagoService.update(registro);
        }

        $scope.regresar = function (registro) {
            if (registro.estado == true) {
                registro.estado = false;
            } else {
                registro.estado = true;
            }
        }
    }
})();