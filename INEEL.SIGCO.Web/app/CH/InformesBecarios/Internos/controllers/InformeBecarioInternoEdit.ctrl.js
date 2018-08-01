(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("InformeBecarioInternoEditCtrl", ['AuthService', '$scope', '$rootScope', 'BecarioInternoService', 'globalGet', '$state', '$filter', "$stateParams", "uploadFileACH", "$uibModal", InformeBecarioInternoEditCtrl]);

    function InformeBecarioInternoEditCtrl(AuthService, $scope, $rootScope, BecarioInternoService, globalGet, $state, $filter, $stateParams, uploadFileACH, $uibModal) {
        var API = globalGet.get("api");
        $scope.registro = {};
        $scope.datePicker = getRangoDeFechaDefault(0, 0, 10);
        
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;

        $scope.estadosRegistro=[{'estadoFlujoId': 1, 'descripcion':'Edición'},{'estadoFlujoId':3,'descripcion':'Aceptado'}];

        //obtener gradoAcademicos
        BecarioInternoService.getBecaInterna().then(
            function (result) {
                $scope.becasinternas = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de becas internas.");
            }
        );

        //catalogo de carreras
        BecarioInternoService.getCarrera().then(
            function (result) {
                $scope.carreras = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de carreras.");
            }
        );

        //catalogo de instituciones
        BecarioInternoService.getInstituciones().then(
            function (result) {
                $scope.instituciones = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de instituciones.");
            }
        );

        //Obtiene el registro
        BecarioInternoService.getbyid($stateParams.id).then(
            function (result) {
                $scope.registro = result.data;
                if ($scope.registro.fechaBaja != null) {
                    $scope.registro.fechaBaja = new Date($scope.registro.fechaBaja);
                }
                $scope.registro.fechaInicioBeca = new Date($scope.registro.fechaInicioBeca);
                
                if ($scope.registro.fechaTerminoBeca != null) {
                    if (new Date($scope.registro.fechaTerminoBeca).getFullYear() > 1901) {
                        $scope.registro.fechaTerminoBeca = new Date($scope.registro.fechaTerminoBeca);
                    }
                    else {
                        $scope.registro.fechaTerminoBeca = null;
                    }
                }
                if ($scope.registro.fechaTerminoExt != null) {
                    if (new Date($scope.registro.fechaTerminoExt).getFullYear() > 1901) {
                        $scope.registro.fechaTerminoExt = new Date($scope.registro.fechaTerminoExt);
                    }
                    else {
                        $scope.registro.fechaTerminoExt = null;
                    }
                    
                }
                if ($scope.registro.extencion == 1 || $scope.registro.extencion == true) {
                    $scope.registro.extencion = true;
                    if (new Date($scope.registro.fechaTerminoExt).getFullYear() > 1901) {
                        $scope.registro.fechaTerminoExt = new Date($scope.registro.fechaTerminoExt);
                        var radio= document.getElementById("radioactivo");
                        console.log(radio);
                        radio.checked=true;
                    }
                    else {
                        $scope.registro.fechaTerminoExt = null;
                        var radio= document.getElementById("radioinactivo");
                        radio.checked=true;
                    }
                    

                } else {
                    $scope.registro.extencion = false;
                    $scope.registro.fechaTerminoExt = null;
                    var radio= document.getElementById("radioinactivo");
                    radio.checked=true;
                }
                $scope.selectedcarrera = $scope.registro.carrera;
                $scope.selectedinstitucion = $scope.registro.institucion;
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
       
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            $scope.files = null;
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            $scope.archivos = adjunto.files.length;
            
            var propiedades = {
                file: adjunto.files[0],
                ext: "pdf;doc;docx", /* pdf;doc;docx;ppt */
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
                    $scope.registro.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.ValidForm.$setDirty();
                }
            });

        }
        //#endregion info gral

        //modal carreras
        $scope.opencarreras = function () {
            $scope.desabilitar = true;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listacarreras.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.carrera = {};
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $uibModalInstance.close(item);
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selectedcarrera = selectedItem;
                $scope.selectedcarrera.carreraId = selectedItem.carreraId;
            });
            $scope.desabilitar = false;
            $scope.ValidForm.$setDirty();
        }

        //modal instituciones
        $scope.openInstituciones = function () {
            $scope.desabilitar = true;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listainstituciones.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.institucion = {};
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $uibModalInstance.close(item);
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selectedinstitucion = selectedItem;
                $scope.selectedinstitucion.institucionID = selectedItem.institucionID;
            });
            $scope.desabilitar = false;
            $scope.ValidForm.$setDirty();
        }


        $scope.validarFechasInicio = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.registro.fechaInicioBeca);
            $scope.finalDateComparacion = new Date($scope.registro.fechaTerminoBeca);
            if ($scope.inicioDateComparacion >= $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                $scope.registro.fechaInicioBeca = "";
                return false;
            }

        }

        //Valida las fechas de termino
        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.registro.fechaInicioBeca);
            $scope.finalDateComparacion = new Date($scope.registro.fechaTerminoBeca);
            if ($scope.inicioDateComparacion >= $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                $scope.registro.fechaTerminoBeca = "";
                return false;
            }
            
        }

        //Funcion para agregar registro
        $scope.ActualizaRegistro = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                if ($scope.registro.extencion == false) {
                    $scope.registro.fechaTerminoExt = null;
                }
                if ($scope.registro.extencion == true && $scope.registro.fechaTerminoExt == null) {
                    toastr.error("Ingrese una fecha de extensión");
                    return false;
                }


                if ($scope.registro.fechaInicioBeca >= $scope.registro.fechaTerminoBeca) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }

                if ($scope.registro.fechaBaja != null && ($scope.registro.fechaBaja < $scope.registro.fechaInicioBeca || $scope.registro.fechaBaja > $scope.registro.fechaTerminoBeca)) {
                    toastr.error("La Fecha de Baja debe estar entre el periodo de inicio y término de la beca.");
                    return false;
                }



                if ($scope.registro.fechaTerminoExt != null) {
                    if ($scope.registro.fechaTerminoExt <= $scope.registro.fechaTerminoBeca) {
                        toastr.error("La fecha de extensión debe ser mayor a la fecha de término de la beca.");
                        return false;
                    }
                }

                if($scope.registro.adjunto==null && $scope.registro.estadoFlujoId==3){
                    toastr.error("Llene todos los campos requeridos");
                    return false;
                }

                
                if($scope.registro.adjunto!=null && $scope.registro.estadoFlujoId==3){
                    $scope.registro.fechaValidacion= $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                }

                
                if ($scope.registro.extencion == true) {
                    $scope.registro.extencion = 1;
                } else {
                    $scope.registro.extencion = 0;
                }

                


                $scope.desabilitar = true;
                $scope.registro.carreraId = $scope.selectedcarrera.carreraId;
                $scope.registro.institucionID = $scope.selectedinstitucion.institucionID;
                $scope.registro.paisID = $scope.selectedinstitucion.paisID;
                

                BecarioInternoService.update($scope.registro).then(
                    function (result) {
                        if (result.data.adjuntoId != null) {
                            $scope.registro.adjunto.adjuntoId = result.data.adjuntoId;
                            $scope.registro.adjuntoId = result.data.adjuntoId;
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
                        toastr.success("Registro actualizado correctamente!");
                        $rootScope.globalRegresar();
                        $scope.ValidForm.$setPristine();
                        $scope.desabilitar = false;
                    },
                    function (err) {
                        $scope.desabilitar = false;
                        if (err.data != null) {
                            toastr.warning(err.data.exceptionMessage);
                        } else {
                            toastr.error(err.data);
                            console.error(err);
                        }
                    });
                    // }, function (err) {
                    //     console.log(err);
                    // }
                // );


            }
        }

        

        $scope.deleteFile = function () {
            $scope.registro.adjunto=null;
            $scope.registro.adjuntoId=null;
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
            $scope.ValidForm.$setDirty();
        }

    }
})();