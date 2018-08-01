(function () {
    'use strict';
    angular
        .module("ineelPI")
        .controller('propiedadindustrialagregarCtrl', [
            '$scope'
            , '$filter'
            , '$rootScope'
            , '$uibModal'
            , 'CatalogosPIService'
            , 'adjuntarArchivo'
            , 'PropiedadIndustrialService'
            , propiedadindustrialagregarCtrl]);

    function propiedadindustrialagregarCtrl($scope, $filter, $rootScope, $uibModal, CatalogosPIService, adjuntarArchivo, PropiedadIndustrialService) {
        /***Controlador para agregar PI desde el modulo de  PI */
        /***Controlador para agregar PI desde el modulo de  PI */
        /***Controlador para agregar PI desde el modulo de  PI */
        $scope.pi = {};
        $scope.pi.inventores = [];
        $scope.pi.proyecto = {};
        $scope.datePicker = getRangoDeFechaDefault(0, 0, 15);
        $scope.fechaActual = new Date();

        CatalogosPIService.gettipospinactivos().then(
            function (result) {
                $scope.tipos = result.data;
            }, function (error) {
                toastr.error(error.data.message);
            });

        CatalogosPIService.getestadosdelprocesoactivos().then(
            function (result) {
                $scope.estados = result.data;
            }, function (error) {
                toastr.error(error.data.message);
            });

        $scope.agregarinventorexterno = function () {
            var inventor = {};
            inventor.nombre = $scope.inventorExt.nombre;
            inventor.clavePersona = 'Externo';
            inventor.esExterno = true;
            inventor.institucion = $scope.inventorExt.institucion;
            $scope.existe = $filter('filter')($scope.pi.inventores, inventor.nombre, true);
            if ($scope.existe.length == 0) {
                $scope.pi.inventores.push(inventor);
                $scope.inventorExt = {};
                $scope.addExt = false;
            }
            else {
                toastr.warning("El autor ya se encuentra en la lista.");
            }
        }

        $scope.eliminainventor = function (inventor) {
            var index = $scope.pi.inventores.indexOf(inventor);
            $scope.pi.inventores.splice(index, 1);
        }

        $scope.getFileDetails = function (adjunto) {
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'PI' };
                    $scope.pi.adjunto = Adjunto;
                    $scope.formda.$setDirty();
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }

        $scope.guardapi = function () {
            if ($scope.pi.fechaInicioTramite != undefined && ($scope.pi.fechaInicioTramite.getFullYear() < 1975 || $scope.pi.fechaInicioTramite.getFullYear() > $scope.fechaActual.getFullYear() + 15)) {
                toastr.error("La fecha de inicio de tr&aacute;mite es inv&aacute;lida");
                return false;
            }
            if (($scope.pi.fechaProximoPago != undefined && ($scope.pi.fechaProximoPago.getFullYear() < 1975 || $scope.pi.fechaProximoPago.getFullYear() > $scope.fechaActual.getFullYear() + 15))) {
                toastr.error("La fecha de pr&oacute;ximo pago es inv&aacute;lida");
                return false;
            }
            if (($scope.pi.fechaVencimiento != undefined && ($scope.pi.fechaVencimiento.getFullYear() < 1975 || $scope.pi.fechaVencimiento.getFullYear() > $scope.fechaActual.getFullYear() + 15))) {
                toastr.error("La fecha de vencimiento es inv&aacute;lida");
                return false;
            }
            if (($scope.pi.fechaExpedicion != undefined && ($scope.pi.fechaExpedicion.getFullYear() < 1975 || $scope.pi.fechaExpedicion.getFullYear() > $scope.fechaActual.getFullYear() + 15))) {
                toastr.error("La fecha de expedici&oacute;n es inv&aacute;lida");
                return false;
            }
            if (($scope.pi.fechaPresentacion != undefined && ($scope.pi.fechaPresentacion.getFullYear() < 1975 || $scope.pi.fechaPresentacion.getFullYear() > $scope.fechaActual.getFullYear() + 15))) {
                toastr.error("La fecha de presentac&oacute;n es inv&aacute;lida");
                return false;
            }

            PropiedadIndustrialService.createpi($scope.pi).then(
                function (result) {
                    toastr.success(result.data);
                    $rootScope.globalRegresar();
                    $scope.formda.$setPristine();
                },
                function (error) {
                    toastr.error(error.message);
                }
            );
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
                var inventor = {};
                inventor.nombre = selectedItem.nombreCompleto;
                inventor.clavePersona = selectedItem.clavePersona;
                inventor.esExterno = false;

                $scope.existe = $filter('filter')($scope.pi.inventores, inventor.clavePersona, 'clavePersona');
                if ($scope.existe.length == 0) {
                    $scope.pi.inventores.push(inventor);
                    $scope.formda.$setDirty();
                }
                else {
                    toastr.warning("El autor ya se encuentra en la lista.");
                }
            });
        }

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
                $scope.pi.proyecto.nombre = selectedItem.nombre;
                $scope.pi.numeroProyecto = selectedItem.proyectoId;
                $scope.formda.$setDirty();
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
        }

    }
}());