(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ClienteGetConsultaCtrl", [
            "$scope",
            "$stateParams",
            "DTOptionsBuilder",
            "$uibModal",
            "ProyectosEmpresaCRService",
            "PropuestasEmpresaCRService",
            "IniciativasEmpresaCRService",
            "OportunidadNegocioCRService",
            "EmpresasCRService",
            ClienteGetConsultaCtrl
        ]);

    function ClienteGetConsultaCtrl($scope, $stateParams, DTOptionsBuilder, $uibModal, ProyectosEmpresaCRService, PropuestasEmpresaCRService, IniciativasEmpresaCRService, OportunidadNegocioCRService, EmpresasCRService) {
        $scope.messageAlert = {};
        $scope.empresa = {};
        if ($stateParams.id === null) {
            return false;
        }
        var id = $stateParams.id;
        $scope.empresa.id = id;


        EmpresasCRService.getEmpresa($scope.empresa.id).then(
            function (result) {
                $scope.empresa = result.data;

                if ($scope.empresa == null || $scope.empresa == 0 || $scope.empresa == undefined) {
                    toastr.warning("Sin resultados de busqueda, verifique la existencia de la empresa");
                    $scope.messageAlert.show = false;
                }
                else {
                    id = $scope.empresa.empresaId;
                    $scope.messageAlert.show = true;

                }
            },
            function (err) {
                toastr.error(err);
            });



        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDOM('tp')
            .withDisplayLength(5);

        $scope.buscar = function () {
            $scope.empresa = {};
            if ($scope.selectedempresa == null || $scope.selectedempresa == undefined || $scope.selectedempresa == "") {
                toastr.error("Debe ingresar una empresa para realizar la busqueda");
            } else {
                $scope.empresa.nombreEmpresa = $scope.selectedempresa.originalObject.nombreEmpresa;
                $scope.empresa = $scope.selectedempresa.originalObject;

            }
        }

        $scope.iniciativasAsignadasEmpresa = [];
        $scope.propuestasAsignadosEmpresa = [];
        $scope.proyectosAsignadosEmpresa = [];
        $scope.oportunidadNegocioEmpresa = [];
        $scope.proyectosVigentesEmpresa = [];

        $scope.consultar = function consultar(id) {
            $scope.iniciativasAsignadasEmpresa = [];
            IniciativasEmpresaCRService.getIniciativasAsignadasEmpresa(id).then(
                function (result) {
                    $scope.iniciativasAsignadasEmpresa = result.data;
                },
                function (err) {
                    toastr.error(err);
                });

            $scope.propuestasAsignadosEmpresa = [];
            PropuestasEmpresaCRService.getPropuestasAsignadasEmpresa(id).then(
                function (result) {
                    $scope.propuestasAsignadosEmpresa = result.data;
                },
                function (err) {
                    toastr.error(err);
                });

            $scope.proyectosAsignadosEmpresa = [];
            ProyectosEmpresaCRService.getProyectosAsignadosEmpresa(id).then(
                function (result) {
                    $scope.proyectosAsignadosEmpresa = result.data;
                },
                function (err) {
                    toastr.error(err);
                });

            ProyectosEmpresaCRService.getProyectosAsociadosVigentes(id).then(
                function (result) {
                    
                    $scope.proyectosVigentesEmpresa = result.data;
                }, function (err) {
                    toastr.error(err);
                });

            $scope.oportunidadNegocioEmpresa = [];
            OportunidadNegocioCRService.getOportunidadesAsignadasEmpresa(id).then(
                function (result) {
                    $scope.oportunidadNegocioEmpresa = result.data;
                    
                },
                function (err) {
                    toastr.error(err);
                });

            EmpresasCRService.getesaliado(id).then(
                function (result) {
                    $scope.aliado = result.data;
                },
                function (err) {
                    toastr.error(err);
                });
        }

        $scope.consultar(id);

        $scope.detalleIniciativaAsignada = function (id) {
            $scope.folioId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/iniciativas/iniciativaAsignadaDetail.html',
                controller: 'IniciativaAsignadaDetailCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargar();
            });
        }

        $scope.detallePropuestaAsignado = function (id) {
            $scope.proyectoId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/propuestas/propuestaAsignadaDetail.html',
                controller: 'PropuestaAsignadaDetailsCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargar();
            });
        }

        $scope.detalleProyectoAsignado = function (id) {
            $scope.proyectoId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/proyectos/proyectoAsignadoDetail.html',
                controller: 'ProyectoAsignadoDetailsCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {
                $scope.recargar();
            });
        }
    }
})();
