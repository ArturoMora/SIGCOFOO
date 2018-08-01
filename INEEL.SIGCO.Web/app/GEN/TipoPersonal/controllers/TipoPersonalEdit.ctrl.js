/*AYUDA:
FooEntitiesService nombre de factory en RolesEdit.service.js
*/

(function () {
    "use strict";


    angular
      .module("ineelGEN")
      .controller("TipoPersonalEditCtrl", ['$scope', 'tipopersonaService', 'globalGet', '$state', '$stateParams', TipoPersonalEditCtrl]);

    function TipoPersonalEditCtrl($scope, tipopersonaService, globalGet, $state, $stateParams) {

        //Variable API
        var API = globalGet.get("api");
        
        var id = $stateParams.id;

        //Obtene ambito
        tipopersonaService.GetById(id).then(
            function (result) {
                $scope.registro = result.data;
               
            },
            function (err) {
                console.error(err);
            });

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.TipoPersonaForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                tipopersonaService.Update($scope.registro).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("tipopersonal");
                                },
                                function (err) {
                                    console.error(err);
                                });
            }
        }

    }

})();