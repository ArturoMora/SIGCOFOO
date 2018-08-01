(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("PPConvocatoriaEditCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "$filter",
        "FondosProgramaCRService",
        "$uibModal",
        "DTOptionsBuilder",
        PPConvocatoriaEditCtrl
        ]);

    function PPConvocatoriaEditCtrl(AuthService, $scope, $state, $stateParams, $filter, FondosProgramaCRService,  $uibModal, DTOptionsBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt');
        $scope.proyectosNuevos = [];
        $scope.proyectosAgregados = []; 
        $scope.proyectosAnteriores = []; 
        $scope.propuestasAgregadas = []; 
        $scope.propuestasAnteriores = [];
        $scope.ppFondos = {};
        $scope.propuestasNuevas = []; 
        $scope.claveProyectos = [];
        $scope.clavePropuestas = [];
        

        FondosProgramaCRService.getPP($stateParams.id).then(
            function (result) {
                debugger;
                $scope.fondos = result.data;
                $scope.proyectosAgregados = $scope.fondos.proyectoPorFondo;
                $scope.propuestasAgregadas = $scope.fondos.propuestaPorFondo;
                $scope.ppFondos.fondoProgramaId = $scope.fondos.fondoProgramaId;

                angular.forEach($scope.proyectosAgregados, function (value, key) {
                    $scope.claveProyectos.push( value.proyectoId );
                });

                angular.forEach($scope.propuestasAgregadas, function (value, key) {
                    $scope.clavePropuestas.push(value.propuestaId);
                });
            },
            function (err) {
                toastr.error("No se pueden cargar los datos");
                console.error(err);
            });

        $scope.openProyecto = function () {
            $scope.vinculo = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarProyecto.html',
                controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                if($scope.claveProyectos.indexOf(selectedItem.proyectoId) >-1){
                    toastr.error("El proyecto seleccionado ya se encuentra asociado al fondo, seleccione otro");
                }
                else {
                    $scope.claveProyectos.push(selectedItem.proyectoId);
                    $scope.proyectosNuevos.push(selectedItem.proyectoId);

                    FondosProgramaCRService.getNombreUnidad(selectedItem.unidadOrganizacionalId).then(
                        function (result) {
                            debugger;
                            result.data == null ? $scope.nombreU = "Dato no disponible" : $scope.nombreU = result.data.nombreUnidad;
                            $scope.proyectosAgregados.push({
                                "proyectoId": selectedItem.proyectoId,
                                "nombre": selectedItem.nombre,
                                "nombreJefeProyecto": selectedItem.nombreJefeProyecto,
                                "unidadOrganizacionalId": selectedItem.unidadOrganizacionalId,
                                "nombreUnidad": $scope.nombreU,
                                "costo": selectedItem.costo,
                                "proyecto":{"nombre":selectedItem.nombre},
                            });
                        },
                        function (err) {
                            toastr.error(err.data.message);
                            console.error(err.data);
                        });
                        $scope.form.$setDirty();
                }
                
            });
        }

        $scope.openPropuesta = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarPropuesta.html',
                controller: 'PropuestasFilterGetCtrl',
                scope: $scope,
            });

            modalInstance.result.then(function (selectedItem) {
                debugger;
                if ($scope.clavePropuestas.indexOf(selectedItem.propuestaId) > -1) {
                    toastr.error("La propuesta seleccionada ya se encuentra asociado al fondo, seleccione otra");
                }
                else {
                    $scope.clavePropuestas.push(selectedItem.propuestaId);
                    $scope.propuestasNuevas.push(selectedItem.propuestaId);

                    FondosProgramaCRService.getNombreUnidad(selectedItem.unidadOrganizacionalId).then(
                        function (result) {
                            result.data == null ? $scope.nombreU = "Dato no disponible" : $scope.nombreU = result.data.nombreUnidad;
                            $scope.propuestasAgregadas.push(
                               {
                                   "propuestaId": selectedItem.propuestaId,
                                   "titulo": selectedItem.titulo,
                                   "claveEmpPropuesta": selectedItem.claveEmpPropuesta,
                                   "unidadOrganizacionalId": selectedItem.unidadOrganizacionalId,
                                   "nombreUnidad": $scope.nombreU,
                                   "costos": selectedItem.costos
                               });
                        },
                        function (err) {
                            toastr.error(err.data.message);
                            console.error(err.data);
                        });
                        $scope.form.$setDirty();
                }
              
            });
        }

        $scope.deletePropuesta = function ( id) {
            $scope.clavePropuestas.splice($scope.clavePropuestas.indexOf(id), 1);
            for (var c = 0; c < $scope.propuestasAgregadas.length; c++) {
                if ($scope.propuestasAgregadas[c].propuestaId == id) {
                    $scope.propuestasAnteriores.push($scope.propuestasAgregadas[c].propuestaId);
                    $scope.propuestasAgregadas.splice(c, 1);
                    break;
                }
            }

            $scope.propuestasNuevas.splice($scope.propuestasNuevas.indexOf(id), 1);
            
            $scope.form.$setDirty();
        }

        $scope.deleteProyecto = function (id) {
            $scope.claveProyectos.splice($scope.claveProyectos.indexOf(id), 1);
            for (var c = 0; c < $scope.proyectosAgregados.length; c++) {
                if ($scope.proyectosAgregados[c].proyectoId == id) {
                    $scope.proyectosAnteriores.push($scope.proyectosAgregados[c].proyectoId);
                    $scope.proyectosAgregados.splice(c, 1);
                    break;
                }
            }
            $scope.proyectosNuevos.splice($scope.proyectosNuevos.indexOf(id), 1);
            $scope.form.$setDirty();
        }
         
        $scope.saveppConvocatoria = function () {
            $scope.ppFondos.fondoId = $scope.ppFondos.fondoProgramaId;
           
            if ($scope.propuestasAnteriores.length > 0 || $scope.proyectosAnteriores.length > 0) {
                $scope.ppFondos.propuestasAnteriores = $scope.propuestasAnteriores;
                $scope.ppFondos.proyectosAnteriores = $scope.proyectosAnteriores;
                FondosProgramaCRService.eliminaPPAnteriores($scope.ppFondos).then(
                        function (result) {
                            if (($scope.proyectosNuevos.length < 0 || $scope.propuestasNuevas.length < 0)) {
                                toastr.success("Registro actualizado correctamente!");
                                $state.go("ppsConvocatoriaGet");
                            }

                        }, function (err) {
                            toastr.error(err.message);
                            console.error(err);
                            return false;
                        });
            }
            $scope.agregaNuevosPP();

        };

        $scope.agregaNuevosPP = function () {
            $scope.ppFondos.autor = AuthService.authentication.nombreCompleto;
            $scope.ppFondos.fechaRegistro = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString();
            $scope.ppFondos.estado = true;
            $scope.ppFondos.proyectosE = $scope.proyectosNuevos;
            $scope.ppFondos.propuestasE = $scope.propuestasNuevas;

            FondosProgramaCRService.createProyecto($scope.ppFondos).then(
            function (result) {
                FondosProgramaCRService.createPropuesta($scope.ppFondos).then(
                    function (result) {
                        toastr.success("Registro actualizado correctamente!");
                        $state.go("ppsConvocatoriaGet");
                    },
                    function (err) {
                        toastr.error(err.data.message);
                        console.error(err.data);
                        return false;
                    });
            },
            function (err) {
                toastr.error(err.data.message);
                console.error(err.data);
                return false;
            });
        };

    }
})();