(function () {
    'use strict';
    angular
        .module("ineelCH")
        .controller('derechosautoreditarCtrl', [
            '$scope'
            , '$filter'
            , '$state'
            , '$rootScope'
            , 'CatalogosPIService'
            , 'DerechosAutorService'
            , '$uibModal'
            , 'adjuntarArchivo'
            , derechosautoreditarCtrl]);

    function derechosautoreditarCtrl($scope, $filter, $state, $rootScope, CatalogosPIService, DerechosAutorService, $uibModal, adjuntarArchivo) {

        /***Controlador para editar DA desde la ficha personal */
        /***Controlador para editar DA desde la ficha personal */
        /***Controlador para editar DA desde la ficha personal */

        $scope.ramas = [];
        $scope.derechoautor = {};
        $scope.derechoautor.autores = [];
        $scope.derechoautorid = $rootScope.getGlobalID();




        CatalogosPIService.getramasactivas().then(
            function (response) {
                $scope.ramas = response.data;
            },
            function (error) {
                toastr.error(error.message);
            }
        );




        $scope.getda = function () {
            DerechosAutorService.getdabyid($scope.derechoautorid).then(
                function (response) {
                    $scope.derechoautor = response.data;
                    if ($scope.derechoautor.proyecto != null && $scope.derechoautor.proyecto != undefined) {
                        $scope.derechoautor.Proyectonombre = $scope.derechoautor.proyecto.nombre;
                    }

                    if ($scope.derechoautor != null) {
                        if ($scope.derechoautor.fechaExpedicion) {
                            $scope.derechoautor.fechaExpedicion = new Date($scope.derechoautor.fechaExpedicion);
                        }
                        if ($scope.derechoautor.fechaSolicitud) {
                            $scope.derechoautor.fechaSolicitud = new Date($scope.derechoautor.fechaSolicitud);
                        }
                        if ($scope.derechoautor.adjuntoId == null) { $scope.regFile = true; } else { $scope.regFile = false; $scope.archivos = 1; }
                        if ($scope.derechoautor.estadoFlujoId === 2) {
                            toastr.success("Solicitud enviada");
                            $rootScope.globalRegresar();
                        }
                    }
                },
                function (error) {
                    toastr.error(error.message);
                }
            );

        }
        $scope.getda();


        $scope.openProyecto = function () {
            $scope.desabilitar = true;
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                //templateUrl: 'app/vistasGenericas/buscarProyecto.html',
                //controller: 'ProyectosFilterGetCtrl',

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


                $scope.derechoautor.proyecto = selectedItem;
                $scope.derechoautor.numeroProyecto = selectedItem.proyectoId;
                //$scope.derechoautor.proyecto.nombre = selectedItem.nombre;
                //$scope.derechoautor.proyecto.proyectoId = selectedItem.proyectoId;


                $scope.derechoautor.proyecto.nombre = selectedItem.nombre;
                $scope.derechoautor.Proyectonombre = selectedItem.nombre;
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
        }


        $scope.clean = function () {
            $scope.derechoautor.Proyectonombre = null;
            $scope.derechoautor.numeroProyecto = null;
            $scope.derechoautor.proyecto.nombre = null;
            $scope.derechoautor.proyecto.proyectoId = null;
            $scope.derechoautor.relacionMedianteProyecto = false;
            $scope.derechoautor.proyecto = null;
        }

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
                var autor = {};
                autor.nombre = selectedItem.nombreCompleto;
                autor.clavePersona = selectedItem.clavePersona;
                autor.esExterno = false;
                $scope.existe = $filter('filter')($scope.derechoautor.autores, autor.clavePersona, 'clavePersona');
                if ($scope.existe.length == 0) {
                    $scope.derechoautor.autores.push(autor);
                }
                else {
                    toastr.warning("El autor ya se encuentra en la lista.");
                }
            });
        }

        $scope.agregarautorexterno = function () {
            var autor = {};
            autor.nombre = $scope.autorExt.nombre;
            autor.clavePersona = 'Externo';
            autor.esExterno = true;
            autor.institucion = $scope.autorExt.institucion;
            $scope.existe = $filter('filter')($scope.derechoautor.autores, autor.nombre, true);
            if ($scope.existe.length == 0) {
                $scope.derechoautor.autores.push(autor);
                $scope.autorExt = {};
                $scope.addExt = false;
            }
            else {
                toastr.warning("El autor ya se encuentra en la lista.");
            }
        }

        $scope.eliminaautor = function (autor) {
            var index = $scope.derechoautor.autores.indexOf(autor);
            $scope.derechoautor.autores.splice(index, 1);
        }

        $scope.getFileDetails = function (adjunto) {
            $scope.formda.$setDirty();

            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'PI' };
                    $scope.derechoautor.adjunto = Adjunto;
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }

        $scope.deleteFile = function () {
            $scope.formda.$setDirty();
            $scope.derechoautor.adjunto = null;
            $scope.derechoautor.adjuntoId = null;
            $scope.derechoautor.accion = "elimina";
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
        }

        //Funcion para agregar registro

        $scope.actualizarda = function () {

            if ($scope.derechoautor.estadoFlujoId == 3) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/vistasGenericas/modificarValidados.html', controller: function ($uibModalInstance) {
                        $scope.ok = function () {
                            $scope.actualizardaF();
                            $uibModalInstance.dismiss('cancel'); $scope.dtInstance._renderer.rerender();
                        }; $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
                    }, scope: $scope
                });
            } else {
                $scope.actualizardaF();
            }

        }

        $scope.actualizardaF = function () {
            if ($scope.derechoautor.autores.length == 0) {
                toastr.error("Ingrese al menos un autor interno.");
                return false;
            }

            $scope.derechoautor.listacoautores="";
            var inventores = $filter('filter')($scope.derechoautor.autores, { esExterno: false });
            for (var i = 0; i < inventores.length; i++) {
                $scope.derechoautor.listacoautores += inventores[i].clavePersona + ",";
            }

            DerechosAutorService.updateda($scope.derechoautor).then(
                function (result) {
                    toastr.success(result.data);
                    $scope.formda.$setPristine();
                    $scope.getda();
                },
                function (err) {
                    toastr.error(err.message);
                });
        }

        $scope.validarFechas = function () {

            $scope.fechaActual = new Date();
            $scope.finalDateComparacion = new Date($scope.derechoautor.fechaExpedicion);
            if ($scope.finalDateComparacion >= $scope.fechaActual) {
                toastr.error("Fecha de certificado deber ser menor a la fecha actual");
                $scope.derechoautor.fechaExpedicion = "";
                return false;
            }
        }


        $scope.regresar = function () {
            $state.go("fichapersonal.daexterno", { seccion: 'daexterno' });
        }

    }//fin 
}());