(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("expertosEditCtrl", [
            "$scope",
            "$state",
            "$stateParams",
            "ExpertosCRService",
            "LineasDesarrolloTecnologicoCRService",
            "$uibModal",
            "MenuService",
            "DTOptionsBuilder",
            expertosEditCtrl
        ]);

    function expertosEditCtrl($scope, $state, $stateParams, ExpertosCRService, lineasInvestigacion, $uibModal, MenuService, DTOptionsBuilder) {

        $scope.experto = {};
        $scope.investigadoresNuevos = [];
        $scope.investigadoresViejos = [];
        $scope.expertoId = $stateParams.id;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);

        //llenar el combo de lineas de investigacion 
        $scope.llenarlineasInvestigacion = function () {
            lineasInvestigacion.getLineasDesarrolloTecnologico().then(
                function (response) {
                    $scope.lineas = response.data;
                }
                , function (error) {
                    toastr.warning(error.data.message);
                }
            );
        };

        //trae las comunidades de practica
        $scope.llenaComunidades = function () {
            ExpertosCRService.getComunidades().then(
                function (result) {
                    $scope.comunidades = result.data;
                }, function (error) {
                    toastr.error(error);
                }
                );
        }

        $scope.consultarexperto = function () {
            ExpertosCRService.getexperto($scope.expertoId).then(
                function (response) { 
                    if (typeof response.data !== 'undefined' && response.data !== null) {
                        $scope.experto = response.data;
                        $scope.investigadores = $scope.experto.investigadores;
                        $scope.lineaDesarrolloTecnologicoId = $scope.experto.lineaDesarrolloTecnologico.lineaDesarrolloTecnologicoId;
                        $scope.comunidad = $scope.experto.comunidad;
                    }
                    else {
                        toastr.warning("No se encontraron resultados...");
                    }
                }, 
                function (error) { 
                    toastr.error(error.data.messageDetail);
                });
        };

        //buscar en los contactos agregados  
        $scope.buscarcontacto = function () {
            MenuService.setVariable('expertos', true);
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/ContactosGetGral.html',
                controller: 'ContactosGetGralCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                if (typeof selectedItem !== 'undefined') {

                    $scope.contacto = {};
                    if (selectedItem.nombreEmpresa == undefined || selectedItem.nombreEmpresa == '' || selectedItem.nombreEmpresa == null) {
                        $scope.contacto.nombreEmpresa = selectedItem.empresa.nombreEmpresa;
                    } else {
                        $scope.contacto.nombreEmpresa = selectedItem.nombreEmpresa;
                    }

                    $scope.contacto.nombreCompleto = selectedItem.nombreContacto + " " + selectedItem.apellidoPaterno + " " + selectedItem.apellidoMaterno;
                    $scope.contacto.adjunto64 = selectedItem.adjunto64;
                    $scope.contacto.puesto = selectedItem.puesto;
                    $scope.contacto.localidad = selectedItem.localidad;
                    $scope.contacto.correo = selectedItem.correo;
                    $scope.contacto.telefono = selectedItem.telefono;
                    $scope.contacto.celular = selectedItem.celular;
                    $scope.contacto.empresaId = selectedItem.empresaId;
                    $scope.contacto.contactoId = selectedItem.contactoId;
                    $scope.contacto.estadoContacto = selectedItem.estadoContacto;
                    $scope.contacto.paisOrigen = selectedItem.paisOrigen;
                }
            });
        }

        //Buscar Investigador
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
                var investigadores = {
                    'clavePersona': selectedItem.clavePersona,
                    'nombreCompleto': selectedItem.nombreCompleto
                };
                $scope.investigadores.push(investigadores);
                $scope.expertoseditform.$setDirty();
            });
        }

        $scope.deleteUser = function (autor) {
            $scope.investigadores.splice($scope.investigadores.indexOf(autor), 1);
            $scope.investigadoresViejos.push(autor.clavePersona);
            $scope.expertoseditform.$setDirty();
        }
        

        $scope.actualizarexperto = function () {
            if ($scope.expertoseditform.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            if($scope.investigadores.length==0){
                toastr.error("Agregue un por lo menos un investigador");
                return false;
            }
            else {
                $scope.experto.contactoId = $scope.experto.contacto.contactoId;
                $scope.experto.tipoExperto = 2;
                $scope.experto.especialidad = $scope.experto.especialidad;
                $scope.experto.lineaDesarrolloTecnologicoId = $scope.lineaDesarrolloTecnologicoId;
                $scope.experto.investigadores = $scope.investigadores;
                if ($scope.comunidad !== null) {
                    if ($scope.comunidad !== undefined) {
                        $scope.experto.ComunidadId = $scope.comunidad.comunidadId;
                    }
                }
                
                
                
                $scope.desactivar = true;

                ExpertosCRService.update($scope.experto).then(
                    function (result) {
                        toastr.success(result.data);
                        MenuService.setVariable('expertos', false);
                        $state.go("expertosget");
                    },
                    function (error) {
                        $scope.desactivar = false;
                        toastr.error(error.data.message);
                    });
            }
        }

         $scope.llenarlineasInvestigacion();
         $scope.consultarexperto();
         $scope.llenaComunidades();


    }


})();