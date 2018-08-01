(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("estudiosmercadoCtrlAdd", [
        "AuthService",
        "$filter",
        "$scope",
        "$state",
        "$stateParams",
        "DTOptionsBuilder",
        "$uibModal",
        "uploadFileACH",
        "FileUploader",
        "globalGet",
        "EstudioMercadoService",
        estudiosmercadoCtrlAdd
    ]);

    function estudiosmercadoCtrlAdd(AuthService, $filter, $scope, $state, $stateParams, DTOptionsBuilder, $uibModal, uploadFileACH, FileUploader, globalGet, EstudioMercadoService) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;
        $scope.registro = {};
        $scope.autores = [];
        $scope.adjuntos = [];
        $scope.archivoCargado = "0";
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('t');
        //$scope.subprogramasProyecto = "92";


        //////////////////////Buscar persona////////////
        $scope.PersonaSeleccionada = {};
        $scope.openUser = function () {
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        return $scope.empleado;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.PersonaSeleccionada = selectedItem;
                $scope.userAdd = true;
                $scope.add_user();
                $scope.ValidForm.$setDirty();
            });
        }
        ///////////////////////////////////////////////////////////////
        //Proyecto
        $scope.openProyecto = function () {
            $scope.desabilitar = true;
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarProyecto.html',
                controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.registro.proyectoNombre = selectedItem.nombre;
                $scope.registro.proyectoId = selectedItem.proyectoId;
            });
            $scope.desabilitar = false;
            $scope.ValidForm.$setDirty();
        }
        

        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
         
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
                        $scope.archivoCargado = "1";
                    } else {
                        toastr.error(result.message);
                        $scope.archivoCargado = "0";
                    }
                } else {
                    var error = err.message || "Error al adjuntar";
                    toastr.error(error);
                    $scope.archivoCargado = "0";
                }
                
            });
        };
        function transferComplete(result) {
            
           
            $scope.$apply(function () {
                if (result.error === false) {
                    var adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CR"
                    }
                    $scope.adjuntos.push(adjunto);
                    $scope.ValidForm.$setDirty();
                    angular.element("input[type='file']").val(null);
                }
            });
           
        }

        $scope.add = function () {
            //if ($scope.ValidForm.$invalid || $scope.registro.adjunto == null) {
            //    toastr.error("Complete los datos requeridos");
            //    return false;
            //} else {
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                if ($scope.registro.fecha > $scope.hoy) {
                    toastr.error("La fecha debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                $scope.desabilitar = true;
                $scope.registro.listaAdjuntos = $scope.adjuntos;
                $scope.registro.claveUnidad =$scope.areaasignada.claveUnidad;
                EstudioMercadoService.add($scope.registro).then(
                    function (result) {
                        for (var t = 0; t < $scope.autores.length; t++) {
                            $scope.autores[t].estudiosMercadoId = result.data;
                        }
                        ///////Agregar autores
                        EstudioMercadoService.addAutores($scope.autores).then(
                        function (result) {
                            toastr.success("Registro creado exitosamente!");
                            $state.go("estudiosmercado");
                        });
                        ///////////////////
                        
                    });
            //}
        };

        $scope.deleteFile = function (id) {
            $scope.adjuntos.splice(id, 1);
        }
        /////////////////////Funciones de autores
        $scope.add_user = function () {
            var registro = {
                "clavePersona":$scope.PersonaSeleccionada.clavePersona,
                "nombrePersona": $scope.PersonaSeleccionada.nombreCompleto,
                "estudiosMercadoId":""

            };
            for (var i = 0; i < $scope.autores.length; i++) {
                if ($scope.autores[i].clavePersona == registro.clavePersona) {
                    toastr.error("El autor " + registro.nombrePersona + " ya existe dentro de la tabla de autores!");
                    $scope.autorIIE = {};
                    return false;
                }
            }
            $scope.autores.push(registro);
            $scope.userAdd = false;
            $scope.PersonaSeleccionada = null;
        }

        $scope.add_userExt = function () {
            if ($scope.nombreAutor == null) {
                toastr.error("Ingrese el nombre del Autor!");
                return false;
            }
            $scope.addExt = false;
            for (var i = 0; i < $scope.autores.length; i++) {
                if (($scope.autores[i].clavePersona == "") && ($scope.autores[i].nombrePersona == $scope.nombreAutor)) {
                    toastr.error("El autor " + $scope.nombreAutor + " ya existe dentro de la tabla de autores!");
                    $scope.addExt = true;
                    return false;
                }
            }
            var registro = {
                "clavePersona": "",
                "nombrePersona": $scope.nombreAutor,
                "estudiosMercadoId": ""
            };
            $scope.autores.push(registro);
            $scope.nombreAutor = null;

        }

        $scope.eliminarAutor = function (registro) {
            $scope.descripcionRow = registro.nombrePersona;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {

                        $scope.delete(registro, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.delete = function (registro, $uibModalInstance) {
            var idx = ($scope.autores.indexOf(registro));
            $scope.autores.splice(idx, 1);
            $uibModalInstance.dismiss('close');
        };
        
    }
})();