(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("configuracionPeriodoEdit", ['AuthService', '$scope', '$rootScope',
            'configuracionPeriodoService', '$uibModal', '$state','correoNotificacionService', configuracionPeriodoEdit]);

    function configuracionPeriodoEdit(AuthService, $scope, $rootScope,
        configuracionPeriodoService, $uibModal, $state, correoNotificacionService) {
        window.scrollTo(0, 0);
        $scope.registro = {};

        var id = $rootScope.getGlobalID();
        $scope.authentication = AuthService.authentication;
        configuracionPeriodoService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
                $scope.registro.fechaInicioReal = new Date($scope.registro.fechaInicioReal);
                $scope.registro.fechaTerminoReal = new Date($scope.registro.fechaTerminoReal);
                configuracionPeriodoService.GetByIdPeriodoFI(id).then(
                    function (result) {
                        $scope.registroSeleccion = result.data;
                        $scope.registroSeleccion.fechaInicioReal = new Date($scope.registroSeleccion.fechaInicioReal);
                        $scope.registroSeleccion.fechaTerminoReal = new Date($scope.registroSeleccion.fechaTerminoReal);
                        //$scope.comparacion = new Date($scope.registroSeleccion.fechaTerminoReal);
                    });
                configuracionPeriodoService.GetReplicaByIdPeriodoFI(id).then(
                    function (result) {
                        $scope.registroRepechaje = result.data;
                        $scope.registroRepechaje.fechaInicioReal = new Date($scope.registroRepechaje.fechaInicioReal);
                        $scope.registroRepechaje.fechaTerminoReal = new Date($scope.registroRepechaje.fechaTerminoReal);
                        //$scope.comparacion = new Date($scope.registroSeleccion.fechaTerminoReal);
                    });
            },
            function (error) {
                toastr.error(error);
            });

        $scope.actualizar = function () {
            debugger;
            if ($scope.registro.fechaTerminoReal <= $scope.registro.fechaInicioReal) {
                toastr.error("La fecha de término debe ser mayor a la de inicio");
                return false;
            }
            var anio = $scope.registro.fechaInicioReal.getFullYear();
            var fecha = "31/12/" + anio;
            if ($scope.registro.fechaTerminoReal.getFullYear() > anio) {
                toastr.error("La fecha de término debe estar comprendida hasta " + fecha);
                return false;
            }

            if ($scope.registroSeleccion.fechaTerminoReal <= $scope.registroSeleccion.fechaInicioReal) {
                toastr.error("La fecha de término de selección debe ser mayor a la de inicio de selección");
                return false;
            }
            configuracionPeriodoService.Update($scope.registro).then(
                   function (result) {
                       toastr.success(result.data);
                       //$state.go("configuracionPeriodo");
                       //debugger;
                       //var a = $scope.comparacion.toString();
                       //var b = $scope.registroSeleccion.fechaTerminoReal.toString();
                       //if (a != b) {
                           configuracionPeriodoService.UpdatePeriodoSeleccion($scope.registroSeleccion).then(
                                function (result) {
                                    console.log(result);
                                },
                                function (err) {
                                    console.log(err);
                                    toastr.error("Error al actualizar el período de selección");
                                });
                           configuracionPeriodoService.UpdatePeriodoReplica($scope.registroRepechaje).then(
                                function (result) {
                                    console.log(result);
                                },
                                function (err) {
                                    console.log(err);
                                    toastr.error("Error al actualizar el período de selección");
                                });
                       
                   },
                   function (error) {
                       toastr.error(error.data.message);
                       $scope.desabilitar = false;
                   });
        }
    }
})();