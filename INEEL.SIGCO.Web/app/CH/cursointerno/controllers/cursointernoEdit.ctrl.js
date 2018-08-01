(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("cursointernoEditCtrl", ['AuthService', '$scope', '$rootScope', 'CursoInternoCHService', 'globalGet', '$state', "uploadFileACH", "$uibModal", "DTOptionsBuilder", cursointernoEditCtrl]);

    function cursointernoEditCtrl(AuthService, $scope, $rootScope, CursoInternoCHService, globalGet, $state, uploadFileACH, $uibModal, DTOptionsBuilder) {
        var API = globalGet.get("api");
        var id = $rootScope.getGlobalID();
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });

        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;
        if ($scope.idGF == null) {
            $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
            $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        } else {
            $scope.clavePersona = $scope.idGF;
            $scope.nombreEmpleado = $scope.nomGF;
        }
        $scope.editarGestion = 0;
        $scope.idGF = $rootScope.GestionFichasClave;
        if ($scope.idGF != null) {
            $scope.editarGestion = 1;
        }

        $scope.listaCoAutores="";

        $scope.ligasEliminadas = [];
        $scope.archivosEliminados = [];
        $scope.registro = {};
        $scope.AutoresIIE = [];
        $scope.AutoresIIEEliminados = [];
        $scope.auxColabora = [];
        $scope.AutoresExtEliminados = [];
        $scope.AutoresExt = [];
        $scope.archivosAdjuntos = [];
        $scope.sitiosWebNuevos = [];
        $scope.sitioWebCurso = [];
        $scope.contador = 0;
        $scope.urlDescarga = API + "Descarga/GetFileCurso";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //$scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        //obtener gradoAcademicos
        //obtener el registro a editar
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);

        var origenCH = $rootScope.getOrigen() == 'CH' ? true : false;
        CursoInternoCHService.getbyid(id).then(
            function (result) {
                CursoInternoCHService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.registro.nombrePersona = result.data.nombreCompleto;
                    });
                $scope.autorIIE = {};
                $scope.registro = result.data;
                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                }
                if ($scope.registro.fechaCurso != null) {
                    $scope.registro.fechaCurso = new Date($scope.registro.fechaCurso);
                }
                if ($scope.registro.fechaTermino != null) {
                    $scope.registro.fechaTermino = new Date($scope.registro.fechaTermino);
                }
                if ($scope.registro.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
                CursoInternoCHService.getByObj($scope.registro.cursoInternoId).then(
                    function (result) {
                        $scope.AutoresIIE = result.data;
                        if ($scope.idGF == null) {
                            var Registro = {
                                "clavePersona": $scope.clavePersona,
                                "nombreCompleto": $scope.nombreEmpleado
                            }
                            for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                                if ($scope.AutoresIIE[i].clavePersona == Registro.clavePersona) {
                                    //toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                                    $scope.PersonaSeleccionada = null;
                                    return false;
                                }
                            }
                            $scope.userAdd = false;
                            $scope.PersonaSeleccionada = null;
                            $scope.AutoresIIE.push(Registro);
                        }

                        for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                            $scope.contador = $scope.contador + $scope.AutoresIIE[i].contribucion;
                        }

                    });
                CursoInternoCHService.getExt($scope.registro.cursoInternoId).then(
                    function (result) {
                        $scope.AutoresExt = result.data;
                    });

                CursoInternoCHService.getAdjuntos($scope.registro.cursoInternoId).then(
                    function (result) {
                        $scope.archivosAdjuntos = result.data;
                    });
            },
            function (error) {
                toastr.error(error);
            });
        CursoInternoCHService.getTipoCurso().then(
            function (result) {
                $scope.cursos = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Tipo de Cursos.");
            }
        );

        /////////////////////////Buscar Proyecto
        //Buscar Proyecto
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
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
        }
        //////////////////////Buscar persona////////////
        $scope.PersonaSeleccionada = {};
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
                $scope.autorIIE.clavePersona = $scope.PersonaSeleccionada.clavePersona;
                $scope.autorIIE.nombrePersona = $scope.PersonaSeleccionada.nombreCompleto;
                $scope.userAdd = true;
                $scope.add_user();
            });
        }
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            //Que no exita el adjunto
            var igual = 0;
            var contador = 0;
            for (contador = 0; contador < $scope.archivosAdjuntos.length; contador++) {
                if (adjunto.files[0].name == $scope.archivosAdjuntos[contador].nombre) {
                    igual = 1;
                }
            }
            if (igual == 0) {
                for (contador = 0; contador < $scope.tasklist.length; contador++) {
                    if (adjunto.files[0].name == $scope.tasklist[contador].nombre) {
                        igual = 1;
                    }
                }
            }
            if (igual > 0) {
                toastr.error("El adjunto ya existe");
                adjunto = '';
                $("#filesGral").filestyle('clear');
                return;
            }
            else {
                $scope.files = null;
                $scope.files = [];
                $scope.files.push(adjunto.files[0]);
                $scope.archivos = adjunto.files.length;

                // $scope.uploadFiles();
                var propiedades = {
                    file: adjunto.files[0],
                    ext: "pdf;doc;docx;ppt;pptx", /* pdf;doc;docx;ppt */
                    type: '*', /* */
                    size: '8', /* cantidad entera en MB*/
                    api: API + "FileUploadMT/UploadFiles/"
                }
                uploadFileACH.upload(propiedades,
                    function (err, result) {
                        if (!err) {
                            console.log("result:");
                            console.log(result);
                            $("#filesGral").filestyle('clear');
                            if (!result.error) {
                                transferComplete(result);
                                $("#filesGral").filestyle('clear');
                            } else {
                                toastr.error(result.message);
                                $("#filesGral").filestyle('clear');
                            }
                        } else {
                            var error = err.message || "Error al adjuntar";
                            $("#filesGral").filestyle('clear');
                            toastr.error(error);
                        }
                    });
            };
        }



        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.finalDateComparacion = new Date($scope.registro.fechaCurso);
            if ($scope.finalDateComparacion >= $scope.fechaActual) {
                toastr.error("Fecha de inicio del congreso deber ser menor a la fecha actual");
                $scope.registro.fechaCurso = "";
                return false;
            }
        }



        $scope.validarFechas2 = function () {
            $scope.fechaActual = new Date();
            $scope.finalDateComparacion = new Date($scope.registro.fechaTermino);
            if ($scope.finalDateComparacion >= $scope.fechaActual) {
                toastr.error("Fecha de termino del congreso deber ser menor a la fecha actual");
                $scope.registro.fechaCurso = "";
                return false;
            }
        }



        $scope.tasklist = [];
        function transferComplete(result) {
            
            $scope.$apply(function () {
                if (result.error === false) {
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    var cont = 0;
                    for (var o = 0; o < $scope.archivosAdjuntos.length; o++) {
                        if ($scope.archivosAdjuntos[o].nombre == result.nameFile) {
                            cont++;
                        }
                    }

                    for (var o = 0; o < $scope.tasklist.length; o++) {
                        if ($scope.tasklist[o].nombre == result.nameFile) {
                            cont++;
                        }
                    }

                    if (cont == 0) {

                        var RegistroFiles = {
                            "RutaCompleta": result.fullPathFile,
                            "nombre": result.nameFile,
                            "ModuloId": "CH",
                            "CursoInternoId": $scope.registro.cursoInternoId
                        }
                        $scope.archivosAdjuntos.push(RegistroFiles)
                        //CursoInternoCHService.AddFile(RegistroFiles).then(
                        //    function (result) {
                        //        $scope.buscarArchivos();
                        //    });



                    }

                    $scope.existFile = 1;
                }
            });
        }

        $scope.buscarArchivos = function () {
            CursoInternoCHService.getAdjuntos($scope.registro.cursoInternoId).then(
                function (result) {
                    $scope.archivosAdjuntos = result.data;
                });
        }

        $scope.deleteTask = function (index) {
            //var files = $scope.adjuntos.length + $scope.tasklist.length;
            //if (files > 1) {
            $scope.tasklist.splice(index, 1);
            angular.element("input[type='file']").val(null);
            //}
            //else {
            //    toastr.error("No existen suficientes archivos para eliminar");
            //}
        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        //Funcion para agregar registro

        $scope.update = function (opc) {
            if ($scope.registro.estadoFlujoId == 3) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/vistasGenericas/modificarValidados.html', controller: function ($uibModalInstance) {
                        $scope.ok = function () {
                            $scope.updateF(opc);
                            $uibModalInstance.dismiss('cancel'); $scope.dtInstance._renderer.rerender();
                        }; $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
                    }, scope: $scope
                });
            } else {
                $scope.updateF(opc);
            }
        }


        $scope.updateF = function (validar) {
           
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {


                if ($scope.AutoresIIE.length == 0) {
                    toastr.error("Ingrese al menos un autor interno");
                    return false;
                }
                    //if (($scope.archivosAdjuntos.length + $scope.tasklist.length) == 0) {
                    //    toastr.error("Ingrese por lo menos un autor interno");
                    //    return false;
                    //}http://vmsigcop.iie.org.mx:8081/issue/SIGCOE3-1806
                else {
                    if ($scope.registro.fechaCurso > $scope.registro.fechaTermino && ($scope.registro.fechaTermino != null)) {
                        toastr.error("La fecha de inicio debe ser menor a la de término");
                        return false;
                    } else {
                        $scope.desactivar = true;
                        if ($scope.registro.perteneceCP == 1) {
                            $scope.registro.perteneceCP = true;
                        } else { $scope.registro.perteneceCP = false; }
                        if ($scope.editarGestion == 0) {
                            $scope.registro.estadoFlujoId = 1;
                        }
                        $scope.registro.clavePersona = $scope.clavePersona;
                        for (var i = 0; i < $scope.archivosEliminados.length; i++) {
                            $scope.archivosAdjuntos.push($scope.archivosEliminados[i]);
                        }
                        for (var i = 0; i < $scope.ligasEliminadas.length; i++) {
                            $scope.registro.sitioWebCurso.push($scope.ligasEliminadas[i]);
                        }
                        for (var i = 0; i < $scope.AutoresExtEliminados.length; i++) {
                            $scope.AutoresExt.push($scope.AutoresExtEliminados[i]);
                        }

                        for (var i = 0; i < $scope.AutoresIIEEliminados.length; i++) {
                            $scope.AutoresIIE.push($scope.AutoresIIEEliminados[i]);
                        }
                        CursoInternoCHService.update($scope.registro).then(
                            function (result) {

                                CursoInternoCHService.updateFiles($scope.archivosAdjuntos).then(
                                function (result) {
                                    CursoInternoCHService.updateAutoresExternos($scope.AutoresExt).then(
                                        function (result) {
                                            CursoInternoCHService.updateAutoresInternos($scope.AutoresIIE).then(
                                        function (result) {
                                            toastr.success("Registro Actualizado");
                                            $scope.ValidForm.$setPristine();
                                            if (validar) {
                                                $scope.registro.sitioWebCurso = [];
                                                $scope.validar();
                                            }
                                            $scope.desactivar = false;
                                            $state.reload();
                                        });
                                        });
                                });

                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);
                            });
                    }
                }
            }
        }


        $scope.validar = function () {
           
            try {
                if ($scope.ValidForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    if ($scope.AutoresIIE.length == 0) {
                        toastr.error("Ingrese al menos un autor interno");
                        return false;
                    }
                    if ($scope.registro.perteneceCP == 1) {
                        $scope.registro.perteneceCP = true;
                    } else { $scope.registro.perteneceCP = false; }
                    var Registro = {
                        "cursoInternoId": $scope.registro.cursoInternoId,
                        "estadoFlujoId": 2,
                        "perteneceCP": $scope.registro.perteneceCP
                    };
                    $scope.registro.clavePersona = $scope.clavePersona;
                    //Cambiar el estado del registro
                    $scope.desactivar = true;
                    $scope.registro.estadoFlujoId = 2;

                    for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                        $scope.listaCoAutores += $scope.AutoresIIE[i].clavePersona + ",";
                    }


                    CursoInternoCHService.update($scope.registro).then(
                        function (result) {
                            var Solicitud = {
                                "ClavePersona": $scope.registro.clavePersona,
                                "TipoInformacionId": "",
                                "InformacionId": $scope.registro.cursoInternoId,
                                "FechaSolicitud": new Date(),
                                "EstadoFlujoId": 2,
                                "titulo": $scope.registro.titulo
                            }

                            //CursoInternoCHService.updateFiles($scope.archivosAdjuntos);


                            if ($scope.registro.perteneceCP == true) {
                                Solicitud.TipoInformacionId = 18;
                                CursoInternoCHService.AddSolicitudCH(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        CursoInternoCHService.AddBitacoraSolicitud(Bitacora);
                                        ////////////////
                                        var tipoMensaje;
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registro.nombrePersona,
                                            "Seccion": "Cursos Impartidos",
                                            "TipoCorreo": "SolicitudCentroPosgrado",
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "coautores": $scope.listaCoAutores,
                                        }
                                        // CursoInternoCHService.mailNotificacion(Mail);
                                        CursoInternoCHService.mailNotificacionConCoautores(Mail);
                                        toastr.success("Solicitud Enviada!");

                                        if (origenCH) {
                                            $state.go("fichapersonal.cursointerno", { seccion: 'cursointerno' });
                                        } else {
                                            $rootScope.globalRegresar();
                                        }

                                    })
                            } else {
                                Solicitud.TipoInformacionId = 17;
                                CursoInternoCHService.AddSolicitudCH(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        CursoInternoCHService.AddBitacoraSolicitud(Bitacora);
                                        ////////////////
                                        var tipoMensaje;
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registro.nombrePersona,
                                            "Seccion": "Cursos Impartidos",
                                            "TipoCorreo": 1,
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "coautores": $scope.listaCoAutores,
                                        }
                                        // CursoInternoCHService.mailNotificacion(Mail);
                                        CursoInternoCHService.mailNotificacionConCoautores(Mail);
                                        toastr.success("Solicitud Enviada!");


                                        if (origenCH) {
                                            $state.go("fichapersonal.cursointerno", { seccion: 'cursointerno' });
                                        } else {
                                            $rootScope.globalRegresar();
                                        }
                                    })
                            }
                        },
                        function (err) {
                            $scope.desactivar = false;
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
            //CursoInternoCHService.update($scope.registro);
            //toastr.success("Archivo Eliminado!");
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }

        $scope.add_File = function () {
            var RegistroFiles = {
                "RutaCompleta": $scope.registro.adjunto.rutaCompleta,
                "nombre": $scope.registro.adjunto.nombre,
                "ModuloId": $scope.registro.adjunto.moduloId,
                "CursoInternoId": $scope.registro.cursoInternoId
            }
            //CursoInternoCHService.AddFile(RegistroFiles);
            $scope.archivosAdjuntos.push($scope.registro.adjunto);
            $scope.registro.adjunto = null;
            $scope.existFile = 0;
        }

        $scope.eliminarFile = function (registro) {

            if (registro.adjuntoCursosId != undefined) {
                registro.nombre = "eliminar";
                $scope.archivosEliminados.push(registro);
            }
            //CursoInternoCHService.deleteAdjunto(registro.adjuntoCursosId);
            var idx = ($scope.archivosAdjuntos.indexOf(registro));
            $scope.archivosAdjuntos.splice(idx, 1);
        }

        $scope.add_user = function () {
            var Registro = {
                "cursoInternoId": $scope.registro.cursoInternoId,
                "clavePersona": $scope.autorIIE.clavePersona,
                "nombreCompleto": $scope.autorIIE.nombrePersona

            }
            for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                if ($scope.AutoresIIE[i].clavePersona == Registro.clavePersona) {
                    toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                    $scope.PersonaSeleccionada = null;
                    return false;
                }
            }
            //CursoInternoCHService.AddUser(Registro).then(
            //    function (result) {
                    $scope.userAdd = false;
                    $scope.autorIIE = {};
                    //Registro.autorInternoCursoInternoId = result.data.autorInternoCursoInternoId;
                    $scope.PersonaSeleccionada = null;
                    $scope.AutoresIIE.push(Registro);

                //});
        }


        $scope.delete = function (registro) {
            //CursoInternoCHService.deleteAutorIIE(registro.autorInternoCursoInternoId).then(
            //    function (result) {
                    for (var i = 0; i < $scope.auxColabora.length; i++) {
                        if ($scope.auxColabora[i].id == registro.contribucion) {
                            $scope.catNum.push($scope.auxColabora[i]);
                        }
                    }

                    if (registro.autorInternoCursoInternoId != undefined) {
                        registro.nombreCompleto = "eliminar"
                        $scope.AutoresIIEEliminados.push(registro);
                    }
                    var idx = ($scope.AutoresIIE.indexOf(registro));
                    $scope.AutoresIIE.splice(idx, 1);
                    //$uibModalInstance.dismiss('close');
                    var porcentaje = parseInt(registro.contribucion);
                    $scope.contador = $scope.contador - porcentaje;
                //},
                //function (err) {
                //    toastr.error(err.data.message);
                //});
        };

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }

        $scope.addLiga = function () {

            if ($scope.registro) { //se hace esta comparación para comprobar que no es undefined
                var liga = $scope.registro.descripcionLiga;
                var idx = -1;
                if (liga != "" && liga != undefined) {
                    for (var contador = 0; contador < $scope.registro.sitioWebCurso.length; contador++) {
                        if ($scope.registro.sitioWebCurso[contador].url == liga) {
                            var idx = contador;
                        }
                    }
                    var idx2 = $scope.sitiosWebNuevos.indexOf(liga);
                    if (idx > -1 || idx2 > -1) {
                        toastr.error("La Liga de acceso indicada ya se encuentra asociada a la convocatoria, indique otra");
                    }
                        // is newly selected
                    else {
                        var urlnew = {
                            url: liga,
                            autor: $scope.nombreEmpleado,
                            estado: true,
                            cursoInternoId: id,
                            cursoInterno:null
                        };
                        $scope.registro.sitioWebCurso.push(urlnew);
                    }
                }
                else {
                    toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
                }
            }
            else {
                toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
            }
            $scope.registro.descripcionLiga = '';
        }


        $scope.deleteTaskNew = function (index) {
            $scope.sitiosWebNuevos.splice(index, 1);

        }


        //Eliminar el archivo adjunto
        $scope.eliminarUrl = function (registro) {

            if (registro.sitioWebCursoInternoId != undefined) {
                registro.url = "eliminar";
                $scope.ligasEliminadas.push(registro);
            }

            var idx = ($scope.registro.sitioWebCurso.indexOf(registro));
            $scope.registro.sitioWebCurso.splice(idx, 1);


        }

        $scope.add_userExt = function () {
            if ($scope.autorExt.nombreCompleto != null && $scope.autorExt.institucion != null) {
                $scope.autorExt.cursoInternoId = $scope.registro.cursoInternoId;

                for (var i = 0; i < $scope.AutoresExt.length; i++) {
                    if (($scope.AutoresExt[i].nombreCompleto == $scope.autorExt.nombreCompleto) && ($scope.AutoresExt[i].institucion == $scope.autorExt.institucion)) {
                        toastr.error("El autor " + $scope.autorExt.nombreCompleto + " ya existe dentro de la tabla de autores!");
                        $scope.addExt = true;
                        $scope.autorExt = {};
                        return false;
                    }
                }


                //CursoInternoCHService.AddUserExt($scope.autorExt).then(
                //    function (result) {
                $scope.addExt = false;
                //$scope.autorExt.autorExternoCursoInternoId = result.data.autorExternoCursoInternoId;
                $scope.AutoresExt.push($scope.autorExt);
                $scope.autorExt = {};

                //});
            } else {
                toastr.error("Complete los datos requeridos del autor externo");
            }
        }

        $scope.deleteExt = function (registro) {
            //CursoInternoCHService.deleteAutorExt(registro.autorExternoCursoInternoId).then(
            //    function (result) {

            if (registro.autorExternoCursoInternoId != undefined) {
                registro.nombreCompleto = "eliminar"
                $scope.AutoresExtEliminados.push(registro);
            }
            var idx = ($scope.AutoresExt.indexOf(registro));
            $scope.AutoresExt.splice(idx, 1);
            $scope.auxColabora.splice(idx, 1);
            //},
            //function (err) {
            //    toastr.error(err.data.message);
            //});
        };

        $scope.clean = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }


        $scope.regresar = function () {
            $state.go("fichapersonal.cursointerno", { seccion: 'cursointerno' });
        }

    };
})();