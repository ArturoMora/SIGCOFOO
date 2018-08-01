(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .directive('numbersOnly', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attr, ngModelCtrl) {
                    function fromUser(text) {
                        if (text) {
                            var transformedInput = text.replace(/[^0-9]/g, '');

                            if (transformedInput !== text) {
                                ngModelCtrl.$setViewValue(transformedInput);
                                ngModelCtrl.$render();
                            }
                            return transformedInput;
                        }
                        return undefined;
                    }
                    ngModelCtrl.$parsers.push(fromUser);
                }
            };
        })
        .controller("ponenciaCtrlAdd"
            , ['$rootScope','AuthService'
            , '$scope'
            , 'PonenciaService'
            , 'globalGet'
            , 'uploadFileACH'
            , '$state'
            , '$filter'
            , '$uibModal'
            , 'DTOptionsBuilder'
            , ponenciaCtrlAdd]);
    function ponenciaCtrlAdd($rootScope,AuthService, $scope, PonenciaService, globalGet, uploadFileACH, $state, $filter, $uibModal, DTOptionsBuilder) {
        //Variable API
        window.scrollTo(0, 0);
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
        $scope.pais = '';
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        var origenCH = $rootScope.getOrigen() == 'CH' ? true : false;
        $scope.registro = {};
        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;
        if ($scope.idGF == null) {
            $scope.registro.clavePersona = AuthService.authentication.userprofile.clavePersona;
            $scope.registro.nombrePersona = AuthService.authentication.nombreCompleto;
        } else {
            $scope.registro.clavePersona = $scope.idGF;
            $scope.registro.nombrePersona = $scope.nomGF;
        }


        $scope.regresar=function(){
            $state.go("fichapersonal.ponencia", { seccion: 'ponencia' });
        }
       
        $scope.autorIIE = {};
        $scope.autorIIE.contribucion = "1";
        $scope.autorIIE.clavePersona = $scope.registro.clavePersona;
        $scope.autorIIE.nombrePersona = $scope.registro.nombrePersona;

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

        
        

        PonenciaService.getPaises().then(
             function (result) {
                 $scope.paises = result.data;
             },
             function (err) {
                 toastr.error(err);
             });

        PonenciaService.getCongresos().then(
             function (result) {
                 $scope.congresos = result.data;
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de congresos.");
            }
            );

        PonenciaService.getAmbitos().then(
             function (result) {
                 $scope.ambitos = result.data;
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Ambitos.");
            }
            );
        PonenciaService.getNiveles().then(
             function (result) {
                 $scope.niveles = result.data;
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Niveles de ponencia.");
            }
            );
        PonenciaService.getEstados().then(
             function (result) {
                 $scope.ponencias = result.data;
                 $scope.add_user();
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Estados de ponencia.");
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
                $scope.ValidForm.$setDirty();
            });
        }

        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.finalDateComparacion = new Date($scope.registro.fechaInicio);
            if ($scope.finalDateComparacion > $scope.fechaActual) {
                toastr.error("Fecha de inicio del congreso deber ser menor a la de hoy");
                $scope.registro.fechaInicio = "";
                return false;
            }
            $scope.registro.year = $scope.finalDateComparacion.getFullYear();
        }

         $scope.openCongresos = function () {
            $scope.desabilitar = true;
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listacongresos.html',
                controller: 'listacongresosCtrl',
                resolve: {
                    proyectoSelect: function () {
                        $scope.verproyecto = false;
                        return $scope.proyectoSelect;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.registro.congresoSelect = selectedItem;
                $scope.registro.congresonombreSelect = selectedItem.nombreCongreso;
                $scope.ValidForm.$setDirty();
            });
            $scope.desabilitar = false;
        }

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
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
        
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            
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
                    $scope.registro.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.ValidForm.$setDirty();
                }
            });
            
        }
        
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        
        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        $scope.counter = 0;
        $scope.change = function () {
            $scope.counter++;
        };
        //Funcion para agregar registro
        $scope.add = function () {
            if ($scope.AutoresIIE.length < 1) {
                toastr.error("y de clic en el bot&oacute;n de confirmar", "Indique por lo menos a un autor");
                return;
            }
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                
                //<<<<<<< HEAD
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                if ($scope.registro.fechaInicio > $scope.hoy) {
                    toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                var de = parseInt($scope.registro.paginasde);
                var hasta = parseInt($scope.registro.paginashasta);
                if (de >= hasta) {
                    toastr.error("Rango de páginas incorrecto");
                    return false;
                }
                //=======
                //                $scope.registro.lugarCongreso = $scope.paises[$scope.pais - 1].descripcion;
                //>>>>>>> refs/remotes/origin/desarrollo/todos
                //if ($scope.registro.year.length == 4) {
                //    var anioActual = new Date().getFullYear();
                //    if ($scope.registro.year > anioActual) {
                //        toastr.error("El año no debe ser mayor a "+anioActual);
                //        return false;
                //    }
                   

                    if ($scope.registro.congresoSelect != undefined) {
                        $scope.registro.paisID = $scope.pais;
                        $scope.desactivar = true;
                        $scope.registro.congresoId = $scope.registro.congresoSelect.congresoId;
                        $scope.registro.paginas = $scope.registro.paginasde + "-" + $scope.registro.paginashasta;
                        $scope.registro.estadoFlujoId = 1;
                        $scope.registro.estadoActivoId = 1;
                        PonenciaService.add($scope.registro).then(
                            function (result) {
                                var idPonencia = result.data.ponenciaId;
                                for (var iie = 0; iie < $scope.AutoresIIE.length; iie++) {
                                    var Registro = {
                                        "ponenciaId": idPonencia,
                                        "clavePersona": $scope.AutoresIIE[iie].clavePersona,
                                        "contribucion": $scope.AutoresIIE[iie].contribucion,
                                        "estado": 1,
                                        "nombreCompleto": $scope.AutoresIIE[iie].nombrePersona
                                    }
                                    PonenciaService.AddUser(Registro).then(
                                                        function (result) {
                                                        });
                                }

                                for (var ext = 0; ext < $scope.AutoresExt.length; ext++) {
                                    $scope.AutoresExt[ext].ponenciaId = idPonencia;
                                    PonenciaService.AddUserExt($scope.AutoresExt[ext]).then(
                                                        function (result) {
                                                        });
                                }

                                
                                toastr.success("Registro creado exitosamente!");
                                if (origenCH) {
                                    $state.go("fichapersonal.ponencia", { seccion: 'ponencia' });
                                } else {
                                    $rootScope.globalRegresar();
                                }


                                //if (origenCH) {
                                //    $state.go("fichapersonal.ponencia", { seccion: 'ponencia' });
                                //} else {
                                //    $rootScope.globalRegresar();
                                //}
                                
                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);
                            });
                    } else { toastr.error("Seleccione un congreso!"); }
                //} else { toastr.error("Año invalido!"); }
            }
        }

       
        $scope.add_user = function () {
            if ($scope.autorIIE.contribucion != undefined) {
                //<<<<<<< HEAD
                //var aux;
                //if ($scope.autorIIE.contribucion == "99") {
                //    aux = "10";
                //} else {
                //    aux = $scope.autorIIE.contribucion;
                //}
                var Registro = {
                    //"publicacionId": $scope.registro.publicacionId,
                    "clavePersona": $scope.autorIIE.clavePersona,
                    "contribucion": $scope.autorIIE.contribucion,
                    //=======
                    //                var Registro = {
                    //                    //"publicacionId": $scope.registro.publicacionId,
                    //                    "clavePersona": $scope.autorIIE.clavePersona,
                    //                    "contribucion": $scope.autorIIE.contribucion,
                    //>>>>>>> refs/remotes/origin/desarrollo/todos
                    //"estado": 1,
                    "nombreCompleto": $scope.autorIIE.nombrePersona

                }
                
                //PublicacionService.AddUser(Registro).then(
                //                    function (result) {
                $scope.userAdd = false;
                for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                    if ($scope.AutoresIIE[i].clavePersona == Registro.clavePersona) {
                        toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                        $scope.autorIIE = {};
                        return false;
                    }
                }
                //$scope.autorIIE = {};
                //Registro.autorIIEPublicacionId = result.data.autorIIEPublicacionId;
                $scope.PersonaSeleccionada = null;
                $scope.AutoresIIE.push(Registro);

                //Eliminar del drop
                for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                    //<<<<<<< HEAD
                    
                    if ($scope.catNum[i].id == $scope.autorIIE.contribucion) {
                        //=======
                        //                    if ($scope.catNum[i].id == Registro.contribucion) {
                        //>>>>>>> refs/remotes/origin/desarrollo/todos
                        $scope.auxColabora.push($scope.catNum[i]);
                        $scope.catNum.splice(i, 1);
                    }
                }

                //});

                //Limpiar campos--
                {
                    $scope.autorIIE.clavePersona = undefined
                    $scope.autorIIE.contribucion = undefined
                    $scope.autorIIE.nombrePersona = undefined
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
            //PublicacionService.deleteAutorIIE(registro.autorIIEPublicacionId).then(
            //        function (result) {
            //<<<<<<< HEAD
            //var aux;
            //if (registro.contribucion == "10") {
            //    aux = "99";
            //} else {
            //    aux = registro.contribucion;
            //}
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    //=======
                    //            for (var i = 0; i < $scope.auxColabora.length; i++) {
                    //                if ($scope.auxColabora[i].id == registro.contribucion) {
                    //>>>>>>> refs/remotes/origin/desarrollo/todos
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            var idx = ($scope.AutoresIIE.indexOf(registro));
            $scope.AutoresIIE.splice(idx, 1);
            $scope.auxColabora.splice(idx, 1);
            $uibModalInstance.dismiss('close');
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
            if ($scope.autorExt.nombre != null && $scope.autorExt.institucion != null && $scope.autorExt.contribucion != undefined) {
                //$scope.autorExt.publicacionId = $scope.registro.publicacionId;
                //PublicacionService.AddUserExt($scope.autorExt).then(
                //                    function (result) {
                $scope.addExt = false;
                for (var i = 0; i < $scope.AutoresExt.length; i++) {
                    if (($scope.AutoresExt[i].nombre == $scope.autorExt.nombre) && ($scope.AutoresExt[i].institucion == $scope.autorExt.institucion)) {
                        toastr.error("El autor " + $scope.autorExt.nombre + " ya existe dentro de la tabla de autores!");
                        $scope.addExt = true;
                        $scope.autorExt = {};
                        return false;
                    }
                }
                //<<<<<<< HEAD
                //var aux;
                //if ($scope.autorExt.contribucion == "99") {
                //    aux = "10";
                //} else {
                //    aux = $scope.autorExt.contribucion;
                //}
                var Registro = {
                    "nombre": $scope.autorExt.nombre,
                    "institucion": $scope.autorExt.institucion,
                    "contribucion": $scope.autorExt.contribucion

                }
                //$scope.autorExt.autorPublicacionExtId = result.data.autorPublicacionExtId;
                $scope.AutoresExt.push(Registro);
                //=======
                //                //$scope.autorExt.autorPublicacionExtId = result.data.autorPublicacionExtId;
                //                $scope.AutoresExt.push($scope.autorExt);
                //>>>>>>> refs/remotes/origin/desarrollo/todos
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
            //PublicacionService.deleteAutorExt(registro.autorPublicacionExtId).then(
            //        function (result) {
            //<<<<<<< HEAD
            //var aux;
            //if (registro.contribucion == "10") {
            //    aux = "99";
            //} else {
            //    aux = registro.contribucion;
            //}
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    //=======
                    //            for (var i = 0; i < $scope.auxColabora.length; i++) {
                    //                if ($scope.auxColabora[i].id == registro.contribucion) {
                    //>>>>>>> refs/remotes/origin/desarrollo/todos
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            var idx = ($scope.AutoresExt.indexOf(registro));
            $scope.AutoresExt.splice(idx, 1);
            $uibModalInstance.dismiss('close');
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
    }
})();