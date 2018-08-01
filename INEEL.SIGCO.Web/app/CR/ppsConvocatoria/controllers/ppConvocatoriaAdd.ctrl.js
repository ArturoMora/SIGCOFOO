(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("PPConvocatoriaAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$filter",
        "FondosProgramaCRService",
        "$uibModal",
        "DTOptionsBuilder",
        PPConvocatoriaAddCtrl
        ]);

    function PPConvocatoriaAddCtrl(AuthService, $scope, $state, $filter, FondosProgramaCRService, $uibModal, DTOptionsBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt');
        $scope.clavesProyectos = [];
        $scope.proyectosAgregados = [];
        $scope.clavesPropuestas = [];
        $scope.propuestasAgregadas = [];
        $scope.ppFondos = {};
        $scope.fondoProgramaId;

        FondosProgramaCRService.fondosProgramaAllByEstado().then(
            function (result) {
                $scope.fondos = result.data;
            }, function (error) {
                toastr.error("No se ha podido cargar los registros de los Fondos o programas");
            });

        $scope.consultarFondos = function () {
            FondosProgramaCRService.ValidaDuplicidad($scope.fondoProgramaId).then(
            function (result) {
                debugger;
                if (result.data==null) {
                    toastr.error("El fondo ya se encuentra asociado, seleccione otro o edite el anterior");
                    $scope.fondoProgramaId = null;
                    $scope.fuentes = null;
                    return false;
                }
                $scope.fuentes = result.data;
            }, function (error) {
                toastr.error(error.message);
                console.log(error);
            });
           
        }
        $scope.deleteProyecto = function (index) {
            $scope.clavesProyectos.splice(index, 1);
            $scope.proyectosAgregados.splice(index, 1);

        }
        $scope.deletePropuesta = function (index) {
            $scope.clavesPropuestas.splice(index, 1);
            $scope.propuestasAgregadas.splice(index, 1);

        }

        $scope.openProyecto = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarProyecto.html',
                controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                scope: $scope,
            });

            modalInstance.result.then(function (selectedItem) {
                if ($scope.clavesProyectos.indexOf(selectedItem.proyectoId) > -1) {
                    toastr.error("El proyecto seleccionado ya se encuentra asociado al fondo, seleccione otro");
                }
                else {
                    $scope.clavesProyectos.push(selectedItem.proyectoId);
                    FondosProgramaCRService.getNombreUnidad(selectedItem.unidadOrganizacionalId).then(
                        function (result) {
                            result.data == null? $scope.nombreU="Dato no disponible" : $scope.nombreU=result.data.nombreUnidad;
                            $scope.proyectosAgregados.push(
                               {
                                   "proyectoId": selectedItem.proyectoId,
                                   "nombre": selectedItem.nombre,
                                   "nombreJefeProyecto": selectedItem.nombreJefeProyecto,
                                   "unidadOrganizacionalId": selectedItem.unidadOrganizacionalId,
                                   "nombreUnidad": $scope.nombreU,
                                   "costo": selectedItem.costo
                               });
                        },
                        function (err) {
                            toastr.error(err.data.message);
                        });
                        $scope.form.$setDirty();
                }
                $scope.clavesProyectos;
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
                if ($scope.clavesPropuestas.indexOf(selectedItem.propuestaId) > -1) {
                    toastr.error("La propuesta seleccionada ya se encuentra asociado al fondo, seleccione otra");
                }
                else {
                    $scope.clavesPropuestas.push(selectedItem.propuestaId);
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
                        });
                        $scope.form.$setDirty();
                }
                $scope.clavesPropuestas;
                
            });
        }

        $scope.AddPPConvocatoria = function () {
                $scope.ppFondos.proyectosE = $scope.clavesProyectos;
                $scope.ppFondos.propuestasE = $scope.clavesPropuestas;
                $scope.ppFondos.autor = AuthService.authentication.nombreCompleto;
                $scope.ppFondos.fechaRegistro = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString();
                $scope.ppFondos.estado = true;
                
                $scope.ppFondos.FondoId = $scope.fondoProgramaId;
                FondosProgramaCRService.createProyecto($scope.ppFondos).then(
                function (result) {

                    FondosProgramaCRService.createPropuesta($scope.ppFondos).then(
                        function (result) {
                            toastr.success("Registro agregado correctamente!");
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


        }

    }
})();