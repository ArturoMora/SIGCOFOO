(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("capitulosCtrlEdit", ['AuthService', '$scope', '$rootScope', 'CapituloService',
            'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH", "$uibModal",
            "DTOptionsBuilder", capitulosCtrlEdit]);

    function capitulosCtrlEdit(AuthService, $scope, $rootScope, CapituloService,
        globalGet, $state, $filter, $stateParams, uploadFileACH, $uibModal,
        DTOptionsBuilder) {
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR  ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR ESTA EN CH */
        /******NOTA: ESTE ARCHIVO YA NO SE UTILIZA, EL CONTROLADOR ESTA EN CH */
        var API = globalGet.get("api");
        var id = $rootScope.getGlobalID();
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        var d = new Date();
        $scope.anioActual = d.getUTCFullYear();
        $scope.registro = {};
        $scope.paisanterior = "";
        $scope.AutoresIIE = [];
        $scope.auxColabora = [];
        $scope.AutoresExt = [];
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//
        $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        $scope.ClavePersona = AuthService.authentication.userprofile.clavePersona;
        debugger;
        //obtener gradoAcademicos
        //obtener el registro a editar
        $scope.pais = "";
        debugger;
        CapituloService.getbyid(id).then(
            function (result) {
                $scope.paisanterior = result.data.pais;
               
                $scope.autorIIE = {};
                $scope.catNum = [{
                    "id": "1",
                    "descripcion": " 1er"
                }, {
                    "id": "2",
                    "descripcion": " 2do"
                }, {
                    "id": "3",
                    "descripcion": " 3er"
                }, {
                    "id": "4",
                    "descripcion": " 4to"
                }, {
                    "id": "5",
                    "descripcion": " 5to"
                }, {
                    "id": "6",
                    "descripcion": " 6to"
                }, {
                    "id": "7",
                    "descripcion": " 7mo"
                }, {
                    "id": "8",
                    "descripcion": " 8vo"
                }, {
                    "id": "9",
                    "descripcion": " 9no"
                }, {
                    "id": "10",
                    "descripcion": "10mo"
                }];
                $scope.registro = result.data;
             
               
                $scope.registro.claveUnidadAut = $scope.authentication.userprofile.claveUnidad;
               
                $scope.registro.year = $filter('date')($scope.registro.year, 'yyyy')
                try {
                    $scope.registro.year = parseInt($scope.registro.year);
                }catch(error){}
                $scope.pais = parseInt($scope.registro.pais);
                            $scope.AutoresIIE = result.data.autorInternoCapitulo;
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

                    $scope.AutoresExt = result.data.autorExternoCapitulo;
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
                    
                    $scope.editores = result.data.editoresCapitulo;

                    CapituloService.ValidarExistencia($scope.registro.capitulosId).then(function (result) {
                        $scope.validacion = result.data;
                    });

                if ($scope.registro.adjuntoId == null) {
                    $scope.regFile = true;
                } 
                else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }},      
            function (error) {
                toastr.error(error);
            });
            
            CapituloService.getPaises().then(
            function (result) {
                $scope.paises = result.data;
            },
            function (err) {
                toastr.error(err);
            });


        //////////////////////Buscar persona////////////
        $scope.PersonaSeleccionada = {};
        $scope.ModificaPais = function () {
            
            $scope.registro.pais = $scope.pais;
           
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
            console.log("aqui");
            console.log(result);
            $scope.$apply(function () {
                if (result.error === false) {
                   
                    $scope.registro.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        "moduloId": "MT"
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

                        $scope.auxDate = $scope.registro.year;
                
                        var fech = new Date($scope.registro.year, 1, 1);
                        $scope.registro.year = fech;

                      
                        $scope.registro.estadoFlujoId = 1;
                        CapituloService.update($scope.registro).then(
                            function (result) {
                                $scope.registro.year = fech;
                                toastr.success("Registro Actualizado");
                                
                               
                                $scope.desactivar = false;
                                if ($scope.EnviarSolicitud == false) {
                                    $state.reload();
                                }
                                if ($scope.EnviarSolicitud) {
                                    $scope.SetValidar();
                                }
                                
                            },
                            function (err) {
                               
                                $scope.desactivar = false;
                                console.error(err);
                                
                            });
            }
        }
        $scope.EnviarSolicitud = false;
        $scope.validar = function () {
            $scope.EnviarSolicitud = true;
            $scope.update();
 

        }

        $scope.SetValidar = function () {
            debugger;
            $scope.EnviarSolicitud = true;
            try {
                if ($scope.ValidForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    if ($scope.validacion == 0) {
                        var Registro = {
                            "capitulosId": $scope.registro.capitulosId,
                            "estadoFlujoId": 8
                        };
                        //Cambiar el estado del registro
                        debugger;

                        $scope.desactivar = true;
                        CapituloService.updateEstado(Registro).then(
                            function (result) {
                                var Solicitud = {
                                    "ClavePersona": $scope.ClavePersona,
                                    "TipoInformacionId": 19,
                                    "InformacionId": $scope.registro.capitulosId,
                                    "FechaSolicitud": new Date(),
                                    "EstadoFlujoId": 8,
                                    "ClaveUnidadAut": $scope.registro.claveUnidadAut
                                }

                                CapituloService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.ClavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }
                                        CapituloService.AddBitacoraSolicitud(Bitacora);

                                        var Mail = {
                                            "Modulo": "Memoria Tecnológica",
                                            "Empleado": $scope.nombreEmpleado,
                                            "Seccion": "Capítulo",
                                            "TipoCorreo": "SolicitudGerente",
                                            "ClavePersona": $scope.ClavePersona,
                                            "Descripcion1": 1
                                        }
                                        CapituloService.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        debugger;
                                        $state.go("Capitulos");
                                    })
                            },
                            function (err) {
                                debugger;
                                $scope.desactivar = false;
                                console.error(err);
                            });

                    } else {
                        debugger;
                        var Registro = {
                            "capitulosId": $scope.registro.capitulosId,
                            "estadoFlujoId": 2
                        };
                        //Cambiar el estado del registro
                        CapituloService.updateEstado(Registro).then(
                            function (result) {
                                var Solicitud = {
                                    "ClavePersona": $scope.ClavePersona,
                                    "TipoInformacionId": 19,
                                    "InformacionId": $scope.registro.capitulosId,
                                    "FechaSolicitud": new Date(),
                                    "EstadoFlujoId": 2
                                }
                                CapituloService.AddSolicitud(Solicitud).then(
                                    function (result) {
                                        var Bitacora = {
                                            "SolicitudId": result.data,
                                            //"FechaMovimiento": new Date('dd/MM/yyyy'),
                                            "FechaMovimiento": new Date(),
                                            "ClavePersona": $scope.ClavePersona,
                                            "Descripcion": "Se envió la solicitud",
                                            "EstadoFlujoId": 1
                                        }

                                        CapituloService.AddBitacoraSolicitud(Bitacora);
                                        var Mail = {
                                            "Modulo": "Memoria Tecnológica",
                                            "Empleado": $scope.nombreEmpleado,
                                            "Seccion": "Capítulo",
                                            "TipoCorreo": 1,
                                            "ClavePersona": $scope.ClavePersona,
                                        }
                                        CapituloService.mailNotificacion(Mail);
                                        toastr.success("Solicitud Enviada!");
                                        $state.go("Capitulos");
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
            CapituloService.update($scope.registro);
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
                    "capitulosId": $scope.registro.capitulosId,
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
                CapituloService.AddUser(Registro).then(
                                    function (result) {
                                        
                                        $scope.userAdd = false;
                                        $scope.autorIIE = {};
                                       
                                        $scope.PersonaSeleccionada = null;
                                        Registro.autorInternoCapituloId = result.data.autorInternoCapituloId; //se setea su id una vez guardado
                                        $scope.AutoresIIE.push(Registro);
                                                                               
                                        for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                                            if ($scope.catNum[i].id == Registro.contribucion) {
                                                $scope.auxColabora.push($scope.catNum[i]);
                                                $scope.catNum.splice(i, 1);
                                            }
                                        }

                    },
                                    function (error) {
                                        //toastr
                                    }
                );


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
                        //$state.reload();
                    };
                },
                scope: $scope
            });
        };
       
        $scope.delete = function (registro, $uibModalInstance) {
            
            //alert(registro.autorInternoCapituloId);
            if (registro.autorInternoCapituloId == undefined || registro.autorInternoCapituloId == null) {                
                $scope.eliminacionLocal(registro);
                $uibModalInstance.dismiss('close');
            }else{
            CapituloService.deleteAutorIIE(registro.autorInternoCapituloId).then(
                function (result) {
                    $uibModalInstance.dismiss('close');
                    $scope.eliminacionLocal(registro);
                    },
                function (err) {
                    $uibModalInstance.dismiss('close');
                    $scope.message = "Se present&oacute; un error, desea recargar la vista actual <br/> <strong> se perder&aacute;n sus cambios actuales</strong>";
                    var modalInstance = $uibModal.open({
                        templateUrl: 'app/vistasGenericas/Confirmacion.html',
                        controller: 'ConfirmacionContinueCtrl',
                        scope: $scope
                    });
                });
            }
        };

        $scope.eliminacionLocal = function (registro) {
            try {
                for (var i = 0; i < $scope.auxColabora.length; i++) {
                    if ($scope.auxColabora[i].id == registro.contribucion) {
                        $scope.catNum.push($scope.auxColabora[i]);
                    }
                }
                var idx = ($scope.AutoresIIE.indexOf(registro));
                $scope.AutoresIIE.splice(idx, 1);
            } catch (e) { }
        }


        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }


        //////////////////////////////////////////////////////////////////////////
        $scope.add_userExt = function () {
            if ($scope.autorExt.nombre != null && $scope.autorExt.institucion != null && $scope.autorExt.contribucion != undefined) {
                $scope.autorExt.capitulosId = $scope.registro.capitulosId;

                for (var i = 0; i < $scope.AutoresExt.length; i++) {
                    if (($scope.AutoresExt[i].nombre == $scope.autorExt.nombre) && ($scope.AutoresExt[i].institucion == $scope.autorExt.institucion)) {
                        toastr.error("El autor " + $scope.autorExt.nombre + " ya existe dentro de la tabla de autores!");
                        $scope.addExt = true;
                        $scope.autorExt = {};
                        return false;
                    }
                }
                CapituloService.AddUserExt($scope.autorExt).then(
                                    function (result) {
                                        $scope.addExt = false;
                                        $scope.autorExt = result.data;
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
            
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            var idx = ($scope.AutoresExt.indexOf(registro));
            $scope.AutoresExt.splice(idx, 1);

            if (registro.autorExternoCapituloId == undefined || registro.autorExternoCapituloId == null) {
                $uibModalInstance.dismiss('close');
            } else {

            CapituloService.deleteAutorExt(registro.autorExternoCapituloId).then(
                function (result) {
                    $uibModalInstance.dismiss('close');

                },
                function (err) {
                    $uibModalInstance.dismiss('close');
                    $scope.message = "Se present&oacute; un error, desea recargar la vista actual <br/> <strong> se perder&aacute;n sus cambios actuales</strong>";
                    var modalInstance = $uibModal.open({
                        templateUrl: 'app/vistasGenericas/Confirmacion.html',
                        controller: 'ConfirmacionContinueCtrl',
                        scope: $scope
                    });
                });
        }
        };

        $scope.addEditor = function () {
            
            if ($scope.descripcioneditor) { //se hace esta comparación para comprobar que no es undefined
              
                var idx=-1
                var editor = $scope.descripcioneditor;
                if (editor != "" && editor != undefined) {
                    if (!($scope.editores == undefined && $scope.editores == null)){
                        for (var cont = 0; cont < $scope.editores.length; cont++) {
                            if ($scope.editores[cont].editor_Nombre == editor) {
                                idx = 1;
                            }
                        }
                    } else {
                        $scope.editores = [];
                    }
                    //var idx = $scope.editores.indexOf(editor);
                    if (idx > -1) {
                        toastr.error("El editor ya se encuentra asociado, indique otro");
                        $scope.registro.descripcioneditor = ''
                    }
                    else {
                        
                        var Registro = {
                            "editoresCapituloId" : 0,
                            "capitulosId":$scope.registro.capitulosId,
                            "editor_Nombre": editor
                        }

                        CapituloService.AddEditor(Registro).then(
                            function (result) {
                                Registro.editoresCapituloId = result.data.editoresCapituloId;
                                $scope.editores.push(Registro);
                            },
                            function (error) { console.log(error);}
                        );
                        $scope.descripcioneditor = "";
                    }
                }
                else {
                    toastr.error("Se requiere un editor");
                }
            } else {
                toastr.error("Se requiere un editor");
            }
            $scope.descripcioneditor = "";
        };


        $scope.add_File = function () {
           
            var RegistroFiles = {
                "RutaCompleta": $scope.registro.adjunto.rutaCompleta,
                "nombre": $scope.registro.adjunto.nombre,
                "ModuloId": $scope.registro.adjunto.moduloId,
                "CapitulosId": $scope.registro.capitulosId
            }
           
        }


        $scope.eliminarEditor = function (registro) {
            $scope.descripcionRow = registro.nombre;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {

                        $scope.deleteEditor(registro, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.deleteEditor = function (registro, $uibModalInstance) {
            debugger;
            var idx = ($scope.editores.indexOf(registro));
            $scope.editores.splice(idx, 1);
            if (registro.editoresCapituloId == undefined || registro.editoresCapituloId==null) {
                $uibModalInstance.dismiss('close');
            } else {

            
            CapituloService.deleteEditor(registro.editoresCapituloId).then(
                    function (result) {
                        $uibModalInstance.dismiss('close');
                        
                    },
                    function (err) {
                        //toastr.error(err.data.message);
                        $uibModalInstance.dismiss('close');
                        $scope.message = "Se present&oacute; un error, desea recargar la vista actual <br/> <strong> se perder&aacute;n sus cambios actuales</strong>";
                        var modalInstance = $uibModal.open({
                            templateUrl: 'app/vistasGenericas/Confirmacion.html',
                            controller: 'ConfirmacionContinueCtrl',
                            scope: $scope
                        });
                        
                    });
            }
        };
        $scope.continueFunction = function () {
            $state.reload();
        }


    }
})();