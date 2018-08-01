(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("EditarLineamientoComunidadCtrl", [
            "AuthService",
            "$scope",
            "$stateParams",
            "globalGet",
            "$state",
            "uploadFileACH",
            "LineamientosCPService",
            "TipoLineamientoCPService",
            EditarLineamientoComunidadCtrl
        ]);

    function EditarLineamientoComunidadCtrl(AuthService, $scope,$stateParams, globalGet,$state, uploadFileACH, LineamientosCPService, TipoLineamientoCPService) {
        var API = globalGet.get("api");

        //carga el lineamiento
        LineamientosCPService.getById($stateParams.id).then(function (result) {
            $scope.lineamiento = result.data;
            if ($scope.lineamiento.adjuntoId == null) {
                $scope.regFile = true;
            } else {
                $scope.regFile = false;
            }
        },function(err) {
            toastr.error("Error al cargar la información de lineamientos");
            console.log(err);
        });

        
        //Carga los tipos de lineamientos
        TipoLineamientoCPService.getAll().then(function (result) {
            $scope.tiposLineamiento = result.data;
        }, function (err) {
            toastr.error("Error al cargar los registros de lineamientos");
            console.log(err);
        });

        $scope.deleteFile = function () {
            $scope.lineamiento.adjunto = null;
            $scope.regFile = true;
            $scope.formLineamientos.$setDirty();
        }
        
        //Adjunto
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
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
                    //agregarlo al modelo
                    $scope.lineamiento.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CP"
                    }

                    $scope.formLineamientos.$setDirty();
                }
            });
        }

        $scope.regresar = function () {
            $scope.globalRegresar();
        }

        $scope.actualizarRegistro = function () {
            if ($scope.formLineamientos.$invalid) {
                toastr.error("Complete los campos requeridos");
                return false;
            } else {
                LineamientosCPService.update($scope.lineamiento).then(function (result) {
                    toastr.success("Registro actualizado correctamente!");
                    $scope.formLineamientos.$setPristine();
                    $state.go("GestionLineamientos");
                }, function (err) {
                    toastr.error("Error al actualizar el registro");
                    console.log(err);
                });
            }
            
        }

    }


})();