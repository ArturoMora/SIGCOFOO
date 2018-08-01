(function () {
    "use strict";

    angular
        .module("ineelMT")
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
            , ['AuthService'
            , '$scope'
            , 'PonenciaService'
            , 'globalGet'
            , 'uploadFileACH'
            , '$state'
            , '$filter'
            , '$uibModal'
            , 'DTOptionsBuilder'
            , ponenciaCtrlAdd]);
    function ponenciaCtrlAdd(AuthService, $scope, PonenciaService, globalGet, uploadFileACH, $state, $filter, $uibModal, DTOptionsBuilder) {
        //Variable API
        
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

        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);

        $scope.registro = {};
        $scope.registro.nombrePersona = AuthService.authentication.nombreCompleto;
        $scope.registro.clavePersona = AuthService.authentication.userprofile.clavePersona;
        $scope.pais = '';
        $scope.autorIIE = {};

      

        $scope.datePicker = getRangoDeFechaDefault(0,2,0);
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


        PonenciaService.getCongresos().then(
             function (result) {
                 $scope.congresos = result.data;
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de congresos.");
            }
            );

        //Obtener Paises
        PonenciaService.getPaises().then(
            function (result) {
                $scope.paises = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error(err);
            });

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
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Estados de ponencia.");
            }
            );

        //////////////////
        //$scope.validarFechas = function () {
        //    $scope.fechaActual = new Date();
        //    $scope.finalDateComparacion = new Date($scope.registro.fechaInicio);
        //    if ($scope.finalDateComparacion > $scope.fechaActual) {
        //        toastr.error("Fecha de inicio del congreso deber ser menor a la de hoy");
        //        $scope.registro.fechaInicio = "";
        //        return false;
        //    }
        //}

        $scope.openCongresos = function () {
           
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
            });
          
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
            });
        }
        ///////////////////////////////////////////////////////////////
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
                    console.log("result:");
                    console.log(result);
                  
                    if (!result.error) {
                        transferComplete(result);
                    } else {
                        toastr.error(result.message);
                    }
                } else {
                    var error = err.message || "Error al adjuntar";
                    $(":file").filestyle('clear');1
                    toastr.error(error);
                }
                
            });
        };

        $scope.tasklist = [];
        $scope.deleteTask = function (index) {
            $scope.tasklist.splice(index, 1);
            angular.element("input[type='file']").val(null);
        }

        function transferComplete(result) {
          
            console.log("aqui");
            console.log(result);
            $scope.$apply(function () {
                if (result.error === false) {
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.registro.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.tasklist.push(
                        {
                            "nameFile": result.nameFile,
                            "fullpath": result.fullPathFile
                        });
                    //angular.element("input[type='file']").val(null);
                }
            });
           
        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        $scope.counter = 0;
        $scope.change = function () {
            $scope.counter++;
        };
        //Funcion para agregar registro
        $scope.add = function () {
           
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {


                if ($scope.registro.paginasde != $scope.registro.paginashasta) {
                    var de = parseInt($scope.registro.paginasde);
                    var hasta = parseInt($scope.registro.paginashasta);

                    if (hasta < de) {
                        toastr.error("Rango de páginas incorrecto");
                        return false;
                    }
                }




                if ($scope.registro.year.length == 4) {
                    var datetoday = new Date();
                    var today = datetoday.getFullYear();
                    
                  
                    if ($scope.registro.year < 1975 || $scope.registro.year > today) {
                        toastr.error("El rango del año del congreso debe estar comprendido entre 1975 y "+today);
                        return false;
                    }
                   


                  if ($scope.registro.congresoSelect != undefined) {
                     if ($scope.pais != '') {
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

                                debugger;
                                toastr.success("Registro creado exitosamente!");
                                $state.go("Ponencias");
                            },
                            function (err) {
                                $scope.desactivar = false;
                                console.error(err);
                            });
                     } else { toastr.error("Seleccione un país!"); }
                    } else { toastr.error("Seleccione un congreso!"); }
                } else { toastr.error("Año invalido!"); }
            }
        }

        //$scope.ProyectoSeleccionado = {};
        $scope.verproyecto = false;
        $scope.openProyecto = function () {
          
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
            
        }

        $scope.add_user = function () {
            if ($scope.autorIIE.contribucion != undefined) {
                var Registro = {
                    //"publicacionId": $scope.registro.publicacionId,
                    "clavePersona": $scope.autorIIE.clavePersona,
                    "contribucion": $scope.autorIIE.contribucion,
                    //"estado": 1,
                    "nombreCompleto": $scope.autorIIE.nombrePersona

                }
                //Limpiar campos
                {
                    $scope.autorIIE.clavePersona = undefined
                    $scope.autorIIE.contribucion = undefined
                    $scope.autorIIE.nombrePersona = undefined
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
                    if ($scope.catNum[i].id == Registro.contribucion) {
                        $scope.auxColabora.push($scope.catNum[i]);
                        $scope.catNum.splice(i, 1);
                    }
                }

                //});


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
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            var idx = ($scope.AutoresIIE.indexOf(registro));
            $scope.AutoresIIE.splice(idx, 1);
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
        $scope.ModificaPais = function () {
            $scope.paisanterior = $scope.paises[$scope.pais - 1].descripcion;
            $scope.registro.lugarCongreso = $scope.paisanterior;
          
        }

        $scope.clean = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }

    }
})();