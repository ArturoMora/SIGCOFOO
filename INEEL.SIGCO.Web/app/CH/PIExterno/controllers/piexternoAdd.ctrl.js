(function () {
    "use strict";

    angular
        .module("ineelCH")
        .directive('numbersOnly', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attr, ngModelCtrl) {
                    function fromUser(text) {
                        if (text) {
                            var transformedInput = text.replace(/[^0-9]/g, '');

                            if (transformedInput !== text) {
                                ngModelCtrl.$setViewValue(transformedInput);
                                ngModelCtrl.$render();
                            }
                            return transformedInput;
                        }
                        return undefined;
                    }
                    ngModelCtrl.$parsers.push(fromUser);
                }
            };
        })
        .controller("piexternoAddCtrlAdd", [
            '$scope'
            , '$state'
            , '$filter'
            , '$rootScope'
            , '$uibModal'
            , 'AuthService'
            , 'CatalogosPIService'
            , 'adjuntarArchivo'
            , 'PropiedadIndustrialService'
            , piexternoAddCtrlAdd]);
    function piexternoAddCtrlAdd($scope, $state, $filter, $rootScope, $uibModal, AuthService, CatalogosPIService, adjuntarArchivo, PropiedadIndustrialService) {

        window.scrollTo(0, 0);
        $scope.pi = {};
        $scope.pi.inventores = [];
        $scope.pi.proyecto = {};
        var origenCH = $rootScope.getOrigen() == 'CH' ? true : false;




        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;

        if ($scope.idGF == null) {
            $scope.pi.clavePersona = AuthService.authentication.userprofile.clavePersona;
            $scope.pi.nombrePersona = AuthService.authentication.nombreCompleto;
        } else {
            $scope.pi.clavePersona = $scope.idGF;
            $scope.pi.nombrePersona = $scope.nomGF;
        }
        var autor = {};
        autor.nombre = $scope.pi.nombrePersona;
        autor.clavePersona = $scope.pi.clavePersona;
        autor.esExterno = false;
        $scope.pi.inventores.push(autor);

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

        $scope.regresar=function(){
            $state.go("fichapersonal.piexterno", { seccion: 'piexterno' });
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

            PropiedadIndustrialService.createpich($scope.pi).then(
                function (result) {
                    toastr.success(result.data);
                    if (origenCH) {
                        $state.go("fichapersonal.piexterno", { seccion: 'piexterno' });
                    } else {
                        $rootScope.globalRegresar();
                    }
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
                var autor = {};
                autor.nombre = selectedItem.nombreCompleto;
                autor.clavePersona = selectedItem.clavePersona;
                autor.esExterno = false;
                $scope.existe = $filter('filter')($scope.pi.inventores, autor.clavePersona, 'clavePersona');
                if ($scope.existe.length == 0) {
                    $scope.pi.inventores.push(autor);
                }
                else {
                    toastr.warning("El autor ya se encuentra en la lista.");
                }
                $scope.formda.$setDirty();
            });
        }

        $scope.limpiaX = function(){
                $scope.pi.proyecto.nombre = null;
                $scope.pi.numeroProyecto = null;
                $scope.formda.$setDirty();
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
})();