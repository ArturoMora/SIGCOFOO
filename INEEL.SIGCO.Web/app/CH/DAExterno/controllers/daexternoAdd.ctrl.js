(function () {
    "use strict";

    angular
        .module("ineelCH")
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
        .controller("daexternoAddCtrlAdd"
            , ['$rootScope','AuthService'
            , '$scope'
            , 'DAExternoService'
            , 'globalGet'
            , 'uploadFileACH'
            , '$state'
            , '$filter'
            , '$uibModal'
            , 'DTOptionsBuilder'
            , daexternoAddCtrlAdd]);
    function daexternoAddCtrlAdd($rootScope,AuthService, $scope, DAExternoService, globalGet, uploadFileACH, $state, $filter, $uibModal, DTOptionsBuilder) {
        //Variable API
        window.scrollTo(0, 0);
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;
        $scope.AutoresIIE = [];
        $scope.auxColabora = [];
        $scope.AutoresExt = [];
        $scope.contador = 0;

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


        DAExternoService.getRamas().then(
             function (result) {
                 $scope.ramas = result.data;
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de ramas DA.");
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
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            debugger;
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
                debugger;
                if (!err) {
                    console.log("result:");
                    console.log(result);
                    debugger;
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
                debugger;
            });
        };
        function transferComplete(result) {
            debugger
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
                }
            });
            debugger;
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
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                //if ($scope.registro.fechaCertificado > $scope.hoy) {
                //    toastr.error("La fecha de certificación debe estar comprendida hasta " + $scope.hoyString);
                //    return false;
                //}
                //debugger;
                if ($scope.AutoresIIE.length == 0) {
                    toastr.error("Ingrese al menos un autor interno.");
                    return false;
                }
                $scope.desactivar = true;
                $scope.registro.estadoFlujoId = 1;
                DAExternoService.add($scope.registro).then(
                    function (result) {
                        var DAexternoId = result.data.daExternoId;
                        for (var iie = 0; iie < $scope.AutoresIIE.length; iie++) {
                            var Registro = {
                                "dAExternoId": DAexternoId,
                                "clavePersona": $scope.AutoresIIE[iie].clavePersona,
                                "contribucion": $scope.AutoresIIE[iie].contribucion,
                                "estado": 1,
                                "nombreCompleto": $scope.AutoresIIE[iie].nombrePersona
                            }
                            DAExternoService.AddUser(Registro).then(
                                                function (result) {
                                                });
                        }

                        for (var ext = 0; ext < $scope.AutoresExt.length; ext++) {
                            $scope.AutoresExt[ext].dAExternoId = DAexternoId;
                            DAExternoService.AddUserExt($scope.AutoresExt[ext]).then(
                                                function (result) {
                                                });
                        }
                        toastr.success("Registro creado exitosamente!");
                        $state.go("fichapersonal.daexterno", { seccion: 'daexterno' });
                    },
                    function (err) {
                        $scope.desactivar = false;
                        console.error(err);
                    });
            }
        }



        $scope.add_user = function () {
            //if ($scope.contador < 100) {
            if ($scope.autorIIE.contribucion != undefined) {
                var aux = parseInt($scope.autorIIE.contribucion) + parseInt($scope.contador);
                if (aux <= 100) {
                    var porcentaje = parseInt($scope.autorIIE.contribucion);
                    $scope.contador = $scope.contador + porcentaje;
                    var Registro = {
                        //"publicacionId": $scope.registro.publicacionId,
                        "clavePersona": $scope.autorIIE.clavePersona,
                        "contribucion": $scope.autorIIE.contribucion,
                        //"estado": 1,
                        "nombreCompleto": $scope.autorIIE.nombrePersona

                    }
                    for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                        if ($scope.AutoresIIE[i].clavePersona == Registro.clavePersona) {
                            toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
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
                    toastr.error("El porcentaje de colaboración supera el 100%");
                }

            } else {
                toastr.error("Complete los datos requeridos del autor");
            }
            //} //else {
            //    toastr.error("El porcentaje de colaboración supera el 100%");
            //}

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
            if ($scope.autorExt.nombre != null && $scope.autorExt.institucion != null && $scope.autorExt.contribucion != undefined) {
                var aux = parseInt($scope.autorExt.contribucion) + parseInt($scope.contador);
                if (aux <= 100) {
                    for (var i = 0; i < $scope.AutoresExt.length; i++) {
                        if (($scope.AutoresExt[i].nombre == $scope.autorExt.nombre) && ($scope.AutoresExt[i].institucion && $scope.autorExt.institucion)) {
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
                } else {
                    toastr.error("El porcentaje de colaboración supera el 100%");
                }
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
    }
})();