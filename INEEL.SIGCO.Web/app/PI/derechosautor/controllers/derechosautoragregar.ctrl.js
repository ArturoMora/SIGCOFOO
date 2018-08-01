(function () {
    'use strict';
    angular
        .module("ineelPI")
        .controller('derechosautoragregarCtrl', [
            '$scope'
            , '$filter'
            , '$state'
            , 'CatalogosPIService'
            , 'DerechosAutorService'
            , '$uibModal'
            , 'adjuntarArchivo'
            , derechosautoragregarCtrl]);

    function derechosautoragregarCtrl($scope, $filter, $state, CatalogosPIService, DerechosAutorService, $uibModal, adjuntarArchivo) {
        /***Controlador para agregar DA desde el modulo de  PI */
        /***Controlador para agregar DA desde el modulo de  PI */
        /***Controlador para agregar DA desde el modulo de  PI */
        $scope.ramas = [];
        $scope.derechoautor = {};
        $scope.derechoautor.autores = [];
        $scope.derechoautor.proyecto = {};
        $scope.datePicker = getRangoDeFechaDefault(0, 0, 15);
        $scope.fechaActual = new Date();

        CatalogosPIService.getramasactivas().then(
            function (response) {
                $scope.ramas = response.data;
            },
            function (error) {
                toastr.error(error.message);
            }
        );


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
                if ($scope.existe.length == 0) {
                    $scope.derechoautor.autores.push(autor);
                    $scope.formda.$setDirty();
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
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'PI' };
                    $scope.derechoautor.adjunto = Adjunto;
                    $scope.formda.$setDirty();
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }

        //Funcion para agregar registro
        $scope.guardarda = function () {
            if ( ($scope.derechoautor.fechaSolicitud != undefined && ($scope.derechoautor.fechaSolicitud.getFullYear() < 1975 || $scope.derechoautor.fechaSolicitud.getFullYear() > $scope.fechaActual.getFullYear() + 15))) {
                toastr.error("La fecha de solicitud es inv&aacute;lida");
                return false;
            }
            if (($scope.derechoautor.fechaExpedicion.getFullYear() < 1975 || $scope.derechoautor.fechaExpedicion.getFullYear() > $scope.fechaActual.getFullYear() + 15)) { //fecha de certificado
                toastr.error("La fecha de certificado es inv&aacute;lida");
                return false;
            }
            if ($scope.derechoautor.autores.length == 0) {
                toastr.error("Ingrese al menos un autor interno.");
                return false;
            }

            DerechosAutorService.createda($scope.derechoautor).then(
                function (result) {
                    toastr.success("Registro creado exitosamente!");
                    $state.go("derechosautorget");
                },
                function (err) {
                    toastr.error(err.data.message);
                });
        }


        $scope.limpiaX = function () {
            $scope.derechoautor.proyectoNombre = "";
            $scope.derechoautor.numeroProyecto = "";
        }

    }//fin 
}());