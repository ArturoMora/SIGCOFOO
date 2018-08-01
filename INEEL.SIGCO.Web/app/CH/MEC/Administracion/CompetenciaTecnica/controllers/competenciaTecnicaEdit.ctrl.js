(function () {
    "use strict";
    angular
        .module("ineelCH")
                .directive('validNumber', function () {
                    return {
                        require: '?ngModel',
                        link: function (scope, element, attrs, ngModelCtrl) {

                            element.on('keydown', function (event) {
                                var keyCode = []
                                if (attrs.allowNegative == "true") {
                                    keyCode = [8, 9, 36, 35, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 109, 110, 173, 190, 189];
                                }
                                else {
                                    var keyCode = [8, 9, 36, 35, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 173, 190];
                                }


                                if (attrs.allowDecimal == "false") {

                                    var index = keyCode.indexOf(190);


                                    if (index > -1) {
                                        keyCode.splice(index, 1);
                                    }

                                }

                            })
                            ngModelCtrl.$parsers.push(function (text) {
                                var oVal = ngModelCtrl.$modelValue;
                                var nVal = ngModelCtrl.$viewValue;
                                console.log(nVal);
                                if (parseFloat(nVal) != nVal) {

                                    if (nVal === null || nVal === undefined || nVal == '' || nVal == '-') oVal = nVal;

                                    ngModelCtrl.$setViewValue(oVal);
                                    ngModelCtrl.$render();
                                    return oVal;
                                }
                                else {
                                    var decimalCheck = nVal.split('.');
                                    if (!angular.isUndefined(decimalCheck[1])) {
                                        if (attrs.decimalUpto)
                                            decimalCheck[1] = decimalCheck[1].slice(0, attrs.decimalUpto);
                                        else
                                            decimalCheck[1] = decimalCheck[1].slice(0, 2);
                                        nVal = decimalCheck[0] + '.' + decimalCheck[1];
                                    }

                                    ngModelCtrl.$setViewValue(nVal);
                                    ngModelCtrl.$render();
                                    return nVal;
                                }
                            });
                        }
                    };
                })
        .controller("competenciatecnicaEditCtrl", ['AuthService', '$scope', '$rootScope', 'MECService', 'globalGet', '$state', '$filter', "$stateParams", "FileUploader", "uploadFileACH", competenciatecnicaEditCtrl]);

    function competenciatecnicaEditCtrl(AuthService, $scope, $rootScope, MECService, globalGet, $state, $filter, $stateParams, FileUploader, uploadFileACH) {
        var API = globalGet.get("api");
        var id = $rootScope.idG;
        $scope.registro = {};
        $scope.urlDescarga = API + "Descarga/GetFile";
        $scope.authentication = AuthService.authentication;

        
        //obtener el registro a editar
        MECService.getbyidTecnica(id).then(
            function (result) {
                $scope.registro = result.data;
                if ($scope.registro.accesoPublico == 0) { $scope.registro.accesoPublico = "0" } else { $scope.registro.accesoPublico = "1" };
                if ($scope.registro.adjuntoId != null) { $scope.archivoAdjunto = true } else { $scope.archivoAdjunto = false };
                if ($scope.registro.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
            },
            function (error) {
                toastr.error(error);
            });

        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
            $scope.files = null;
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            $scope.archivos = adjunto.files.length;
            debugger;
            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "pdf", /* pdf;doc;docx;ppt */
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
                    $scope.registro.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.archivoAdjunto = true;
                }
            });
            debugger;
        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        //Funcion para agregar registro
        $scope.update = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if ($scope.archivoAdjunto == false) {
                    toastr.error("Adjunte un archivo!");
                    return false;
                }
                //Todo salio bien
                $scope.desabilitar = true;
                MECService.updateTecnica($scope.registro).then(
                    function (result) {
                        if (result.data.adjuntoId != null) {
                            $scope.registro.adjunto.adjuntoId = result.data.adjuntoId;
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
                        $scope.desabilitar = false;
                        $state.go("mecadministracion");
                    },
                    function (err) {
                        $scope.desabilitar = false;
                        console.error(err);
                    });

            }
        }

        $scope.deleteFile = function () {
            $scope.registro.adjunto.nombre = "eliminar";
            MECService.updateTecnica($scope.registro);
            toastr.success("Archivo Eliminado!");
            $scope.registro.adjuntoId = null;
            $scope.archivos = 0;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $scope.archivoAdjunto = false;
        }

        $scope.regresar = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if ($scope.archivoAdjunto == false) {
                    toastr.error("Adjunte un archivo!");
                    return false;
                } else {
                    $state.go("mecadministracion");
                }
            }
        }
    }
})();