(function () {
    'use strict';
    angular
        .module("ineelPI")
        .controller('derechosautoreditarCtrl', [
            '$scope'
            , '$filter'
            , '$rootScope'
            , '$stateParams'
            , 'CatalogosPIService'
            , 'DerechosAutorService'
            , '$uibModal'
            , 'adjuntarArchivo'
            , derechosautoreditarCtrl]);

    function derechosautoreditarCtrl($scope, $filter, $rootScope, $stateParams, CatalogosPIService, DerechosAutorService, $uibModal, adjuntarArchivo) {
        /***Controlador para editar DA desde el modulo de  PI */
        /***Controlador para editar DA desde el modulo de  PI */
        /***Controlador para editar DA desde el modulo de  PI */
        $scope.ramas = [];
        $scope.derechoautor = {};
        $scope.derechoautor.proyecto = {};
        $scope.derechoautor.autores = [];
        $scope.derechoautorid = $stateParams.id;
        $scope.editarGestion = 0;
        $scope.fechaActual = new Date();
        $scope.idGF = $rootScope.GestionFichasClave;


     
    
        if ($scope.idGF != null) {
            $scope.editarGestion = 1;
        }

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
                    if ($scope.derechoautor != null) {
                        if ($scope.derechoautor.fechaExpedicion) {
                            $scope.derechoautor.fechaExpedicion = new Date($scope.derechoautor.fechaExpedicion);
                        }
                        if ($scope.derechoautor.fechaSolicitud) {
                            $scope.derechoautor.fechaSolicitud = new Date($scope.derechoautor.fechaSolicitud);
                        }
                        if ($scope.derechoautor.adjuntoId == null) { $scope.regFile = true; } else { $scope.regFile = false; $scope.archivos = 1; }

                        if ($scope.derechoautor.proyecto == null){ $scope.derechoautor.proyecto = {};}
                        if($scope.derechoautor.unidadOrganizacional !== null){
                            $scope.unidadOselect = $scope.derechoautor.unidadOrganizacional;
                        }
                        
                        if ($scope.derechoautor.estadoFlujoId === 2) {
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
                $scope.derechoautor.proyecto.nombre = selectedItem.nombre;
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

        $scope.deleteFile = function () {
            $scope.derechoautor.adjunto = null;
            $scope.derechoautor.adjuntoId = null;
            $scope.derechoautor.accion = "elimina";
            $scope.regFile = true;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
            $scope.formda.$setDirty();
        }

        //Funcion para agregar registro
        $scope.actualizarda = function () {
            if (($scope.derechoautor.fechaSolicitud != undefined && ($scope.derechoautor.fechaSolicitud.getFullYear() < 1975 || $scope.derechoautor.fechaSolicitud.getFullYear() > $scope.fechaActual.getFullYear() + 15))) {
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

            DerechosAutorService.updateda($scope.derechoautor).then(
                function (result) {
                    toastr.success(result.data);
                   
                    $scope.getda();
                    $scope.formda.$setPristine();

                },
                function (err) {
                    toastr.error(err.message);
                });
        }

        



    }//fin 
}());