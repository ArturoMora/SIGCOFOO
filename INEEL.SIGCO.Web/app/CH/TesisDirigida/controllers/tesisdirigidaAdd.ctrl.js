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
        .controller("tesisdirigidaAddCtrl"
            , ['$rootScope', 'AuthService'
                , '$scope'
                , 'TesisDirigidaService'
                , 'globalGet'
                , 'uploadFileACH'
                , '$state'
                , '$filter'
                , tesisdirigidaAddCtrl]);
    function tesisdirigidaAddCtrl($rootScope, AuthService, $scope, TesisDirigidaService, globalGet, uploadFileACH, $state, $filter) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        window.scrollTo(0, 0)
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;
        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;
        $scope.registro = { nombreEmpleado: '' };
        if ($scope.idGF == null) {
            $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
            $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        } else {
            $scope.clavePersona = $scope.idGF;
            $scope.nombreEmpleado = $scope.nomGF;
        }
        $scope.registro.nombrePersona = $scope.nombreEmpleado;

        TesisDirigidaService.getgradoacademico().then(
            function (result) {
                $scope.gradoacademico = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de grados académicos.");
            }
        );

        $scope.regresar = function () {
            $state.go("fichapersonal.tesisdirigida", { seccion: 'tesisdirigida' });
        }

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
        //Funcion para agregar registro
        $scope.add = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                //Validacion Fechas
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');

                var limiteSuperior = new Date();
                var limiteInferior = new Date(1975, 1, 1);

                if ($scope.registro.fechaInicio < limiteInferior) {
                    toastr.error("La fecha de inicio ingresada no es una fecha válida.");
                    $scope.registro.fechaInicio = "";
                    return false;
                }

                if ($scope.registro.fechaTermino < limiteInferior) {
                    toastr.error("La fecha de termino ingresada no es una fecha válida.");
                    $scope.registro.fechaTermino = "";
                    return false;
                }

                if ($scope.registro.fechaInicio > $scope.hoy) {
                    toastr.error("La fecha de inicio debe ser menor a la fecha actual " + $scope.hoyString);
                    return false;
                }
                if ($scope.registro.fechaTermino > $scope.hoy) {
                    toastr.error("La fecha de término debe ser menor a la fecha actual " + $scope.hoyString);
                    return false;
                }
                if ($scope.registro.fechaInicio >= $scope.registro.fechaTermino) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }

                if ($scope.registro.fechaAceptacion != null) {

                    if ($scope.registro.fechaAceptacion < $scope.registro.fechaTermino) {
                        toastr.error("La fecha de aceptación de la tesis debe ser mayor a la de término");
                        return false;
                    }
                }

                if ($scope.registro.fechaExamen != null) {

                    if ($scope.registro.fechaExamen <= $scope.registro.fechaAceptacion) {
                        toastr.error("La fecha de examen debe ser mayor a la de aceptación de la tesis ");
                        return false;
                    }
                }

                /////////////////
                $scope.desabilitar = true;
                $scope.registro.estadoFlujoId = "1";
                $scope.registro.clavePersona = $scope.clavePersona;
                var registro={
                    "GradoAcademicoId": $scope.registro.gradoAcademicoId,
                    "FechaInicio": $scope.registro.fechaInicio,
                    "FechaTermino": $scope.registro.fechaTermino,
                    "ClavePersona": $scope.clavePersona
                };
                TesisDirigidaService.ValidaRegistroDuplicado(registro).then(
                    function (res) {
                        if(res.data){
                            toastr.warning("Intente cambiar el grado académico o la fechas de inicio y término");
                            toastr.warning("Ya existe el registro!");
                                
                            return false;
                        }
                        TesisDirigidaService.add($scope.registro).then(
                            function (result) {
                                toastr.success(result.data);
                                $state.go("fichapersonal.tesisdirigida", { seccion: 'tesisdirigida' });
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
            $scope.registro.fechaAceptacion = null;
        }

        $scope.clean2 = function () {
            $scope.registro.fechaExamen = null;
        }
    }
})();