(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ConvenioAddCtrl", [
        "AuthService",
        "$scope","$rootScope",
        "$state",
        "$stateParams",
        "$filter",
        'globalGet',
        'FileUploader',
        "AliadosCRService",
        'uploadFileACH',
        "$uibModal",
        "DTOptionsBuilder",
        ConvenioAddCtrl
        ]);

    function ConvenioAddCtrl(AuthService, $scope, $rootScope, $state, $stateParams, $filter, globalGet,
        FileUploader, AliadosCRService, uploadFileACH, $uibModal, DTOptionsBuilder) {
        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt');

        $scope.aliado_id = $stateParams.id;


        var API = globalGet.get("api");
        $scope.dtInstance = {};

        $scope.content = "si";
        $scope.convenio = {};

        $scope.nombreUnidad = {};

        $scope.unidadesO = [];
        $scope.unidadesOA = [];
      
        $scope.tasklist = [];
        $scope.adjuntosRuta = [];
        $scope.adjuntosNombre = [];

        $scope.ocultaFecha = 0;
       
        $scope.datePicker50 = getRangoDeFechaDefault(0, 0, 50);
        // desdel el 75 a 50 años de la fecha actual

      
        //obtiene el nombre del aliado
        AliadosCRService.getAliado($scope.aliado_id).then(
            function (result) {
                $scope.aliados = result.data;
                $scope.convenio = result.data;
            },
            function (err) {
                console.error(err);
        });


        $scope.$watch('nombreUnidad', function () {
            $scope.openArea();
        });


        ////////////////////////////////////Buscar EO
        $scope.ElementoSeleccionado = {};
        $scope.openArea = function () {
            
            if ($scope.nombreUnidad != null) {



                $scope.unidadYaRegistrada = 0;

                if ($scope.nombreUnidad.claveUnidad != "") {

                  
                     

                            for (var i = 0; i < $scope.unidadesOA.length; i++) {
                                if ($scope.unidadesOA[i] == $scope.nombreUnidad.claveUnidad) {
                                    $scope.unidadYaRegistrada = 1;
                                    break;
                                }
                            }
                     
                    
                }


      
               
                if ($scope.unidadYaRegistrada == 1) {
                    toastr.error("El área seleccionada ya se encuentra asociada al convenio, seleccione otra");
                    $scope.nombreUnidad = null;
                }
                else {
                    if ($scope.nombreUnidad.claveUnidad != null || $scope.nombreUnidad.claveUnidad != undefined) {
                        $scope.convenio.nombreUnidad = $scope.nombreUnidad.nombreUnidad;
                        $scope.convenio.claveUnidad = $scope.nombreUnidad.claveUnidad;
                        $scope.convenio.fechaEfectiva = $scope.nombreUnidad.fechaEfectiva;
                        $scope.unidadesOA.push($scope.nombreUnidad.claveUnidad);
                        $scope.unidadesO.push($scope.nombreUnidad);
                        $scope.nombreUnidad = null;
                    }
                  

                }
            }
        };

        $scope.deleteArea = function (area, index) {
            $scope.descripcionRow = area.nombreUnidad;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        $scope.unidadesO.splice(index, 1);
                        $scope.unidadesOA.splice(index, 1);
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
            $scope.inicioDateComparacion = new Date($scope.convenio.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.convenio.fechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                $scope.convenio.fechaInicio = "";
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                return false;
            }

            if ($scope.inicioDateComparacion < $scope.fechaLimiteInferior) {
                $scope.convenio.fechaInicio = "";
                toastr.error("Fecha de inicio deber ser mayor a 23/11/1975.");
                return false;
            }

        };

        $scope.validarFechas = function () {
            //$scope.fechaActual = new Date();
            $scope.fechaLimiteInferior = new Date("11/23/1975");
            $scope.inicioDateComparacion = new Date($scope.convenio.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.convenio.fechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion ) {
                $scope.convenio.fechaTermino = "";
                toastr.error("Fecha de inicio deber ser menor a fecha de término y menos a la fecha actual");
                return false;
            }
          

            if ($scope.fechaLimiteInferior > $scope.finalDateComparacion) {
                $scope.convenio.fechaTermino = "";
                toastr.error("Fecha de termino deber ser mayor a 23/11/1975.");
                return false;
            }
           
        };
               



        $scope.deleteAdjuntoAnt = function (index, id, adjuntoId) {
           
            $scope.adjuntos.splice(index, 1);
            $scope.adjuntosAntDel.push(id);
            $scope.adjuntosIdAntDel.push(adjuntoId);
            $scope.adjuntosA.splice(index, 1);
        }

        //--------------------------------------------------- logica de adjunto
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {

            if (adjunto.files.length <= 0) {
                return false;
            }
            
            var igual = 0;
            var contador = 0;

            var x = adjunto.files[0].name;

            for (contador = 0; contador < $scope.adjuntosNombre.length; contador++) {
                var a = $scope.adjuntosNombre[contador];
                if (x === a) {
                    igual = 1;
                }
            }

            if (igual > 0) {
                toastr.error("El adjunto ya existe");
                $("#filesGral").filestyle('clear');
                return;
            } else {

                $scope.files = [];
                $scope.files.push(adjunto.files[0]);
                
                var propiedades = {
                    file: adjunto.files[0],
                    ext: "*", /* pdf;doc;docx;ppt */
                    type: Date.now(),// '*', /* */
                    size: '8', /* cantidad entera en MB*/
                    api: API + "FileUploadMT/UploadFiles/"
                }
                //pueden utilizar la misma API para los diferentes modulos: API + "FileUploadMT/UploadFiles/"

                uploadFileACH.upload(propiedades,
                function (err, result) {
                    if (!err) {

                        if (!result.error) {
                            transferComplete(result);
                            $("#filesGral").filestyle('clear');
                        } else {
                            toastr.error(result.message);
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        toastr.error(error);
                    }
                });
            }
        };

        $scope.deleteTaskAdjunto = function (adjunto, index) {
            $scope.descripcionRow = adjunto.nameFile;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        $scope.tasklist.splice(index, 1);
                        $scope.adjuntosNombre.splice(index, 1);
                        $scope.adjuntosRuta.splice(index, 1);
                        //toastr.success("Registro eliminado exitosamente!");
                        $uibModalInstance.dismiss('close');
                        angular.element("input[type='file']").val(null);
                        
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        // CONFIRMATION.        
        function transferComplete(result) {
            
            $scope.$apply(function () {
                $scope.siguienteIG = false;
                if (!result.error) {
                    $scope.tasklist.push(
                        {
                            "nameFile": result.nameFile,
                            "fullpath": result.fullPathFile
                        });
                    $scope.adjuntosRuta.push(result.fullPathFile.replace(/\"/g, ""));
                    $scope.adjuntosNombre.push(result.nameFile.replace(/\"/g, ""));
                    $scope.form.$setDirty();
                }
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



       
    

        $scope.AddConvenio = function () {
            if ($scope.form.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                $scope.convenio.tipoConvenio = $scope.convenio.tipoConvenioId;
                $scope.convenio.objetoConvenio = $scope.convenio.objetoConvenio;
                $scope.convenio.noConvenio = $scope.convenio.noConvenio;
                $scope.convenio.fechaInicioConvenio = $scope.convenio.fechaInicio;

                $scope.convenio.indefinido = $scope.convenio.indefinido;

                if ($scope.convenio.indefinido == true) {
                                  
                $scope.convenio.fechaTerminoConvenio = null;
                } else {
                    $scope.convenio.fechaTerminoConvenio = $scope.convenio.fechaTermino;
                }
               
                $scope.convenio.observacion = $scope.convenio.observacion;
              
                $scope.convenio.tipoAccesoConvenio = $scope.convenio.tipoAccesoConvenio;
                $scope.convenio.nomFirmaConvenio = $scope.convenio.nomFirmaConvenio;

                $scope.convenio.areasConvenio = $scope.unidadesOA;
                $scope.convenio.ambitoConvenio = $scope.convenio.ambitoConvId;
                
                $scope.convenio.adjuntosRutaConvenio = $scope.adjuntosRuta;
                $scope.convenio.adjuntosNombreConvenio = $scope.adjuntosNombre;

                $scope.desactivar = true;
                AliadosCRService.createConvenio($scope.convenio)
                    .then(
                        function (result) {
                            toastr.success(result.data);
                            $rootScope.globalRegresar();
                        },
                        function (err) {
                            toastr.error(err.data.message);
                            console.error(err.data);
                            $scope.desactivar = false;
                        });
            }
        };


    }
})();