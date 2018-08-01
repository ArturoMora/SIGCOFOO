(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("EventoAddCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$filter",
            "$stateParams",
            "globalGet",
            "OportunidadNegocioCRService",
            "comunService",
            EventoAddCtrl
        ]);
                      
    function EventoAddCtrl(AuthService, $scope, $state, $filter, $stateParams, globalGet, OportunidadNegocioCRService,comunService) {

        $scope.authentication = AuthService.authentication;
      
        $scope.fechaActual = new Date();

        $scope.noEmpleado     = AuthService.authentication.userprofile.clavePersona;
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;

        OportunidadNegocioCRService.getTiposEventosDisponibles().then(
            function (result) {
                $scope.tiposEventos = result.data;
            },
            function (err) {
                toastr.error(err);
        });

        $scope.ok = function () {
            if ($scope.eventoAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.evento.nombreEvento.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "Eventos"
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                       
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {

                            var eventoDatos = {
                                "nombreEvento": $scope.evento.nombreEvento,
                                "estado": 1,
                                "ciudad": $scope.evento.ciudad,
                                "fechaEvento": $scope.evento.fechaEvento,
                                "claveEmpleado":$scope.noEmpleado,
                                "registroEmpleado": $scope.nombreEmpleado,
                                "tipoEventoONId": $scope.evento.tipoEventoONId
                            };
                           
                            debugger;
                            OportunidadNegocioCRService.createEvento(eventoDatos).then(
                                function (result) {
                                    toastr.success("Registro creado correctamente");
                                    $state.go("eventosGet");
                                },
                                function (err) {
                                    toastr.error("Error al registrar un nuevo registro");
                                });
                        }
                    });
                
            }
        };

       
    }
})();
