/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("competenciasCtrlAdd", ['$scope', 'calificacioncompetenciasService',  'globalGet', '$state', '$stateParams', competenciasCtrlAdd]);

    function competenciasCtrlAdd($scope, calificacioncompetenciasService, globalGet, $state, $stateParams) {
    
        
        //Agregar
        $scope.save = function () {
           
            if ($scope.CalificacionForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                var Registro = {
                    "calificacion": $scope.registro.calificacion,
                    "estado"     : 1
                }

                
                calificacioncompetenciasService.add(Registro).then(
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