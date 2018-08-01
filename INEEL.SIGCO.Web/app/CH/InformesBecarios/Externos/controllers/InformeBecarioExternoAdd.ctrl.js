(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("InformeBecarioExternoAddCtrl", 
            ['AuthService', 
            '$scope',
            '$filter',
            'InformeBecarioCHService', 
            'globalGet',
            '$rootScope', 
            '$uibModal', 
            'uploadFileACH',  InformeBecarioExternoAddCtrl]);

    function InformeBecarioExternoAddCtrl(AuthService, $scope, $filter, InformeBecarioCHService, globalGet,
        $rootScope, $uibModal, uploadFileACH) {
        var API = globalGet.get("api");
        $scope.registro = {};
        $scope.datePicker = getRangoDeFechaDefault(0, 0, 10);
        $scope.authentication = AuthService.authentication;

        //obtener instituciones para el modal
        InformeBecarioCHService.getInstituciones().then(
            function (result) {
                $scope.instituciones = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de instituciones.");
                console.log(err);
            }
        );

        //Get Tipos de beca
        InformeBecarioCHService.getTipoBecas().then(
            function (result) {
                $scope.becas = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de tipo de beca.");
                console.log(err);
            }
        );

        ///Validar rango de fechas
        $scope.validarFechasInicio = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.registro.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.registro.fechaTermino);
            if ($scope.inicioDateComparacion >= $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                $scope.registro.fechaInicio = "";
                return false;
            }
            // if ($scope.inicioDateComparacion > $scope.fechaActual) {
            //     toastr.error("Fecha inicial deber ser menor a la de hoy");
            //     $scope.registro.fechaInicio = "";
            //     return;
            // }
        }

        //Valida las fechas de termino
        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.registro.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.registro.fechaTermino);
            if ($scope.inicioDateComparacion >= $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                $scope.registro.fechaTermino = "";
                return false;
            }
            // if ($scope.finalDateComparacion > $scope.fechaActual) {
            //     toastr.error("Fecha final deber ser menor a la de hoy");
            //     $scope.registro.fechaTermino = "";
            //     return;
            // }
        }

        //modal instituciones
        $scope.openInstituciones = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listainstituciones.html',
                controller: function ($scope, $uibModalInstance) {
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
                $scope.registro.nombreInstitucion = selectedItem.descripcion;
                $scope.registro.institucionId = selectedItem.institucionID;
                $scope.fromBecario.$setDirty();
            });
        }



        $scope.openPersonal = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.registro.claveAsesor = selectedItem.clavePersona;
                $scope.registro.nombreAsesor= selectedItem.nombreCompleto;
                $scope.fromBecario.$setDirty();
            });
        }

        //Buscar Proyecto
        $scope.openProyecto = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarProyecto.html',
                controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.proyecto = selectedItem.proyectoId + " - " + selectedItem.nombre;
                $scope.registro.proyectoId = selectedItem.proyectoId;
                $scope.fromBecario.$setDirty();
            });

        }


        //Guardar registro
        $scope.addBecario = function () {
            if ($scope.fromBecario.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }

            if($scope.gerencia!=null){
                $scope.registro.claveUnidad = $scope.gerencia.claveUnidad;
            }

            $scope.registro.estadoFlujoId = 1;
            $scope.registro.fechaInicio=$filter('date')($scope.registro.fechaInicio, 'yyyy-MM-dd HH:mm:ss');
            $scope.registro.fechaTermino=$filter('date')($scope.registro.fechaTermino, 'yyyy-MM-dd HH:mm:ss');

            InformeBecarioCHService.createBecario($scope.registro).then(
                function (result) {
                    $scope.fromBecario.$setPristine();
                    toastr.success(result.data);
                    $rootScope.globalRegresar();
                },
                function (err) {
                    console.error(err);
                    if(err.data!=null){
                        toastr.error(err.data.message);
                    }else{
                        toastr.error(err);
                    }
                    
                });

        }


        /****Adjuntos */
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) {
                return false;
            }

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
                            // $("#filesGral").filestyle('clear');
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

        //***Confirmacion de carga de adjunto */
        function transferComplete(result) {
            $scope.$apply(function () {

                $scope.siguienteIG = false;
                if (!result.error) {
                    var adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        "moduloId": "CH",
                    }
                    $scope.fromBecario.$setDirty();
                    $scope.registro.adjunto = adjunto;
                }
            });
        }




    }

})();