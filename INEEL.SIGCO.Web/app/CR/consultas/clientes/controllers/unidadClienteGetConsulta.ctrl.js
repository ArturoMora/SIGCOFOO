(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("UnidadClienteGetConsultaCtrl", [
            "$scope",
            "$stateParams",
            "DTOptionsBuilder",
            "MenuService",
            "$uibModal",
            "ComunServiceProyectos",
            "ProyectosEmpresaCRService",
            "PropuestasEmpresaCRService",
            "IniciativasEmpresaCRService",
            "OportunidadNegocioCRService",
            "EmpresasCRService",
            UnidadClienteGetConsultaCtrl
        ]);

    function UnidadClienteGetConsultaCtrl($scope, $stateParams, DTOptionsBuilder, MenuService, $uibModal, ComunServiceProyectos, ProyectosEmpresaCRService, PropuestasEmpresaCRService, IniciativasEmpresaCRService, OportunidadNegocioCRService, EmpresasCRService) {
        // $scope.esEmpresa = false;
        $scope.empresa = {};
        if ($stateParams.id === null) {
            return false;
        }
        // var id = $stateParams.id;
        
        /***Inicializacion de variables y carga de informacion inicial****/
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDOM('lftip')
            .withDisplayLength(5);

        $scope.iniciativasAsignadasEmpresa = [];
        $scope.propuestasAsignadosEmpresa = [];
        $scope.proyectosAsignadosEmpresa = [];
        $scope.oportunidadNegocioEmpresa = [];
        $scope.proyectosVigentesEmpresa = [];

        $scope.getInformacionEmpresa = function (empresaid) {
            ComunServiceProyectos.GetEmpresaWithImagen(empresaid).then(function (res) {
                $scope.empresa = res.data;
            }, function (err) {
                toastr.error("Error al cargar los datos de la empresa asociada");
                console.log(err);
            });
        }
        //Consulta la informacion por la unidad de x empresa buscada
        $scope.consultarInformacionUnidadEmpresa = function (id) {
            var nodo= {'ClaveUnidad': id.trim()}; //en ocasiones el id contiene bastantes espacios 
            ProyectosEmpresaCRService.GetInformacionNodoEmpresa(nodo).then(
                function (res) {
                    $scope.unidadEmpresa = res.data;
                    $scope.getInformacionEmpresa($scope.unidadEmpresa.empresaId);
                }, function (err) {
                    toastr.error("Error al cargar los datos de la unidad");
                }
            );

            $scope.iniciativasAsignadasEmpresa = [];
            IniciativasEmpresaCRService.GetIniciativasAsociadasNodoEmpresa(nodo).then(
                function (result) {
                    $scope.iniciativasAsignadasEmpresa = result.data;
                },
                function (err) {
                    toastr.error(err);
                });

            $scope.propuestasAsignadosEmpresa = [];
            PropuestasEmpresaCRService.GetPropuestasAsociadosNodoEmpresa(nodo).then(
                function (result) {
                    $scope.propuestasAsignadosEmpresa = result.data;
                },
                function (err) {
                    toastr.error(err);
                });

            $scope.proyectosAsignadosEmpresa = [];  //Proyectos historicos empresa
            ProyectosEmpresaCRService.GetProyectosAsociadosInactivosNodoEmpresas(nodo).then(
                function (result) {
                    $scope.proyectosAsignadosEmpresa = result.data;
                },
                function (err) {
                    toastr.error(err);
                });

            ProyectosEmpresaCRService.GetProyectosAsociadosVigentesNodoEmpresas(nodo).then(
                function (result) {
                    $scope.proyectosVigentesEmpresa = result.data;
                }, function (err) {
                    toastr.error(err);
                });
        }

        /***Despliegue de modales***/

        $scope.detalleIniciativaAsignada = function (id) {
            $scope.folioId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/iniciativas/iniciativasAsignadasUnidadesEmpresasDetails.html',
                controller: 'IniciativasAsignadasUnidadesEmpresasDetailsCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {

            });
        }

        $scope.detallePropuestaAsignado = function (id) {
            $scope.proyectoId = id;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/propuestas/propuestaAsignadasUnidadesEmpresasDetails.html',
                controller: 'PropuestasAsignadasUnidadesEmpresasDetailsCtrl',
                scope: $scope
            });
            modalInstance.result.then(function () {

            });
        }

        $scope.consultarInformacionUnidadEmpresa($stateParams.id);

        /***Funciones relacionadas con los acentos**/
        function removeAccents(data) {
            return data
                .replace(/έ/g, 'ε').replace(/[ύϋΰ]/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω')
                .replace(/ά/g, 'α').replace(/[ίϊΐ]/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ')
                .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o')
                .replace(/ú/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o')
                .replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a')
                .replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i');
        }


        var searchType = jQuery.fn.DataTable.ext.type.search;

        searchType.string = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data) :
                    data;
        };

        searchType.html = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data.replace(/<.*?>/g, '')) :
                    data;
        };

    }
})();
