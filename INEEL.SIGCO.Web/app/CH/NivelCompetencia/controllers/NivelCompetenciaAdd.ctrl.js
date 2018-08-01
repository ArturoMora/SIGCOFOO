/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    angular
        .module("ineelCH")
        .controller("nivelcompetenciaCtrlAdd", ['$scope', 'nivelcompetenciaService', 'globalGet', '$state',  nivelcompetenciaCtrlAdd]);

    function nivelcompetenciaCtrlAdd($scope, nivelcompetenciaService, globalGet, $state) {


        nivelcompetenciaService.getAll().then(
            function (result) {
                $scope.nivelesRegistrados = result.data;            
            },
            function (err) {
                toastr.error("No se han podido cargar la información registrada en el sistema");
            }
        );

                   
        $scope.save = function () {

           
            

            var bandera = "0";

            var destino = $scope.registro.descripcion;
            
            var origen = "";

            for (var i = 0; i < $scope.nivelesRegistrados.length; i++) {
                var origen = $scope.nivelesRegistrados[i].descripcion;
               
                if (parseInt(origen) === parseInt(destino)) {
                    bandera = "1";                  
                }              
            }
            
            if (bandera === "0") {
                if ($scope.NivelCompetenciaForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    var Registro = {
                        "descripcion": $scope.registro.descripcion,
                        "estado": 1
                    }
                    nivelcompetenciaService.add(Registro).then(
                           function (result) {
                               toastr.success(result.data);
                               $state.go("nivelcompetencia");
                           },
                           function (err) {
                               console.error(err);
                           }
                    );
                }
            } else {
                toastr.error("El nivel de competencia que desea ingresar ya se encuentra registrado");
            }
         }

         $scope.onlyNumbers = function (event) {
             var keys = {
                 'up': 38, 'right': 39, 'down': 40, 'left': 37,
                 'escape': 27, 'backspace': 8, 'tab': 9, 'enter': 13, 'del': 46,
                 '0': 48, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55, '8': 56, '9': 57
             };
             for (var index in keys) {
                 if (!keys.hasOwnProperty(index)) continue;
                 if (event.charCode == keys[index] || event.keyCode == keys[index]) {
                     return; //default event
                 }
             }
             event.preventDefault();
         };
    }

})();