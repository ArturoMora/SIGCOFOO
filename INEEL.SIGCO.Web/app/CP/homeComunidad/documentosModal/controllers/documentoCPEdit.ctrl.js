(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("documentoCPEditCtrl", [
            "$scope",
            "globalGet",
            "$uibModalInstance",
            'uploadFileACH',
            "DocumentoCPService",
            "TipoDocumentoCPService",
            documentoCPEditCtrl
        ]);

    function documentoCPEditCtrl($scope, globalGet, $uibModalInstance, uploadFileACH, DocumentoCPService, TipoDocumentoCPService) {
        var API = globalGet.get("api");

        window.scrollTo(0, 0)

        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });


        $scope.archivoCargado = false;

        // desdel el 75 a 50 años de la fecha actual
        $scope.datePicker50 = getRangoDeFechaDefault(0, 0, 50);

        $scope.adjunto = {};


        $scope.tiposAccesos = [
          { valor: "Público", descripcion: "Público" },
          { valor: "Restringido", descripcion: "Restringido" }
        ];

        $scope.tiposEstatus = [
          { valor: "1", descripcion: "Aprobado" },
          { valor: "0", descripcion: "En revisión" }
        ];


        $scope.archivos = 0;

        TipoDocumentoCPService.getPorEstado().then(
           function (result) {
               $scope.tipodocumento = result.data;
               setTimeout(estiloArchivo, 500);
           },
           function (err) {
               toastr.error("No se han podido cargar los registros");
           });

        // LOGICA ADJUNTOS
        // #region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) {
                return false;
            }

            $scope.files = [];
            $scope.files.push(adjunto.files[0]);


            var propiedades = {
                file: adjunto.files[0],
                ext: "*",
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
            $scope.archivoCargado = true;
            $scope.$apply(function () {
                if (result.error === false) {

                    $scope.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CP"
                    }


                }
            });
        }


        $scope.deleteFile = function () {

            if ($scope.documento != null) {
                $scope.documento.adjunto=null;
                $scope.documento.idAdjunto = null;
                $scope.archivoCargado = false;
                // DocumentoCPService.update($scope.documento);
                // toastr.success("Archivo Eliminado!");
                $scope.archivos = 0;
                $scope.regFile = true;
                angular.element("input[type='file']").val(null);
                $(":file").filestyle('clear');
            }


        }


        //Función para guardar comunidades
        $scope.save = function () {

            if ($scope.documentoEditForm.$invalid || !$scope.archivoCargado) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var evalua = $scope.documento.tipoAcceso;
                var estatus = $scope.documento.estado;

                if (evalua == "Restringido") {
                    $scope.documento.tipoAcceso = 0;
                    $scope.seleccionado = "Restringido";
                } else {
                    $scope.documento.tipoAcceso = 1;
                    $scope.seleccionado = "Público";
                }

                if (estatus == "1") {
                    $scope.documento.estado = "1";
                    $scope.estatusseleccionado = "1";
                } else {
                    $scope.documento.estado = "0";
                    $scope.estatusseleccionado = "0";
                }

                $scope.documento.adjunto = $scope.adjunto;

                DocumentoCPService.update($scope.documento).then(
                 function (result) {
                     toastr.success("Documento actualizado correctamente!");
                     $scope.documentosComunidad();  //Llama al metodo padre, esta en documentosComunidad.ctrl.js
                     $scope.cancel();

                 },
                 function (err) {
                     toastr.error("Error al actualizar el documento!");
                     console.log(err);
                     $scope.cancel();
                 });


            }
        } //TERMINO DE LA FUNCIÓN DE GUARDADO DE COMUNIDAD DE PRÁCTICA




        $scope.obtenerDocumento = function () {
            DocumentoCPService.getById($scope.idDocumentoActualizar).then(
              function (result) {
                  $scope.documento = result.data;

                  if ($scope.documento.tipoAcceso == true) {
                      $scope.seleccionado = "Público";
                  } else {
                      $scope.seleccionado = "Restringido";
                  }


                  if ($scope.documento.estado == true) {
                      $scope.estatusseleccionado = "1";
                  } else {
                      $scope.estatusseleccionado = "0";
                  }


                  if ($scope.documento.idAdjunto == null) {
                      $scope.regFile = true;
                  } else {
                      $scope.regFile = false;
                      $scope.archivos = 1;
                      $scope.adjunto = $scope.documento.adjunto;
                      $scope.archivoCargado = true;
                  }

              },
              function (err) {
                  toastr.error("No se han podido cargar los registros");
              });



        }




        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

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

        $scope.obtenerDocumento();



    }
})();
