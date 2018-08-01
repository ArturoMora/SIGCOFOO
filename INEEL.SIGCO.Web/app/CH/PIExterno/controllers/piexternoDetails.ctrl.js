(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("piexternoCtrlDetails", ['AuthService', '$scope', 'PIExternoService', "$stateParams","globalGet","$rootScope","$state", piexternoCtrlDetails]);

    function piexternoCtrlDetails(AuthService, $scope, PIExternoService, $stateParams, globalGet, $rootScope, $state) {
        var id = $stateParams.id;
        window.scrollTo(0, 0);
        $scope.id2 = $stateParams.id2;
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;

        $scope.url = $rootScope.fromState;
        $scope.volver = function () {
            if ($scope.url.name.indexOf('fichapersonal') >= 0) {
                $state.go("fichapersonal.piexterno", { seccion: 'piexterno' });
            } else {
                $rootScope.globalRegresar();
            }
        }



        $scope.autoresExternos = {};

        PIExternoService.getbyidPropiedadIndustrial(id).then(
            function (result) {


               // PIExternoService.Persona(result.data.clavePersona).then(
               // function (result) {
               //     $scope.registro.nombrePersona = result.data.nombreCompleto;
               // });
               // PIExternoService.getByPIExterno(result.data.piExternoId).then(
               // function (result) {
               //     $scope.autoriie = result.data;
               // });
               // PIExternoService.getByPIExternoExt(result.data.piExternoId).then(
               //function (result) {
               //    $scope.autorexterno = result.data;
               //});


                $scope.registro = result.data;
               
                // PIExternoService.Persona(result.data.clavePersona).then(
                // function (result) {
                //     $scope.registro.nombrePersona = result.data.nombreCompleto;

                    
                // });
                // PIExternoService.getByPIExterno(result.data.piExternoId).then(
                // function (result) {
                //     $scope.autoriie = result.data;
                // });
                // PIExternoService.getByPIExternoExt(result.data.piExternoId).then(
                //function (result) {
                //    $scope.autorexterno = result.data;
                //});


                $scope.autoresExternos = $filter('filter')(result.data.inventores, { clavePersona: 'Externo' });

                $scope.registro = result.data;
                if ($scope.registro.adjunto == null) {
                    $scope.regFile = true;
                   $scope.archivos = 1;
                }



            },
            function (error) {
                toastr.error(error);

            });

        ////Extraer informacion del usuario//
        ////obtener el registro a mostrar
        //PIExternoService.getbyid(id).then(
        //    function (result) {
        //        PIExternoService.Persona(result.data.clavePersona).then(
        //        function (result) {
        //            $scope.registro.nombrePersona = result.data.nombreCompleto;
        //        });
        //        PIExternoService.getByPIExterno(result.data.piExternoId).then(
        //        function (result) {
        //            $scope.autoriie = result.data;
        //        });
        //        PIExternoService.getByPIExternoExt(result.data.piExternoId).then(
        //       function (result) {
        //           $scope.autorexterno = result.data;
        //       });
        //        $scope.registro = result.data;
        //        if ($scope.registro.adjunto == null) {
        //            $scope.regFile = true;
        //        } else {
        //            $scope.regFile = false;
        //            $scope.archivos = 1;
        //        }
        //    },
        //    function (error) {
        //        toastr.error(error);
        //    });






    }
})();