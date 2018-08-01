(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("daexternoDetallesCtrl", [
            'AuthService'
            , '$scope'
            , '$filter'
            , 'adjuntarArchivo'
            , '$rootScope'
            , 'DerechosAutorService'
            , 'CatalogosPIService'
            , 'globalGet'
            , '$state'
            , "$stateParams"
            , "$uibModal"
            , "MenuService"
            , daexternoDetallesCtrl]);

    function daexternoDetallesCtrl(AuthService, $scope, $filter, adjuntarArchivo, $rootScope,
        DerechosAutorService, CatalogosPIService, globalGet, $state, $stateParams, $uibModal, MenuService) {

        //Controlador da desde solicitudes admin CH    
        //Controlador da desde solicitudes admin CH
        //Controlador da desde solicitudes admin CH

        $scope.rolId = MenuService.getRolId();
        if ($scope.rolId != 1 && $scope.rol != 1026) { toastr.error("No Autorizado"); $state.go("home"); return false; }

        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        $scope.justificacion = messageDefaultAprobacionAdminCH_ + "";


        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de esté derecho de autor externo con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de esté derecho de autor externo con la siguiente justificación: " + $scope.justificacion + " ? ";
        //Cada vez que el usuario cambia la justificacion se actualiza el mensaje  //antes de esto el mensaje era estatico
        $scope.$watch("justificacion", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.aprobacionQ = "";
                $scope.rechazoQ = "";
                $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de esté derecho de autor externo con la siguiente justificación: " + $scope.justificacion + " ? ";
                $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de esté derecho de autor externo con la siguiente justificación: " + $scope.justificacion + " ? ";
            }
        })




        var API = globalGet.get("api");
        $scope.editAdmin = $stateParams.id2;
        var id = $stateParams.id;
        var id2 = $stateParams.id2;
        $scope.derechoautor = {};
        $scope.registro = {};
        $scope.auxColabora = [];

        $scope.contador = 0;
        $scope.urlDescarga = API + "Descarga/GetFile";

        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //obtener el registro a editar
        DerechosAutorService.getdabyid(id).then(
            function (result) {
                $scope.derechoautor = result.data;
                DerechosAutorService.persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.registro.nombrePersona = result.data.nombreCompleto;

                        $scope.registro.clavePersona = result.data.clavePersona;
                        $scope.registro.claveUnidadAut = result.data.claveUnidad;
                    });


                if ($scope.derechoautor.fechaValidacion == null) {
                    $scope.FechaValidacionAux = new Date();
                } else {
                    $scope.FechaValidacionAux = new Date($scope.derechoautor.fechaValidacion);
                }
                if ($scope.derechoautor.fechaExpedicion != null) {
                    $scope.derechoautor.fechaExpedicion = new Date($scope.derechoautor.fechaExpedicion);
                }
                if ($scope.derechoautor.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
                if ($scope.derechoautor.proyecto === null) { $scope.derechoautor.proyecto = {}; }
            },
            function (error) {
                toastr.error(error);
            });


        CatalogosPIService.getramasactivas().then(
            function (response) {
                $scope.ramas = response.data;
            },
            function (error) {
                toastr.error(error.message);
            }
        );

        $scope.openProyecto = function () {
            $scope.desabilitar = true;
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarProyecto.html',
                controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                resolve: {
                    proyectoSelect: function () {
                        $scope.verproyecto = false;
                        return $scope.proyectoSelect;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.derechoautor.proyecto.nombre = selectedItem.nombre;
                $scope.derechoautor.numeroProyecto = selectedItem.proyectoId;
                $scope.ValidForm.$setDirty();
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
        }

        $scope.openUser = function () {
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        return $scope.empleado;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                var autor = {};
                autor.nombre = selectedItem.nombreCompleto;
                autor.clavePersona = selectedItem.clavePersona;
                autor.esExterno = false;
                $scope.existe = $filter('filter')($scope.derechoautor.autores, autor.clavePersona, 'clavePersona');
                if ($scope.existe.length == 0) {
                    $scope.derechoautor.autores.push(autor);
                }
                else {
                    toastr.warning("El autor ya se encuentra en la lista.");
                }
                $scope.ValidForm.$setDirty();
            });
        }

        $scope.agregarautorexterno = function () {
            var autor = {};
            autor.nombre = $scope.autorExt.nombre;
            autor.clavePersona = 'Externo';
            autor.esExterno = true;
            autor.institucion = $scope.autorExt.institucion;
            $scope.existe = $filter('filter')($scope.derechoautor.autores, autor.nombre, 'nombre');
            if ($scope.existe.length == 0) {
                $scope.derechoautor.autores.push(autor);
                $scope.autorExt = {};
                $scope.addExt = false;
            }
            else {
                toastr.warning("El autor ya se encuentra en la lista.");
            }
        }

        $scope.eliminaautor = function (autor) {
            var index = $scope.derechoautor.autores.indexOf(autor);
            $scope.derechoautor.autores.splice(index, 1);
        }

        $scope.getFileDetails = function (adjunto) {
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'PI' };
                    $scope.derechoautor.adjunto = Adjunto;
                    $scope.ValidForm.$setDirty();
                    
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }

        $scope.deleteFile = function () {
            $scope.derechoautor.adjunto = null;
            $scope.derechoautor.adjuntoId = null;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }

        function CrearSolicitudSinoExiste(Mail, opc, registro, registroID, tipoInformacionID) {

            var Solicitud = {
                "ClavePersona": $scope.derechoautor.clavePersona,
                "TipoInformacionId": tipoInformacionID,
                "InformacionId": registroID,
                "FechaSolicitud": new Date(),
                "EstadoFlujoId": 3,
                "ClaveUnidadAut": $scope.derechoautor.claveUnidadAut
            };

            DerechosAutorService.AddSolicitud(Solicitud).then(
                function (result) {

                    id2 = result.data;

                    var Bitacora = {
                        "SolicitudId": result.data,
                        "FechaMovimiento": new Date(),
                        "ClavePersona": $scope.authentication.userprofile.clavePersona,
                        "Descripcion": "Gestión de Ficha",
                        "EstadoFlujoId": $scope.derechoautor.estadoFlujoId,
                        "idRol": 1
                    }
                    DerechosAutorService.AddBitacoraSolicitud(Bitacora).then(function (resultBitacora) {
                        return id2;
                    }, function (error) {
                        return 0;
                    });
                    if (opc == 2) {
                        debugger;
                        apruebaAdminCHfunction(Mail, id2);
                    }

                }, function (error) {
                    toastr.error("problema al registrar la bitácora");
                    console.log(error);
                    return 0;
                });
        }
        function apruebaAdminCHfunction(Mail, id2) {
            var registro = {
                "solicitudId": id2,
                "estadoFlujoId": 3
            }
            $scope.derechoautor.estadoFlujoId = 3;
            $scope.derechoautor.fechaValidacion = $scope.FechaValidacionAux;

            DerechosAutorService.updateda($scope.derechoautor).then(
                function (result) {
                    
                    toastr.success("Solicitud Aprobada!");
                    DerechosAutorService.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: " + $scope.justificacion,
                                "EstadoFlujoId": registro.estadoFlujoId,
                                "idRol": 1
                            }
                            DerechosAutorService.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada"
                            DerechosAutorService.mailNotificacionConCoautores(Mail);
                            $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                        })
                },
                function (err) {
                    $scope.desactivar = false;
                    console.error(err);
                });
        }
        //obtener el registro a editar
        $scope.save = function (opc) {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } if ($scope.derechoautor.autores.length == 0) {
                toastr.error("Ingrese al menos un autor interno.");
                return false;
            } else {

                $scope.derechoautor.listacoautores = "";
                var autoresinternos = $filter('filter')($scope.derechoautor.autores, { esExterno: false });
                for (var c = 0; c < autoresinternos.length; c++) {
                    $scope.derechoautor.listacoautores += autoresinternos[c].clavePersona + ",";
                }

                for (var i = 0; i < $scope.ramas.length; i++) {
                    if ($scope.ramas[i].ramaDAId == $scope.derechoautor.ramaDAId) {
                        $scope.ramaselect = $scope.ramas[i].descripcion;
                    }
                }
                var Mail = {
                    "Modulo": "Capital Humano",
                    "Empleado": $scope.derechoautor.nombrePersona,
                    "Seccion": "Derecho de Autor",
                    "TipoCorreo": 2,
                    "ClavePersona": $scope.derechoautor.clavePersona,
                    "Descripcion1": "<b>Titulo:</b> " + $scope.derechoautor.titulo + "<br/>",
                    "Descripcion2": "<b>Rama:</b> " + $scope.ramaselect + "<br/>",
                    "Descripcion3": "<b>Indautor:</b> " + $scope.derechoautor.certificado + "<br/>",
                    "Descripcion4": "",
                    "Descripcion5": $scope.derechoautor.relacionMedianteProyecto,
                    "Justificacion": $scope.justificacion,
                    "Estado": "",
                    "coautores": $scope.derechoautor.listacoautores
                }

                if ($scope.editAdmin == "1") {
                    if (CrearSolicitudSinoExiste(Mail, opc, $scope.registro,
                        $scope.derechoautor.daExternoId, 15) > 0) {
                    }
                }
                switch (opc) {
                    case 1:
                        $scope.derechoautor.estadoFlujoId = 1;
                        if ($scope.derechoautor.autores.length == 0) {
                            toastr.error("Ingrese al menos un autor interno.");
                            return false;
                        }

                        DerechosAutorService.updateda($scope.derechoautor).then(
                            function (result) {
                                if($scope.derechoautor.adjunto!=null){
                                    $scope.regFile = false;
                                }
                                
                                toastr.success(result.data);
                            },
                            function (err) {
                                toastr.error(err.message);
                            });
                        break;
                    case 2:
                        if ($scope.editAdmin != "1")
                            apruebaAdminCHfunction(Mail, id2);
                        break;
                    case 3:
                        var registro = {
                            "solicitudId": id2,
                            "estadoFlujoId": 1
                        }
                        $scope.derechoautor.estadoFlujoId = 1

                        DerechosAutorService.updateda($scope.derechoautor).then(
                            function (result) {
                                toastr.success("Solicitud Rechazada!");
                                DerechosAutorService.updateSolicitud(registro).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": registro.solicitudId,
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                            "Descripcion": "Rechazado: " + $scope.justificacion,
                                            "EstadoFlujoId": 2,
                                            "idRol": 1
                                        }
                                        DerechosAutorService.AddBitacoraSolicitud(Bitacora);
                                        Mail.Estado = "Rechazada"
                                        DerechosAutorService.mailNotificacionConCoautores(Mail);
                                        $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                                    })
                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);
                            });
                        break;
                }
            }
        }
    }
})();