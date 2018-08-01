(function () {
    "use strict";

    angular
        .module("ineelMT")
        .controller("CursosPersonalAddCtrl"
            , ['AuthService'
            , '$scope'
            , 'CursosPersonalServiceMT'
            , 'globalGet'
            , 'uploadFileACH'
            , '$state'
            , '$filter'
            , '$uibModal'
            , 'DTOptionsBuilder'
            , CursosPersonalAddCtrl]);
    function CursosPersonalAddCtrl(AuthService, $scope, CursosPersonalServiceMT, globalGet, uploadFileACH, $state, $filter, $uibModal, DTOptionsBuilder) {
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR  ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR ESTA EN CH */
        var API = globalGet.get("api");
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        $scope.authentication = AuthService.authentication;
        $scope.AutoresIIE = [];
        $scope.auxColabora = [];
        $scope.AutoresExt = [];
        $scope.contador = 0;
        $scope.archivosAdjuntos = [];
        $scope.sitiosWeb = [];

        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);

        $scope.registro = {};
        $scope.registro.privadoPublico = 1;
        $scope.registro.perteneceCP = 0;
        $scope.registro.nombrePersona = AuthService.authentication.nombreCompleto;
        $scope.registro.clavePersona = AuthService.authentication.userprofile.clavePersona;

        var Registro = {
            "clavePersona": $scope.registro.clavePersona,
            "nombreCompleto": $scope.registro.nombrePersona
        }
        for (var i = 0; i < $scope.AutoresIIE.length; i++) {
            if ($scope.AutoresIIE[i].clavePersona == Registro.clavePersona) {
                toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                $scope.PersonaSeleccionada = null;
                return false;
            }
        }
        $scope.userAdd = false;
        $scope.PersonaSeleccionada = null;
        $scope.AutoresIIE.push(Registro);

        $scope.autorIIE = {};
        $scope.catNum = [{
            "id": "10",
            "descripcion": "10%"
        }, {
            "id": "20",
            "descripcion": "20%"
        }, {
            "id": "30",
            "descripcion": "30%"
        }, {
            "id": "40",
            "descripcion": "40%"
        }, {
            "id": "50",
            "descripcion": "50%"
        }, {
            "id": "60",
            "descripcion": "60%"
        }, {
            "id": "70",
            "descripcion": "70%"
        }, {
            "id": "80",
            "descripcion": "80%"
        }, {
            "id": "90",
            "descripcion": "90%"
        }];


        CursosPersonalServiceMT.getTipoCurso().then(
             function (result) {
                 //$scope.cursos = result.data;
                 $scope.cursos = [];
                 var cont2 = 0;
                 for (var cont = 0; cont < result.data.length; cont++) {
                     if (result.data[cont].estado == true) {
                         $scope.cursos[cont2] = result.data[cont];
                         cont2++;
                     }
                 }
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de tipos de cursos.");
            }
            );


        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.finalDateComparacion = new Date($scope.registro.fechaCurso);
            if ($scope.finalDateComparacion > $scope.fechaActual) {
                toastr.error("Fecha de inicio del curso deber ser menor a la de hoy");
                $scope.registro.fechaCurso = "";
                return false;
            }
        }



        $scope.VerificaFechaInicio = function () {
           
            var limiteInferior       = new Date(1975, 1, 1);           
            var fechaInicioIngresada = new Date($scope.registro.fechaCurso);

            if (fechaInicioIngresada < limiteInferior) {
                toastr.error("La fecha de inicio ingresada no es una fecha válida.");
                $scope.registro.fechaCurso = "";
                return false;
            }
                        
            if ($scope.registro.fechaTermino != null) {

                var fechaTerminoIngresada = new Date($scope.registro.fechaTermino);
                if (fechaTerminoIngresada < fechaInicioIngresada) {
                    toastr.error("La fecha de inicio ingresada debe ser mayor a la fecha de término.");
                    $scope.registro.fechaCurso = "";
                    return false;
                } else {
                    return true;
                }

            }          

            
        };

        $scope.VerificaFechaTermino = function () {

            var limiteSuperior = new Date();
            var limiteInferior = new Date(1975, 1, 1);
            var fechaTerminoIngresada = new Date($scope.registro.fechaTermino);


            if (fechaTerminoIngresada > limiteSuperior) {
                toastr.error("La fecha de termino ingresada no es una fecha válida.");
                $scope.registro.fechaTermino = "";
                return false;
            }

            if (fechaTerminoIngresada < limiteInferior) {
                toastr.error("La fecha de termino ingresada no es una fecha válida.");
                $scope.registro.fechaTermino = "";
                return false;
            }

            if ($scope.registro.fechaCurso != null) {
                var fechaInicioIngresada = new Date($scope.registro.fechaCurso);
                if (fechaInicioIngresada > fechaTerminoIngresada) {
                    toastr.error("La fecha de inicio debe ser menor a la fecha de término.");
                    $scope.registro.fechaTermino = "";
                    return false;
                } else {
                    return true;
                }

            }

        };


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
                controller: 'ProyectosFilterGetCtrl',
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
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
            
            //Que no exita el adjunto
            var igual = 0;
            var contador = 0;
            for (contador = 0; contador < $scope.archivosAdjuntos.length; contador++) {
                if (adjunto.files[0].name == $scope.archivosAdjuntos[contador].nombre) {
                    igual = 1;
                }
            }
            if (igual > 0) {
                toastr.error("El adjunto ya existe");
                adjunto = '';
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
                    ext: "*", /* pdf;doc;docx;ppt */
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
    
        function transferComplete(result) {
            console.log("aqui");
            console.log(result);
            $scope.$apply(function () {
                if (result.error === false) {
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.registro.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    var cont = 0;
                    for (var o = 0; o < $scope.archivosAdjuntos.length; o++) {
                        if ($scope.archivosAdjuntos[o].nombre == result.nameFile) {
                            cont++;
                        }
                    }
                    if (cont == 0) {
                        $scope.archivosAdjuntos.push($scope.registro.adjunto);
                    }

                    $scope.existFile = 1;
                   // $scope.archivosAdjuntos.push($scope.registro.adjunto);
                   //// $scope.registro.adjunto = null;
                   //// $scope.existFile = 0;
                   // $scope.existFile = 1;
                }
            });
        }

        //Funcion para agregar registro
        $scope.add = function () {
            debugger;
            if ($scope.ValidForm.$invalid && false) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if ($scope.AutoresIIE.length == 0 ) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                }
                else {
                    if ($scope.registro.fechaCurso > $scope.registro.fechaTermino) {
                        toastr.error("La fecha de inicio debe ser menor a la de término");
                        return false;
                    } else {

                        if ($scope.registro.perteneceCP == 1) {
                            $scope.registro.perteneceCP = true;
                        } else { $scope.registro.perteneceCP = false; }
                        $scope.desactivar = true;
                        $scope.registro.estadoFlujoId = 1;
                        CursosPersonalServiceMT.add($scope.registro).then(
                            function (result) {
                                var cursoInternoId = result.data.cursoInternoId;
                                for (var iie = 0; iie < $scope.AutoresIIE.length; iie++) {
                                    var Registro = {
                                        "CursoInternoId": cursoInternoId,
                                        "clavePersona": $scope.AutoresIIE[iie].clavePersona,
                                        "nombreCompleto": $scope.AutoresIIE[iie].nombrePersona
                                    }
                                    CursosPersonalServiceMT.AddUser(Registro).then(
                                                        function (result) {
                                                        });
                                }
                              
                                for (var iie = 0; iie < $scope.AutoresExt.length; iie++) {
                                    var Registro = {
                                        "CursoInternoId": cursoInternoId,
                                        "nombreCompleto": $scope.AutoresExt[iie].nombre,
                                        "institucion": $scope.AutoresExt[iie].institucion
                                    }
                                    CursosPersonalServiceMT.AddUserExt(Registro).then(
                                                        function (result) {
                                                        });
                                }

                                for (var files = 0; files < $scope.archivosAdjuntos.length; files++) {
                                    var RegistroFiles = {
                                        "RutaCompleta": $scope.archivosAdjuntos[files].rutaCompleta,
                                        "nombre": $scope.archivosAdjuntos[files].nombre,
                                        "ModuloId": $scope.archivosAdjuntos[files].moduloId,
                                        "CursoInternoId": cursoInternoId
                                    }
                                    CursosPersonalServiceMT.AddFile(RegistroFiles);

                                }
                                for (var sitios = 0; sitios < $scope.sitiosWeb.length; sitios++) {
                                    var RegistroSitios = {
                                        "Url": $scope.sitiosWeb[sitios],
                                        "Descripcion": $scope.sitiosWeb[sitios],
                                        "FechaRegistro": new Date(),
                                        "Autor": $scope.registro.nombrePersona,
                                        "Estado": true,
                                        "CursoInternoId": cursoInternoId
                                    }
                                   
                                    CursosPersonalServiceMT.AddSitios(RegistroSitios);

                                }
                                //for (var files = 0; files < $scope.archivosAdjuntos.length; files++) {
                                //    var RegistroFiles = {
                                //        "RutaCompleta": $scope.archivosAdjuntos[files].rutaCompleta,
                                //        "nombre": $scope.archivosAdjuntos[files].nombre,
                                //        "ModuloId": $scope.archivosAdjuntos[files].moduloId,
                                //        "CursoInternoId": cursoInternoId
                                //    }
                                //    CursosPersonalServiceMT.AddFile(RegistroFiles);
                                //}
                                toastr.success("Registro creado exitosamente!");
                                $state.go("Cursos")
                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);
                            });
                    }
                }
            }
        }

        $scope.add_user = function () {
                    var Registro = {
                        //"publicacionId": $scope.registro.publicacionId,
                        "clavePersona": $scope.autorIIE.clavePersona,
                        //"estado": 1,
                        "nombreCompleto": $scope.autorIIE.nombrePersona
                    }
                    for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                        if ($scope.AutoresIIE[i].clavePersona == Registro.clavePersona) {
                            toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                            $scope.PersonaSeleccionada = null;
                            return false;
                        }
                    }
                    //PublicacionService.AddUser(Registro).then(
                    //                    function (result) {
                    $scope.userAdd = false;
                    //$scope.autorIIE = {};
                    //Registro.autorIIEPublicacionId = result.data.autorIIEPublicacionId;
                    $scope.PersonaSeleccionada = null;
                    $scope.AutoresIIE.push(Registro);
                    //Eliminar del drop
                    //for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                    //    if ($scope.catNum[i].id == Registro.contribucion) {
                    //        $scope.auxColabora.push($scope.catNum[i]);
                    //        $scope.catNum.splice(i, 1);
                    //    }
                    //}
        }


        $scope.add_File = function () {
            $scope.archivosAdjuntos.push($scope.registro.adjunto);
            $scope.registro.adjunto = null;
            $scope.existFile = 0;
        }

        $scope.eliminarFile = function (registro) {
            var idx = ($scope.archivosAdjuntos.indexOf(registro));
            $scope.archivosAdjuntos.splice(idx, 1);
        }

        $scope.eliminarAutor = function (registro) {
            $scope.descripcionRow = registro.nombreCompleto;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {

                        $scope.delete(registro, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.delete = function (registro, $uibModalInstance) {
            //PublicacionService.deleteAutorIIE(registro.autorIIEPublicacionId).then(
            //        function (result) {
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            var idx = ($scope.AutoresIIE.indexOf(registro));
            $scope.AutoresIIE.splice(idx, 1);
            $uibModalInstance.dismiss('close');
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
        //////////////////////////////////////////////////////////////////////////
        $scope.add_userExt = function () {
            //if ($scope.contador < 100) {
            if ($scope.autorExt.nombre != null && $scope.autorExt.institucion) {
                var aux = parseInt($scope.autorExt.contribucion) + parseInt($scope.contador);
                for (var i = 0; i < $scope.AutoresExt.length; i++) {
                    if (($scope.AutoresExt[i].nombre == $scope.autorExt.nombre) && ($scope.AutoresExt[i].institucion == $scope.autorExt.institucion)) {
                        toastr.error("El autor " + $scope.autorExt.nombre + " ya existe dentro de la tabla de autores!");
                        $scope.addExt = true;
                        return false;
                    }
                }
                //$scope.autorExt.publicacionId = $scope.registro.publicacionId;
                //PublicacionService.AddUserExt($scope.autorExt).then(
                //                    function (result) {
                var porcentaje = parseInt($scope.autorExt.contribucion);
                $scope.contador = $scope.contador + porcentaje;
                $scope.addExt = false;
                //$scope.autorExt.autorPublicacionExtId = result.data.autorPublicacionExtId;
                $scope.AutoresExt.push($scope.autorExt);
                //Eliminar del drop
                for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                    if ($scope.catNum[i].id == $scope.autorExt.contribucion) {
                        $scope.auxColabora.push($scope.catNum[i]);
                        $scope.catNum.splice(i, 1);
                    }
                }
                $scope.autorExt = {};

                //});
            } else {
                toastr.error("Complete los datos requeridos del autor externo");
            }
            //} else {
            //    toastr.error("El porcentaje de colaboración supera el 100%");
            //}

        }

        $scope.eliminarAutorExt = function (registro) {
            var porcentaje = parseInt(registro.contribucion);
            $scope.contador = $scope.contador - porcentaje;
            $scope.descripcionRow = registro.nombre;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {

                        $scope.deleteExt(registro, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    var porcentaje = parseInt($scope.autorExt.contribucion);
                    $scope.contador = $scope.contador + porcentaje;
                },
                scope: $scope
            });
        };

        $scope.deleteExt = function (registro, $uibModalInstance) {
            //PublicacionService.deleteAutorExt(registro.autorPublicacionExtId).then(
            //        function (result) {
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            var idx = ($scope.AutoresExt.indexOf(registro));
            $scope.AutoresExt.splice(idx, 1);
            $uibModalInstance.dismiss('close');
            //},
            //function (err) {
            //    toastr.error(err.data.message);
            //});
        };

        $scope.addLiga = function () {
            if ($scope.registro) { //se hace esta comparación para comprobar que no es undefined
                var liga = $scope.registro.descripcionLiga;
                if (liga != "" && liga != undefined) {
                    var idx = $scope.sitiosWeb.indexOf(liga);
                    if (idx > -1) {
                        toastr.error("La Liga de acceso indicada ya se encuentra asociada, indique otra");
                        $scope.registro.descripcionLiga = ''
                    }
                    else {
                        $scope.sitiosWeb.push(liga);
                    }
                }
                else {
                    toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
                }
            } else {
                toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
            }

            /*Nota: No limpio la caja de texto porque como es un dato requerido, 
            si lo regreso a vacio, me marca que debo de 
            poner algo en el input*/
            //$scope.convocatoria.descripcionLiga = "";
        };

        $scope.deleteTask = function (index) {
            $scope.sitiosWeb.splice(index, 1);
        }

        $scope.clean = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }

    }
})();