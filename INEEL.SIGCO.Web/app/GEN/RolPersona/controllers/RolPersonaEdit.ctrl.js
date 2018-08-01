/*AYUDA:
FooEntitiesService nombre de factory en RolesEdit.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("RolPersonaEditCtrl", ['$scope', 'RolPersonaService', 'RolesService', 'globalGet', '$state', '$stateParams', "$uibModal", RolPersonaEditCtrl]);

    function RolPersonaEditCtrl($scope, RolPersonaService, RolesService, globalGet, $state, $stateParams, $uibModal) {
        $scope.dtInstance = {};
        $scope.id = $stateParams.id;

        $scope.status = true;
      
        RolesService.getById($scope.id).then(
          function (result) {
              $scope.rolPersonaSeleccionado = result.data;
              $scope.caragarDatos();
             },
          function (err) {
             console.error(err);
          }
        );

        $scope.caragarDatos = function () {
            RolPersonaService.getById($scope.id).then(
               function (result) {

                   for (var i = 0; i < result.data.length; i++) {
                       if (result.data[i].estado == "1") {
                           result.data[i].estado = true;
                       } else {
                           result.data[i].estado = false;
                       }
                   }

                   $scope.usuariosRol = result.data;
                   $scope.loading = false;
               },
               function (err) {
                   toastr.error("No se han podido cargar los roles registrados en el sistema");
               }
           );
        }





        $scope.openPersona = function () {
            $scope.selectItem = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    selectedItem: function () {
                        return $scope.selectedItem;
                    }
                },
                scope: $scope
            });

            modalInstance.result.then(function (selectedItem) {
              
                $scope.PersonaSeleccionada = selectedItem;

                var rolExiste = 0;

                for (var i = 0; i < $scope.usuariosRol.length; i++) {
                    if ($scope.usuariosRol[i].clavePersona === $scope.PersonaSeleccionada.clavePersona) {
                        toastr.error("El usuario ya tiene el rol asignado");
                        rolExiste = 1;
                        break;
                    } else {
                       
                        $scope.status = true;
                        rolExiste = 0;
                        
                        break;
                    }

                }
              
                if (rolExiste === 0) {
                    $scope.save();
                }

            });
        };





        //Guardar Cambios
        $scope.save = function () {
           
                if ($scope.status === true) {
                    var Registro = {
                        "idRol": $scope.id,
                        "clavePersona": $scope.PersonaSeleccionada.clavePersona,
                        "rupersona": $scope.PersonaSeleccionada.ruPersona,
                        "estado": 1,
                        "fechaEfectiva": $scope.PersonaSeleccionada.fechaEfectiva,
                    }

                    $scope.verificarRegistro = 0;

                    for (var i = 0; i < $scope.usuariosRol.length; i++) {
                        if ($scope.usuariosRol[i].clavePersona == $scope.PersonaSeleccionada.clavePersona) {
                            $scope.verificarRegistro = i;
                            break;
                        }
                    }

                    if ($scope.verificarRegistro === 0) {
                        RolPersonaService.Add(Registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $scope.caragarDatos();
                                    toastr.success("Rol asignado exitosamente");
                                },
                                function (err) {
                                    console.error(err);
                                }
                        );
                    } else {
                        toastr.error("El usuario ya tiene el rol asignado");
                    }
                } else {
                    toastr.error("El usuario ya tiene el rol asignado");
                }
               
            
        }
   
        //Guardar estado
        $scope.saveEstado = function (idRol, estado, clavePersona) {
            
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
                            "rolPersonaId": idRol,
                            "estado": _estado
                        };

                        RolPersonaService.UpdateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                       
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.usuariosRol.length; i++) {
                            if ($scope.usuariosRol[i].rolPersonaId === idRol) {
                                $scope.usuariosRol[i].estado = estado;
                            }
                        }
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }// FIN DE FUNCION QUE GUARDA ESTADO 

        //eliminar usuario
        $scope.eliminaUsuario = function (idRol, numempleado, estadoreg) {

            var pagina;
            var _estado;
            var registro;

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                       
                        $scope.indiceAEliminar = 0;

                        for (var i = 0; i < $scope.usuariosRol.length; i++) {
                            if ($scope.usuariosRol[i].rolPersonaId == idRol) {
                                $scope.indiceAEliminar = i;
                                break;
                            }
                        }

                        $scope.usuariosRol.splice($scope.indiceAEliminar, 1);
                       
                        RolPersonaService.eliminarUsuario(idRol);
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