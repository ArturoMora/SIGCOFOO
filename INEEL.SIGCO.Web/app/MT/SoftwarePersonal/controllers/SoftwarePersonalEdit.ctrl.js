
(function () {
    "use strict";

    angular
        .module("ineelMT")
        .controller("SoftwarePersonalEditCtrl", [
            "$scope", '$rootScope',
            "softwarePersonalService", 'DTOptionsBuilder', 'comunService', 'AuthService', 'globalGet', 'uploadFileACH', '$uibModal',
            '$http',
            SoftwarePersonalEditCtrl
        ]);

    function SoftwarePersonalEditCtrl($scope, $rootScope,
        softwarePersonalService, DTOptionsBuilder, comunService, AuthService, globalGet, uploadFileACH, $uibModal,
        $http) {
        var d = new Date();

        $scope.anioActual = d.getUTCFullYear();
        var id = $rootScope.getGlobalID();
        var empleadoId = AuthService.authentication.userprofile.clavePersona;
        var API = globalGet.get("api");      
        var endPointProyectos = API + "Proyectos/GetProyectos/";
        var ajuntoMT = {};
        var ajuntoCF = {};
        var ajuntoMU = {};
        $scope.desactivar = true;
        $scope.verificaManualUsuario = false;
        $scope.verificaManualTecnico = false;
        $scope.SoftwarePersonal = { proyecto: {} };
        $scope.publico = false;
        $scope.jefeHiperonimo = false;
        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);

        $scope.isJefe = function () {

            if ($scope.SoftwarePersonal.tipoAcceso == 1) {
                $scope.publico = true;
            }
            var empleado = "";
            if ($scope.SoftwarePersonal.proyecto != null && $scope.SoftwarePersonal.proyecto.numjefeProyecto != null) {
                var Jerarquia = {
                    EmpleadoId: $scope.SoftwarePersonal.proyecto.numjefeProyecto,
                    JefeHiperonimo: AuthService.authentication.userprofile.clavePersona
                };
                comunService.isJefeHiperonimo(Jerarquia).then(
                    function (result) {
                        $scope.jefeHiperonimo = result.data;
                        if ($scope.SoftwarePersonal.tipoAcceso != 1) {
                            $scope.publico = result.data;
                        }
                    },
                    function (error) { }
                );
            } else {
                var Jerarquia = {
                    UnidadOrganizacionalId: $scope.SoftwarePersonal.gerenciaClave,
                    JefeHiperonimo: AuthService.authentication.userprofile.clavePersona
                };
                comunService.isJefeHiperonimoByUnidadOrganizacionalId(Jerarquia).then(
                    function (result) {
                        $scope.jefeHiperonimo = result.data;
                        if ($scope.SoftwarePersonal.tipoAcceso != 1) {
                            $scope.publico = result.data;
                        }
                    },
                    function (error) { }
                );
            }


        }

        $scope.loadDetail = function () {
            softwarePersonalService.GetByIdDetails(id).then(
                function (result) {
                    $scope.SoftwarePersonal = result.data;
                    $scope.isJefe();
                    // debugger;
                    ajuntoMT = $scope.SoftwarePersonal.adjuntoManualTecnico;
                    ajuntoMU = $scope.SoftwarePersonal.adjuntoManualUsuario;

                    ajuntoCF = $scope.SoftwarePersonal.adjuntoCodigoFuente;
                    if (ajuntoMT != null) {
                        $scope.verificaManualTecnico = true;
                    }
                    if (ajuntoMU != null) {
                        $scope.verificaManualUsuario = true;
                    }
                    if ($scope.SoftwarePersonal != null && $scope.SoftwarePersonal.proyecto == null) {
                        $scope.SoftwarePersonal.proyecto = {};
                    }

                    if ($scope.SoftwarePersonal.autores == null) {
                        $scope.SoftwarePersonal.autores = [];
                    }
                    $scope.proyecto = { selected: $scope.SoftwarePersonal.proyecto };
                    if ($scope.SoftwarePersonal.estadoFlujoId < 2) {
                        $scope.desactivar = false;
                    }

                    if($scope.SoftwarePersonal.derechosAutor != null){
                        $scope.derechosAutor = $scope.SoftwarePersonal.derechosAutor;
                    }


                },
                function (err) {
                    console.error(err);
                });
        }
        $scope.loadDetail();


        $scope.listaTipoSoftware = [];

        softwarePersonalService.TipoSoftwareGetAllOrder().then(
            function (result) {
                $scope.listaTipoSoftware = result.data;
            },
            function (err) {
                $scope.listaTipoSoftware = [];
                console.error(err);
            });

        $scope.selectTipo = [];

        softwarePersonalService.getTipoAcceso().then(
            function (result) {
                $scope.selectTipo = result.data;//aqui
            },
            function (err) {
                toastr.error(err);
                console.error(err);
            });


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
                $scope.PersonaSeleccionada = selectedItem;
                toastr.clear();
                if (!selectedItem) {
                } else {
                    $scope.add_userAutor();
                  
                }
               
            });
        }

        $scope.add_userAutor = function () {
            $scope.addExt = false;
            for (var i = 0; i < $scope.SoftwarePersonal.autores.length; i++) {
                if ($scope.SoftwarePersonal.autores[i].claveAutor == $scope.PersonaSeleccionada.clavePersona) {
                    toastr.error("El autor " + $scope.PersonaSeleccionada.clavePersona + " - " + $scope.PersonaSeleccionada.nombreCompleto, " ya existe la lista de autores!");
                    return;
                }
            }
            var element = {
                "claveAutor": $scope.PersonaSeleccionada.clavePersona,
                "nombreCompleto": $scope.PersonaSeleccionada.nombreCompleto,
                "Estado": true
            }
            $scope.form.$setDirty();
            $scope.SoftwarePersonal.autores.push(element);
        }

        $scope.deleteFile = function (adjunto) {

            if (adjunto == 'adjuntoManualTecnico') {
                $scope.SoftwarePersonal.adjuntoManualTecnico = null;
                $scope.SoftwarePersonal.manualTecnico = null;
                $scope.verificaManualTecnico = false;
            }
            if (adjunto == 'adjuntoManualUsuario') {
                $scope.SoftwarePersonal.adjuntoManualUsuario = null;
                $scope.SoftwarePersonal.manualUsuario = null;
                $scope.verificaManualUsuario = false;
            }
            if (adjunto == 'adjuntoCodigoFuente') {
                $scope.SoftwarePersonal.adjuntoCodigoFuente = null;
                $scope.SoftwarePersonal.codigoFuente=null;
            }

            $scope.form.$setDirty();
        }

        ////////////////////////////////////////// adjuntos:
        $scope.getFileDetails = function (adjunto, extensiones) {
            $scope.adjunto = adjunto.id;
            //alert($scope.adjunto);

            $scope.files = [];
            $scope.files.push(adjunto.files[0]);

            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: extensiones,
                type: Date.now(),
                size: '20', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            uploadFileACH.upload(propiedades,
                function (err, result) {
                    if (!err) {
                        if (!result.error) {
                            transferComplete(result);
                        } else {
                            toastr.error(result.message);
                            borrar();
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        toastr.error(error);
                        borrar();
                    }

                });
        };

        // CONFIRMATION.        
        function transferComplete(result) {
            $scope.$apply(function () {
                //$scope.itf.archivos = result.fullPathFile;
                //$scope.fileNameNew = result.nameFile;
                if (!result.error) {
                    if ($scope.adjunto == "manualTecnico") {
                        //alert("manualTecnico2");
                        if (ajuntoMT == null || ajuntoMT == undefined) {
                            ajuntoMT = {};
                        }
                        ajuntoMT.rutaCompleta = result.fullPathFile;
                        ajuntoMT.nombre = result.nameFile;
                        $scope.SoftwarePersonal.adjuntoManualTecnico = ajuntoMT;
                        $scope.verificaManualTecnico = true;
                    }
                    if ($scope.adjunto == "manualUsuario") {
                        //alert("manualUsuario");  
                        if (ajuntoMU == null || ajuntoMU == undefined) {
                            ajuntoMU = {};
                        }
                        ajuntoMU.rutaCompleta = result.fullPathFile;
                        ajuntoMU.nombre = result.nameFile;
                        $scope.SoftwarePersonal.adjuntoManualUsuario = ajuntoMU;
                        $scope.verificaManualUsuario = true;
                    }
                    if ($scope.adjunto == "codigoFuente") {
                        //alert("codigoFuente");
                        if (ajuntoCF == null || ajuntoCF == undefined) {
                            ajuntoCF = {};
                        }
                        ajuntoCF.rutaCompleta = result.fullPathFile;
                        ajuntoCF.nombre = result.nameFile;
                        $scope.SoftwarePersonal.adjuntoCodigoFuente = ajuntoCF;

                    }

                    $scope.form.$setDirty();
                } else { // si hay error

                    borrar();
                }
            });
        }

        function borrar() {
            //alert("por borrar");
            if ($scope.adjunto == "manualTecnico") {
                $("#manualTecnico").filestyle('clear');
                $scope.verificaManualTecnico = false;
            }
            if ($scope.adjunto == "manualUsuario") {
                $("#manualUsuario").filestyle('clear');
                $scope.verificaManualUsuario = false;
            }
            if ($scope.adjunto == "codigoFuente") {
                $("#codigoFuente").filestyle('clear');

            }

          
        }


        $scope.actualizar = function () {
            try {

                var anio = parseInt($scope.SoftwarePersonal.anioVersion);
                if (anio < 1975 || anio > $scope.anioActual) {
                    toastr.error("El año de la versión debe estar combrendido ente 1975 y " + $scope.anioActual);
                    return;
                }

            } catch (e) { toastr.error("Año inválido"); return; }



            if (!$scope.verificaManualUsuario || !$scope.verificaManualTecnico) {
                toastr.error("Complete los campos requeridos");
                return false;
            }

            if ($scope.SoftwarePersonal.proyectoId == null) {
                toastr.error("Seleccione un proyecto");
                return false;
            }

            debugger;
            if($scope.derechosAutor!=null){
                $scope.SoftwarePersonal.derechosAutorId = $scope.derechosAutor.derechosAutorId;
            }

            softwarePersonalService.update($scope.SoftwarePersonal).then(
                function (result) {
                    $scope.loadDetail();
                    toastr.success(result.data);
                    $scope.form.$setPristine();
                    $scope.desactivar = false;
                },
                function (error) {
                    $scope.desactivar = true;
                    toastr.error("error al actualizar el registro");
                }
            );
        }

        $scope.delete = function (registro, $uibModalInstance) {
            var idx = ($scope.SoftwarePersonal.autores.indexOf(registro));
            $uibModalInstance.dismiss('close');
            if ($scope.SoftwarePersonal.autores.length > 1) {
                $scope.SoftwarePersonal.autores.splice(idx, 1);
                softwarePersonalService.DeleteAutor(registro.autorSoftwareId).then(
                    function (result) {
                        toastr.success(result.data);
                        $scope.form.$setDirty();
                    },
                    function (error) {
                        toastr.error(error);
                        console.log(error);
                    }
                );
            } else {
                toastr.error("No se permite dejar sin autores al registro");
            }


        };

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
                $scope.foo = selectedItem;
                $scope.SoftwarePersonal.proyecto = selectedItem;
                // $scope.SoftwarePersonal.proyecto.nombre = selectedItem.nombre;
                $scope.SoftwarePersonal.proyectoId = selectedItem.proyectoId;
                $scope.form.$setDirty();
                //$scope.ProyectoSeleccionado = selectedItem;
               
            });
            $scope.desabilitar = false;
        }

        $scope.clean = function () {
            $scope.SoftwarePersonal.proyecto = null;
            $scope.SoftwarePersonal.proyectoId = null;
            $scope.form.$setDirty();
        }

        $scope.eliminarAutor = function (registro) {
            $scope.descripcionRow = registro.nombreCompleto;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {

                        $scope.delete(registro, $uibModalInstance);
                        $scope.form.$setDirty();
                      
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.deleteAuth = function () {
            toastr.error("Dado que es el mismo que el usuario Autenticado", "No se puede eliminar el Autor");
        }

        $scope.onSelectedProyecto = function (item) {
            $scope.SoftwarePersonal.proyectoId = item.proyectoId;
            ////alert($scope.SoftwarePersonal.proyectoId);
        }

        $scope.refreshelementosSelectProyecto = function (search) {
            //////alert("refreshelementosSelect");
            if (search != undefined && search.length > 1) {
                //var params = { vocabulario: search, sensor: false };

                var getDatos = endPointProyectos + search
                return $http.get(
                    getDatos
                ).then(function (response) {
                    $scope.elementosSelectProyecto = response.data;
                    if ($scope.elementosSelectProyecto == null || $scope.elementosSelectProyecto.length == 0) {
                        $scope.elementosSelectProyecto = [];
                        $scope.sinproyecto = 0;
                        $scope.elementosSelectProyecto.push({ "proyectoId": "Sin resultados con este criterio", "nombre": "" });

                    } else {
                        $scope.sinproyecto = 1;
                    }
                },
                    function (err) {
                        toastr.error(err);
                        console.log('ERROR!!!');
                    }
                );
            } else {
                $scope.elementosSelectProyecto = [];
            }
        };


        $scope.regresar = function () {
            $scope.globalRegresar();
        }


        $scope.validar = function () {
            try {
                if ($scope.form.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    try {

                        var anio = parseInt($scope.SoftwarePersonal.anioVersion);
                        if (anio < 1975 || anio > $scope.anioActual) {
                            toastr.error("El año de la versión debe estar combrendido ente 1975 y " + $scope.anioActual);
                            return;
                        }

                    } catch (e) { toastr.error("Año invalido"); return; }

                    if ($scope.SoftwarePersonal.proyecto == null) {
                        toastr.error("Seleccione un proyecto");
                        return false;
                    }
                    if($scope.derechosAutor!=null){
                        $scope.SoftwarePersonal.derechosAutorId = $scope.derechosAutor.derechosAutorId;
                    }
                    var Registro = {
                        "softwarePersonalId": $scope.SoftwarePersonal.softwarePersonalId,
                        "estadoFlujoId": 8
                    };
                    //Cambiar el estado del registro
                    $scope.desactivar = true;
                    softwarePersonalService.update($scope.SoftwarePersonal).then(
                        function (res) {
                            softwarePersonalService.updateEstado(Registro).then(
                                function (result) {
                                   
                                    var proyecto = $scope.SoftwarePersonal.proyecto.unidadOrganizacionalId;
                                    if (proyecto == undefined) {
                                        proyecto = $scope.SoftwarePersonal.proyecto.claveUnidad;
                                    }
                                    var Solicitud = {
                                        "ClavePersona": empleadoId,
                                        "TipoInformacionId": 20,
                                        "InformacionId": $scope.SoftwarePersonal.softwarePersonalId,
                                        "FechaSolicitud": new Date(),
                                        "EstadoFlujoId": 8,
                                        "ClaveUnidadAut": proyecto
                                    }
                                    softwarePersonalService.AddSolicitud(Solicitud).then(
                                        function (result) {
                                            var Bitacora = {
                                                "SolicitudId": result.data,
                                                "FechaMovimiento": new Date('dd/MM/yyyy'),
                                                "ClavePersona": empleadoId,
                                                "Descripcion": "Se envió la solicitud",
                                                "EstadoFlujoId": 1
                                            }
                                            softwarePersonalService.AddBitacoraSolicitud(Bitacora);
                                            var Mail = {
                                                "Modulo": "Memoria Tecnológica",
                                                "Empleado": AuthService.authentication.nombreCompleto, //$scope.SoftwarePersonal.proyecto.nombreJefeProyecto,
                                                "Seccion": "Software",
                                                "TipoCorreo": "SolicitudGerente",
                                                "ClavePersona": empleadoId,
                                                "Descripcion1": 1
                                            }
                                            softwarePersonalService.mailNotificacion(Mail);
                                            toastr.success("Solicitud Enviada!");
                                            $scope.form.$setPristine();
                                            $rootScope.globalRegresar();
                                        })
                                },
                                function (err) {
                                    $scope.desactivar = false;
                                    console.error(err);
                                });
                        }, function (err) {
                            toastr.error(err);
                            console.log(err);
                        }
                    );


                }
            } catch (e) {
                console.log(e);
                throw e;
            }

        }

    }
})();