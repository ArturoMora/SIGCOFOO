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
        .controller("becarioInernoCtrlAdd"
            , ['AuthService'
            , '$scope'
            , 'BecarioInternoService'
            , 'globalGet'
            , 'uploadFileACH'
            , '$state'
            , '$filter'
            , becarioInernoCtrlAdd]);
    function becarioInernoCtrlAdd(AuthService, $scope, BecarioInternoService, globalGet, uploadFileACH, $state, $filter) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;

        $scope.numeroEmpleado = AuthService.authentication.userprofile.clavePersona;

        $scope.nombreEmpleado = $scope.authentication.nombreCompleto;

        $scope.registro = {};
        $scope.registro.claveEmpleado = AuthService.authentication.userprofile.clavePersona;
        //Obtener becas internas
        BecarioInternoService.getBecaInertna().then(
                                function (result) {
                                    $scope.becas = result.data;
                                });

        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            debugger;
            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "*", /* pdf;doc;docx;ppt */
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
                    $scope.registrosni.Adjunto = {
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
        //Funcion para agregar registro de SNI
        $scope.sniadd = function () {
            if ($scope.sniForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                //Validar fecha de inicio
                if ($scope.registrosni.fechaInicioNombramiento > $scope.registrosni.fechaTerminoNombramiento) {
                    toastr.error("Fecha de inicio del nombramiento deber ser menor a fecha de término.");
                } else {
                    //Validar fecha termino
                    $scope.fechaActual = new Date();
                    if ($scope.fechaInicioNombramiento > $scope.fechaActual) {
                        var date = new Date();
                        $scope.ddMMyyyy = $filter('date')(new Date(), 'dd/MM/yyyy');
                        toastr.error("La fecha de inicio del nombramiento debe ser menor a " + $scope.ddMMyyyy);
                    } else {
                        var fecha = new Date($scope.registrosni.fechaIngreso);
                        fecha.setFullYear(fecha.getFullYear() + 1);
                        if ($scope.registrosni.fechaTerminoNombramiento < fecha) {
                            var fecha2 = new Date($scope.registrosni.fechaIngreso);
                            fecha2.setFullYear(fecha2.getFullYear() + 1);
                            $scope.time2 = $filter('date')(new Date(fecha2), 'dd/MM/yyyy')
                            $scope.time = $filter('date')(new Date(fecha), 'dd/MM/yyyy')
                            toastr.error("La fecha de termino debe ser mayor a " + $scope.time2);
                        } else {
                            $scope.desabilitar = true;
                            $scope.registrosni.estadoFlujoId = "1";
                            SNIService.addSNI($scope.registrosni).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("fichapersonal.sni", { seccion: 'sni' });
                                },
                                function (err) {
                                    $scope.desabilitar = false;
                                    console.error(err);
                                });

                        }
                    }
                }
            }
        }



    }
})();