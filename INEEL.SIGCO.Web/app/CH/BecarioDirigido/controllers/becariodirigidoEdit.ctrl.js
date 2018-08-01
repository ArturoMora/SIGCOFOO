(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("becariodirigidoCtrlEdit", ['AuthService', '$scope', '$rootScope', 'BecarioDirigidoService', 'globalGet', '$state', '$filter', "$stateParams", "FileUploader", "uploadFileACH", "$uibModal", becariodirigidoCtrlEdit]);

    function becariodirigidoCtrlEdit(AuthService, $scope, $rootScope, BecarioDirigidoService, globalGet, $state, $filter, $stateParams, FileUploader, uploadFileACH, $uibModal) {
        var API = globalGet.get("api");
        window.scrollTo(0, 0);
        $scope.editarGestion = 0;
        $scope.idGF = $rootScope.GestionFichasClave;
        if ($scope.idGF != null) {
            $scope.editarGestion = 1;
        }
        //var id = $rootScope.idG;
        var id = $rootScope.getGlobalID();
        $scope.registro = {};
        $scope.areaasignada = {};
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //$scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        //obtener gradoAcademicos
        BecarioDirigidoService.getTipoBecas().then(
            function (result) {
                $scope.becas = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo becas.");
            }
        );
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        //obtener el registro a editar
        BecarioDirigidoService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                BecarioDirigidoService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.registro.nombreEmpleado = result.data.nombreCompleto;
                        $scope.registro.nombrePersona = $scope.registro.nombreEmpleado;
                    });

                $scope.registro.fechaInicio = new Date($scope.registro.fechaInicio);
                $scope.registro.fechaTermino = new Date($scope.registro.fechaTermino);
                //$scope.registro.nombreUnidad = $scope.registro.unidadOrganizacional.nombreUnidad;
                $scope.areaasignada.claveUnidad = $scope.registro.claveUnidad;
                if ($scope.registro.unidadOrganizacional != null) {
                    $scope.areaasignada.nombreUnidad = $scope.registro.unidadOrganizacional.nombreUnidad;
                    //$scope.areaasignada.fechaEfectiva = $scope.registro.unidadOrganizacional.fechaEfectiva;
                }
                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                }
                if ($scope.registro.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
            },
            function (error) {
                toastr.error(error);
            });
        /////////////////////////Buscar Proyecto
        //Buscar Proyecto
        //$scope.ProyectoSeleccionado = {};
        $scope.verproyecto = false;
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
                $scope.registro.proyectoNombre = selectedItem.nombre;
                $scope.registro.proyectoId = selectedItem.proyectoId;
                $scope.ValidForm.$setDirty();
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
        }


        $scope.regresar = function () {
            $state.go("fichapersonal.becariodirigido", { seccion: 'becariodirigido' });
        }
        ////////////////////////////////////Buscar EO
        $scope.ElementoSeleccionado = {};
        $scope.openArea = function () {
            $scope.selectItem = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/EstructuraOrganizacional.html',
                controller: 'EstructuraOrganizacionalFilterGetCtrl',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                //$scope.ElementoSeleccionado = selectedItem;
            });
        }
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            $scope.files = null;
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            $scope.archivos = adjunto.files.length;

            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "pdf;doc;docx", /* pdf;doc;docx;ppt */
                type: '*', /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            uploadFileACH.upload(propiedades,
                function (err, result) {

                    if (!err) {

                        if (!result.error) {
                            transferComplete(result);
                        } else {
                            toastr.error(result.message);
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        $("#filesGral").filestyle('clear');
                        toastr.error(error);
                    }

                });
        };

        function transferComplete(result) {

            $scope.$apply(function () {
                if (result.error === false) {
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.registro.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.ValidForm.$setDirty();
                }
            });
        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        $scope.add = function () {
            if ($scope.registro.estadoFlujoId == 3) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/vistasGenericas/modificarValidados.html', controller: function ($uibModalInstance) {
                        $scope.ok = function () {
                            $scope.addF();
                            $uibModalInstance.dismiss('cancel'); $scope.dtInstance._renderer.rerender();
                        }; $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
                    }, scope: $scope
                });
            } else {
                $scope.addF();
            }
        }
        //Funcion para agregar registro
        $scope.addF = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                //Validacion Fechas
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                if ($scope.registro.fechaInicio > $scope.hoy) {
                    toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                if ($scope.registro.fechaTermino > $scope.hoy) {
                    toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                if ($scope.registro.fechaInicio >= $scope.registro.fechaTermino) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }
                /////////////////

                $scope.registro.claveUnidad = $scope.areaasignada.claveUnidad;
                //$scope.registro.fechaEfectiva = $scope.areaasignada.fechaEfectiva;
                $scope.desabilitar = true;
                if ($scope.editarGestion == 0) {
                    $scope.registro.estadoFlujoId = 1;
                }
                var registro = {
                    "ClavePersona": $scope.authentication.userprofile.clavePersona,
                    "TipoBecaId": $scope.registro.tipoBecaId,
                    "NumeroBecario": $scope.registro.numeroBecario,
                    "BecarioDirigidoId": id
                };

                BecarioDirigidoService.ValidaRegistroDuplicado(registro).then(
                    function (res) {
                        if(res.data){
                            toastr.warning("Intente cambiar el tipo de beca o el número de becario asociado");
                            toastr.warning("Ya existe el registro!");
                            $scope.desabilitar = false;
                            return false;
                        }
                        BecarioDirigidoService.update($scope.registro).then(
                            function (result) {
                                if (result.data.adjuntoId != null) {
                                    $scope.registro.adjunto.adjuntoId = result.data.adjuntoId;
                                    $scope.registro.adjuntoId = result.data.adjuntoId;
                                    $scope.regFile = false;
                                } else {
                                    if (result.data.adjunto != null) {
                                        $scope.registro.adjunto.adjuntoId = result.data.adjunto.adjuntoId;
                                        $scope.registro.adjuntoId = result.data.adjunto.adjuntoId;
                                        $scope.regFile = false;
                                    } else {
                                        $scope.registro.adjunto = null;
                                        $scope.registro.adjuntoId = null;
                                        $scope.regFile = true;
                                    }
                                }
                                toastr.success("Registro Actualizado");
                                $scope.ValidForm.$setPristine();
                                $scope.desabilitar = false;
                            },
                            function (err) {
                                $scope.desabilitar = false;
                                console.error(err);
                            });
                    }, function (err) {
                        console.log(err);
                    }
                );

            }
        }
        $scope.validar = function () {
            try {
                if ($scope.ValidForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    //Validacion Fechas
                    $scope.hoy = new Date();
                    $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                    if ($scope.registro.fechaInicio > $scope.hoy) {
                        toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                        return false;
                    }
                    if ($scope.registro.fechaTermino > $scope.hoy) {
                        toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
                        return false;
                    }
                    if ($scope.registro.fechaInicio >= $scope.registro.fechaTermino) {
                        toastr.error("La fecha de inicio debe ser menor a la de término");
                        return false;
                    }

                    //$scope.add();
                    /////////////////
                    var Registro = {
                        "becarioDirigidoId": $scope.registro.becarioDirigidoId,
                        "estadoFlujoId": 2
                    };
                    //Cambiar el estado del registro
                    $scope.desabilitar = true;
                    $scope.registro.estadoFlujoId = 2;
                    BecarioDirigidoService.update($scope.registro).then(
                        function (result) {
                            var Solicitud = {
                                "ClavePersona": $scope.registro.clavePersona,
                                "TipoInformacionId": 9,
                                "InformacionId": $scope.registro.becarioDirigidoId,
                                "FechaSolicitud": new Date(),
                                "EstadoFlujoId": 2,
                                "titulo": $scope.registro.nombreEstancia
                            }
                            BecarioDirigidoService.AddSolicitud(Solicitud).then(
                                function (result) {
                                    //Bitacora
                                    var Bitacora = {
                                        "SolicitudId": result.data,
                                        "FechaMovimiento": new Date(),
                                        "ClavePersona": $scope.registro.clavePersona,
                                        "Descripcion": "Se envió la solicitud",
                                        "EstadoFlujoId": 1
                                    }
                                    BecarioDirigidoService.AddBitacoraSolicitud(Bitacora);
                                    ////////////////
                                    var Mail = {
                                        "Modulo": "Capital Humano",
                                        "Empleado": $scope.registro.nombreEmpleado,
                                        "Seccion": "Becario Dirigido",
                                        "TipoCorreo": 1,
                                        "ClavePersona": $scope.registro.clavePersona
                                    }
                                    BecarioDirigidoService.mailNotificacion(Mail);
                                    toastr.success("Solicitud Enviada!");
                                    $state.go("fichapersonal.becariodirigido", { seccion: 'becariodirigido' });
                                })
                        },
                        function (err) {
                            $scope.desabilitar = false;
                            console.error(err);
                            $rootScope.globalRegresar();
                        });
                }
            } catch (e) {
                console.log(e);
                throw e;
            }

        }

        $scope.deleteFile = function () {
            $scope.registro.adjunto.nombre = "eliminar";
            //BecarioDirigidoService.update($scope.registro);
            //toastr.success("Archivo Eliminado!");
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }

        $scope.clean = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }
    }
})();