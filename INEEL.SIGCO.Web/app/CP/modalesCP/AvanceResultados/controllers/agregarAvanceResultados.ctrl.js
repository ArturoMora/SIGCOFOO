(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("AgregarAvanceResultadosCtrl", [
            "AuthService",
            "DTOptionsBuilder",
            "$scope",
            "globalGet",
            "$uibModalInstance",
            "$filter",
            "$uibModal",
            "uploadFileACH",
            "AvanceResultadosCPService",
            AgregarAvanceResultadosCtrl
        ]);

    function AgregarAvanceResultadosCtrl(AuthService, DTOptionsBuilder, $scope, globalGet, $uibModalInstance, $filter, $uibModal, uploadFileACH, AvanceResultadosCPService) {
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        var API = globalGet.get("api");
        $scope.resultado = {};
        $scope.autores = [];
        $scope.valorAvance = 0;
        AvanceResultadosCPService.getCompromisosWithResultados($scope.comunidad.comunidadId).then(function (result) {
            $scope.compromisos = result.data;
            setTimeout(estiloArchivo, 500);
        }, function (err) {
            toastr.error("No se han podido cargar los registros de compromisos");
            console.log(err);
        });

        $scope.agregarRegistro = function () {
            if ($scope.avanceAddForm.$invalid) {
                return false;
            } else {
                $scope.resultado.avances = $scope.autores;
                $scope.resultado.idResultado = $scope.idMeta;
                $scope.resultado.fechaRegistro = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString();
                AvanceResultadosCPService.create($scope.resultado).then(function (result) {
                    toastr.success("Registro creado exitosamente!");
                    $uibModalInstance.close();
                
                },function(err) {
                    toastr.error("Error al crear el resultado");
                    console.log(err);
                });
            }
            
        }

        $scope.openUser = function () {
            $scope.variable = $scope.comunidad.comunidadId;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/modalesCP/MiembrosComunidad/MiembrosComunidad.html',
                controller: 'GetMiembrosComunidadCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.miembroSeleccionado = selectedItem;
            });
        }

        $scope.agregaMiembro = function () {
            if ($scope.avanceAddForm.$invalid) {
                toastr.error("Complete todos los campos requeridos");
                return false;
            }
            if ($scope.valorAvance + $scope.miembroSeleccionado.participacion > 100) {
                toastr.error("El avance no puede llegar a mas del 100%");
                $scope.miembroSeleccionado =null;
                return false;
            } else {
                debugger;
                var autor = {
                    'avanceId': 0,
                    'nombrePersona': $scope.miembroSeleccionado.nombrePersona,
                    'idMiembro': $scope.miembroSeleccionado.miembroId,
                    'participacion': $scope.miembroSeleccionado.participacion
                };
                //var idx = $scope.autores.indexOf(autor);
                for (var c = 0; c < $scope.autores.length; c++) {
                    if ($scope.autores[c].idMiembro == $scope.miembroSeleccionado.miembroId) {
                        toastr.error("El autor ya se encuentra registrado");
                        return false;
                    }
                }

                $scope.valorAvance += $scope.miembroSeleccionado.participacion;
                $scope.autores.push(autor);
                $scope.miembroSeleccionado = null;
            }
            
        }

        $scope.deleteMiembro=function(autor) {
            $scope.autores.splice($scope.autores.indexOf(autor), 1);
            $scope.valorAvance -= autor.participacion;
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            toastr.clear();
        }

        //Seccion adjunto
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
                //debugger;
                if (!err) {
                    //  debugger;
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
                    $scope.resultado.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CP"
                    }
                }
            });
        }

        var estiloArchivo = function () {

            $(":file").addClass("filestyle");
            $(":file").filestyle({ buttonName: "btn-success" });
            $('.filestyle').each(function () {

                var $this = $(this), options = {
                    'input': $this.attr('data-input') === 'false' ? false : true,
                    'icon': $this.attr('data-icon') === 'false' ? false : true,
                    'buttonBefore': $this.attr('data-buttonBefore') === 'true' ? true : false,
                    'disabled': $this.attr('data-disabled') === 'true' ? true : false,
                    'size': $this.attr('data-size'),
                    'buttonText': $this.attr('data-buttonText'),
                    'buttonName': $this.attr('data-buttonName'),
                    'iconName': $this.attr('data-iconName'),
                    'badge': $this.attr('data-badge') === 'false' ? false : true,
                    'placeholder': $this.attr('data-placeholder')
                };
                $this.filestyle(options);
            });

        }

    }

})();