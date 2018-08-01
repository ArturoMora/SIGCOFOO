(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ConvenioEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "$filter",
        'globalGet',
        'FileUploader',
        "AliadosCRService",
        'uploadFileACH',
        "$uibModal",
        "DTOptionsBuilder",
        ConvenioEditCtrl
        ]);

    function ConvenioEditCtrl(AuthService, $scope, $state, $stateParams, $filter, globalGet,
        FileUploader, AliadosCRService, uploadFileACH, $uibModal, DTOptionsBuilder) {
        $scope.authentication = AuthService.authentication;
        $scope.convenio_id = $stateParams.id;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt');
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
       

        $scope.uoselecionada = {};

        $scope.archivosAdjuntos = [];
       

        $scope.datePicker50 = getRangoDeFechaDefault(0, 0, 50);
        // desdel el 75 a 50 años de la fecha actual

        AliadosCRService.getConvenio($scope.convenio_id).then(
            function (result) {
                $scope.convenios = result.data;
                //Para tablas que se muestran
                $scope.areasM = $scope.convenios.areaConvenio;
                //$scope.adjuntos = $scope.convenios.adjuntoPorConvenio;

                $scope.archivosAdjuntos = $scope.convenios.adjuntoPorConvenio;
              
                           
                $scope.proyectosA;

                //Para fechas
                //debugger;
                $scope.convenios.fechaInicio = new Date($scope.convenios.fechaInicio);
                $scope.convenios.fechaInicioAnt = new Date(result.data.fechaInicio);
                if ($scope.convenios.fechaTermino != null) {
                    $scope.convenios.fechaTermino = new Date($scope.convenios.fechaTermino);
                    $scope.convenios.fechaTerminoAnt=new Date(result.data.fechaTermino);
                }
            },
            function (err) {
                console.error(err);
            }
        );



        $scope.$watch('uoselecionada', function () {
            if ($scope.convenios != null) {
                if ($scope.uoselecionada.claveUnidad != null || $scope.uoselecionada.claveUnidad != undefined)
                    $scope.saveUnidad();
            }
        });

        $scope.saveUnidad = function () {

            $scope.unidadYaRegistrada = 0;

            if ($scope.uoselecionada.claveUnidad != "") {

                if ($scope.convenios != null) {
                    if ($scope.convenios.areaConvenio.length > 0) {

                        for (var i = 0; i < $scope.convenios.areaConvenio.length; i++) {
                            if ($scope.convenios.areaConvenio[i].claveUnidad == $scope.uoselecionada.claveUnidad) {
                                $scope.unidadYaRegistrada = 1;
                                break;
                            }
                        }
                    }
                }
            }
          
           
            if ($scope.unidadYaRegistrada == 0) {

                var registro = {
                    "fechaRegistro": new Date(),
                    "estado": 1,
                    "autor": $scope.convenios.autor,
                    "convenioId": $scope.convenios.convenioId,
                    "claveUnidad": $scope.uoselecionada.claveUnidad
                }

                AliadosCRService.registraAreaConvenio(registro)
                 .then(
                      function (result) {
                          result.data.unidadOrganizacional = $scope.uoselecionada;
                          $scope.convenios.areaConvenio.push(result.data);
                          toastr.success("Registro creado exitosamente!");
                          $scope.uoselecionada = null;

                      },
                      function (err) {
                          console.error(err);
                      }
                );

            } else {
                toastr.error("La unidad seleccionada ya se encuentra registrada");
                $scope.uoselecionada = null;

            }
        };

        $scope.deleteArea = function (obj) {
            var index = $scope.convenios.areaConvenio.indexOf(obj);
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        AliadosCRService.eliminaAreaConvenio(obj.areaConvenioId)
                        .then(
                            function (result) {
                              
                                $scope.convenios.areaConvenio.splice(index, 1);
                            },
                            function (err) {
                                console.error(err);
                            });
                        $uibModalInstance.dismiss('close');
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

             
        ///Validar rango de fechas
        $scope.validarFechasInicio = function () {
            //$scope.fechaActual = new Date();
            $scope.fechaLimiteInferior = new Date("11/23/1975");
            $scope.inicioDateComparacion = new Date($scope.convenios.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.convenios.fechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                $scope.convenios.fechaInicio = "";
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                return false;
            }

            if ($scope.inicioDateComparacion < $scope.fechaLimiteInferior) {
                $scope.convenios.fechaInicio = "";
                toastr.error("Fecha de inicio deber ser mayor a 23/11/1975.");
                return false;
            }

        };

        $scope.validarFechas = function () {
          

            if (!$scope.convenios.indefinido) {
                $scope.fechaLimiteInferior = new Date("11/23/1975");
                $scope.inicioDateComparacion = new Date($scope.convenios.fechaInicio);
                $scope.finalDateComparacion = new Date($scope.convenios.fechaTermino);
                if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                    $scope.convenios.fechaTermino = "";
                    toastr.error("Fecha de inicio deber ser menor a fecha de término y menos a la fecha actual");
                    return false;
                }


                if ($scope.fechaLimiteInferior > $scope.finalDateComparacion) {
                    $scope.convenios.fechaTermino = "";
                    toastr.error("Fecha de termino deber ser mayor a 23/11/1975.");
                    return false;
                }
            }
           
        };
        
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {

            if (adjunto.files.length <= 0) {
                return false;
            }
            
            //Que no exita el adjunto
            var igual = 0;
            var contador = 0;
            for (contador = 0; contador < $scope.archivosAdjuntos.length; contador++) {
                if (adjunto.files[0].name == $scope.archivosAdjuntos[contador].adjunto.nombre) {
                    igual = 1;
                }
            }
            
            if (igual == 0) {
                for (contador = 0; contador < $scope.tasklist.length; contador++) {
                    if (adjunto.files[0].name == $scope.tasklist[contador].nombre) {
                        igual = 1;
                    }
                }
            }

          
            if (igual > 0) {
                toastr.error("El archivo que desea adjuntar ya existe");
                $("#filesGral").filestyle('clear');
                return;
            }
            else {

                $scope.files = null;
                $scope.files = [];
                $scope.files.push(adjunto.files[0]);
                $scope.archivos = adjunto.files.length;

                // $scope.uploadFiles();
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
                            
                            $("#filesGral").filestyle('clear');
                            if (!result.error) {
                                transferComplete(result);
                                $("#filesGral").filestyle('clear');
                            } else {
                                toastr.error(result.message);
                                $("#filesGral").filestyle('clear');
                            }
                        } else {
                            var error = err.message || "Error al adjuntar";
                            $("#filesGral").filestyle('clear');
                            toastr.error(error);
                        }
                    });
            };
        }

        $scope.tasklist = [];
        function transferComplete(result) {
           
           
            $scope.$apply(function () {
                if (result.error === false) {
                    
                    var cont = 0;
                    for (var o = 0; o < $scope.archivosAdjuntos.length; o++) {
                        if ($scope.archivosAdjuntos[o].nombre == result.nameFile) {
                            cont++;
                        }
                    }

                    for (var o = 0; o < $scope.tasklist.length; o++) {
                        if ($scope.tasklist[o].nombre == result.nameFile) {
                            cont++;
                        }
                    }

                    if (cont == 0) {
                        
                        var RegistroFiles = {
                            "RutaCompleta": result.fullPathFile,
                            "nombre": result.nameFile,
                            "ModuloId": "CR",
                            "adjuntoId" :""
                        }

                        AliadosCRService.AddFile(RegistroFiles).then(
                            function (result) {
                                var resultado = result.data;

                                var adjuntoConvenio = {
                                    "fechaRegistro": new Date(),
                                    "estado": 1,
                                    "autor": $scope.convenios.autor,
                                    "convenioId": $scope.convenios.convenioId,
                                    "adjuntoId": resultado.adjuntoId
                                };

                                RegistroFiles.adjuntoId = resultado.adjuntoId;

                                AliadosCRService.registraAdjuntoConvenio(adjuntoConvenio).then(
                                     function (result) {
                                         result.data.adjunto = RegistroFiles;
                                         $scope.convenios.adjuntoPorConvenio.push(result.data);
                                         toastr.success("Adjunto creado exitosamente!");
                                        
                                     }, function (err) {
                                         console.error(err);
                                     });
                            });
                    }                 
                }
            });
        }
        

        $scope.deleteAdjunto = function (obj) {
         
            var index = $scope.convenios.adjuntoPorConvenio.indexOf(obj);
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        AliadosCRService.eliminaAdjuntoConvenio(obj.adjuntoPorConvenioId)
                        .then(
                            function (result) {
                               
                                $scope.convenios.adjuntoPorConvenio.splice(index, 1);


                                AliadosCRService.eliminaArchivoAdjunto(obj.adjuntoId).then();
                                toastr.success("Adjunto eliminado exitosamente!");

                            },
                            function (err) {
                                console.error(err);
                            });
                        $uibModalInstance.dismiss('close');
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        //obtener lista de fondosPrograma estado activo
        AliadosCRService.tipoConvenioAllByEstado().then(
            function (result) {
                 $scope.tiposConvenio = result.data;
             },
            function (err) {
                toastr.error("No se ha podido cargar los tipos de convenio");
            }
        );

        //obtener lista de fondosPrograma estado activo
        AliadosCRService.ambitoAllByEstado().then(
            function (result) {
                 $scope.ambitosConv = result.data;
             },
            function (err) {
                toastr.error("No se ha podido cargar los ambitos");
            }
        );

        $scope.saveConvenio = function () {
           

            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                     
                
                if ($scope.convenios.fechaInicio == null) {
                    toastr.error("Ingrese la fecha de inicio del convenio");
                    return false;
                }
                
                if ($scope.convenios.indefinido) {
                    $scope.convenios.fechaTermino = null;
                } else {
                    if ($scope.convenios.fechaTermino == null) {
                        toastr.error("Ingrese la fecha de termino del convenio");
                        return false;
                    }
                }

               
                AliadosCRService.updateConvenio($scope.convenios)
                    .then(
                        function(result) {
                            toastr.success(result.data);
                            $scope.form.$setPristine();
                           
                        },
                        function(err) {
                            console.error(err);
                            toastr.error(err.data);
                        });
            }
        };
    }
})();