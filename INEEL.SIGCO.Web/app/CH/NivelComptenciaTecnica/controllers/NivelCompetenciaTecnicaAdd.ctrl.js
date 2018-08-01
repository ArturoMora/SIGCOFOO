/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    angular
        .module("ineelCH")
        .controller("nivelcompetenciatecnicaCtrlAdd", ['$scope', 'nivelcompetenciatecnicaService', 'tipoareaService', 'periodoevaluacionService', 'globalGet', '$state', '$stateParams', nivelcompetenciatecnicaCtrlAdd]);

    function nivelcompetenciatecnicaCtrlAdd($scope, nivelcompetenciatecnicaService, tipoareaService, periodoevaluacionService, globalGet, $state, $stateParams) {
       
        var id = $stateParams.id;
        $scope.idPeriodoSeleccionado = id;
                    
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


        if ($stateParams.id === "" || $stateParams.id === undefined || $stateParams.id === null || isNaN($stateParams.id)) {
            toastr.error("Para poder agregar un nuevo nivel, debe seleccionar un período de evaluación");
        } else {

            periodoevaluacionService.getById(id).then(
              function (result) {
                  $scope.periodosev = result.data;
              },
              function (err) {
                  toastr.error("No se han podido cargar la información registrada en el sistema");
              }
            );

            tipoareaService.getAll().then(
              function (result) {
                  $scope.areasser = result.data;
                  $scope.loading = false;
              },
              function (err) {
                  toastr.error("No se han podido cargar los tipos de áreas registrados en el sistema");
              }
            );

            nivelcompetenciatecnicaService.getByPeriodo($stateParams.id).then(
                function (result) {
                    $scope.nivelesregistrados = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar los niveles de competencias técnicas");
                }
            );

            $scope.save = function () {
                var bandera = "0";
                var seleccionomaxmin = 0;
                              

                var destino = $scope.descripcion.trim();
                var areaIdSel = parseInt($scope.areaId);
                var origen = "";

                var valMin = parseInt($scope.categoriaMin);
                var valMax = parseInt($scope.categoriaMax);

                 

                if (isNaN(valMax) || isNaN(valMin) ||  valMax === 0 || valMin === 0) {
                    toastr.error("Debe seleccionar el nivel de categoría máximo y mínimo");
                   
                } else {

                    for (var i = 0; i < $scope.nivelesregistrados.length; i++) {
                        var origen = $scope.nivelesregistrados[i].descripcion.trim();
                        var areaorigen = parseInt($scope.nivelesregistrados[i].areaId);
                        if ((origen.toUpperCase() === destino.toUpperCase()) && (areaorigen === areaIdSel) ) {
                            bandera = "1";
                        }
                    }



                    if (bandera === "0") {
                        if ($scope.NivelCompetenciaForm.$invalid) {
                            toastr.error("Complete los datos requeridos");
                            return false;
                        } else {
                            var Registro = {
                                "descripcion": $scope.descripcion,
                                "periodoId": $scope.idPeriodoSeleccionado,
                                "areaId": $scope.areaId,
                                "categoriaMin": $scope.categoriaMin,
                                "categoraMax": $scope.categoriaMax,
                                "estado": 1
                            }
                            nivelcompetenciatecnicaService.add(Registro).then(
                                   function (result) {
                                       toastr.success(result.data);

                                       $state.go("niveltecnica", { id: $stateParams.id });
                                       //$state.go("niveltecnica");
                                   },
                                   function (err) {
                                       console.error(err);
                                   }
                            );
                        }
                    } else {
                        toastr.error("El nivel de competencia que desea agregar ya se registro previamente");
                    }
                }
            }
        }

    }
})();