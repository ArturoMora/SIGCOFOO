(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("EventoDetailsCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$stateParams",
            "$uibModalInstance",
            "globalGet",
            "OportunidadNegocioCRService",
            EventoDetailsCtrl
        ]);

    function EventoDetailsCtrl(AuthService, $scope, $state, $stateParams,$uibModalInstance, globalGet, OportunidadNegocioCRService) {

        $scope.evento = {};
        $scope.authentication = AuthService.authentication;

        $scope.fechaActual = new Date();

        var id = $stateParams.id;
        if (id == undefined || id == null || id == "") {
            id = $scope.eventoId; //ctrl reutilizado para modal
        }
        $scope.noEmpleado = AuthService.authentication.userprofile.clavePersona;
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        

        OportunidadNegocioCRService.getEvento(id).then(
              function (result) {
                  $scope.evento = result.data;
                  $scope.evento.fechaEvento = new Date($scope.evento.fechaEvento);
                  $scope.excepcion = result.data.nombreEvento.replace(/ /g, "").replace(/\n/g, "");
              },
              function (err) {
                  toastr.error(err);
              });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
    }
})();
