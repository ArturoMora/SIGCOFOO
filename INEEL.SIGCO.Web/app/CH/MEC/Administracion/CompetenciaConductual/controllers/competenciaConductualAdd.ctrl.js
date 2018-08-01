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
        .controller("competenciaconductualAddCtrl"
            , ['AuthService'
            , '$scope'
            , 'MECService'
            , 'globalGet'
            , 'uploadFileACH'
            , '$state'
            , '$filter'
            , competenciaconductualAddCtrl]);
    function competenciaconductualAddCtrl(AuthService, $scope, MECService, globalGet, uploadFileACH, $state, $filter) {
        //Variable API
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;
        $scope.registro = {};
        $scope.archivoAdjunto = false;
        $scope.registro.accesoPublico = "0";
        MECService.getPeriodo().then(
             function (result) {
                 $scope.periodos = result.data;
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de periodos.");
            }
        );

        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
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
                    $scope.registro.Adjunto = {
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
        $scope.add = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if ($scope.archivoAdjunto == false) {
                    toastr.error("Adjunte un archivo!");
                    return false;
                }
                $scope.desabilitar = true;
                MECService.createConductual($scope.registro).then(
                    function (result) {
                        toastr.success(result.data);
                        $state.go("mecadministracion");
                    },
                    function (err) {
                        $scope.desabilitar = false;
                        console.error(err);
                    });
            }
        }
    }
})();