(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("publicacionCtrlEdit", ['AuthService', '$scope', '$rootScope', 'PublicacionService',  'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH", "$uibModal", "DTOptionsBuilder", publicacionCtrlEdit]);

    function publicacionCtrlEdit(AuthService, $scope, $rootScope, PublicacionService, globalGet, $state, $filter, $stateParams, uploadFileACH, $uibModal, DTOptionsBuilder) {
        
        var API = globalGet.get("api");
        var id = $rootScope.getGlobalID();
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });

        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR PARA AGREGAR PUBLICACIONES ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR PARA AGREGAR PUBLICACIONES ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR PARA AGREGAR PUBLICACIONES ESTA EN CH */
        alert('foo');
        $scope.registro = {};
        $scope.AutoresIIE = [];
        $scope.auxColabora = [];
        $scope.AutoresExt = [];
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //$scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        //obtener gradoAcademicos
        //obtener el registro a editar
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);


        PublicacionService.getbyid(id).then(
            function (result) {
                PublicacionService.Persona(result.data.clavePersona).then(
                    function (result) {
                        $scope.registro.nombrePersona = result.data.nombreCompleto;
                        $scope.registro.claveUnidadAut = $scope.authentication.userprofile.claveUnidad;
                    });
                $scope.autorIIE = {};
                $scope.catNum = [{
                    "id": "1",
                    "descripcion": " 1er",
                    "lugar": 1
                }, {
                    "id": "2",
                    "descripcion": " 2do",
                    "lugar": 2
                }, {
                    "id": "3",
                    "descripcion": " 3er",
                    "lugar": 3
                }, {
                    "id": "4",
                    "descripcion": " 4to",
                    "lugar": 4
                }, {
                    "id": "5",
                    "descripcion": " 5to",
                    "lugar": 5
                }, {
                    "id": "6",
                    "descripcion": " 6to",
                    "lugar": 6
                }, {
                    "id": "7",
                    "descripcion": " 7mo",
                    "lugar": 7
                }, {
                    "id": "8",
                    "descripcion": " 8vo",
                    "lugar": 8
                }, {
                    "id": "9",
                    "descripcion": " 9no",
                    "lugar": 9
                }, {
                    "id": "10",
                    "descripcion": "10mo",
                    "lugar": 10
                }];
                $scope.registro = result.data;
                PublicacionService.ValidarExistencia($scope.registro.publicacionId).then(function (result) {
                    $scope.validacion = result.data;
                });
                if ($scope.registro.proyecto != null) {
                    $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                }
                $scope.registro.revistaSelect = $scope.registro.revista;
                $scope.registro.revistanombreSelect = $scope.registro.revista.revistaNombre;
                $scope.registro.fechaPublicacion = new Date($scope.registro.fechaPublicacion);
                var array = $scope.registro.paginas.split('-');
                $scope.registro.paginasde = array[0];
                $scope.registro.paginashasta = array[1];
                $scope.registro.fechaInicio = new Date($scope.registro.fechaInicio);
                if ($scope.registro.fechaTermino != null) {
                    $scope.registro.fechaTermino = new Date($scope.registro.fechaTermino);
                }

                if ($scope.registro.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
                var count = 1;
                PublicacionService.getByPublicacion($scope.registro.publicacionId).then(
                    function (result) {
                        $scope.AutoresIIE = result.data;
                        for (var p = 0; p < $scope.AutoresIIE.length; p++) {
                            var auxCat = $scope.catNum.length;
                            var x = 0;
                            do {
                                var aux = "" + $scope.AutoresIIE[p].contribucion + "";
                                if ($scope.catNum[x].id == aux) {
                                    $scope.r = $scope.catNum[x].id;
                                    $scope.auxColabora.push($scope.catNum[x]);
                                    $scope.catNum.splice(x, 1);
                                } else { x++ }

                            } while ($scope.r != aux);
                        }
                    });
                PublicacionService.getByPublicacionExt($scope.registro.publicacionId).then(
                    function (result) {
                        $scope.AutoresExt = result.data;
                        for (var p = 0; p < $scope.AutoresExt.length; p++) {
                            var auxCat = $scope.catNum.length;
                            var x = 0;
                            do {
                                var aux = "" + $scope.AutoresExt[p].contribucion + "";
                                if ($scope.catNum[x].id == aux) {
                                    $scope.r = $scope.catNum[x].id;
                                    $scope.auxColabora.push($scope.catNum[x]);
                                    $scope.catNum.splice(x, 1);
                                } else { x++ }

                            } while ($scope.r != aux);
                        }
                    });
            },
            function (error) {
                toastr.error(error);
            });
        PublicacionService.getRevistas().then(
            function (result) {
                $scope.revistas = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de revistas.");
            }
        );

        PublicacionService.getAmbitos().then(
            function (result) {
                $scope.ambitos = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Ambitos.");
            }
        );
        PublicacionService.getNiveles().then(
            function (result) {
                $scope.niveles = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Niveles de Publicacion.");
            }
        );
        PublicacionService.getEstados().then(
            function (result) {
                $scope.publicaciones = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Estados de Publicacion.");
            }
        );
        //////////////////////Buscar persona////////////

        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.finalDateComparacion = new Date($scope.registro.fechaPublicacion);
            if ($scope.finalDateComparacion > $scope.fechaActual) {
                toastr.error("Fecha de publicación deber ser menor a la de hoy");
                $scope.registro.fechaPublicacion = "";
                return false;
            };

            $scope.minimo = new Date("1975/11/25");
            if ($scope.finalDateComparacion < $scope.minimo) {
                toastr.error("Fecha de publicación deber ser mayor a 25/11/1975");
                $scope.registro.fechaPublicacion = "";
                return false;
            };
        }

        $scope.openRevistas = function () {
            $scope.desabilitar = true;
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listarevistas.html',
                controller: 'listarevistasCtrl',
                resolve: {
                    proyectoSelect: function () {
                        $scope.verproyecto = false;
                        return $scope.proyectoSelect;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.registro.revistaSelect = selectedItem;
                $scope.registro.revistanombreSelect = selectedItem.revistaNombre;
            });
            $scope.desabilitar = false;
        }

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
            });
        }
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
            $scope.files = null;
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            $scope.archivos = adjunto.files.length;
            debugger;
            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "pdf;doc;docx;", /* pdf;doc;docx;ppt */
                type: '*', /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            uploadFileACH.upload(propiedades,
                function (err, result) {
                   
                    if (!err) {
                        console.log("result:");
                        console.log(result);
                        
                        if (!result.error) {
                            transferComplete(result);
                        } else {
                            toastr.error(result.message);
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        toastr.error(error);
                    }
                   
                });
        };
        function transferComplete(result) {
           
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
                }
            });
            
        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////
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
        //Funcion para agregar registro
        $scope.espere = false;
        $scope.update = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                
                if ($scope.AutoresIIE.length == 0) {
                    toastr.error("Ingrese al menos un autor interno.");
                    return false;
                }
                if ($scope.registro.revistaSelect != undefined) {

                    
                 
                    var val1 = $scope.registro.paginasde;
                    var val2 = $scope.registro.paginashasta;
                   
                    if (val1 !== val2) {

                        if (parseInt($scope.registro.paginasde) >= parseInt($scope.registro.paginashasta)) {
                            toastr.error("Rango de páginas incorrecto");
                            return false;
                        }
                    }
                   

                    $scope.desactivar = true;
                    $scope.registro.revistaId = $scope.registro.revistaSelect.revistaId;
                    $scope.registro.paginas = $scope.registro.paginasde + "-" + $scope.registro.paginashasta;
                    $scope.registro.estadoFlujoId = 1;
                    $scope.espere = true;
                    PublicacionService.update($scope.registro).then(
                        function (result) {
                            $scope.espere = false;
                            if (result.data.adjuntoId != null) {
                                $scope.registro.adjunto.adjuntoId = result.data.adjuntoId;
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
                            //$state.go("fichapersonal.publicacion", { seccion: 'publicacion' });
                            $scope.desactivar = false;
                        },
                        function (err) {
                            $scope.espere = false;
                            $scope.desactivar = false;
                            console.error(err);
                        });
                } else { toastr.error("Selecciones una Revista!"); }
            }
        }
        $scope.validar = function () {
            try {
                if ($scope.ValidForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {

                    if ($scope.AutoresIIE.length == 0) {
                        toastr.error("Ingrese al menos un autor interno.");
                        return false;
                    }
                    //////////////Verificar si ya fue rechazada para saltarse al gerenete
                    if ($scope.validacion == 0) {
                        $scope.update();
                        //////////////
                        var Registro = {
                            "publicacionId": $scope.registro.publicacionId,
                            "estadoFlujoId": 8
                        };
                        //Cambiar el estado del registro
                        $scope.desactivar = true;
                        PublicacionService.updateEstado(Registro).then(
                            function (result) {
                                var Solicitud = {
                                    "ClavePersona": $scope.registro.clavePersona,
                                    "TipoInformacionId": 11,
                                    "InformacionId": $scope.registro.publicacionId,
                                    "FechaSolicitud": new Date(),
                                    "EstadoFlujoId": 8,
                                    "ClaveUnidadAut": $scope.registro.claveUnidadAut
                                }
                                PublicacionService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            //"FechaMovimiento": new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' }),
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        PublicacionService.AddBitacoraSolicitud(Bitacora);
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registro.nombrePersona,
                                            "Seccion": "Artículos",
                                            "TipoCorreo": "SolicitudGerente",
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion1": 1
                                        }
                                        PublicacionService.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        $state.go("Publicaciones");
                                    })
                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);
                            });
                    } else {
                        var Registro = {
                            "publicacionId": $scope.registro.publicacionId,
                            "estadoFlujoId": 2
                        };
                        //Cambiar el estado del registro
                        PublicacionService.updateEstado(Registro).then(
                            function (result) {
                                var Solicitud = {
                                    "ClavePersona": $scope.registro.clavePersona,
                                    "TipoInformacionId": 11,
                                    "InformacionId": $scope.registro.publicacionId,
                                    "FechaSolicitud": new Date(),
                                    "EstadoFlujoId": 2
                                }
                                PublicacionService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            //"FechaMovimiento": new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' }),
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }

                                        PublicacionService.AddBitacoraSolicitud(Bitacora);
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registro.nombrePersona,
                                            "Seccion": "Artículos",
                                            "TipoCorreo": 1,
                                            "ClavePersona": $scope.registro.clavePersona,
                                        }
                                        PublicacionService.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        $state.go("Publicaciones");
                                    })
                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);
                            });
                    }
                }
            } catch (e) {
                console.log(e);
                throw e;
            }

        }

        $scope.deleteFile = function () {
            $scope.registro.adjunto.nombre = "eliminar";
            PublicacionService.update($scope.registro);
            toastr.success("Archivo Eliminado!");
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
        }

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }

        $scope.add_user = function () {
            if ($scope.autorIIE.contribucion != undefined) {
                var Registro = {
                    "publicacionId": $scope.registro.publicacionId,
                    "clavePersona": $scope.autorIIE.clavePersona,
                    "contribucion": $scope.autorIIE.contribucion,
                    "estado": 1,
                    "nombreCompleto": $scope.autorIIE.nombrePersona

                }

                for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                    if ($scope.AutoresIIE[i].clavePersona == Registro.clavePersona) {
                        toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                        $scope.autorIIE = {};
                        return false;
                    }
                }
                PublicacionService.AddUser(Registro).then(
                    function (result) {
                        $scope.userAdd = false;
                        $scope.autorIIE = {};
                        Registro.autorIIEPublicacionId = result.data.autorIIEPublicacionId;
                        $scope.PersonaSeleccionada = null;
                        $scope.AutoresIIE.push(Registro);

                        //Eliminar del drop
                        for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                            if ($scope.catNum[i].id == Registro.contribucion) {
                                $scope.auxColabora.push($scope.catNum[i]);
                                $scope.catNum.splice(i, 1);
                            }
                        }

                    });


            } else {
                toastr.error("Complete los datos requeridos del autor");
            }

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
            PublicacionService.deleteAutorIIE(registro.autorIIEPublicacionId).then(
                function (result) {
                    for (var i = 0; i < $scope.auxColabora.length; i++) {
                        if ($scope.auxColabora[i].id == registro.contribucion) {
                            $scope.catNum.push($scope.auxColabora[i]);
                        }
                    }
                    var idx = ($scope.AutoresIIE.indexOf(registro));
                    $scope.AutoresIIE.splice(idx, 1);
                    $uibModalInstance.dismiss('close');
                },
                function (err) {
                    toastr.error(err.data.message);
                });
        };

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }
        //////////////////////////////////////////////////////////////////////////
        $scope.add_userExt = function () {
            if ($scope.autorExt.nombre != null && $scope.autorExt.institucion != null && $scope.autorExt.contribucion != undefined) {
                $scope.autorExt.publicacionId = $scope.registro.publicacionId;
                for (var i = 0; i < $scope.AutoresExt.length; i++) {
                    if (($scope.AutoresExt[i].nombre == $scope.autorExt.nombre) && ($scope.AutoresExt[i].institucion == $scope.autorExt.institucion)) {
                        toastr.error("El autor " + $scope.autorExt.nombre + " ya existe dentro de la tabla de autores!");
                        $scope.addExt = true;
                        $scope.autorExt = {};
                        return false;
                    }
                }
                PublicacionService.AddUserExt($scope.autorExt).then(
                    function (result) {
                        $scope.addExt = false;
                        $scope.autorExt.autorPublicacionExtId = result.data.autorPublicacionExtId;
                        $scope.AutoresExt.push($scope.autorExt);
                        //Eliminar del drop
                        for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                            if ($scope.catNum[i].id == $scope.autorExt.contribucion) {
                                $scope.auxColabora.push($scope.catNum[i]);
                                $scope.catNum.splice(i, 1);
                            }
                        }
                        $scope.autorExt = {};

                    });
            } else {
                toastr.error("Complete los datos requeridos del autor externo");
            }
        }

        $scope.eliminarAutorExt = function (registro) {
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
                },
                scope: $scope
            });
        };

        $scope.deleteExt = function (registro, $uibModalInstance) {
            PublicacionService.deleteAutorExt(registro.autorPublicacionExtId).then(
                function (result) {
                    for (var i = 0; i < $scope.auxColabora.length; i++) {
                        if ($scope.auxColabora[i].id == registro.contribucion) {
                            $scope.catNum.push($scope.auxColabora[i]);
                        }
                    }
                    var idx = ($scope.AutoresExt.indexOf(registro));
                    $scope.AutoresExt.splice(idx, 1);
                    $uibModalInstance.dismiss('close');
                },
                function (err) {
                    toastr.error(err.data.message);
                });
        };
        $scope.clean = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }
    }
})();