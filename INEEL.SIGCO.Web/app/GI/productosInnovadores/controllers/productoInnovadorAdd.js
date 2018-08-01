(function () {
    'use strict';
    angular
        .module("ineelGI")
        .controller('productoInnovadorAdd', ['$scope', 'AuthService', 'MenuService', 'comunCountService', 'comunService',
            'IdeainnovadoraService', 'carteraPropuestaService',
            'ngFabForm', 'productoInnovadorService', '$state', '$uibModal', 'adjuntarArchivo', productoInnovadorAdd]);

    function productoInnovadorAdd($scope, AuthService, MenuService, comunCountService, comunService,
        IdeainnovadoraService, carteraPropuestaService,
        ngFabForm, productoInnovadorService, $state, $uibModal, adjuntarArchivo) {
        $scope.authentication = AuthService.authentication;
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        $scope.registro = {};
        $scope.comunidad = {};
        $scope.proponentes = [];
        $scope.proponente = {};
        $scope.auxColabora = [];
        $scope.PersonaSeleccionada = {};

        /////////////////////////Buscar Proyecto
        $scope.verproyecto = false;
        $scope.openProyecto = function () {
            $scope.desabilitar = true; $scope.proyectoSelect = {}; var modalInstance = $uibModal.open({
                size: 'lg', templateUrl: 'app/vistasGenericas/buscarProyecto.html', controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                resolve: { proyectoSelect: function () { $scope.verproyecto = false; return $scope.proyectoSelect; } }, scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                toastr.clear();
                comunService.PersonalProyecto_GetByClave($scope.registro.clavePersona, selectedItem.proyectoId).then(
                    function (result) {
                        if (result.data != null && result.data.length > 0) {
                            toastr.warning(selectedItem.nombre, "Ya se encuentra como participante del proyecto");
                        } else {
                            $scope.elemento = selectedItem;
                            $scope.registro.proyectoNombre = selectedItem.nombre;
                            $scope.registro.proyectoId = selectedItem.proyectoId;
                            $scope.registro.UnidadOrganizacionalId = selectedItem.claveUnidad;
                            $scope.ValidForm.$setDirty();
                        }
                    }, function (err) { toastr.error(err); console.error(err); return; });
            }); $scope.desabilitar = false;
        }

        $scope.eliminar = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
            $scope.registro.UnidadOrganizacionalId = null;
            $scope.ValidForm.$setDirty();
        }
        ///segmento
        carteraPropuestaService.getAllSegmentoMercado().then(
            function (result) {
                $scope.SegmentosMercado = result.data;
            }, function (error) {
                toastr.error(error);
            });
        ///factores
        productoInnovadorService.getAllFactoresInnovacion().then(
            function (result) {
                $scope.Factores = result.data;
            }, function (error) {
                toastr.error(error);
            });
        //contribucion
        //Obtener grado proponente
        productoInnovadorService.getAllContribucion().then(
            function (result) {
                $scope.contribucion = result.data;
                $scope.agregaPrimerProponente();
            },
            function (err) {
                toastr.error(err);
            });


        //Eliminar proponente
        $scope.eliminarProponente = function (registro) {
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucionId) {
                    $scope.contribucion.push($scope.auxColabora[i]);
                }
            }
            var idx = ($scope.proponentes.indexOf(registro));
            $scope.proponentes.splice(idx, 1);
            $scope.auxColabora.splice(idx, 1);
        };

        //Buscar proponente

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

                $scope.proponente.clavePersona = $scope.PersonaSeleccionada.clavePersona;
                $scope.proponente.nombrePersona = $scope.PersonaSeleccionada.nombreCompleto;
                if ($scope.auxColabora.length > 0) {
                    var contribucionData = {
                        id: 1,
                        contribucion: "co-autor"
                    }
                    $scope.proponente.contribucion = contribucionData;
                    $scope.add_proponente();
                }

                $scope.userAdd = true;
            });
        }

        

        //Agregar proponente
        $scope.add_proponente = function () {

            if ($scope.proponente.contribucion != undefined) {
                var Registro = {
                    "clavePersona": $scope.proponente.clavePersona,
                    "contribucionId": $scope.proponente.contribucion.id,
                    "contribucionDescripcion": $scope.proponente.contribucion.contribucion,
                    "nombreCompleto": $scope.proponente.nombrePersona
                }
                $scope.userAdd = false;
                for (var i = 0; i < $scope.proponentes.length; i++) {
                    if ($scope.proponentes[i].clavePersona == Registro.clavePersona) {
                        toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de proponentes!");
                        $scope.PersonaSeleccionada.clavePersona = null;
                        $scope.proponente = {};
                        return false;
                    }
                }
                $scope.PersonaSeleccionada = null;
                $scope.proponentes.push(Registro);
                for (var i = $scope.contribucion.length - 1; i >= 0; i--) {

                    if (($scope.contribucion[i].id == $scope.proponente.contribucion.id) && ($scope.proponente.contribucion.id == 0)) {
                        $scope.auxColabora.push($scope.contribucion[i]);
                        $scope.contribucion.splice(i, 1);
                    }
                }
                {
                    $scope.proponente.clavePersona = undefined
                    $scope.proponente.contribucion = undefined
                    $scope.proponente.nombrePersona = undefined
                }
                $scope.ValidForm.$setDirty();
            } else {
                toastr.error("Agregar contribución al proponente");
            }

        }


        $scope.agregaPrimerProponente = function () {
            $scope.proponente.clavePersona = $scope.ClavePersonaLogin;
            $scope.proponente.nombrePersona = $scope.authentication.userprofile.nombreCompleto;
            var contribucionData = {
                id: 0,
                contribucion: "Autor"
            }

            $scope.proponente.contribucion = contribucionData;
            $scope.add_proponente();
            $scope.userAdd = true;
        }

        


        $scope.agregar = function () {

            $scope.registro.ProductoAutores = [];
            for (var i = 0; i < $scope.proponentes.length; i++) {
                var aux = {
                    'clavePersona': $scope.proponentes[i].clavePersona, 'nombre': $scope.proponentes[i].nombreCompleto,
                    'contribucionId': $scope.proponentes[i].contribucionId
                };
                $scope.registro.ProductoAutores.push(aux);
            }

            if ($scope.registro.ProductoAutores == undefined || $scope.registro.ProductoAutores == null || $scope.registro.ProductoAutores.length == 0) {
                toastr.error("Agregue al menos un autor");
                return false;
            }
            $scope.registro.clavePersona = $scope.ClavePersonaLogin;
            $scope.registro.estadoFlujoId = 1;
            $scope.registro.tipoAcceso = 1;
            productoInnovadorService.add($scope.registro).then(
                function (result) {
                    toastr.success(result.data);
                    $state.go("productoInnovador");
                },
                function (err) {
                    console.error(err);
                    $scope.desabilitar = false;
                });
        };

    }
}());