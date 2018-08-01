(function () {
    "use strict";

    angular.module("ineelCH")
        .controller("becarioexternoDetallesCtrl", ['AuthService', '$scope', '$rootScope', 'BecarioExternoServiceCH', 'globalGet', '$state', '$stateParams', '$uibModal', 'uploadFileACH', 'DTOptionsBuilder', 'MenuService', becarioexternoDetallesCtrl]);
    function becarioexternoDetallesCtrl(AuthService, $scope, $rootScope, BecarioExternoServiceCH, globalGet, $state, $stateParams, $uibModal, uploadFileACH, DTOptionsBuilder, MenuService) {
        $scope.rolId = MenuService.getRolId(); 
        if ($scope.rolId != 1 && $scope.rol!=1026) { toastr.error("No Autorizado"); $state.go("home"); return false; }

        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        $scope.justificacion = messageDefaultAprobacionAdminCH_ + "";
        $scope.aprobacionQ = " ¿Seguro que desea aprobar el registro de esté becario externo con la siguiente justificación: " + $scope.justificacion + " ? ";
        $scope.rechazoQ = " ¿Seguro que desea regresar la solicitud de registro de esté becario externo con la siguiente justificación: " + $scope.justificacion + " ? ";





        //Variable API
        var API = globalGet.get("api");
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        $scope.urlDescarga = API + "Descarga/GetFile";
        $scope.adjuntosEliminados = [];
        //$scope.FechaValidacionAux = new Date();

        //Parametros
        //var id = $stateParams.id;
        //var id2 = $stateParams.id2;
        $scope.editAdmin = $stateParams.id2;
        var id = $rootScope.getGlobalID();
        var id2 = $rootScope.getGlobalID2();
        $scope.registro = {};
        BecarioExternoServiceCH.getById(id).then(
            function (result) {
                $scope.becario = result.data;
                if ($scope.becario.fechaValidacion == null) {
                    $scope.FechaValidacionAux = new Date();
                } else {
                    $scope.FechaValidacionAux = new Date($scope.becario.fechaValidacion);
                }
                if ($scope.becario.proyecto != null) {
                    $scope.proyecto = $scope.becario.proyecto.nombre;
                }
                //$scope.becario.fechaInicio = new Date($scope.becario.fechaInicio);
                //$scope.becario.fechaTermino = new Date($scope.becario.fechaTermino);
                if ($scope.becario.fechaInicio != null)
                    $scope.becario.fechaInicio = new Date($scope.becario.fechaInicio);
                if ($scope.becario.fechaTermino != null)
                    $scope.becario.fechaTermino = new Date($scope.becario.fechaTermino);
                $scope.selectedinstitucion = $scope.becario.institucion;
                $scope.adjuntos = $scope.becario.adjuntoBecarioExterno;
                BecarioExternoServiceCH.Persona(result.data.becario_ClavePersona).then(
                    function (result) {
                        $scope.registro = $scope.becario;
                        $scope.registro.nombrePersona = result.data.nombreCompleto;
                        $scope.registro.clavePersona = result.data.clavePersona;
                        $scope.registro.claveUnidadAut = result.data.claveUnidad;
                    });

            },
            function (err) {
                console.error(err);
            });

        $scope.openBecario = function () {
            $scope.desabilitarBuscarBecario = true;
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        $scope.verpersona = false;
                        return $scope.empleado;
                    }
                },
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                var compara = angular.equals($scope.becario.becario_ClavePersona, selectedItem.clavePersona);
                if (compara == true) {
                    toastr.error("El becario y asesor no debe ser el mismo");
                    return false;
                }
                else {
                    $scope.becario.asesor_Nombre = selectedItem.nombreCompleto;
                    $scope.becario.asesor_ClavePersona = selectedItem.clavePersona;
                    $scope.PersonaSeleccionada = selectedItem;
                    $scope.fromBecario.$setDirty();
                }
            });
            $scope.desabilitarBuscarBecario = false;
        }
        function CrearSolicitudSinoExiste(Mail, opc, registro, registroID, tipoInformacionID) {

            var Solicitud = {
                "ClavePersona": $scope.registro.clavePersona,
                "TipoInformacionId": tipoInformacionID,
                "InformacionId": registroID,
                "FechaSolicitud": new Date(),
                "EstadoFlujoId": 3,
                "ClaveUnidadAut": $scope.registro.claveUnidadAut
            };

            BecarioExternoServiceCH.AddSolicitud(Solicitud).then(
                function (result) {

                    id2 = result.data;
                    console.log("id de solicitud:");
                    console.log(result.data);

                    var Bitacora = {
                        "SolicitudId": result.data,
                        "FechaMovimiento": new Date(),
                        "ClavePersona": $scope.authentication.userprofile.clavePersona,
                        "Descripcion": "Gestión de Ficha",
                        "EstadoFlujoId": $scope.registro.estadoFlujoId,
                        "idRol": 1
                    }
                    BecarioExternoServiceCH.AddBitacoraSolicitud(Bitacora).then(function (resultBitacora) {
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
            if ($scope.justificacion == null) {
                toastr.error("Escriba una justificación");
                return false;
            }
            var registro = {
                "solicitudId": id2,
                "estadoFlujoId": 3
            }
            $scope.becario.estadoFlujoId = 3;
            $scope.becario.fechaValidacion = $scope.FechaValidacionAux;

            BecarioExternoServiceCH.Update($scope.becario).then(
                function (result) {
                    toastr.success("Solicitud Aprobada!");
                    $state.reload();
                    $scope.desabilitar = false;
                    BecarioExternoServiceCH.updateSolicitud(registro).then(
                        function (result) {
                            var Bitacora = {
                                "SolicitudId": registro.solicitudId,
                                //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                "FechaMovimiento": new Date(),
                                "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                "Descripcion": "Aprobado: " + $scope.justificacion,
                                "EstadoFlujoId": registro.estadoFlujoId,
                                "idRol": 1
                            }
                            BecarioExternoServiceCH.AddBitacoraSolicitud(Bitacora);
                            Mail.Estado = "Aprobada";
                            BecarioExternoServiceCH.mailNotificacion(Mail);
                            $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                        })
                },
                function (err) {
                    $scope.desabilitar = false;
                    console.error(err);
                });
        }
        //Guardar Cambios
        $scope.save = function (opc) {
            if ($scope.fromBecario.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if ($scope.justificacion == null && opc != 1) {
                    toastr.error("Escriba una justificación");
                    return false;
                }
                $scope.becario.institucionID = $scope.selectedinstitucion.institucionID;
                $scope.AuxnombreInstitucion = $scope.selectedinstitucion.descripcion;
                var Mail = {
                    "Modulo": "Capital Humano",
                    "Empleado": $scope.becario.becario_Nombre,
                    "Seccion": "Becario Externo",
                    "TipoCorreo": 2,
                    "ClavePersona": $scope.becario.becario_ClavePersona,
                    "Descripcion1": "<b>Nombre Becario:</b> " + $scope.becario.becario_Nombre + "<br/>",
                    "Descripcion2": "<b>Asesor:</b> " + $scope.becario.asesor_Nombre + "<br/>",
                    "Descripcion3": "<b>Título:</b> " + $scope.becario.titulo + "<br/>",
                    "Descripcion4": "<b>Institución:</b> " + $scope.AuxnombreInstitucion,
                    "Justificacion": $scope.justificacion,
                    "Estado": ""
                }
                $scope.desabilitar = true;
                //Agregar archivos 
                angular.forEach($scope.tasklist, function (value, key) {
                    $scope.becario.adjuntoBecarioExterno.push({
                        Adjunto:
                        {
                            "rutaCompleta": value.fullpath.replace(/\"/g, ""),
                            "nombre": value.nameFile.replace(/\"/g, ""),
                            moduloId: "CH"
                        }
                    });

                });

                if ($scope.editAdmin == "1") {
                    if (CrearSolicitudSinoExiste(Mail, opc, $scope.registro,
                        $scope.registro.becarioExternoId, 13) > 0) {
                        debugger;
                    }
                }

                debugger;
                for (var i = 0; i < $scope.adjuntosEliminados.length; i++) {
                    $scope.becario.adjuntoBecarioExterno.push($scope.adjuntosEliminados[i]);
                }

                switch (opc) {
                    case 1:


                        //                $scope.software.fechaEfectiva = new Date();
                        var registro={
                            "Becario_ClavePersona": $scope.registro.clavePersona,
                            "TipoBecaId": $scope.becario.tipoBecaId,
                            "FechaInicio": $scope.becario.fechaInicio,
                            "FechaTermino": $scope.becario.fechaTermino,
                            "BecarioExternoId":id
                        };
            
                        BecarioExternoServiceCH.ValidaRegistroDuplicado(registro).then(
                            function(res){
                                if(res.data){
                                    toastr.warning("Intente cambiar el tipo de beca, las fechas de inicio y término o el número de becario");
                                    toastr.warning("Ya existe el registro!");
                                    return false;
                                }
                                BecarioExternoServiceCH.Update($scope.becario).then(
                                    function (result) {
                                        toastr.success(result.data);
                                        $state.reload();
                                        $scope.desabilitar = false;
                                        //                                $scope.tasklist = [];
                                        //                                $scope.adjuntos = [];
                                        $scope.becario.adjuntoBecarioExterno = [];
                                        BecarioExternoServiceCH.getById(id).then(
                                            function (result) {
                                                $scope.becario = result.data;
                                                $scope.proyecto = $scope.becario.proyecto.nombre;
                                                $scope.becario.fechaInicio = new Date($scope.becario.fechaInicio);
                                                $scope.becario.fechaTermino = new Date($scope.becario.fechaTermino);
        
                                                $scope.institucionselect = $scope.becario.institucion;
                                                //$scope.adjuntos = $scope.becario.adjuntoBecarioExterno;
                                            },
                                            function (err) {
                                                console.error(err);
                                            });
                                    },
                                    function (err) {
                                        console.error(err);
                                        $scope.desabilitar = false;
                                    });
                            },function(err){
                                console.log(err);
                            }
                        );
                        
                        break;

                    case 2:
                        if ($scope.editAdmin != "1")
                            apruebaAdminCHfunction(Mail, id2);
                        break;
                    case 3:
                        if ($scope.justificacion == null) {
                            toastr.error("Escriba una justificación");
                            return false;
                        }
                        var registro = {
                            "solicitudId": id2,
                            "estadoFlujoId": 1
                        }
                        $scope.becario.estadoFlujoId = 1;
                        BecarioExternoServiceCH.Update($scope.becario).then(
                            function (result) {
                                toastr.success("Solicitud Rechazada!");
                                BecarioExternoServiceCH.updateSolicitud(registro).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": registro.solicitudId,
                                            //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                                            "Descripcion": "Rechazado: " + $scope.justificacion,
                                            "EstadoFlujoId": 2,
                                            "idRol": 1
                                        }
                                        BecarioExternoServiceCH.AddBitacoraSolicitud(Bitacora);
                                        Mail.Estado = "Rechazada";
                                        BecarioExternoServiceCH.mailNotificacion(Mail);
                                        $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                                    })
                            },
                            function (err) {
                                $scope.desabilitar = false;
                                console.error(err);
                            });
                        break;
                }
            }
        }




        //obtener instituciones 
        BecarioExternoServiceCH.getInstituciones().then(
            function (result) {
                $scope.instituciones = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar el catálogo de instituciones.");
            }
        );

        //Get TipoBeca
        BecarioExternoServiceCH.getTipoBeca().then(
            function (result) {
                $scope.tipoBeca = result.data;

            },
            function (err) {
                toastr.error("No se ha podido cargar el catálogo de tipo de beca.");
            }
        );

        ///Validar rango de fechas

        $scope.validarFechasInicio = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.becario.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.becario.fechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                return false;
            }
        }

        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.becario.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.becario.fechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                return false;
            }
        }


        //Buscar Persona
        $scope.PersonaSeleccionada = {};
        $scope.verpersona = false;
        $scope.openAsesor = function () {
            $scope.desabilitarBuscarAsesor = true;
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        $scope.verpersona = false;
                        return $scope.empleado;
                    }
                },
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                var compara = angular.equals($scope.becario.becario_ClavePersona, selectedItem.clavePersona);
                if (compara == true) {
                    toastr.error("El becario y asesor no debe ser el mismo");
                    return false;
                }
                else {
                    $scope.becario.asesor_Nombre = selectedItem.nombreCompleto;
                    $scope.becario.asesor_ClavePersona = selectedItem.clavePersona;
                    $scope.PersonaSeleccionada = selectedItem;
                }
            });
            $scope.desabilitarBuscarAsesor = false;
        }


        //Buscar Proyecto
        $scope.ProyectoSeleccionado = {};
        $scope.verproyecto = false;
        $scope.openProyecto = function () {
            $scope.desabilitarBuscarProyecto = true;
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
                $scope.proyecto = selectedItem.nombre;
                $scope.becario.proyectoId = selectedItem.proyectoId;
                $scope.ProyectoSeleccionado = selectedItem;
                $scope.fromBecario.$setDirty();
            });
            $scope.desabilitarBuscarProyecto = false;
        }

        //modal instituciones
        $scope.openInstituciones = function () {
            $scope.desabilitar = true;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listainstituciones.html',
                controller: function ($scope, $uibModalInstance) {

                    $scope.institucion = {};
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $uibModalInstance.close(item);
                    }

                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selectedinstitucion = selectedItem;
                $scope.fromBecario.$setDirty();
            });
            $scope.desabilitar = false;
        }


        //AGRERGAR REGISTRO
        $scope.addBecario = function () {

            // obetener id de la institucion
            $scope.becario.institucionID = $scope.selectedinstitucion.institucionID;

            //por default cuando se agrega un registro el estado del flujo es 1
            $scope.becario.estadoFlujoId = 1;
            $scope.becario.estadoFlujo = "Activo";

            $scope.becario.fechaValidacion = new Date();

            //ingresar id del archivo, esta pendiente por validar 
            $scope.becario.adjuntoBecarioExterno = [];
            //Asignar becario 
            $scope.becario.becario_ClavePersona = $scope.claveBecario;
            $scope.becario.becario_RUPersona = $scope.ruBecario;
            $scope.becario.becario_FechaEfectiva = $scope.fechaBecario;
            // Guardar registro Becario

            if ($scope.tasklist.length < 1) {
                toastr.error("Debe adjuntar un archivo");
                return false;
            }
            angular.forEach($scope.tasklist, function (value, key) {
                $scope.becario.adjuntoBecarioExterno.push({
                    Adjunto:
                    {
                        "rutaCompleta": value.fullpath.replace(/\"/g, ""),
                        "nombre": value.nameFile.replace(/\"/g, ""),
                        moduloId: "CH"
                    }
                });

            });
            $scope.desabilitar = true;
            BecarioExternoServiceCH.addBecario($scope.becario).then(
                function (result) {
                    toastr.success(result.data);
                    $state.go("fichapersonal.becarioexterno", { seccion: 'becarioexterno' });

                },
                function (err) {
                    console.error(err);
                    $scope.desabilitar = false;
                });

        }



        //--------------------------------------------------- logica de adjunto
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            //Que no exita el adjunto
            var igual = 0;
            var contador = 0;
            for (contador = 0; contador < $scope.becario.adjuntoBecarioExterno.length; contador++) {
                if (adjunto.length > 0) {
                    if (adjunto.files[0].name == $scope.becario.adjuntoBecarioExterno[contador].adjunto.nombre) {
                        igual = 1;
                    }
                }
            }
            if (igual > 0) {
                $("#filesGral").filestyle('clear');
                toastr.error("El adjunto ya existe");
                adjunto = '';
                return;
            }
            else {
                $scope.files = [];
                $scope.files.push(adjunto.files[0]);
                // $scope.uploadFiles();
                var propiedades = {
                    file: adjunto.files[0],
                    ext: "*", /* pdf;doc;docx;ppt */
                    type: '*', /* */
                    size: '8', /* cantidad entera en MB*/
                    api: API + "FileUploadMT/UploadFiles/"
                }
                //pueden utilizar la misma API para los diferentes modulos: API + "FileUploadMT/UploadFiles/"
                uploadFileACH.upload(propiedades,
                    function (err, result) {
                        if (!err) {
                            console.log("result:");
                            console.log(result);
                            if (!result.error) {
                                transferComplete(result);

                            } else {
                                $("#filesGral").filestyle('clear');
                                toastr.error(result.message);
                            }
                        } else {
                            var error = err.message || "Error al adjuntar";
                            $("#filesGral").filestyle('clear');
                            toastr.error(error);
                        }
                    });
            }
        };

        $scope.tasklist = [];
        $scope.deleteTask = function (index) {
            var files = $scope.adjuntos.length + $scope.tasklist.length;
            if (files > 1) {
                $scope.tasklist.splice(index, 1);
                angular.element("input[type='file']").val(null);
                $("#filesGral").filestyle('clear');
            }
            else {

                toastr.error("No existen suficientes archivos para eliminar");
            }
        }
        // CONFIRMATION.        
        function transferComplete(result) {
            console.log(result);
            $scope.$apply(function () {

                $scope.siguienteIG = false;

                if (!result.error) {

                    var cont = 0;
                    for (var o = 0; o < $scope.becario.adjuntoBecarioExterno.length; o++) {
                        if ($scope.becario.adjuntoBecarioExterno[o].adjunto.nombre == result.nameFile) {
                            cont++;
                        }
                    }

                    if (cont == 0) {
                        var RegistroFiles = {
                            adjunto: {
                                "rutaCompleta": result.fullPathFile,
                                "nombre": result.nameFile,
                                "moduloId": "CH"
                            },
                            "becarioExternoId": $scope.auxid
                        }
                        $scope.becario.adjuntoBecarioExterno.push(RegistroFiles);
                        //BecarioExternoServiceCH.Update($scope.becario).then(
                        //    function (result) {
                        //        $scope.obtieneinformacionbe();
                        //    });
                    }
                    $("#filesGral").filestyle('clear');
                    $scope.fromBecario.$setDirty();

                } else {
                    $("#filesGral").filestyle('clear');
                }
            });
        }
        //#endregion info gral

        //Eliminar el archivo adjunto
        $scope.OpenDelete = function (rowAdjuntoBecarioExterno) {
            // var idx = $scope.adjuntos[indx].adjunto.adjuntoId;
            // $scope.becario.adjuntoBecarioExterno[idx].adjunto.nombre = "eliminar";
            var contador = 0;
            if ($scope.becario.adjuntoBecarioExterno != null || $scope.becario.adjuntoBecarioExterno != undefined) {
                contador += $scope.becario.adjuntoBecarioExterno.length;
            }
            var files = contador;

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        //servicio de eliminar AdjuntoBecarioExterno
                        // delete: 
                        //BecarioExternoServiceCH.deleteAdjuntoBecarioExterno(rowAdjuntoBecarioExterno.adjuntoBecarioExternoId).then(
                        //    function (sucess) {
                        if (rowAdjuntoBecarioExterno.adjuntoId != undefined || rowAdjuntoBecarioExterno.adjuntoId != null) {
                            rowAdjuntoBecarioExterno.adjunto.nombre = "eliminar";
                            $scope.adjuntosEliminados.push(rowAdjuntoBecarioExterno);
                        }
                        var idx = ($scope.adjuntos.indexOf(rowAdjuntoBecarioExterno));
                        $scope.adjuntos.splice(idx, 1);
                        $uibModalInstance.dismiss('cancel');
                        $scope.fromBecario.$setDirty();
                        //    },
                        //    function (error) {
                        //        $uibModalInstance.dismiss('cancel');
                        //    }
                        //);

                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.RegresarBecario = function () {
            if ($scope.tasklist.length > 0) {
                BecarioExternoServiceCH.getById(id).then(
                    function (result) {
                        $scope.becario = result.data;
                        //Agregar archivos 
                        angular.forEach($scope.tasklist, function (value, key) {
                            $scope.becario.adjuntoBecarioExterno.push({
                                Adjunto:
                                {
                                    "rutaCompleta": value.fullpath.replace(/\"/g, ""),
                                    "nombre": value.nameFile.replace(/\"/g, ""),
                                    moduloId: "MT"
                                }
                            });
                        });
                        BecarioExternoServiceCH.Update($scope.becario).then(
                            function (result) {
                                toastr.success(result.data);
                                $rootScope.globalRegresar(); //$state.go("solicitudesrh");
                            },
                            function (err) {
                                console.error(err);
                                desabilitar = false;
                            });
                    },
                    function (err) {
                        console.error(err);
                    });
            }
            else {
                $state.go("fichapersonal.becarioexterno", { seccion: 'becarioexterno' });
            }
        }

    }
})();