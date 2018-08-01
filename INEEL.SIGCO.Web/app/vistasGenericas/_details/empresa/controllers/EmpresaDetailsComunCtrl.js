(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("EmpresaDetailsComunCtrl", [
            "$scope",
            "$state",
            "$uibModal",
            "$stateParams",
            "DTOptionsBuilder",
            "ComunServiceEmpresas",
            EmpresaDetailsCtrl]);

    function EmpresaDetailsCtrl($scope, $state, $uibModal, $stateParams, DTOptionsBuilder, ComunServiceEmpresas ) {
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDOM('lftip')
            .withDisplayLength(5);

        /***Carga de informacion de los diferentes OCs y/o atributos***/
        $scope.empresaId= $stateParams.id;
        ComunServiceEmpresas.GetEmpresaWithImagen($stateParams.id).then(
            function (res) {
                $scope.empresa = res.data;
            }, function (err) {
                toastr.error("Error al cargar los datos de la empresa");
                console.log(err);
            });

        ComunServiceEmpresas.GetProyectosVigentesEmpresa($stateParams.id).then(
            function (res) {
                $scope.proyectosVigentesEmpresa = res.data;
            }, function (err) {
                toastr.error("Error al cargar los proyectos vigentes de la empresa");
                console.log(err);
            });

        ComunServiceEmpresas.GetProyectosNoVigentes($stateParams.id).then(
            function (res) {
                $scope.proyectosNoVigentesEmpresa = res.data;
            }, function (err) {
                toastr.error("Error al cargar los proyectos vigentes de la empresa");
                console.log(err);
            });

        ComunServiceEmpresas.getPropuestasAsignadasEmpresa($stateParams.id).then(
            function (result) {
                $scope.propuestasAsignadosEmpresa = result.data;
            },
            function (err) {
                toastr.error("Error al cargar las propuestas con la empresa");
                console.log(err);
            });

        ComunServiceEmpresas.getIniciativasAsignadasEmpresa($stateParams.id).then(
            function (result) {
                $scope.iniciativasAsignadasEmpresa = result.data;
            },
            function (err) {
                toastr.error("Error al cargar las iniciativas con la empresa");
                console.log(err);
            });

        ComunServiceEmpresas.getOportunidadesAsignadasEmpresa($stateParams.id).then(
            function (result) {
                $scope.oportunidadNegocioEmpresa = result.data;
            },
            function (err) {
                toastr.error("Error al cargar las oportunidades de negocio con la empresa");
                console.log(err);
            });

        ComunServiceEmpresas.GetConveniosVigentesByEmpresa($stateParams.id).then(
            function (result) {
                $scope.conveniosVigentes = result.data;
            },
            function (err) {
                toastr.error("Error al cargar los convenios vigentes con la empresa");
                console.log(err);
            });

        ComunServiceEmpresas.GetConveniosNoVigentesByEmpresa($stateParams.id).then(
            function (result) {
                $scope.conveniosNoVigentes = result.data;
            },
            function (err) {
                toastr.error("Error al cargar los convenios vigentes con la empresa");
                console.log(err);
            });

        ComunServiceEmpresas.GetProductosByEmpresa($stateParams.id).then(
            function (result) {
                $scope.productos = result.data;
            },
            function (err) {
                toastr.error("Error al cargar los productos asociados con la empresa");
                console.log(err);
            });

        ComunServiceEmpresas.GetServiciosByEmpresa($stateParams.id).then(
            function (result) {
                $scope.servicios = result.data;
            },
            function (err) {
                toastr.error("Error al cargar los servicios asociados con la empresa");
                console.log(err);
            });

        ComunServiceEmpresas.GetFondosByEmpresa($stateParams.id).then(
            function (result) {
                $scope.fondos = result.data;
            },
            function (err) {
                toastr.error("Error al cargar los servicios asociados con la empresa");
                console.log(err);
            });

        /***Funciones relacionadas al cambio de estilos al momento de dar clic entre diferentes pestanias, como proyectos y convenios***/
        $scope.cambiaEstiloProyectos=function(p1, p2){
            var pestaniaActiva= document.getElementById(p1);
            var pestaniaInactiva= document.getElementById(p2);
            pestaniaActiva.setAttribute("style","color: #ffffff !important;");
            pestaniaInactiva.setAttribute("style","color: #515356 !important");
        }    

        $scope.cambiaEstiloConvenios=function(p1, p2){
            var pestaniaActiva= document.getElementById(p1);
            var pestaniaInactiva= document.getElementById(p2);
            pestaniaActiva.setAttribute("style","color: #ffffff !important;");
            pestaniaInactiva.setAttribute("style","color: #515356 !important");
        }    


        /***Despliegue de modales****/
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
