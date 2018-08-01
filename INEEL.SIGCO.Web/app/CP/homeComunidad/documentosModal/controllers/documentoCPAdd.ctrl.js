(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("documentoCPAddCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$filter",
           
            "globalGet",        
            "$uibModalInstance",
            'uploadFileACH',
            "DocumentoCPService",
            "TipoDocumentoCPService",
            documentoCPAddCtrl
        ]);

    function documentoCPAddCtrl(AuthService, $scope, $state, $filter,  globalGet,  $uibModalInstance, uploadFileACH, DocumentoCPService, TipoDocumentoCPService) {
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

        $scope.urlDescarga = API + "Descarga/GetFile";

        $scope.tasklist = [];
        $scope.adjunto = {};

        TipoDocumentoCPService.getPorEstado().then(
           function (result) {
               $scope.tipodocumento = result.data;
               setTimeout(estiloArchivo, 500);
           },
           function (err) {
               toastr.error("No se han podido cargar los registros");
               console.log(err);
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
             
        //Función para guardar comunidades
        $scope.save = function () {

            if ($scope.documentoAddForm.$invalid || !$scope.archivoCargado) {
                toastr.error("Complete los campos requeridos");
                return false;
            } else {

                        var valorTipoAcceso = false;

                        if ($scope.documento.tipoAcceso == 1)
                            valorTipoAcceso = true;

                        var documento = {};

                        if ($scope.identificaTipo.administrador == true) {
                            var documento = {
                                "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                                "estado": $scope.documento.estado,
                                "tipoAcceso": valorTipoAcceso,
                                "idComunidadCP": $scope.comunidad_id,
                                "idTipoDocumento": $scope.documento.idTipoDocumento,
                                "idMiembroCP" :null,
                                "palabraClave": $scope.documento.palabraClave,
                                "idPersona": $scope.userLogin,
                                "nombreDocumento":$scope.documento.nombreDocumento
                            };

                        } else {

                               var documento = {
                                    "fechaRegistro": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                                    "estado": $scope.documento.estado,
                                    "tipoAcceso": valorTipoAcceso,
                                    "idComunidadCP": $scope.comunidad_id,
                                    "idTipoDocumento": $scope.documento.idTipoDocumento,
                                    "idMiembroCP": $scope.InformacionMiembro.miembroId,
                                    "palabraClave": $scope.documento.palabraClave,
                                    "idPersona": null,
                                    "nombreDocumento":$scope.documento.nombreDocumento
                                };
                        
                        }



                        documento.adjunto = $scope.adjunto;
                                      
                        DocumentoCPService.create(documento).then(
                        function (result) {
                            toastr.success("Documento registrado correctamente!");
                            $scope.documentosComunidad();
                            $scope.cancel();
                           
                        },
                        function (err) {
                            toastr.error("Error al registrar el documento!");
                            $scope.cancel();
                        });


                    }
        } //TERMINO DE LA FUNCIÓN DE GUARDADO DE COMUNIDAD DE PRÁCTICA

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
        
    }
})();
