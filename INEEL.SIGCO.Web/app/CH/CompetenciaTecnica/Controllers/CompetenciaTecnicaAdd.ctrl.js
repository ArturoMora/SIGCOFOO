/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    angular
        .module("ineelCH")
        .controller("competenciatecnicaCtrlAdd", ['$scope', 'competenciatecnicaService', 'tipoareaService', 'periodoevaluacionService', 'nivelcompetenciatecnicaService', 'globalGet', '$state', '$stateParams', competenciatecnicaCtrlAdd]);

    function competenciatecnicaCtrlAdd($scope, competenciatecnicaService, tipoareaService, periodoevaluacionService, nivelcompetenciatecnicaService, globalGet, $state, $stateParams) {
       

        var id = $stateParams.id;


        if ($stateParams.id === "" || $stateParams.id === undefined || $stateParams.id === null || isNaN($stateParams.id)) {
            toastr.error("Para poder agregar una nueva competencia, debe seleccionar un período de evaluación");
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

                        $scope.areasev = result.data;
                        $scope.loading = false;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar los tipos de áreas registrados en el sistema");
                    }
            );

            nivelcompetenciatecnicaService.getByPeriodo(id).then(
                function (result) {
                    $scope.niveles = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar los niveles de competencia registrados en el sistema");
                }
            );



            competenciatecnicaService.getByPeriodo(id).then(
                function (result) {                  
                    $scope.registroCompetencias = result.data;
                    $scope.loading = false;
                },
                function (err) {
                    toastr.error("No se han podido cargar las competencias técnicas registrados en el sistema");
                }
            );

            $scope.save = function () {

                var bandera = "0";

                var nuevaCompetencia = $scope.registro.competencia.trim();
                var nuevaDescripcion = $scope.registro.descripcion.trim();

                var cambioTipoArea = parseInt($scope.registro.areaId);
                var cambioNivel = parseInt($scope.registro.nivelId);

                if (cambioNivel > 0 && cambioTipoArea > 0) {

                    if (isNaN(cambioNivel) || isNaN(cambioTipoArea)) {
                        toastr.error("Debe seleccionar el tipo de area y el nivel de competencia");
                        bandera = "1";
                    } else {

                        for (var i = 0; i < $scope.registroCompetencias.length; i++) {
                            var competenciaRegistrada = $scope.registroCompetencias[i].competencia.trim();
                            var descripcionRegistrada = $scope.registroCompetencias[i].descripcion.trim();

                            var areaRegistrada = parseInt($scope.registroCompetencias[i].areaId);
                            var nivelRegistrado = parseInt($scope.registroCompetencias[i].nivelId);

                            if ((nuevaCompetencia.toUpperCase() === competenciaRegistrada.toUpperCase()) ) {
                                bandera = "1";
                            }
                        }
                    }

                    if (bandera === "0") {

                        if ($scope.NivelCompetenciaForm.$invalid) {
                            toastr.error("Complete los datos requeridos");
                            return false;
                        } else {
                            var Registro = {
                                "competencia": $scope.registro.competencia,
                                "descripcion": $scope.registro.descripcion,
                                "periodoId": id,
                                "areaId": $scope.registro.areaId,
                                "nivelId": $scope.registro.nivelId,
                                "estado": 1
                            }
                            competenciatecnicaService.add(Registro).then(
                                   function (result) {
                                       toastr.success(result.data);
                                       // $state.go("competenciatecnica");
                                       $state.go("competenciatecnica", { id: $stateParams.id });
                                   },
                                   function (err) {
                                       console.error(err);
                                   }
                            );
                        }
                    } else {
                        toastr.error("La competencia que desea agregar ya se encuentra registrada");

                    }
                } else {
                    toastr.error("Debe seleccionar un tipo de área y el nivel de la competencia");
                }
            }
        }

    }
})();