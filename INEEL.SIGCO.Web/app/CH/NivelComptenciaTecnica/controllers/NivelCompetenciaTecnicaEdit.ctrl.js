/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    angular
        .module("ineelCH")
        .controller("nivelcompetenciatecnicaCtrlEdit", ['$scope', 'nivelcompetenciatecnicaService', 'tipoareaService', 'periodoevaluacionService', 'globalGet', '$state', '$stateParams', nivelcompetenciatecnicaCtrlEdit]);

    function nivelcompetenciatecnicaCtrlEdit($scope, nivelcompetenciatecnicaService, tipoareaService, periodoevaluacionService, globalGet, $state, $stateParams) {
        
        var id = $stateParams.id;
        var area = "";
        var descripcion = "";
        var min = 0;
        var max = 0;
                        
        $scope.niveles = [
              { valor: "0", descripcion: "Seleccione un nivel de categoría" },
              
              { valor: "1", descripcion: "A" },
              { valor: "2", descripcion: "B" },
              { valor: "3", descripcion: "C" },
              { valor: "4", descripcion: "D" },
              { valor: "5", descripcion: "E" },
              { valor: "6", descripcion: "F" },
              { valor: "7", descripcion: "G" },
              { valor: "8", descripcion: "H" },
              { valor: "9", descripcion: "I" },
              { valor: "10", descripcion: "J" },
              { valor: "11", descripcion: "K" },
              { valor: "12", descripcion: "L" },
              { valor: "13", descripcion: "M" },
              { valor: "14", descripcion: "N" },
              { valor: "15", descripcion: "O" },
              { valor: "16", descripcion: "P" },
              { valor: "17", descripcion: "Q" },
              { valor: "18", descripcion: "R" },
              { valor: "19", descripcion: "S" },
              { valor: "20", descripcion: "T" },
              { valor: "21", descripcion: "U" },
              { valor: "22", descripcion: "V" },
              { valor: "23", descripcion: "W" },
              { valor: "24", descripcion: "X" },
              { valor: "25", descripcion: "Y" },
              { valor: "26", descripcion: "Z" }
        ];    

        tipoareaService.getAll().then(
          function (result) {
              $scope.areasser = result.data;
              $scope.loading = false;
          },
          function (err) {
              toastr.error("No se han podido cargar los tipos de áreas registrados en el sistema");
          }
        );

        //Obtene ambito
        nivelcompetenciatecnicaService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
                $scope.catMax = parseInt($scope.registro.categoraMax);
                $scope.catMin = parseInt($scope.registro.categoriaMin);
                min = parseInt($scope.registro.categoriaMin);
                max = parseInt($scope.registro.categoraMax);
                area = $scope.registro.areaId;
                descripcion =  $scope.registro.descripcion.trim();

                nivelcompetenciatecnicaService.getByPeriodo($scope.registro.periodoId).then(
                    function (result) {
                        $scope.nivelesregistrados = result.data;
                        $scope.loading = false;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar los niveles de competencias técnicas");
                    }
                );
            },
            function (err) {
                console.error(err);
            }
        );

       

        //Guardar Cambios
        $scope.save = function () {
         
            var bandera = "0";
            var seleccionomaxmin = 0;
            
            var descripcionMod = $scope.registro.descripcion.trim();
            var areaMod        = parseInt($scope.registro.areaId);
            var valMinMod      = parseInt($scope.registro.categoriaMin);
            var valMaxMod      = parseInt($scope.registro.categoraMax);
                       
            if (valMinMod === null || valMinMod === undefined || isNaN(valMaxMod) || isNaN(valMinMod) || valMaxMod === 0 || valMinMod === 0) {
                toastr.error("Debe seleccionar el nivel de categoría máximo y mínimo");
               
            } else {
              

                if (area === areaMod && descripcion === descripcionMod) {

                    if (max === valMaxMod && min === valMinMod) {
                        bandera = "1";
                    } else {
                       
                        if (parseInt(valMaxMod) > parseInt(valMinMod)) {
                            bandera = "0";
                        } else {
                            bandera = "1";
                            toastr.error("Verifique que las categorías esten asignadas correctamente");
                        }

                    }




                } else {
                   

                        for (var i = 0; i < $scope.nivelesregistrados.length; i++) {
                            var descripcionRegistrados = $scope.nivelesregistrados[i].descripcion.trim();
                            var areaRegistrados        = parseInt($scope.nivelesregistrados[i].areaId);
                            var maxRegistrados         = parseInt($scope.nivelesregistrados[i].categoraMax);
                            var minRegistrados         = parseInt($scope.nivelesregistrados[i].categoriaMin);

                            if ((descripcionMod.toUpperCase() === descripcionRegistrados.toUpperCase()) && (areaMod === areaRegistrados) && (valMinMod === minRegistrados) && (valMaxMod === maxRegistrados)) {
                                bandera = "1";
                                break;
                            }

                            if ((descripcionMod.toUpperCase() === descripcionRegistrados.toUpperCase()) && (areaMod === areaRegistrados)) {
                                bandera = "1";
                                break;
                            }

                        }
                                         
                  
                }




                if (bandera === "0") {

                    if ($scope.NivelCompetenciaForm.$invalid) {
                        toastr.error("Complete los datos requeridos");
                        return false;
                    } else {
                        nivelcompetenciatecnicaService.update($scope.registro).then(
                               function (result) {
                                   toastr.success(result.data);
                                   $state.go("niveltecnica", { id: $scope.registro.periodoId });

                               },
                                function (err) {
                                    console.error(err);
                                }
                        );
                    }
                } else {
                    toastr.error("El nivel de competencia que desea actualizar, ya se encuentra registrado");
                }
            }
        }


    }

})();