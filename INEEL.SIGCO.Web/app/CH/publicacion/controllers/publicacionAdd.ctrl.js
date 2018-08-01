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
        .controller("publicacionCtrlAdd"
        , ['$rootScope', 'AuthService'
            , '$scope'
            , 'PublicacionService'
            , 'globalGet'
            , 'uploadFileACH'
            , '$state'
            , '$filter'
            , '$uibModal'
            , "DTOptionsBuilder"
            , publicacionCtrlAdd]);
    function publicacionCtrlAdd($rootScope, AuthService,
        $scope, PublicacionService, globalGet,
        uploadFileACH, $state, $filter, $uibModal, DTOptionsBuilder) {
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
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);


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


        //PublicacionService.getRevistas().then(
        //    function (result) {
        //        $scope.revistas = result.data;
        //    },
        //    function (err) {
        //        toastr.error("No se han podido cargar el catalogo de revistas.");
        //    }
        //);
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
                $scope.add_user();
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Estados de Publicacion.");
            }
        );
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
        ///////////////////////////////////////////////////////////////

        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.finalDateComparacion = new Date($scope.registro.fechaPublicacion);
            if ($scope.finalDateComparacion > $scope.fechaActual) {
                toastr.error("Fecha de artículo deber ser menor a la de hoy");
                $scope.registro.fechaPublicacion = "";
                return false;
            }
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
                $scope.ValidForm.$setDirty();
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
                ext: "pdf;doc;docx", /* pdf;doc;docx;ppt */
                type: '*', /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            uploadFileACH.upload(propiedades,
                function (err, result) {
                    
                    if (!err) {
                        // console.log("result:");
                        // console.log(result);
                        
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
                if ($scope.registro.revistaSelect != undefined) {
                    
                    if (parseInt($scope.registro.paginasde) >= parseInt($scope.registro.paginashasta)) {
                        toastr.error("Rango de páginas incorrecto");
                        return false;
                    }
                    if ($scope.AutoresIIE.length == 0) {
                        toastr.error("Ingrese al menos un autor interno.");
                        return false;
                    }
                    $scope.desactivar = true;
                    $scope.registro.revistaId = $scope.registro.revistaSelect.revistaId;
                    $scope.registro.paginas = $scope.registro.paginasde + "-" + $scope.registro.paginashasta;
                    $scope.registro.estadoFlujoId = 1;
                    $scope.registro.estadoActivoId = 1;

                    var registro={
                        "ClavePersona": AuthService.authentication.userprofile.clavePersona,
                        "RevistaId": $scope.registro.revistaSelect.revistaId,
                        "FechaPublicacion": $scope.registro.fechaPublicacion,
                        "Paginas": $scope.registro.paginas
                    };

                    PublicacionService.ValidaRegistroDuplicado(registro).then(
                        function(res){
                            if(res.data){
                                toastr.warning("Intente cambiar la revista asociada, la fecha de publicación o el número de páginas", {
                                    timeOut:10000,
                                });
                                toastr.warning("Ya existe el registro!");
                                
                                return false;
                            }
                            PublicacionService.add($scope.registro).then(
                                function (result) {
                                    var idPublicacion = result.data.publicacionId;
                                    for (var iie = 0; iie < $scope.AutoresIIE.length; iie++) {
                                        var Registro = {
                                            "publicacionId": idPublicacion,
                                            "clavePersona": $scope.AutoresIIE[iie].clavePersona,
                                            "contribucion": $scope.AutoresIIE[iie].contribucion,
                                            "estado": 1,
                                            "nombreCompleto": $scope.AutoresIIE[iie].nombrePersona
                                        }
                                        PublicacionService.AddUser(Registro).then(
                                            function (result) {
                                            });
                                    }
        
                                    for (var ext = 0; ext < $scope.AutoresExt.length; ext++) {
                                        $scope.AutoresExt[ext].publicacionId = idPublicacion;
                                        PublicacionService.AddUserExt($scope.AutoresExt[ext]).then(
                                            function (result) {
                                            });
                                    }
                                    toastr.success("Registro creado exitosamente!");
                                    if (origenCH) {
                                        $state.go("fichapersonal.publicacion", { seccion: 'publicacion' });
                                    } else {
                                        $rootScope.globalRegresar();
                                    }
                                    
                                },
                                function (err) {
                                    $scope.desactivar = false;
                                    // if(err.data.exceptionMessage!=null){
                                        // if((new RegExp('Ya existe el registro!')).test(err.data.exceptionMessage)){
                                            // toastr.warning(err.data.exceptionMessage,'Ya existe el registro!');
                                        // }
                                    // }else{
                                        toastr.error(err.data.message);
                                    // }
                                    console.log(err);
                                });
                        },function(err){
                            console.log(err);
                        }
                    );    
                    
                } else { toastr.error("Selecciones una Revista!"); }
            }
        }
        var origenCH = $rootScope.getOrigen() == 'CH' ? true : false;
        $scope.regresar = function () {
            if (origenCH) {
                $state.go("fichapersonal.publicacion", { seccion: 'publicacion' });
            } else {
                $rootScope.globalRegresar();
            }
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
                //Limpiar campos--
                {
                    $scope.autorIIE.clavePersona = undefined
                    $scope.autorIIE.contribucion = undefined
                    $scope.autorIIE.nombrePersona = undefined
                }
                for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                    if ($scope.AutoresIIE[i].clavePersona == Registro.clavePersona) {
                        toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                        $scope.autorIIE = {};
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