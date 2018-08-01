(function () {
    "use strict";

    var app = angular.module("ineelMT");

    app.controller("SolicitudInsumoGetCtrl", ["AuthService", "$scope", "SolicitudInsumoService", "$uibModal", "DTOptionsBuilder", "$state", SolicitudInsumoGetCtrl]);
    function SolicitudInsumoGetCtrl(AuthService, $scope, SolicitudInsumoService, $uibModal, DTOptionsBuilder, $state) {
        //Variables de carga
        $scope.Aux="prueba"
        $scope.loading = true;
        $scope.registros = [];
        
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //obtener registros
        //SolicitudInsumoService.getAll().then(
        SolicitudInsumoService.getById($scope.authentication.userprofile.clavePersona).then(
            function (result) {
                $scope.registros = result.data;
                for (var contadorReg = 0; contadorReg < $scope.registros.length; contadorReg++) {
                    SolicitudInsumoService.getByClave($scope.registros[contadorReg].clavePersonaSolicitante).then(
                    function (result) {
                        $scope.registros[contadorReg-1].nombrePersonaSolicitante = result.data.nombreCompleto;
                    },
                    function(err){
                        toastr.error("No se han podido cargar el nombre del solicitan");
                    });
                }
                $scope.loading = false;
                $scope.dtOptions = DTOptionsBuilder
                 .newOptions()
                 .withOption('responsive', true);
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de SolicitudInsumo");
            }
            );

        $scope.buscar = function (Registro) {
            debugger;
            switch (Registro.tipoInformacionId) {

                case 1:
                    $state.go('BuscarInsumosDetails', { id: Registro.insumosId, id2: "AutorizarDenegar0816"});
                //case 2:
                //    $state.go('SNIDetailsAdmin', { id: Registro.informacionId, id2: Registro.solicitudId });
                //    break;
            }
        }
    }
})();