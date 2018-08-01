(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("EventoEditCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$stateParams",
            "globalGet",
            "OportunidadNegocioCRService",
            "comunService",
            EventoEditCtrl
        ]);
                    
    function EventoEditCtrl(AuthService, $scope, $state, $stateParams, globalGet, OportunidadNegocioCRService,comunService) {

        $scope.authentication = AuthService.authentication;

        $scope.fechaActual = new Date();

        var id = $stateParams.id;

        $scope.noEmpleado = AuthService.authentication.userprofile.clavePersona;
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;

      
        OportunidadNegocioCRService.getTiposEventosDisponibles().then(
            function (result) {
                $scope.tiposEventos = result.data;
            },
            function (err) {
                toastr.error(err);
        });

       
        
        OportunidadNegocioCRService.getEvento(id).then(
              function (result) {
                  $scope.evento = result.data;
                  $scope.evento.fechaEvento = new Date($scope.evento.fechaEvento);
                  $scope.excepcion = result.data.nombreEvento.replace(/ /g, "").replace(/\n/g, "");
              },
              function (err) {
                  toastr.error(err);
         });

      
        $scope.ok = function () {
            if ($scope.formEditEventos.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var registro = {
                    "dato": $scope.evento.nombreEvento.replace(/ /g, "").replace(/\n/g, ""),
                    "origen": "Eventos",
                    "excepcion": $scope.excepcion
                };
                comunService.ValidacionExistCR(registro)
                    .then(function (result) {
                        $scope.existente = result.data;
                        if ($scope.existente) {
                            toastr.warning("El registro ya existe");
                            return false;
                        } else {
                           

                            var eventoDatos = {
                                "eventoId" : id,
                                "nombreEvento": $scope.evento.nombreEvento,
                                "estado": $scope.evento.estado,
                                "ciudad": $scope.evento.ciudad,
                                "fechaEvento": new Date($scope.evento.fechaEvento),
                                "claveEmpleado": $scope.noEmpleado,
                                "registroEmpleado": $scope.nombreEmpleado,
                                "tipoEventoONId": $scope.evento.tipoEventoONId
                            };

                           
                            OportunidadNegocioCRService.updateEvento(eventoDatos).then(
                                function (result) {
                                    toastr.success("Registro actualizado correctamente");
                                    $state.go("eventosGet");
                                },
                                function (err) {
                                    toastr.error("Error al actualizar el registro ");
                                });
                        }
                    });
                
            }
        };
       
      
    }
})();
