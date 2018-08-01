(function () {
    'use strict';
    angular
        .module("ineelGI")
        .controller('planNegocioAdd', ['$scope', 'AuthService', 'MenuService', 'comunCountService','comunService','tipoAccesoService',
            'ngFabForm', 'planNegocioService', '$state', '$uibModal', 'adjuntarArchivo','buscarPropuestaFactory', planNegocioAdd]);

    function planNegocioAdd($scope, AuthService, MenuService, comunCountService,comunService,tipoAccesoService,
        ngFabForm, planNegocioService, $state, $uibModal, adjuntarArchivo, buscarPropuestaFactory) {
        $scope.authentication = AuthService.authentication;
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        $scope.registro = {};
        debugger;
        $scope.registro.planNegocioEvolArchivos = [];
        $scope.registro.proyectoNombre = "";
        
        $scope.unidades = [];
        $scope.autoresPNE = [];
        
        /////////////////////////Buscar Proyecto
        $scope.verproyecto = false;
        $scope.openProyecto = function () {$scope.desabilitar = true;$scope.proyectoSelect = {};var modalInstance = $uibModal.open({
                size: 'lg',templateUrl: 'app/vistasGenericas/buscarProyecto.html',controller: 'ProyectosFilterGetCtrl',
                resolve: { proyectoSelect: function () { $scope.verproyecto = false; return $scope.proyectoSelect; }}, scope: $scope });
            modalInstance.result.then(function (selectedItem) {toastr.clear();
                comunService.PersonalProyecto_GetByClave($scope.registro.clavePersona, selectedItem.proyectoId).then(
                    function (result) { console.log(result.data);if (result.data != null && result.data.length > 0) { console.log(result.data.length);
                            toastr.warning(selectedItem.nombre, "Ya se encuentra como participante del proyecto");
                        } else {
                            $scope.elemento = selectedItem;
                            $scope.registro.proyectoNombre = selectedItem.nombre;
                            $scope.registro.proyectoId = selectedItem.proyectoId;
                    }}, function (err) { toastr.error(err); console.error(err); return; });}); $scope.desabilitar = false;}

        $scope.eliminar = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }


        //
        $scope.$watch("propuesta", function (newValue, oldValue) {
            debugger;
            try {
                $scope.registro.propuestaClave = $scope.propuesta.propuestaClave;
            } catch (err) { }
        });
        debugger;
        $scope.quitarPropuesta = function () {
            $scope.registro.propuestaClave = null;
            $scope.propuesta = null;
        }

        $scope.eliminararea = function (registro) {
            var idx = ($scope.registro.planNegocioEvolGerencias.indexOf(registro));
            $scope.registro.planNegocioEvolGerencias.splice(idx, 1);
        };

        $scope.eliminaradjunto = function (registro) {
            var idx = ($scope.registro.planNegocioEvolArchivos.indexOf(registro));
            $scope.registro.planNegocioEvolArchivos.splice(idx, 1);
        };

        $scope.eliminarautor = function (registro) {
            var idx = ($scope.autoresPNE.indexOf(registro));
            $scope.autoresPNE.splice(idx, 1);
        };

        //adjunto
        $scope.getFileDetails = function (adjunto) {
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'GI' };
                    var aux = {
                        'adjunto': Adjunto
                    };
                    debugger;
                    if ($scope.registro.planNegocioEvolArchivos.length > 0) {
                        for (var i = 0; i < $scope.registro.planNegocioEvolArchivos.length; i++) {
                            if (aux.adjunto.nombre == $scope.registro.planNegocioEvolArchivos[i].adjunto.nombre) {
                                toastr.warning("El archivo ya existe");
                                $(":file").filestyle('clear');
                                return false;
                            }
                        }
                    }

                    $scope.registro.planNegocioEvolArchivos.push(aux);
                    $(":file").filestyle('clear');
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }

        //obtener tipo de acceso
        tipoAccesoService.get().then(
            function (result) {
                $scope.tiposAccesos = result.data;
            }, function (error) {
                toastr.error(error);
            });

        $scope.agregar = function () {
            debugger;
            $scope.registro.planNegocioEvolAutores = [];
            for (var i = 0; i < $scope.autoresPNE.length; i++) {
                var aux = { 'clavePersona': $scope.autoresPNE[i].clavePersona, 'nombre': $scope.autoresPNE[i].nombreCompleto };
                $scope.registro.planNegocioEvolAutores.push(aux);
            }
            
            if (($scope.registro.propuestaClave == undefined || $scope.registro.propuestaClave == null) && ($scope.registro.proyectoId == undefined || $scope.registro.proyectoId == null)) {
                toastr.error("Seleccione un proyecto y/o una propuesta");
                return false;
            }
            if ($scope.registro.planNegocioEvolAutores == undefined || $scope.registro.planNegocioEvolAutores == null || $scope.registro.planNegocioEvolAutores.length == 0) {
                toastr.error("Agregue al menos un autor");
                return false;
            }
            if ($scope.registro.planNegocioEvolGerencias == undefined || $scope.registro.planNegocioEvolGerencias == null || $scope.registro.planNegocioEvolGerencias == 0) {
                toastr.error("Agregue al menos una gerencia");
                return false;
            }
            if ($scope.registro.planNegocioEvolArchivos == undefined || $scope.registro.planNegocioEvolArchivos == null || $scope.registro.planNegocioEvolArchivos == 0) {
                toastr.error("Adjunte al menos una evidencia");
                return false;
            }
            debugger;
            $scope.registro.clavePersona = $scope.ClavePersonaLogin;
            planNegocioService.add($scope.registro).then(
                   function (result) {
                       toastr.success(result.data);
                       $state.go("planNegocioEvolutivo");
                   },
                   function (err) {
                       console.error(err);
                       $scope.desabilitar = false;
                   });
        };

    }
}());