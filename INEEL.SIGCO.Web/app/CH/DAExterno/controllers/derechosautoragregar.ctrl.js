(function () {
    'use strict';
    angular
        .module("ineelCH")
        .controller('derechosautoragregarCtrl', [
            '$scope'
            ,'$state'
            , '$filter'
            , '$rootScope'
            , 'AuthService'
            , 'CatalogosPIService'
            , 'DerechosAutorService'
            , '$uibModal'
            , 'adjuntarArchivo'
            , derechosautoragregarCtrl]);

    function derechosautoragregarCtrl($scope,$state, $filter, $rootScope, AuthService, CatalogosPIService, DerechosAutorService, $uibModal, adjuntarArchivo) {
        /*****Este controlador es de la vista de "derechosautoragregar.html" que esta en CH */

        $scope.ramas = [];
        $scope.derechoautor = {};
        $scope.derechoautor.autores = [];
        var origenCH = $rootScope.getOrigen() == 'CH' ? true : false;

        $scope.validarFechas = function () {

            $scope.fechaActual = new Date();
            $scope.finalDateComparacion = new Date($scope.derechoautor.fechaExpedicion);
            if ($scope.finalDateComparacion >= $scope.fechaActual) {
                toastr.error("Fecha de certificado deber ser menor a la fecha actual");
                $scope.derechoautor.fechaExpedicion = "";
                return false;
            }
          }

        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;

        if ($scope.idGF == null) {
            $scope.derechoautor.clavePersona = AuthService.authentication.userprofile.clavePersona;
            $scope.derechoautor.nombrePersona = AuthService.authentication.nombreCompleto;

            var autor = {};
            autor.nombre = $scope.derechoautor.nombrePersona;
            autor.clavePersona = $scope.derechoautor.clavePersona;
            autor.esExterno = false;
            $scope.derechoautor.autores.push(autor);
        } else {
            $scope.derechoautor.clavePersona = $scope.idGF;
            $scope.derechoautor.nombrePersona = $scope.nomGF;
        }

        CatalogosPIService.getramasactivas().then(
            function (response) {
                $scope.ramas = response.data;
            },
            function (error) {
                toastr.error(error.message);
            }
        );

        $scope.regresar=function(){
            $state.go("fichapersonal.daexterno", { seccion: 'daexterno' });
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
                $scope.derechoautor.proyectoNombre = selectedItem.nombre;
                $scope.derechoautor.numeroProyecto = selectedItem.proyectoId;
                $scope.formda.$setDirty();
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
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
                $scope.formda.$setDirty();
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
            $scope.existe = $filter('filter')($scope.derechoautor.autores, autor.nombre,true);
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
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'PI' };
                    $scope.derechoautor.adjunto = Adjunto;
                    $scope.formda.$setDirty()
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }


        $scope.limpiaX = function () {
            $scope.derechoautor.proyectoNombre ="";
            $scope.derechoautor.numeroProyecto = null;
            $scope.formda.$setDirty();
        }


        //Funcion para agregar registro
        $scope.guardarda = function () {

            if ($scope.derechoautor.autores.length == 0) {
                toastr.error("Ingrese al menos un autor interno.");
                return false;
            }

            DerechosAutorService.createdach($scope.derechoautor).then(
                function (result) {
                    toastr.success("Registro creado exitosamente!");
                    if (origenCH) {
                        $state.go("fichapersonal.daexterno", { seccion: 'daexterno' });
                    } else {
                        $rootScope.globalRegresar();
                    }
                },
                function (err) {
                    toastr.error(err.message);
                });
        }

    }//fin 
}());