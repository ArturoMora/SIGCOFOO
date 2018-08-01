/*AYUDA:
FooEntitiesService nombre de factory en RolesEdit.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("TipoUnidadEditCtrl", ['$scope', 'tunidadService', 'globalGet', '$state', '$stateParams', TipoUnidadEditCtrl]);

    function TipoUnidadEditCtrl($scope, tunidadService, globalGet, $state, $stateParams) {

        //Variable API
        var API = globalGet.get("api"); 
          
        var id = $stateParams.id;

        debugger
        
        tunidadService.GetById(id).then(
            function (result) {
                debugger
                $scope.registro = result.data;
                $scope.registro.fechaEfectiva = new Date(result.data.fechaEfectiva);
               
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.TUForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                tunidadService.Update($scope.registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("tipounidad");
                                },
                                function (err) {
                                    console.error(err);
                                });
            }
        }

    }

})();