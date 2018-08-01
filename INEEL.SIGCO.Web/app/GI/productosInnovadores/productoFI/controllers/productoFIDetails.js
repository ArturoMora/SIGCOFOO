(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("solicitudFIDetalles", ['AuthService', '$scope', 'productoInnovadorService', "$stateParams", "globalGet", "$rootScope", "comiteService", "miembrosGEService", "productoHistorialFI", "$state", solicitudFIDetalles]);

    function solicitudFIDetalles(AuthService, $scope, productoInnovadorService, $stateParams, globalGet, $rootScope, comiteService, miembrosGEService, productoHistorialFI, $state) {
        window.scrollTo(0, 0)
        var id = $rootScope.getGlobalID();
        $scope.registro = {};
        $scope.comiteexist = {};
        var API = globalGet.get("api");
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        $scope.notificados = [];

        //obtener el registro a mostrar
        productoInnovadorService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                $scope.historialSolicitud();
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
            },
            function (error) {
                toastr.error(error);
            });

        comiteService.get().then(
            function (result) {
                $scope.comites = result.data;
            }, function (error) {
                toastr.error(error);
            });


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



        $scope.verificarnotificar = function (clavePersona) {
            $scope.contador = 0;
            for (var i = 0; i < $scope.miembros.length; i++) {
                if ($scope.miembros[i].clavePersona != clavePersona) {
                    $scope.miembros[i].seleccionado = false;
                }
            }
            for (var i = 0; i < $scope.miembros.length; i++) {

                if ($scope.comiteexist != null && $scope.comiteexist != undefined) {
                    if ($scope.miembros[i].clavePersona != $scope.comiteexist.clavePersona) {
                        if ($scope.miembros[i].seleccionado == true) {
                            $scope.contador++;
                        }
                    }
                } else {
                    if ($scope.miembros[i].seleccionado == true) {
                        $scope.contador++;
                    }
                }
            }
        }

        ///Notificar
        $scope.notificar = function () {
            for (var i = 0; i < $scope.miembros.length; i++) {
                if ($scope.miembros[i].seleccionado == true) {
                    $scope.notificados.push($scope.miembros[i]);
                }
            }
            var noti = {
                'listaMiembros': $scope.notificados,
                'id': id
            }
            productoInnovadorService.asignarEvaluador(noti).then(
                function (result) {
                    //bitacora!!
                    //var Bitacora = {
                    //    "SolicitudId": id2,
                    //    "FechaMovimiento": new Date('dd/MM/yyyy'),
                    //    "ClavePersona": $scope.ClavePersonaLogin,
                    //    "Descripcion": "Se notificó a los evaluadores",
                    //    "EstadoFlujoId": 14
                    //}
                    //bitacoraSolicitudService.AddBitacoraSolicitud(Bitacora);
                    toastr.success("Evaluador asignado");
                    $state.reload();
                }, function (error) {
                    toastr.error(error);
                });
        }

        $scope.registrar = function () {
            $scope.registro.estadoFlujoComite = 18;
            $scope.factorAsignado = $scope.getFactorName($scope.Factores, $scope.registro.factorInnovacionId);
            $scope.registro.Movimiento = "Registro de FIN consensuado: " + $scope.factorAsignado;
            productoInnovadorService.RegistrarFI($scope.registro).then(
                function (result) {
                    var comentario = {
                        "SolicitudId": $scope.historial.solicitudId,
                        "EvaluacionFinal": $scope.factorAsignado,
                        "ComentarioFinal": $scope.justificacion,
                        "EtapaEvaluacion": 'Final'
                    };

                    console.log(comentario);
                    productoHistorialFI.AddComentario(comentario).then(
                        function (res) {
                            toastr.success("Factor de Innovación Registrado");
                            $state.go("productoFI");
                        }, function (err) {
                            toastr.error(err.data.message);
                            console.log(err);
                        }
                    );


                }, function (error) {
                    toastr.error(error);

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
        ///factores
        productoInnovadorService.getAllFactoresInnovacion().then(
            function (result) {
                $scope.Factores = result.data;
            }, function (error) {
                toastr.error(error);
            });

    }
})();