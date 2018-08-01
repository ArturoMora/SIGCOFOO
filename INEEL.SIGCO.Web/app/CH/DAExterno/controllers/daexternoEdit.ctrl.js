(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("daexternoCtrlEdit", ['AuthService', '$scope','$rootScope', 'DAExternoService', 'globalGet', '$state', '$filter', "$stateParams", "FileUploader", "uploadFileACH", "$uibModal", "DTOptionsBuilder", daexternoCtrlEdit]);

    function daexternoCtrlEdit(AuthService, $scope, $rootScope, DAExternoService, globalGet, $state, $filter, $stateParams, FileUploader, uploadFileACH, $uibModal, DTOptionsBuilder) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });


        window.scrollTo(0, 0);
        $scope.editarGestion = 0;
        $scope.idGF = $rootScope.GestionFichasClave;
        if ($scope.idGF != null) {
            $scope.editarGestion = 1;
        }
        var API = globalGet.get("api");
        //var id = $rootScope.idG;
        var id = $rootScope.getGlobalID();
        $scope.registro = {};
        $scope.AutoresIIE = [];
        $scope.auxColabora = [];
        $scope.AutoresExt = [];
        $scope.contador = 0;
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        //$scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        //obtener gradoAcademicos
        //obtener el registro a editar
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);


        DAExternoService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
                DAExternoService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombrePersona = result.data.nombreCompleto;
                });
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
                
                if ($scope.registro.fechaCertificado != null) {
                    $scope.registro.fechaCertificado = new Date($scope.registro.fechaCertificado);
                }

                if ($scope.registro.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
                DAExternoService.getByDAExterno($scope.registro.daExternoId).then(
                function (result) {
                    $scope.AutoresIIE = result.data;
                    for (var i = 0; i < $scope.AutoresIIE.length;i++){
                        $scope.contador = $scope.contador + $scope.AutoresIIE[i].contribucion;
                    }        

                });
                DAExternoService.getByDAExternoExt($scope.registro.daExternoId).then(
                function (result) {
                    $scope.AutoresExt = result.data;
                    for (var i = 0; i < $scope.AutoresExt.length; i++) {
                        $scope.contador = $scope.contador + $scope.AutoresExt[i].contribucion;
                    }
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
        DAExternoService.getRamas().then(
             function (result) {
                 $scope.ramas = result.data;
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de revistas.");
            }
            );

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
            });
        }
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
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
                }
            });
          
        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        //Funcion para agregar registro
        $scope.update = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                //if ($scope.registro.fechaCertificado > $scope.hoy) {
                //    toastr.error("La fecha de certificación debe estar comprendida hasta " + $scope.hoyString);
                //    return false;
                //}
                if ($scope.AutoresIIE.length == 0) {
                    toastr.error("Ingrese al menos un autor interno.");
                    return false;
                }
                $scope.desactivar = true;
                if ($scope.editarGestion == 0) {
                    $scope.registro.estadoFlujoId = 1;
                }
                    DAExternoService.update($scope.registro).then(
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
                            $scope.desactivar = false;
                        },
                        function (err) {
                            $scope.desactivar = false;
                            console.error(err);
                        });
            }
        }
        $scope.validar = function () {
            try {
                if ($scope.ValidForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    $scope.hoy = new Date();
                    $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                    //if ($scope.registro.fechaCertificado > $scope.hoy) {
                    //    toastr.error("La fecha de certificación debe estar comprendida hasta " + $scope.hoyString);
                    //    return false;
                    //}
                    if ($scope.AutoresIIE.length == 0) {
                        toastr.error("Ingrese al menos un autor interno.");
                        return false;
                    }
                    var Registro = {
                        "DAExternoId": $scope.registro.daExternoId,
                        "estadoFlujoId": 2
                    };
                    //$scope.update();
                    //Cambiar el estado del registro
                    $scope.desactivar = true;
                    $scope.registro.estadoFlujoId = 2;
                    DAExternoService.update($scope.registro).then(
                                    function (result) {
                                        var Solicitud = {
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "TipoInformacionId": 15,
                                            "InformacionId": $scope.registro.daExternoId,
                                            "FechaSolicitud": new Date(),
                                            "EstadoFlujoId": 2,
                                            "titulo": $scope.registro.titulo
                                        }
                                        DAExternoService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.registro.clavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        DAExternoService.AddBitacoraSolicitud(Bitacora);
                                        ////////////////
                                        var Mail = {
                                            "Modulo": "Capital Humano",
                                            "Empleado": $scope.registro.nombrePersona,
                                            "Seccion": "Derechos de Autor",
                                            "TipoCorreo": 1,
                                            "ClavePersona": $scope.registro.clavePersona
                                        }
                                        DAExternoService.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        $state.go("fichapersonal.daexterno", { seccion: 'daexterno' });
                                    })
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
            DAExternoService.update($scope.registro);
            toastr.success("Archivo Eliminado!");
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

        $scope.add_user = function () {
            if ($scope.autorIIE.contribucion != undefined) {
                var aux = parseInt($scope.autorIIE.contribucion) + parseInt($scope.contador);
                if (aux <= 100) {
                    var porcentaje = parseInt($scope.autorIIE.contribucion);
                    $scope.contador = $scope.contador + porcentaje;
                    var Registro = {
                        "DAExternoId": $scope.registro.daExternoId,
                        "clavePersona": $scope.autorIIE.clavePersona,
                        "contribucion": $scope.autorIIE.contribucion,
                        "estado": 1,
                        "nombreCompleto": $scope.autorIIE.nombrePersona

                    }
                    for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                        if ($scope.AutoresIIE[i].clavePersona == Registro.clavePersona) {
                            toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                            $scope.contador = $scope.contador - porcentaje;
                            return false;
                        }
                    }
                    DAExternoService.AddUser(Registro).then(
                                        function (result) {
                                            $scope.userAdd = false;
                                            $scope.autorIIE = {};
                                            Registro.autoresIntDAId = result.data.autoresIntDAId;
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
                    toastr.error("El porcentaje de colaboración supera el 100%");
                }
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
            DAExternoService.deleteAutorIIE(registro.autoresIntDAId).then(
                    function (result) {
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
                var aux = parseInt($scope.autorExt.contribucion) + parseInt($scope.contador);
                if (aux <= 100) {
                    $scope.autorExt.daExternoId = $scope.registro.daExternoId;
                    for (var i = 0; i < $scope.AutoresExt.length; i++) {
                        if (($scope.AutoresExt[i].nombre == $scope.autorExt.nombre) && ($scope.AutoresExt[i].institucion && $scope.autorExt.institucion)) {
                            toastr.error("El autor " + $scope.autorExt.nombre + " ya existe dentro de la tabla de autores!");
                            $scope.addExt = true;
                            return false;
                        }
                    }
                DAExternoService.AddUserExt($scope.autorExt).then(
                                    function (result) {
                                        var porcentaje = parseInt($scope.autorExt.contribucion);
                                        $scope.contador = $scope.contador + porcentaje;
                                        $scope.addExt = false;
                                        $scope.autorExt.autoresExtDAId = result.data.autoresExtDAId;
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
                    toastr.error("El porcentaje de colaboración supera el 100%");
                }
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
            DAExternoService.deleteAutorExt(registro.autoresExtDAId).then(
                    function (result) {
                        for (var i = 0; i < $scope.auxColabora.length; i++) {
                            if ($scope.auxColabora[i].id == registro.contribucion) {
                                $scope.catNum.push($scope.auxColabora[i]);
                            }
                        }
                        var idx = ($scope.AutoresExt.indexOf(registro));
                        $scope.AutoresExt.splice(idx, 1);
                        $uibModalInstance.dismiss('close');
                        var porcentaje = parseInt(registro.contribucion);
                        $scope.contador = $scope.contador - porcentaje;
                    },
                    function (err) {
                        toastr.error(err.data.message);
                    });
        };



    }
})();