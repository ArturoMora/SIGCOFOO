(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("AliadoDetailsCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "AliadosCRService",
        "$uibModal",
        "ProyectosEmpresaCRService",
        "PropuestasEmpresaCRService",
        "DTOptionsBuilder",
        AliadoDetailsCtrl
        ]);

    function AliadoDetailsCtrl(AuthService, $scope, $state, $stateParams, AliadosCRService, $uibModal, ProyectosEmpresaCRService, PropuestasEmpresaCRService, DTOptionsBuilder) {
        $scope.aliado_id = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('frtp');
        $scope.conveniosM = [];
        $scope.actividadesM = [];
        $scope.aliados = {};
        $scope.aliados.direccion = "";
        var id = "";

        $scope.organizacionTipo = "";

        $scope.propuestasAsignadosEmpresa = [];
        $scope.proyectosAsignadosEmpresa = [];
        $scope.oportunidadNegocioEmpresa = [];

        AliadosCRService.getAliado($scope.aliado_id).then(
            function (result) {
                $scope.aliados = result.data;
                $scope.conveniosM = $scope.aliados.convenio;
                $scope.actividadesM = $scope.aliados.actividadAdicional;

                var estado = "";
                var municipio = "";
                var localidad = "";
                var colonia = "";
                var calle = "";
                var cp = "";

                if ($scope.aliados.empresa.calle != null && $scope.aliados.empresa.calle != undefined) {
                    calle = $scope.aliados.empresa.calle;
                }
                if ($scope.aliados.empresa.colonia != null && $scope.aliados.empresa.colonia != undefined) {
                    colonia = ' ' + $scope.aliados.empresa.colonia;
                }
                if ($scope.aliados.empresa.localidad != null && $scope.aliados.empresa.localidad != undefined) {
                    localidad = ', ' + $scope.aliados.empresa.localidad;
                }
               
                if ($scope.aliados.empresa.municipios) {
                    if ($scope.aliados.empresa.municipios.nombreMunicipio != null && $scope.aliados.empresa.municipios.nombreMunicipio != undefined) {
                        municipio = ', ' + $scope.aliados.empresa.municipios.nombreMunicipio;
                    }
                }
                if ($scope.aliados.empresa.estados) {
                    if ($scope.aliados.empresa.estados.nombreEstado != null && $scope.aliados.empresa.estados.nombreEstado != undefined) {
                        estado = ', ' + $scope.aliados.empresa.estados.nombreEstado;
                    }
                }
                if ($scope.aliados.empresa.cp != null && $scope.aliados.empresa.cp != undefined) {
                    cp = ', C.P. ' + $scope.aliados.empresa.cp;
                }

                $scope.aliados.direccion = calle + colonia + localidad + municipio + estado + cp;

                

                $scope.organizacionTipo = $scope.aliados.empresa.tipoOrganizacion.nombre

                if ($scope.aliados.empresa == null || $scope.aliados.empresa == 0 || $scope.aliados.empresa == undefined) {
                    //toastr.warning("Sin resultados de busqueda, verifique la existencia de la empresa");
                    //$scope.messageAlert.show = false;
                }
                else {
                    id = $scope.aliados.empresa.empresaId;
                    //$scope.messageAlert.show = true;
                    consultarAlianzas(id);
                }
            },
            function (err) {
                console.error(err);
            });

     
        //Guardar estado
        $scope.consultaEstado = function (estado) {
            var _estado;
            
            if (estado == true) {
                _estado = "Activo";
            } else if (estado == false) {
                _estado = "Inactivo";
            }
            return _estado;
        }

        function consultarAlianzas(id) {
            $scope.propuestasAsignadosEmpresa = [];
            PropuestasEmpresaCRService.getPropuestasAsignadasEmpresa(id).then(
                 function (result) {
                     $scope.propuestasAsignadosEmpresa = result.data;
                     //debugger;
                 },
                 function (err) {
                     toastr.error(err);
                 });
            $scope.proyectosAsignadosEmpresa = [];
            ProyectosEmpresaCRService.getProyectosAsignadosEmpresa(id).then(
                function (result) {
                    $scope.proyectosAsignadosEmpresa = result.data;
                    //debugger;
                },
                function (err) {
                    toastr.error(err);
                });
            $scope.oportunidadNegocioEmpresa = [];
        }

        //Obtiene Vigencia
        $scope.getVigencia = function (fechaTermino) {
            var vigencia;
            $scope.fechaActual = new Date();
            var finalDateComparacion = new Date(fechaTermino);

            if ($scope.fechaActual > finalDateComparacion) {
                vigencia = "Inactiva";
            }
            else if ($scope.fechaActual < finalDateComparacion) {
                vigencia = "Activa";
            }
            return vigencia;
        }
    }
})();



