(function () {
    "use strict";
    angular
        .module("ineelCR")
        .controller("estudiosmercadoCtrlEdit", ['AuthService', '$state','$scope', '$rootScope', '$stateParams','EstudioMercadoService', 'globalGet', '$filter', "uploadFileACH", "$uibModal", "DTOptionsBuilder", estudiosmercadoCtrlEdit]);

    function estudiosmercadoCtrlEdit(AuthService, $state, $scope, $rootScope, $stateParams, EstudioMercadoService, globalGet, $filter, uploadFileACH, $uibModal, DTOptionsBuilder) {
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('t');
        $scope.areaasignada = {};
        $scope.urlDescarga = API + "Descarga/GetFile";
        $scope.adjuntos = [];

        var id = $stateParams.id;
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        ////////////////////////////////////////
        EstudioMercadoService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
                $scope.registro.fecha = new Date($scope.registro.fecha);
                $scope.registro.proyectoNombre = $scope.registro.proyecto.nombre;
                $scope.areaasignada.nombreUnidad = $scope.registro.unidadOrganizacional.nombreUnidad;
                $scope.areaasignada.claveUnidad = $scope.registro.claveUnidad;

                if ($scope.registro.listaAdjuntos.length > 0) {
                    $scope.regFile = true;
                    for (var c = 0; c < $scope.registro.listaAdjuntos.length; c++) {
                        $scope.adjuntos.push($scope.registro.listaAdjuntos[c]);
                    }
                } else {
                    $scope.regFile = false;

                }
            },
            function (err) {
                toastr.error("No se han podido cargar el Estudio de Mercado.");
            }
        );
        $scope.autores = [];
        EstudioMercadoService.autores(id).then(
            function (result) {
                $scope.autores = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el Estudio de Mercado.");
            }
        );


        $scope.deleteFile = function (id) {
            $scope.adjuntos.splice(id, 1);
            $scope.ValidForm.$setDirty();
            angular.element("input[type='file']").val(null);
        }

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
                toastr.success("Registro actualizado correctamente!");
                // $scope.ValidForm.$setDirty();
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
                resolve: {
                    proyectoSelect: function () {
                        $scope.verproyecto = false;
                        return $scope.proyectoSelect;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.registro.proyectoNombre = selectedItem.nombre;
                $scope.registro.proyectoId = selectedItem.proyectoId;
                $scope.ValidForm.$setDirty();
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
        }
        //>>>>>>> refs/remotes/origin/desarrollo/todos
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.ModificaPais = function () {
            $scope.paisanterior = $scope.paises[$scope.pais - 1].descripcion;
            $scope.registro.lugarCongreso = $scope.paisanterior;
        }

        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
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
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
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
        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        $scope.update = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                if ($scope.registro.fecha > $scope.hoy) {
                    toastr.error("La fecha debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                $scope.desabilitar = true;
                $scope.registro.claveUnidad = $scope.areaasignada.claveUnidad;
                
                // for (var i = 0; i < $scope.registro.listaAdjuntos.length; i++) {
                //   var archivo= {"adjuntoId":$scope.registro.listaAdjuntos[i].adjuntoId,
                //     "nombre": $scope.registro.listaAdjuntos[i].nombre
                //   };

                //   $scope.adjuntos.push(archivo);

                // }
                $scope.registro.listaAdjuntos = $scope.adjuntos;
                EstudioMercadoService.update($scope.registro).then(
                    function (result) {
                        if (result.data.adjuntoId != null) {
                            $scope.registro.adjunto.adjuntoId = result.data.adjuntoId;
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
                        toastr.success("Registro Actualizado Exitosamente!");
                        $scope.desabilitar = false;
                        $(":file").filestyle('clear');
                        $state.go("estudiosmercado");
                    });
            }
        }

        //$scope.deleteFile = function () {
        //    $scope.registro.adjunto.nombre = "eliminar";
        //    EstudioMercadoService.update($scope.registro);
        //    toastr.success("Archivo Eliminado!");
        //    $scope.registro.adjuntoId = null;
        //    $scope.archivos = 0;
        //    $scope.regFile = true;
        //    angular.element("input[type='file']").val(null);
        //    $scope.archivoCargado = "0";
        //}

        //Usuarios
        $scope.add_user = function () {
            var registro = {
                "clavePersona": $scope.PersonaSeleccionada.clavePersona,
                "nombrePersona": $scope.PersonaSeleccionada.nombreCompleto,
                "estudiosMercadoId": $scope.registro.estudiosMercadoId

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
            EstudioMercadoService.add_Autores(registro).then(function (result) { });
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
                "estudiosMercadoId": $scope.registro.estudiosMercadoId
            };
            $scope.autores.push(registro);
            $scope.nombreAutor = null;
            EstudioMercadoService.add_Autores(registro).then(function (result) { });
        }

        $scope.eliminarAutor = function (registro) {
            $scope.descripcionRow = registro.nombrePersona;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {

                        $scope.delete(registro, $uibModalInstance);
                        $scope.ValidForm.$setDirty();
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
            EstudioMercadoService.delete_Autor(registro.autoresEstudioMercadoId).then(function (result) { });
            $uibModalInstance.dismiss('close');
        };


    }
})();
