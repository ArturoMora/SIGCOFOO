/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("competenciasCtrlEdit", ['$scope', 'calificacioncompetenciasService', 'globalGet', '$state', '$stateParams', competenciasCtrlEdit]);

    function competenciasCtrlEdit($scope, calificacioncompetenciasService, globalGet, $state, $stateParams) {
        
        var id = $stateParams.id;


        //Obtene ambito
        calificacioncompetenciasService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (err) {
                console.error(err);
            }
        );

       

        //Guardar Cambios
        $scope.save = function () {
            if ($scope.CakificacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
              
                calificacioncompetenciasService.update($scope.registro).then(
                       function (result) {
                           toastr.success(result.data);
                           $state.go("calificacion");
                        },
                        function (err) {
                           console.error(err);
                        }
                );
            }
        }


    }

})();