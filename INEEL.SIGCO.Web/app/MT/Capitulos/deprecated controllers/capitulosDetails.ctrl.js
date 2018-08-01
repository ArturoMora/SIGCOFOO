(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("capitulosCtrlDetails", ['AuthService', '$scope', 'CapituloService', "$stateParams", "globalGet", "IndicadoresMTService", capitulosCtrlDetails]);

    function capitulosCtrlDetails(AuthService, $scope, CapituloService, $stateParams, globalGet, IndicadoresMTService) {
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR  ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR ESTA EN CH */
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        var id = $stateParams.id;
        alert('get MT');
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //obtener el registro a mostrar

     
        CapituloService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                if ($scope.registro.adjunto == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
                CapituloService.getPais($scope.registro.pais).then(
                function (result) {
                    $scope.pais=result.data;
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