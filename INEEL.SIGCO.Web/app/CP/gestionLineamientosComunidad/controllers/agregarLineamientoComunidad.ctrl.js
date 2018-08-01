(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("AgregarLineamientoComunidadCtrl", [
            "AuthService",
            "$scope",
            "$filter",
            "$state",
            "uploadFileACH",
            "globalGet",
            "TipoLineamientoCPService",
            "LineamientosCPService",
            AgregarLineamientoComunidadCtrl
        ]);

    function AgregarLineamientoComunidadCtrl(AuthService, $scope,  $filter, $state, uploadFileACH, globalGet, TipoLineamientoCPService, LineamientosCPService) {
        $scope.lineamientosComunidad = {};
        var API = globalGet.get("api");
        TipoLineamientoCPService.getAll().then(function (result) {
            $scope.tiposLineamiento = result.data;
        },function(err) {
            toastr.error("Error al cargar los registros de lineamientos");
            console.log(err);
        });

        
        $scope.agregarRegistro = function () {
            if ($scope.formLineamientos.$invalid) {
                toastr.error("Complete los campos requeridos");
                return false;
            } else{
                $scope.lineamientosComunidad.fechaRegistro = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString();
                $scope.lineamientosComunidad.idTipoLineamiento = $scope.tipoLineamiento;
                LineamientosCPService.createLineamiento($scope.lineamientosComunidad).then(function (result) {
                    toastr.success("Registro creado exitosamente!");
                    $state.go("GestionLineamientos");
                }, function (err) {
                    toastr.error("Error al crear el registro");
                    console.log(err);
                });
            }
            
        }


        $scope.regresar = function () {
            $scope.globalRegresar();
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
            console.log(result);
            $scope.$apply(function () {
                if (result.error === false) {
                    //agregarlo al modelo
                    $scope.lineamientosComunidad.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CP"
                    }
                }
            });
        }

    }

})();