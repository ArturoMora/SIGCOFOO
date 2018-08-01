(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("piexternoEditarCtrl", [
            '$scope'
            , '$filter'
            , '$state'
            , '$rootScope'
            , '$uibModal'
            , 'CatalogosPIService'
            , 'adjuntarArchivo'
            , 'PropiedadIndustrialService'
            , piexternoEditarCtrl]);

    function piexternoEditarCtrl($scope, $filter, $state, $rootScope, $uibModal, CatalogosPIService, adjuntarArchivo, PropiedadIndustrialService) {
        /****Controlador editar PI desde ficha personal */
        /****Controlador editar PI desde ficha personal */
        /****Controlador editar PI desde ficha personal */

        $scope.editarGestion = 0;
        $scope.idGF = $rootScope.GestionFichasClave;
        if ($scope.idGF != null) {
            $scope.editarGestion = 1;
        }
        $scope.pi = {};

        $scope.piid = $rootScope.getGlobalID();



        CatalogosPIService.gettipospin().then(
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

        $scope.consultapi = function () {
            PropiedadIndustrialService.getbyid($scope.piid).then(
                function (response) {
                    $scope.pi = response.data;
                    if ($scope.pi.estadoFlujoId === 2) {
                        $state.go("fichapersonal.piexterno", { seccion: 'piexterno' });
                    }
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
                    if ($scope.pi.unidadOrganizacional !== null) {
                        $scope.unidadOselect = $scope.pi.unidadOrganizacional;
                    }
                },
                function (error) {
                    toastr.error(error.message);
                }
            );
        }

        $scope.consultapi();


        $scope.actualizarpi = function () {
            if ($scope.pi.estadoFlujoId == 3) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/vistasGenericas/modificarValidados.html', controller: function ($uibModalInstance) {
                        $scope.ok = function () {
                            $scope.actualizarpi2();
                            $uibModalInstance.dismiss('cancel'); $scope.dtInstance._renderer.rerender();
                        }; $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
                    }, scope: $scope
                });
            } else {
                $scope.actualizarpi2();
            }
        }


        $scope.actualizarpi2 = function () {

            $scope.pi.listacoautores = "";
            var inventores = $filter('filter')($scope.pi.inventores, { esExterno: false });
            for (var i = 0; i < inventores.length; i++) {
                $scope.pi.listacoautores += inventores[i].clavePersona + ",";
            }

            PropiedadIndustrialService.updatepi($scope.pi).then(
                function (result) {
                    toastr.success(result.data);
                    $scope.formda.$setPristine();
                    $scope.consultapi();
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
            $scope.pi.accion = "elimina";
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
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
                }
                else {
                    toastr.warning("El autor ya se encuentra en la lista.");
                }
                $scope.formda.$setDirty();
            });

        }

        $scope.regresar = function () {
            $state.go("fichapersonal.piexterno", { seccion: 'piexterno' });
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


        $scope.clean = function () {

            $scope.pi.proyecto.nombre = null;
            $scope.pi.numeroProyecto = null;

        }

    }
})();