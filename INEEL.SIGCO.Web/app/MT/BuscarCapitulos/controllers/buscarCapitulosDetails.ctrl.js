(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("buscarCapitulosDetailsCtrl", ['AuthService', '$scope', 'buscarCapitulosService', "$stateParams", "globalGet", "$rootScope", "IndicadoresMTService", buscarCapitulosDetailsCtrl]);

    function buscarCapitulosDetailsCtrl(AuthService, $scope, buscarCapitulosService, $stateParams, globalGet, $rootScope, IndicadoresMTService) {
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        var id = $stateParams.id;

        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar

        
        if ($rootScope.parametrosCapitulos == 'undefined' || $rootScope.parametrosCapitulos == null || $rootScope.parametrosCapitulos == undefined || $rootScope.parametrosCapitulos == "undefined") {

        } else {
            $rootScope.parametrosCapitulos.busqueda = $rootScope.parametrosCapitulos.busqueda;
        }

         buscarCapitulosService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                buscarCapitulosService.getPais($scope.registro.pais).then(
                function (result) {
                    $scope.pais = result.data;
                },
                function (error) {
                    toastr.error("Error al traer el país");
                });
            },
            function (error) {
                toastr.error(error);
            });



         $scope.registraAcceso = function () {

            

             var datos = {
                 "claveEmpleado": AuthService.authentication.userprofile.clavePersona,
                 "fecha": new Date(),
                 "modulo": "MT",
                 "ocID": "CAPITULOS"
             }

             IndicadoresMTService.AddAccesoModulosOC(datos).then(
                 function (result) {
                     //$scope.soliResult = result.data;
                 },
                 function (error) {
                     toastr.error(error);
                 });
         }

         $scope.registraAcceso();
    }
})();