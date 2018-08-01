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
        .controller("becariointernoAddCtrl"
            , ['$rootScope', 'AuthService'
                , '$scope'
                , 'BecarioInternoService'
                , 'globalGet'
                , 'uploadFileACH'
                , '$state'
                , '$filter'
                , '$uibModal'
                , becariointernoAddCtrl]);

    /**Este es el formulario para agregar becarios internos en la ficha curricular, agrego esta descripcion porque hay archivos similares que causan confusion***/

    function becariointernoAddCtrl($rootScope, AuthService, $scope, BecarioInternoService, globalGet, uploadFileACH, $state, $filter, $uibModal) {
        //Variable API
        window.scrollTo(0, 0)
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;
        $scope.requiredatalisttestinputinstitucion = true;

        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;
        $scope.registro = { nombrePersona: '' };
        if ($scope.idGF == null) {
            $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
            $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
            $scope.registro.nombrePersona = $scope.nombreEmpleado;
        } else {
            $scope.clavePersona = $scope.idGF;
            $scope.nombreEmpleado = $scope.nomGF;
            $scope.registro.nombrePersona = $scope.nombreEmpleado;
        }




        BecarioInternoService.getBecaInterna().then(
            function (result) {
                $scope.becasinternas = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de becas internas.");
            }
        );
        BecarioInternoService.getCarrera().then(
            function (result) {
                $scope.carreras = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de carreras.");
            }
        );
        BecarioInternoService.getInstituciones().then(
            function (result) {
                $scope.instituciones = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de instituciones.");
            }
        );
        //BecarioInternoService.getPaises().then(
        //     function (result) {
        //         $scope.paises = result.data;
        //     },
        //    function (err) {
        //        toastr.error("No se han podido cargar el catalogo de instituciones.");
        //    }
        //);
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
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
                        console.log("result:");
                        console.log(result);

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


        $scope.regresar = function () {
            $state.go("fichapersonal.becariointerno", { seccion: 'becariointerno' });
        }

        //modal carreras
        $scope.opencarreras = function () {
            $scope.desabilitar = true;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listacarreras.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.carrera = {};
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $uibModalInstance.close(item);
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selectedcarrera = selectedItem;
                $scope.selectedcarrera.carreraId = selectedItem.carreraId;
                $scope.ValidForm.$setDirty();
            });
            $scope.desabilitar = false;
        }

        //modal instituciones
        $scope.openInstituciones = function () {
            $scope.desabilitar = true;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listainstituciones.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.institucion = {};
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $uibModalInstance.close(item);
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selectedinstitucion = selectedItem;
                $scope.selectedinstitucion.institucionID = selectedItem.institucionID;
                $scope.ValidForm.$setDirty();
            });
            $scope.desabilitar = false;
        }

        //Funcion para agregar registro
        $scope.add = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                //Validacion Fechas

                if ($scope.registro.extencion == false) {
                    $scope.registro.fechaTerminoExt = null;
                }
                if ($scope.registro.extencion == true && $scope.registro.fechaTerminoExt == null) {
                    toastr.error("Ingrese una fecha de extensión");
                    return false;
                }
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                if ($scope.registro.fechaInicioBeca > $scope.hoy) {
                    toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                //if ($scope.registro.fechaTerminoBeca > $scope.hoy) {
                //    toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
                //    return false;
                //}
                if ($scope.registro.fechaInicioBeca >= $scope.registro.fechaTerminoBeca) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }
                if ($scope.registro.fechaBaja != null && ($scope.registro.fechaBaja <= $scope.registro.fechaInicioBeca || $scope.registro.fechaBaja >= $scope.registro.fechaTerminoBeca)) {
                    toastr.error("La Fecha de Baja debe estar entre el periodo de inicio y término de la beca.");
                    return false;
                }
                if ($scope.registro.fechaTerminoExt != null) {
                    $scope.registro.extencion = 1;

                    if ($scope.registro.fechaTerminoExt <= $scope.registro.fechaTerminoBeca) {
                        toastr.error("La fecha de extensión debe ser mayor a la fecha de término de la beca.");
                        return false;
                    }
                } else {
                    $scope.registro.extencion = 0;
                }
                /////////////////
                //Todo salio bien
                //if ($scope.registro.extencion == true) {
                //    $scope.registro.extencion = 1;
                //    if ($scope.registro.fechaTerminoExt <= $scope.registro.fechaTerminoBeca) {
                //        toastr.error("La fecha de extensión debe ser mayor a la fecha de término de la beca.");
                //        return false;
                //    }
                //} else {

                //}
                $scope.desabilitar = true;
                $scope.registro.estadoFlujoId = "1";
                $scope.registro.carreraId = $scope.selectedcarrera.carreraId;
                $scope.registro.institucionID = $scope.selectedinstitucion.institucionID;
                $scope.registro.paisID = $scope.selectedinstitucion.pais.paisID;
                $scope.registro.clavePersona = $scope.clavePersona;

                var registro={
                    "ClavePersona": $scope.clavePersona,
                    "BecaInternaId": $scope.registro.becaInternaId,
                    "FechaInicioBeca": $scope.registro.fechaInicioBeca,
                    "FechaTerminoBeca": $scope.registro.fechaTerminoBeca,
                };

                BecarioInternoService.ValidaRegistroDuplicado(registro).then(
                    function (res) {
                        if (res.data) {
                            toastr.warning("Intente cambiar el tipo de beca o las fecha de inicio o término");
                            toastr.warning("Ya existe el registro!");

                            return false;
                        }
                        BecarioInternoService.add($scope.registro).then(
                            function (result) {
                                toastr.success(result.data);
                                $state.go("fichapersonal.becariointerno", { seccion: 'becariointerno' });
                            },
                            function (err) {
                                $scope.desabilitar = false;
                                console.error(err);
                            });
                    }, function (err) {
                        console.log(err);
                    }
                );


            }
        }

        $scope.clean = function () {
            $scope.registro.fechaBaja = null;
        }

        $scope.clean2 = function () {
            $scope.registro.fechaTerminoExt = null;
        }
    }
})();