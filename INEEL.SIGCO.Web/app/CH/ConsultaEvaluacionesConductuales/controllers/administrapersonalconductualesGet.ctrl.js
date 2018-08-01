﻿/// <reference path="editarpersonalareaconductualesGet.ctrl.js" />
/*AYUDA:
FooEntitiesService nombre de factory en editapersonalareaconductuales.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("administrapersonalconductualesCtrlGet", ['$rootScope', '$scope', 'periodoevaluacionService', 'evaluacionconductualService', 'globalGet', '$state', '$stateParams', "$uibModal",  administrapersonalconductualesCtrlGet]);

    function administrapersonalconductualesCtrlGet($rootScope, $scope, periodoevaluacionService, evaluacionconductualService, globalGet, $state, $stateParams, $uibModal) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
     

        $scope.nombreUnidad = {};
        $scope.loading = true;
        $scope.nombreUnidadRegreso = "";
        $scope.mensaje = 0;
       
        if ($rootScope.parametros == 'undefined' || $rootScope.parametros == null || $rootScope.parametros == undefined || $rootScope.parametros == "undefined"){
            $scope.registro = null;
        } else {

            if ($rootScope.parametros.periodo == null || $rootScope.parametros.periodo == 'undefined' || $rootScope.parametros.periodo == undefined || $rootScope.parametros.periodo == "undefined"){
                $scope.registro = null;
            } else {

                $scope.periodo = $rootScope.parametros.periodo;
                $scope.nombreUnidad = $rootScope.parametros.unidad;
                $scope.nombreUnidadRegreso = $scope.nombreUnidad.nombreUnidad;

                var parametros = {
                    'periodo': $scope.periodo,
                    'claveUnidad': $scope.nombreUnidad.claveUnidad
                }

                evaluacionconductualService.getTodosByUnidadPeriodo(parametros).then(
                     function (result) {

                         for (var i = 0; i < result.data.length; i++) {
                             if (result.data[i].visible == "1") {
                                 result.data[i].visible = true;
                             } else {
                                 result.data[i].visible = false;
                             }
                         }

                         $scope.registro = result.data;
                         $scope.mensaje = 1;
                         $scope.loading = false;
                     },
                     function (err) {
                         toastr.error("No se han podido cargar las evaluaciones del periodo y unidad seleccionados");
                         $scope.registro = null;
                     }
                );
            }
        }
        
        periodoevaluacionService.getAll().then(
          function (result) {
              $scope.periodosEV = result.data;
          },
          function (err) {
              toastr.error("No se han podido cargar la información registrada en el sistema");
          }
        );
        
        $scope.cargarEvaluaciones = function () {
            var param = {
                'periodo': $scope.periodo,
                'claveUnidad': $scope.nombreUnidad.claveUnidad
            }

            var periodoS = parseInt($scope.periodo);
            var unidadS = parseInt($scope.nombreUnidad.claveUnidad);

            if (periodoS > 0 && unidadS > 0) {

                if ($scope.periodo == 'undefined' || $scope.periodo == undefined || $scope.periodo == null || $scope.periodo == "undefined" || $scope.periodo == "") {
                    $scope.registro = null;
                    $scope.mensaje = 0;
                } else {
                    evaluacionconductualService.getTodosByUnidadPeriodo(param).then(
                        function (result) {

                            for (var i = 0; i < result.data.length; i++) {
                                if (result.data[i].visible == "1") {
                                    result.data[i].visible = true;
                                } else {
                                    result.data[i].visible = false;
                                }
                            }
                            $scope.registro = result.data;
                            $scope.mensaje = 1;
                            $scope.loading = false;
                        },
                        function (err) {
                            toastr.error("No se han podido cargar las evaluaciones del periodo y unidad seleccionados");
                            $scope.registro = null;
                            $scope.mensaje = 0;
                        }
                    );
                }
            } else {
                $scope.registro = null;
                $scope.mensaje = 0;
            }
        }

        $scope.$watch('nombreUnidad', function () {
            if ($scope.nombreUnidadRegreso == "") {
                $scope.cargarEvaluaciones();
            } else {

                if ($scope.nombreUnidadRegreso != $scope.nombreUnidad.nombreUnidad) {
                    $scope.cargarEvaluaciones();
                }
            }
        });

        $rootScope.parametros = {};
        $scope.parametrosTransferencia = function (clave, nombre, categoriaEmp, categoriaCom, calificacion, claveevaluacion, idcategoriacompetencia, nombreFamilia, idReg) {
            $rootScope.parametros.clave = clave;
            $rootScope.parametros.nombre = nombre;
            $rootScope.parametros.cateemp = categoriaEmp;
            $rootScope.parametros.catcomp = categoriaCom;
            $rootScope.parametros.calificacion = calificacion;
            $rootScope.parametros.evaluacionid = claveevaluacion;
            $rootScope.parametros.periodo = $scope.periodo;
            $rootScope.parametros.unidad = $scope.nombreUnidad;
            $rootScope.parametros.idcategoriacompetencia = idcategoriacompetencia;
            $rootScope.parametros.nombreFamilia = nombreFamilia;


            $state.go("formularioedicionconductuales", { id:idReg });

        }

        //Guardar estado
        $scope.saveEstado = function (id, estado) {
            var pagina;
            var _estado;
            var registro;

            if (estado == true) {
                pagina = "Active";
                _estado = 1;
            } else {
                pagina = "Delete";
                _estado = 0;
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + pagina + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        registro = {
                            "evaluacionId": id,
                            "visible": _estado
                        };

                        evaluacionconductualService.updateEstado(registro);
                        $uibModalInstance.dismiss('cancel');

                    };

                    $scope.cancel = function () {

                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.registro.length; i++) {
                            if ($scope.registro[i].evaluacionId == id) {
                                $scope.registro[i].visible = estado;
                            }
                        }

                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }



    }

})();