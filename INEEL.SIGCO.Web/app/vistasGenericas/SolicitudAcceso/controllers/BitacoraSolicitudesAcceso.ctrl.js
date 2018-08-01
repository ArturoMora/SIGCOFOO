(function () {
    "use strict";
     angular
        .module("ineel.controllers")
        .controller("BitacoraSolicitudesAccesoCtrl", ["AuthService", "$scope", "comunService", "$uibModal", "DTOptionsBuilder",
            "$location", "$stateParams", BitacoraSolicitudesAccesoF]);
     function BitacoraSolicitudesAccesoF(AuthService, $scope, comunService, $uibModal, DTOptionsBuilder,
         $location, $stateParams) {
         debugger;
             var id = $stateParams.id;
             //var id2 = $stateParams.id2;

             
         //Obtener datos de usuario
             $scope.authentication = AuthService.authentication;
         
         //obtener el registro a mostrar
             comunService.BitacoraSolicitudesAcceso(id).then(
                 function (result) {
                     $scope.registros = result.data;
                     try{
                         $scope.registros.fechaMovimiento = new Date($scope.registros.fechaMovimiento);
                     }catch(err){}
                 },
                 function (error) {
                     toastr.error(error);
                 });
         }
})();