(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("InformeBecarioInternoAddCtrl"
            , ['$rootScope', 'AuthService'
                , '$scope'
                , 'BecarioInternoService'
                , 'globalGet'
                , 'uploadFileACH'
                , '$state'
                , '$filter'
                , '$uibModal'
                , InformeBecarioInternoAddCtrl]);

    function InformeBecarioInternoAddCtrl($rootScope, AuthService, $scope, BecarioInternoService, globalGet, uploadFileACH, $state, $filter, $uibModal) {
        //Variable API
        var API = globalGet.get("api");
        $scope.datePicker = getRangoDeFechaDefault(0, 0, 10);
        $scope.authentication = AuthService.authentication;
        $scope.requiredatalisttestinputinstitucion = true;
        $scope.registro = {};
        
        BecarioInternoService.getBecaInterna().then(
            function (result) {
                $scope.becasinternas = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de becas internas.");
            }
        );
        BecarioInternoService.getCarrera().then(
            function (result) {
                $scope.carreras = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de carreras.");
            }
        );
        BecarioInternoService.getInstituciones().then(
            function (result) {
                $scope.instituciones = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de instituciones.");
            }
        );

        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }

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
                    $scope.registro.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.ValidForm.$setDirty();
                }
            });

        }

        //Buscar personal de investigacion ***
        $scope.openPersonal = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.registro.nombreBecario = selectedItem.nombreCompleto;
                $scope.registro.clavePersona = selectedItem.clavePersona;
                $scope.ValidForm.$setDirty();
            });

        }

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
                $scope.registro.carreraId = selectedItem.carreraId;
                $scope.ValidForm.$setDirty();
            });
            $scope.desabilitar = false;
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
                $scope.registro.institucionID = selectedItem.institucionID;
                $scope.registro.paisID = selectedItem.pais.paisID;
                $scope.ValidForm.$setDirty();
            });
            $scope.desabilitar = false;
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
        $scope.add = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {

                //Validacion Fechas

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
                if ($scope.registro.fechaBaja != null && ($scope.registro.fechaBaja <= $scope.registro.fechaInicioBeca || $scope.registro.fechaBaja >= $scope.registro.fechaTerminoBeca)) {
                    toastr.error("La Fecha de Baja debe estar entre el periodo de inicio y término de la beca.");
                    return false;
                }
                if ($scope.registro.fechaTerminoExt != null) {
                    $scope.registro.extencion = 1;

                    if ($scope.registro.fechaTerminoExt <= $scope.registro.fechaTerminoBeca) {
                        toastr.error("La fecha de extensión debe ser mayor a la fecha de término de la beca.");
                        return false;
                    }
                } else {
                    $scope.registro.extencion = 0;
                }

                $scope.desabilitar = true;
                $scope.registro.estadoFlujoId = "1";
                BecarioInternoService.add($scope.registro).then(
                    function (result) {
                        toastr.success(result.data);
                        $rootScope.globalRegresar();
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


            }
        }


    }
})();