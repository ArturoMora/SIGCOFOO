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
        .controller("capitulosCtrlAdd"
        , ['AuthService'
            ,'$rootScope'
            , '$scope'
            , 'CapituloService'
            , 'globalGet'
            , 'uploadFileACH'
            , '$state'
            , '$filter'
            , '$uibModal'
            , 'DTOptionsBuilder'
            , capitulosCtrlAdd]);
    function capitulosCtrlAdd(AuthService, $rootScope, $scope, CapituloService, globalGet, uploadFileACH, $state, $filter, $uibModal, DTOptionsBuilder) {
        //Variable API
        var API = globalGet.get("api");
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        var d = new Date();
        $scope.anioActual = d.getUTCFullYear();
        $scope.ubicacion=window.location.pathname;  //para saber si estan en MT o CH
        
        $scope.authentication = AuthService.authentication;
        var clavePersona = AuthService.authentication.userprofile.clavePersona;
        var nombreCompleto = AuthService.authentication.nombreCompleto;

        $scope.AutoresIIE = [];
        $scope.auxColabora = [];
        $scope.AutoresExt = [];
        $scope.editores = [];
        $scope.descripcioneditor = "";
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.pais = '';
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



        CapituloService.getPaises().then(
            function (result) {
                $scope.paises = result.data;
            },
            function (err) {
                toastr.error(err);
            });

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

        $scope.regresar=function(){
            $state.go("fichapersonal.capitulo", { seccion: 'capitulo' });
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
                    toastr.error(error);
                }
            });
        };

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
                        moduloId: "MT"
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

                var anio = new Date($scope.registro.year).getFullYear();
                var actual = new Date().getFullYear();
                if (anio < 1975 || anio > actual) {
                    toastr.error("El año debe estar comprendido entre 1975 y "+actual);
                    return false;
                }
                //if ($scope.registro.year.length == 4) {
                    if ($scope.editores.length > 0) {
                        if($scope.AutoresIIE.length>0){
                            if ($scope.pais != '') {
                                
                                var fech = new Date($scope.registro.year, 1, 1);
                                $scope.registro.year = fech;

                            $scope.registro.pais = $scope.pais;
                            $scope.desactivar = true;
                            $scope.registro.estadoFlujoId = 1;
                            $scope.registro.estadoActivoId = 1;
                            $scope.registro.estadoCapituloId = 1;
                            var Registro=[];
                            CapituloService.add($scope.registro).then(
                                function (result) {
                                    var Registro = [];
                                    $scope.idCapitulo = result.data.capitulosId;
                                    for (var iie = 0; iie < $scope.AutoresIIE.length; iie++) {
                                        Registro[iie] = {
                                            "capitulosId": $scope.idCapitulo,
                                            "clavePersona": $scope.AutoresIIE[iie].clavePersona,
                                            "contribucion": $scope.AutoresIIE[iie].contribucion,
                                            "estado": 1,
                                            "nombreCompleto": $scope.AutoresIIE[iie].nombreCompleto
                                        }
                                    }
                                            CapituloService.AddUserAll(Registro).then(
                                            function (result) {
                                                var Registro = [];
                                                for (var ed = 0; ed < $scope.editores.length; ed++) {
                                                    //Registro[ed].capitulosId=$scope.idCapitulo;
                                                    //Registro[ed].editor_Nombre=$scope.editores[ed];
                                                    Registro[ed] = {
                                                        "capitulosId": $scope.idCapitulo,
                                                        "editor_Nombre": $scope.editores[ed]
                                                    }
                                                }
                                                CapituloService.AddEditorAll(Registro).then(
                                                function (result) {
                                                    if ($scope.AutoresExt.length > 0) {
                                                        for (var ext = 0; ext < $scope.AutoresExt.length; ext++) {
                                                            $scope.AutoresExt[ext].capitulosId = $scope.idCapitulo;
                                                        }
                                                            CapituloService.AddUserExtAll($scope.AutoresExt).then(
                                                            function (result) {
                                                                toastr.success("Registro creado exitosamente!");
                                                                
                                                                if((new RegExp('indexCH')).test($scope.ubicacion)){ //Si viene de CH
                                                                    $state.go("fichapersonal.capitulo", { seccion: 'capitulo' });
                                                                }else{
                                                                    $rootScope.globalRegresar();
                                                                } 
                                                            },
                                                            function (err) {
                                                                $scope.desactivar = false;
                                                                console.error(err);
                                                            });

                                                    }
                                                    else {
                                                        
                                                        
                                                        if((new RegExp('indexCH')).test($scope.ubicacion)){ //Si viene de CH
                                                            $state.go("fichapersonal.capitulo", { seccion: 'capitulo' });
                                                        }else{
                                                            $rootScope.globalRegresar();
                                                        } 
                                                        toastr.success("Registro creado exitosamente!");
                                                        
                                                    }
                                                },
                                                function (err) {
                                                    $scope.desactivar = false;
                                                    console.error(err);
                                                });
                                            },
                                            function (err) {
                                                $scope.desactivar = false;
                                                console.error(err);
                                            });
                                },
                                function (err) {
                                    $scope.desactivar = false;
                                    console.error(err);
                                });
                        } else { toastr.error("Seleccione un país!"); }
                      } else { toastr.error("Agregue al menos un autor interno"); }
                    } else { toastr.error("Agregue al menos un editor"); }
                //} else { toastr.error("Año inválido!"); }
            }
        }
        $scope.defaultAutorInterno = function () {
            var Registro = {
                //"publicacionId": $scope.registro.publicacionId,
                "clavePersona": clavePersona,
                "contribucion": 1,
                //"estado": 1,
                "nombreCompleto": nombreCompleto

            }
            
            if ($scope.AutoresIIE == null || $scope.AutoresIIE.length==0) {
                $scope.auxColabora.push($scope.catNum[0]);
                $scope.AutoresIIE.push(Registro);
                $scope.catNum.splice(0, 1);
            }
            
            
            
            
        };
        $scope.defaultAutorInterno();

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
                    $scope.autorIIE.clavePersona=undefined
                    $scope.autorIIE.contribucion = undefined
                    $scope.autorIIE.nombrePersona = undefined
                }
                
                $scope.userAdd = false;
                for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                    if ($scope.AutoresIIE[i].clavePersona == Registro.clavePersona) {
                        toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                        $scope.autorIIE = {};
                        return false;
                    }
                }
                
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
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            var idx = ($scope.AutoresIIE.indexOf(registro));
            $scope.AutoresIIE.splice(idx, 1);
            $uibModalInstance.dismiss('close');

        };

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }
        //////////////////////////////////////////////////////////////////////////
        $scope.add_userExt = function () {
            if ($scope.autorExt.nombre != null && $scope.autorExt.institucion != null && $scope.autorExt.contribucion != undefined) {
                
                $scope.addExt = false;
                
                for (var i = 0; i < $scope.AutoresExt.length; i++) {
                    if (($scope.AutoresExt[i].nombre == $scope.autorExt.nombre) && ($scope.AutoresExt[i].institucion == $scope.autorExt.institucion)) {
                        toastr.error("El autor " + $scope.autorExt.nombre + " ya existe dentro de la tabla de autores!");
                        $scope.addExt = true;
                        $scope.autorExt = {};
                        return false;
                    }
                }
                if ($scope.addExt == false) {
                    
                    $scope.AutoresExt.push($scope.autorExt);
                    //Eliminar del drop
                    for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                        if ($scope.catNum[i].id == $scope.autorExt.contribucion) {
                            $scope.auxColabora.push($scope.catNum[i]);
                            $scope.catNum.splice(i, 1);
                        }
                    }
                    $scope.autorExt = {};
                }

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
            
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            var idx = ($scope.AutoresExt.indexOf(registro));
            $scope.AutoresExt.splice(idx, 1);
            $uibModalInstance.dismiss('close');
            
        };

        $scope.addEditor = function () {
            if ($scope.descripcioneditor) { //se hace esta comparación para comprobar que no es undefined
                var editor = $scope.descripcioneditor;
                if (editor != "" && editor != undefined) {
                    var idx = $scope.editores.indexOf(editor);
                    if (idx > -1) {
                        toastr.error("El editor ya se encuentra asociado, indique otro");
                        $scope.registro.descripcioneditor = ''
                    }
                    else {
                        $scope.editores.push(editor);
                        $scope.descripcioneditor = "";
                    }
                }
                else {
                    toastr.error("Se requiere un editor");
                }
            } else {
                toastr.error("Se requiere un editor");
            }
        };

        $scope.deleteTask = function (index) {
            $scope.editores.splice(index, 1);
        }

        $scope.ModificaPais = function (pais) {
            $scope.aux = $scope.paises[$scope.pais].descripcion;
            //$scope.paisanterior = $scope.paises[$scope.pais - 1].descripcion;
            //$scope.registro.pais= $scope.pais;
        }
    }
})();