/*AYUDA:
FooEntitiesService nombre de factory en RolesGet.service.js
*/

(function () {
    "use strict";
    var app = angular.module("ineelGEN");
    app.controller("RolFuncionesGetCtrl", ['$location', '$scope', 'rolfuncionesService', 'funcionesService', 'ModulosService', 'RolesService', '$state', '$stateParams', "$uibModal", "DTOptionsBuilder", "DTColumnBuilder", "DTColumnDefBuilder", RolFuncionesGetCtrl]);

    function RolFuncionesGetCtrl($location, $scope, rolfuncionesService, funcionesService, ModulosService, RolesService, $state, $stateParams, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
        $scope.dtInstance = {};

        $scope.mensaje = "";
        $scope.haSeleccionadoRol = 0;

        RolesService.getAll().then(
            function (result) {
                $scope.roles = result.data;
                $scope.loading = false;
            },
            function (err) {
                   toastr.error("No se han podido cargar los roles registrados en el sistema");
            }
        );
            
        $scope.rolPrevio = $stateParams.idRol;      

        if ($stateParams.idRol === "" || $stateParams.idRol === undefined) {
          
        } else {

            $scope.haSeleccionadoRol = 1;
           
            rolfuncionesService.GetByRol($stateParams.idRol).then(
                     function (result) {
                         for (var i = 0; i < result.data.length; i++) {
                             if (result.data[i].estado == "1") {
                                 result.data[i].estado = true;
                             } else {
                                 result.data[i].estado = false;
                             }
                         }
                         $scope.registro = result.data;
                         $scope.loading = false;
                     },
                     function (err) {
                         $scope.catalogoRoles();
                         toastr.error("No se han podido cargar las funciones del sistema");
                     }
            );
        }

        $scope.cargarregistros = function (idRol) {
            if (idRol != undefined || idRol != "" || idRol != null) {
                $scope.haSeleccionadoRol = 1;
                $scope.rolPrevio = idRol;
                rolfuncionesService.GetByRol(idRol).then(
                         function (result) {
                             for (var i = 0; i < result.data.length; i++) {
                                 if (result.data[i].estado == "1") {
                                     result.data[i].estado = true;
                                 } else {
                                     result.data[i].estado = false;
                                 }
                             }

                             $scope.registro = result.data;
                             $scope.loading = false;

                         },
                         function (err) {
                             $scope.catalogoRoles();
                             toastr.error("No se han podido cargar las funciones del sistema");
                         }
                );
                $scope.mensaje = "";
            }
        }
              
        $scope.catalogoRoles = function () {
          RolesService.getAll().then(
            function (result) {
                $scope.roles = result.data;
                $scope.loading = false;
            },
               function (err) {
                   toastr.error("No se han podido cargar los roles registrados en el sistema");
               }
            );
        }
        
        $scope.saveEstado = function (id, estado, descripcion) {
            $scope.descripcionRow = descripcion;

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
                            "funcionesRolId": id,
                            "estado": _estado
                        };
                       
                        rolfuncionesService.UpdateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                        $scope.dtInstance._renderer.rerender();
                    };
                    $scope.cancel = function () {

                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.registro.length; i++) {
                            if ($scope.registro[i].funcionesRolId === id) {
                                $scope.registro[i].estado = estado;
                            }
                        }
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

        $scope.mensajeDeResultadoCarga = function (resultadoRegistro) {
            $scope.mensaje = resultadoRegistro;
        }

        $scope.open = function () {
            $scope.datoRegistado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/GEN/RolFunciones/RolFuncionesAdd.html',
                controller: 'RolFuncionesAddCtrl',
                scope: $scope
            });

          

        }

        //eliminar funcion del ro
        $scope.eliminaUsuario = function (idFuncion) {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {

                        $scope.indiceAEliminar = 0;

                        for (var i = 0; i < $scope.registro.length; i++) {
                            if ($scope.registro[i].funcionesRolId == idFuncion) {
                                $scope.indiceAEliminar = i;
                                break;
                            }
                        }

                        $scope.registro.splice($scope.indiceAEliminar, 1);               

                        rolfuncionesService.eliminarFuncion(idFuncion);
                        $uibModalInstance.dismiss('cancel');

                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }// FIN DE FUNCION QUE GUARDA ESTADO 
    }

})();