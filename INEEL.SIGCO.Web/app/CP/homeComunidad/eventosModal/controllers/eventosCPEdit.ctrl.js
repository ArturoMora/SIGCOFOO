(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("eventosCPEditCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$filter",
            "AgendaCPService",
            "$uibModal",
            "$uibModalInstance",
            eventosCPEditCtrl
        ]);

    function eventosCPEditCtrl(AuthService, $scope, $state, $filter,   AgendaCPService, $uibModal, $uibModalInstance) {
        // desdel el 75 a 50 años de la fecha actual
        $scope.datePicker50 = getRangoDeFechaDefault(0, 0, 50);


        $scope.tiposAccesos = [
          { valor: "Público", descripcion: "Público" },
          { valor: "Restringido", descripcion: "Restringido" }
        ];

        $scope.agenda = {};
        
        $scope.modificar = function () {
            if ($scope.eventoEditarForm.$invalid) {
                return false;
            } else {
                $scope.hoy = new Date();
              
                if ($scope.datoEvento.fechaReunion < $scope.hoy) {
                    toastr.error("La fecha de reunión ingresada debe ser mayor a la fecha actual.");
                    $scope.datoEvento.fechaReunion = "";
                    return false;
                }

                $scope.agenda.autor = $scope.autor;
                $scope.agenda.fecharegistro = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString();
                var evalua = $scope.datoEvento.estado;
              

                

                if (evalua == "Restringido") {
                    $scope.agenda.estado = false;
                    $scope.seleccionado = "Restringido";
                } else {
                    $scope.agenda.estado = true;
                    $scope.seleccionado = "Público";
                }
                                    
                var fecha = new Date($scope.datoEvento.fechaReunion);
                var hora = new Date($scope.datoEvento.horaReunion);
                var fechaYhora = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + (fecha.getDate() + 1) + " " + hora.getHours() + ":" + hora.getMinutes() + ":" + hora.getMilliseconds();

                $scope.agenda.asunto = $scope.datoEvento.asunto;
                $scope.agenda.lugar = $scope.datoEvento.lugar;
                $scope.agenda.fechaReunion = $scope.datoEvento.fechaReunion;
                $scope.agenda.horaReunion = fechaYhora;
                $scope.agenda.idComunidad = $scope.comunidad.comunidadId;
                $scope.agenda.notificacionEnviada = $scope.datoEvento.notificado;
               
                $scope.agenda.agendaId = $scope.datoEvento.agendaId;

                AgendaCPService.update($scope.agenda).then(
                    function (result) {
                      
                        toastr.success("Evento actualizado correctamente!");
                        $uibModalInstance.close();
                        //$scope.obtenerAgenda();
                        
                    },
                    function (err) {
                        toastr.error("Error al editar el registro");
                        console.error(err);
                        //$scope.cancel();
                });

            }
        };

        $scope.obtenerEvento = function () {
            AgendaCPService.GetById($scope.idEventoActualizar).then(
              function (result) {
                  $scope.datoEvento = result.data;
                  $scope.datoEvento.fechaReunion = new Date($scope.datoEvento.fecha);
                  $scope.datoEvento.horaReunion = new Date($scope.datoEvento.hora);

                  if ($scope.datoEvento.estado == true) {
                      $scope.seleccionado = "Público";
                  } else {
                      $scope.seleccionado = "Restringido";
                  }

                  

              },
              function (err) {
                  toastr.error("No se han podido cargar los registros");
              });
        }

        $scope.obtenerEvento();

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };




    }
})();
