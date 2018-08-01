(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("productoRegistro", ['AuthService', '$scope', 'productoInnovadorService', "$stateParams", "globalGet", "$rootScope", "$state","productoHistorialFI","miembrosGEService", productoRegistro]);

    function productoRegistro(AuthService, $scope, productoInnovadorService, $stateParams, globalGet, $rootScope, $state, productoHistorialFI,miembrosGEService) {
        window.scrollTo(0, 0)
        $scope.idVoBO = $rootScope.getGlobalID();
        var id = $rootScope.getGlobalID();
        $scope.registro = {};
        var API = globalGet.get("api");
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        
        //obtener el registro a mostrar

        $scope.historialSolicitud = function () {
            productoHistorialFI.GetHistorialByProducto(id).then(
                function (res) {
                    $scope.historial = res.data;
                }, function (err) {
                    toastr.error("Error al cargar el historial de evaluación de la solicitud");
                    console.log(err);
                }
            );
        }
        
        productoInnovadorService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                $scope.historialSolicitud(id);
            },
            function (error) {
                toastr.error(error);
            });

        productoInnovadorService.productoGISolicitud(id).then(
            function (result) {
                $scope.rg = result.data;
            },
            function (error) {
                toastr.error(error);
            });

        ///factores
        productoInnovadorService.getAllFactoresInnovacion().then(
            function (result) {
                $scope.Factores = result.data;
            }, function (error) {
                toastr.error(error);
            });

        $scope.actualizar = function () {
            $scope.registro.estadoFlujoComite = 17;
            //revisado por el evaluador
            productoInnovadorService.UpdateFI($scope.registro).then(
           function (result) {
               toastr.success("Registro actualizado");
               $rootScope.globalRegresar();
           },
           function (error) {
               toastr.error(error);
           });
        }

        productoInnovadorService.grupoevaluadorexist(id).then(
                function (result) {
                    $scope.comiteexist = result.data;
                    miembrosGEService.get(1).then(
                function (result) {
                    $scope.miembros = result.data;

                    for (var i = 0; i < $scope.miembros.length; i++) {
                        if ($scope.miembros[i].clavePersona == $scope.comiteexist.clavePersona) {
                            $scope.miembros[i].seleccionado = true;
                            $scope.valido = $scope.miembros[i];
                        }
                    }

                }, function (error) {
                    toastr.error(error);
                });
                }, function (error) {
                    toastr.error(error);
                });



        $scope.voBO = function (respuesta) {

            $scope.registro.voBoDuenio = respuesta;

            if (respuesta == false) {
                $scope.registro.estadoFlujoComite = null;
            }

            productoInnovadorService.updateVobo($scope.registro).then(
               function (result) {
                   toastr.success("Registro actualizado");
                   $state.go("productoInnovador");
               },
               function (error) {
                   toastr.error(error);
               });
        }
    }
})();