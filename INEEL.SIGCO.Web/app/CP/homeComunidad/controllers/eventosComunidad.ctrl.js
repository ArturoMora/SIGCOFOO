(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("EventosComunidadCtrl", [
            "AuthService",
            "authInterceptorService",
            "$scope",            
            "$state",
            "$filter",
            "$stateParams",
            "$uibModal",
            "globalGet",         
            "AgendaCPService",
            "MiembrosCPService",
            EventosComunidadCtrl
        ]);

    function EventosComunidadCtrl(AuthService, authInterceptorService, $scope, $state, $filter, $stateParams, $uibModal, globalGet, AgendaCPService, MiembrosCPService) {
        $scope.authentication = AuthService.authentication;
        $scope.comunidad_id = $stateParams.id;


      
        $scope.autor= AuthService.authentication.nombreCompleto;
        $scope.idEventoActualizar = 0;

        $scope.agregarEvento = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/homeComunidad/eventosModal/eventosAdd.html',
                controller: 'eventosCPAddCtrl',
                scope: $scope
            });

        }


        $scope.modificarEvento = function (id) {
            $scope.idEventoActualizar = id;

            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/homeComunidad/eventosModal/eventosEdit.html',
                controller: 'eventosCPEditCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (item){
                $scope.obtenerAgenda();
            })

        }

        $scope.obtenerAgenda = function () {
            AgendaCPService.getByComunidad($scope.comunidad_id).then(
              function (result) {
                  $scope.eventos = result.data;
                  if($scope.rol.invitado){
                    $scope.eventos= $filter('filter')($scope.eventos,{estado: true} );
                  }
              },
              function (err) {
                  toastr.error("No se han podido cargar los registros");
              });
        }
      

        $scope.notificacionEventoMiembros = function (id, obj) {

            var fechaReunion = new Date(obj.fechaReunion);

            var fecha = new Date(obj.fechaReunion);
            var hora = new Date(obj.horaReunion);
            var fechaYhora = "El día " +  fecha.getFullYear() + "/" + (fecha.getMonth() + 1) + "/" + (fecha.getDate() + 1) + " a las  " + hora.getHours() + ":" + hora.getMinutes() + ":" + hora.getMilliseconds();



            var Mail = {
                "Modulo": "Comunidades de Práctica",
                "Empleado": "Lider de la comunidad",
                "Descripcion1": obj.asunto,
                "Descripcion2": obj.lugar,
                "Descripcion3": fechaYhora,
                "Descripcion4": $scope.comunidad.descripcion,
                "Seccion": "Notificación de eventos",
                "TipoCorreo": "NotificacionEventosCP",
                "id": $scope.comunidad_id,
                "agenda": obj
            };

            // $timeout(function () {
            //     blockUI.message('Espere...');
            // }, 1000);

            MiembrosCPService.enviaNotificaciones(Mail).then(
              function (result) {
                  if (result.data == "enviado") {
                      toastr.success("Se ha notificado a los miembros de la comunidad sobre el evento");
                      $scope.obtenerAgenda();
                  } else {
                      toastr.error("Falla en el envío de notificaciones a los miembros de la comunidad");
                  }

              },
              function (err) {
                  toastr.error("Falla en el envío de notificaciones a los miembros de la comunidad");
              });

        }


        $scope.obtenerAgenda();


        //La funcion removeAccents esta de manera global en el archivo globalINEEL.js, por lo que no necesita de ser escrita de nuevo

        var searchType = jQuery.fn.DataTable.ext.type.search;

        searchType.string = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data) :
                    data;
        };

        searchType.html = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data.replace(/<.*?>/g, '')) :
                    data;
        };

    }

})();