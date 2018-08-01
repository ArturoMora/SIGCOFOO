(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("productoInnovadorDetailsEvaluador", ['AuthService', '$scope', 'productoInnovadorService', "$stateParams", "globalGet", "productoHistorialFI", "$rootScope", "$state", productoInnovadorDetailsEvaluador]);

    function productoInnovadorDetailsEvaluador(AuthService, $scope, productoInnovadorService, $stateParams, globalGet, productoHistorialFI, $rootScope, $state) {
        window.scrollTo(0, 0)
        var id = $rootScope.getGlobalID();
        $scope.registro = {};
        var API = globalGet.get("api");
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//

        //obtener el registro a mostrar
        productoInnovadorService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (error) {
                toastr.error(error);
            });

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

        productoInnovadorService.productoGISolicitud(id).then(
            function (result) {
                $scope.rg = result.data;
                $scope.historialSolicitud();
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
            $scope.factorAsignado=$scope.getFactorName($scope.Factores, $scope.registro.factorInnovacionId);
            $scope.registro.Movimiento = "Registro de FI preliminar por el Evaluador: " + $scope.factorAsignado;
            productoInnovadorService.UpdateFI($scope.registro).then(
                function (result) {

                    var comentario={
                        "SolicitudId" : $scope.historial.solicitudId,
                        "EvaluacionPreliminar" : $scope.factorAsignado,
                        "ComentarioPreliminar" : $scope.justificacion,
                        "EtapaEvaluacion" : 'Preliminares'
                    };

                    productoHistorialFI.AddComentario(comentario).then(
                        function(res){
                            toastr.success("Registro actualizado");
                            $state.go("productoFI");
                            $scope.form.$setPristine();
                        },function(err){
                            console.log(err);
                        }
                    );
                    
                },
                function (error) {
                    toastr.error(error);
                    console.log(error);
                });
        }
        $scope.getFactorName = function (list, id) {

            if (list != null) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].id === id) {
                        return list[i].descripcion;
                    }
                }
            }
            return "";
        }
    }
})();