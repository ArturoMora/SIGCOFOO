(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("EditarAvanceResultadosCtrl", [
            "AuthService",
            "$scope",
            "$uibModalInstance",
            "adjuntarArchivo",
            "$uibModal",
            "DTOptionsBuilder",
            "AvanceResultadosCPService",
            EditarAvanceResultadosCtrl
        ]);

    function EditarAvanceResultadosCtrl(AuthService, $scope, $uibModalInstance, adjuntarArchivo, $uibModal,DTOptionsBuilder, AvanceResultadosCPService) {
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.datePicker = getRangoDeFechaDefault(0, 0, 10);
        $scope.autores = [];
        $scope.registro = $scope.registroEdit;
        $scope.valorAvance = 0;
        
        $scope.recuperaDatos = function () {
            setTimeout(estiloArchivo, 500);
            
            $scope.comentario = $scope.registroEdit.comentario;
            $scope.avance = parseInt($scope.registroEdit.descripcion);
            if ($scope.registro.adjuntoId == null) {
                $scope.regFile = true;
            } else {
                $scope.regFile = false;

            }

            if ($scope.registroEdit.avanceMiembros.length > 0) {
                for (var c = 0; c < $scope.registroEdit.avanceMiembros.length; c++) {
                    $scope.autores.push($scope.registroEdit.avanceMiembros[c]);
                    $scope.autores[c].nombrePersona = $scope.registroEdit.avanceMiembros[c].miembro.nombrePersona;
                    $scope.valorAvance+= parseInt($scope.autores[c].participacion);
                }
            }
        }

        $scope.deleteFile = function () {

            $scope.registro.adjunto = null;
            $scope.regFile = true;
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

        $scope.actualizarRegistro = function () {
            //$scope.registro.idMeta = $scope.idMeta;
            $scope.registro.avances = $scope.autores;
            $scope.registro.comentario = $scope.comentario;
            $scope.registro.descripcion = $scope.avance;
            
            AvanceResultadosCPService.update($scope.registro).then(function (result) {
                toastr.success(result.data);
                $uibModalInstance.close();
            },function(err) {
                toastr.error("Error al crear el resultado");
                console.log(err);
            });
        }

        $scope.agregaMiembro = function () {
            if ($scope.editarAvanceForm.$invalid) {
                return false;
            }
            if ($scope.valorAvance + $scope.miembroSeleccionado.participacion > 100) {
                toastr.error("El avance no puede llegar a mas del 100%");
                return false;
            } else {
                
                var autor = {
                    'avanceId': 0,
                    'nombrePersona': $scope.miembroSeleccionado.nombrePersona,
                    'idMiembro': $scope.miembroSeleccionado.miembroId,
                    'participacion': $scope.miembroSeleccionado.participacion
                };
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

        $scope.deleteMiembro = function (autor) {
            $scope.autores.splice($scope.autores.indexOf(autor), 1);
            $scope.valorAvance -= autor.participacion;
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            toastr.clear();
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


        $scope.getFileDetails = function (adjunto) {
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    $scope.registro.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CP"
                    }
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }

        $scope.recuperaDatos();

    }

})();