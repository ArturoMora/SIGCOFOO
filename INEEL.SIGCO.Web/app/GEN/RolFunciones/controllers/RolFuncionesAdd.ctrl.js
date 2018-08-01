/*AYUDA:
FooEntitiesService nombre de factory en RolesAdd.service.js
*/

(function () {
    "use strict";

    angular
      .module("ineelGEN")
      .controller("RolFuncionesAddCtrl", ['$location','$scope',
          'rolfuncionesService',
          'funcionesService',
          'ModulosService',
          'RolesService',
          'globalGet',
          '$state',
          '$stateParams',
           "$uibModalInstance",
          "DTOptionsBuilder",
          RolFuncionesAddCtrl]);
    
    function RolFuncionesAddCtrl($location, $scope, rolfuncionesService, funcionesService, ModulosService, RolesService,
        globalGet, $state, $stateParams, $uibModalInstance, DTOptionsBuilder) {

        $scope.Roles = {};
        $scope.Roles.Funciones = [];
        $scope.funciones = null;

        $scope.addFuncion = function (f, rolPrevio) {
                f.IdRol = rolPrevio.rolId;
                f.IdFuncion = f.funcionesId;
               
                var index = $scope.Roles.Funciones.indexOf(f); //si ya esta en funciones 
                if (index >= 0) {//entonces: eliminarlo
                    $scope.Roles.Funciones.splice(index, 1);
                }else{                
                //de lo contrario agregarlo:
                    $scope.Roles.Funciones.push(f);
                }
            }

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
        }

        RolesService.getById($scope.rolPrevio).then(
         function (result) {
           $scope.rolseleccionado = result.data;
         },
         function (err) {
          console.error(err);
        });
                     
        ModulosService.getAll().then(
          function (result) {
          $scope.modulos = result.data;
        },
          function (err) {
            console.error(err);
        });

        $scope.myFunc = function (idmodulo) {

     
                var BusquedaFunciones = {
                    "modulo": idmodulo,
                    "rol": $scope.rolPrevio
                }             

                funcionesService.getFunByModuloRol(BusquedaFunciones).then(
                    function (result) {
                        $scope.funciones = result.data;
                        $scope.loading = false;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar las funciones del sistema");
                    }
                );
           
        };
             
        //Agregar rol
        $scope.save = function () {
           
            $scope.funcionAInsertar = 0;
            $scope.mse = "";        
          
            for (var i = 0; i < $scope.Roles.Funciones.length; i++) {
                $scope.funcionAInsertar = $scope.Roles.Funciones[i].funcionesId;
             
                for (var j = 0; j < $scope.registro.length; j++) {

                    if ($scope.registro[j].idFuncion === $scope.funcionAInsertar) {
                        $scope.Roles.Funciones[i].funcionesId = 0;
                        $scope.Roles.Funciones[i].IdRol = 0;
                        $scope.Roles.Funciones[i].IdFuncion = 0;
                        $scope.mse =  "El rol ya cuenta con alguna de las funciones que selecciono";
                        break;
                    } else {
                        $scope.mse = "" ;
                    }
                }
                              
            }
         

           
            rolfuncionesService.Add($scope.Roles).then(
            function (result) {
                toastr.success(result.data);

                $uibModalInstance.dismiss('cancel');
                $scope.cargarregistros($scope.rolPrevio)
                $scope.mensajeDeResultadoCarga($scope.mse);
            },
            function (err) {
                console.error(err);
                $uibModalInstance.dismiss('cancel');
                $scope.mensajeDeResultadoCarga($scope.mse);
            }
           );

          
             
        }      

    }

})();