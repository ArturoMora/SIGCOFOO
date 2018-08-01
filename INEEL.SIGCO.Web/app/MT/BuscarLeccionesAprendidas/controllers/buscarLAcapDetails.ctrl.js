(function () {
    "use strict";

    angular
    .module("ineelMT")
    .controller("BuscarLAcapDetailsCtrl", [
        "AuthService",
        "$scope", 
        "$state", 
        "$stateParams", 
        "buscarLAService","$rootScope","IndicadoresMTService",
        BuscarLAcapDetailsCtrl
    ]);




    function BuscarLAcapDetailsCtrl(AuthService, $scope, $state, $stateParams, buscarLAService, $rootScope, IndicadoresMTService) {
        $scope.registro_id = $stateParams.id;
        $scope.registro= [];
        $scope.palabra = $stateParams.id2;
        $scope.aux = $scope.registro_id;
        $scope.permitirVerCte = false;
        $scope.authentication = AuthService.authentication;
        var roles = AuthService.authentication.userprofile.roles;


        if ($rootScope.parametrosLAA1MT == 'undefined' || $rootScope.parametrosLAA1MT == null || $rootScope.parametrosLAA1MT == undefined || $rootScope.parametrosLAA1MT == "undefined") {

        } else {
            $rootScope.parametrosLAA1MT = $rootScope.parametrosLAA1MT;

        }


        buscarLAService.GetLA($scope.registro_id).then(
            function (result) {
                //$scope.newString = result.data.lAcap.instalaciones.replace($stateParams.id2, $stateParams.id2.bold());
                //result.data.lAcap.instalaciones = $scope.newString;
                //document.getElementById("demo").innerHTML = result.data;
                $scope.registro = result.data;
                //2-AdminMt, 4-Gte, 5-DirDiv, 6-DirGer,14-AdminSIGCO, 16-DirEj
                        //Si es jefe de proyecto
                         if ($scope.registro.proyecto.numjefeProyecto == $scope.authentication.userprofile.clavePersona) {
                                $scope.permitirVerCte = true;
                         }
                        //Si es jefe
                        if ($scope.permitirVerCte == false) {
                            var persona = $scope.authentication.userprofile.clavePersona;
                            var proyecto = $scope.registro.informeTecnicoFinalId;
                            $scope.BuscarJefe({JefeHiperonimo:persona, ProyectoId:proyecto});
                        }
                    },
            function (err) {
                console.error(err);
            });

        $scope.BuscarJefe = function (Registro) {
            buscarLAService.GetJefe(Registro).then(
                            function (result) {
                                if (result.data==true) {
                                    $scope.permitirVerCte = true;
                                }
                            },
                            function (err) {
                                console.error(err);
                            });
        }




        $scope.registraAcceso = function () {

          

            var datos = {
                "claveEmpleado": AuthService.authentication.userprofile.clavePersona,
                "fecha": new Date(),
                "modulo": "MT",
                "ocID": "LAAPRE"
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