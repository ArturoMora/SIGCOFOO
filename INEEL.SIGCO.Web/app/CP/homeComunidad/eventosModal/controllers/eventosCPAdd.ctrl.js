(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("eventosCPAddCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$filter",
            "AgendaCPService",
            "$uibModalInstance",
            eventosCPAddCtrl
        ]);

    function eventosCPAddCtrl(AuthService, $scope, $state, $filter,  AgendaCPService,  $uibModalInstance) {
       
      
        // desdel el 75 a 50 años de la fecha actual
        $scope.datePicker50 = getRangoDeFechaDefault(0, 0, 50);

        $scope.agenda = {};

        $scope.agregarEvento = function () {
            if ($scope.eventoAddForm.$invalid) {
                
                return false;
            } else {
                $scope.hoy = new Date();

                if ($scope.fechaReunion < $scope.hoy) {
                    toastr.error("La fecha de reunión ingresada debe ser mayor a la fecha actual.");
                    $scope.fechaReunion = "";
                    return false;
                }

                var fecha = new Date($scope.fechaReunion);
                //var arr = $scope.horaReunion.split(':');
                //Se hizo de esta manera para la compatibilidad con la nena de Internet explorer, ya que no soporta los input de tipo time (-_-)!!!
                var hora = $scope.horaReunion.substring(0, 2);
                var minuto = $scope.horaReunion.substring(3, 5);
                //var fechaYhora = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + (fecha.getDate() + 1) + " " + arr[0] + ":" + arr[1];
                var fechaYhora = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + (fecha.getDate() + 1) + " " + hora + ":" + minuto;

                $scope.agenda.autor = $scope.autor;
                $scope.agenda.fecharegistro = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString();

                if ($scope.tipoAcceso == "1") {
                    $scope.agenda.estado = true;
                } else {
                    $scope.agenda.estado = false;
                }



                $scope.agenda.asunto = $scope.asunto;
                $scope.agenda.lugar = $scope.lugar;
                $scope.agenda.fechaReunion = $scope.fechaReunion;
                $scope.agenda.horaReunion = fechaYhora;
                $scope.agenda.idComunidad = $scope.comunidad_id;
                $scope.agenda.NotificacionEnviada =false;
                $scope.desactivar = true;
                         
              
                AgendaCPService.create($scope.agenda).then(
                    function (result) {
                      
                        toastr.success("Evento creado correctamente!");
                        $scope.cancel();
                        $scope.obtenerAgenda();
                        
                    },
                    function (err) {
                        toastr.error("Error al intentar registrar el evento");
                        console.error(err);
                        $scope.cancel();
                });

            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
