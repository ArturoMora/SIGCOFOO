(function () {
    'use strict';
    angular
        .module("ineelPI")
        .controller('propiedadindustrialeditarCtrl', [
            '$scope'
            , '$filter'
            , '$stateParams'
            , '$uibModal'
            , 'CatalogosPIService'
            , 'adjuntarArchivo'
            , 'PropiedadIndustrialService'
            , propiedadindustrialeditarCtrl]);

    function propiedadindustrialeditarCtrl($scope, $filter, $stateParams, $uibModal, CatalogosPIService, adjuntarArchivo, PropiedadIndustrialService) {
        /***Controlador para editar PI desde el modulo de  PI */
        /***Controlador para editar PI desde el modulo de  PI */
        /***Controlador para editar PI desde el modulo de  PI */
        $scope.pi = {};
        $scope.pi.inventores = [];
        $scope.datePicker = getRangoDeFechaDefault(0, 0, 15);
        $scope.fechaActual = new Date();
        $scope.piid = $stateParams.id;


      

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

        PropiedadIndustrialService.getbyid($scope.piid).then(
            function (response) {
                $scope.pi = response.data;
                if ($scope.pi.fechaExpedicion != null) {
                    $scope.pi.fechaExpedicion = new Date($scope.pi.fechaExpedicion);
                }
                if ($scope.pi.fechaPresentacion != null) {
                    $scope.pi.fechaPresentacion = new Date($scope.pi.fechaPresentacion);
                }
                if ($scope.pi.fechaVencimiento != null) {
                    $scope.pi.fechaVencimiento = new Date($scope.pi.fechaVencimiento);
                }
                if ($scope.pi.fechaProximoPago != null) {
                    $scope.pi.fechaProximoPago = new Date($scope.pi.fechaProximoPago);
                }
                if ($scope.pi.fechaInicioTramite != null) {
                    $scope.pi.fechaInicioTramite = new Date($scope.pi.fechaInicioTramite);
                }
                if ($scope.pi.adjuntoId == null) { $scope.regFile = true; } else { $scope.regFile = false; $scope.archivos = 1; }

                if ($scope.pi.proyecto == null) { $scope.pi.proyecto = {}; }
                if ($scope.pi.unidadOrganizacional !== null) { $scope.unidadOselect = $scope.pi.unidadOrganizacional; }

            },
            function (error) {
                toastr.error(error.message);
            }
        );


        $scope.actualizarpi = function () {
            if($scope.pi.fechaInicioTramite != undefined && ($scope.pi.fechaInicioTramite.getFullYear() < 1975 || $scope.pi.fechaInicioTramite.getFullYear() > $scope.fechaActual.getFullYear() + 15)){
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

            PropiedadIndustrialService.updatepi($scope.pi).then(
                function (result) {
                    $scope.formda.$setPristine();
                    toastr.success(result.data);
                },
                function (error) {
                    toastr.error(error.message);
                }
            );
        }

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

        $scope.deleteFile = function () {
            $scope.pi.adjunto = null;
            $scope.pi.adjuntoId = null;
            $scope.regFile = true;
            $scope.pi.accion = "elimina";
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
            $scope.formda.$setDirty();
        }

        $scope.clean = function () {
            
            $scope.pi.proyecto.nombre = null;
            $scope.pi.numeroProyecto = null;

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
                controller: 'ProyectosFilterGetCtrl',
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