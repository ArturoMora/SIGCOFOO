/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    angular
        .module("ineelCH")
        .controller("competenciatecnicaCtrlEdit", ['$scope', 'competenciatecnicaService', 'tipoareaService', 'periodoevaluacionService', 'nivelcompetenciatecnicaService', 'globalGet', '$state', '$stateParams', competenciatecnicaCtrlEdit]);

    function competenciatecnicaCtrlEdit($scope, competenciatecnicaService, tipoareaService, periodoevaluacionService, nivelcompetenciatecnicaService, globalGet, $state, $stateParams) {
        
        var id = $stateParams.id;

        var competencia = "";
        var descripcion = "";
        var tipoarea = 0;
        var nivel = 0;
    

                   
        competenciatecnicaService.getById(id).then(
            function (result) {
                $scope.registro = result.data;


                competenciatecnicaService.getByPeriodo($scope.registro.periodoId).then(
                    function (result) {
                        $scope.registroCompetencias = result.data;
                        $scope.loading = false;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar las competencias técnicas registrados en el sistema");
                    }
                );


                nivelcompetenciatecnicaService.getByPeriodo($scope.registro.periodoId).then(
                    function (result) {
                        $scope.niveles = result.data;
                        $scope.loading = false;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar los niveles de competencia registrados en el sistema");
                    }
                );

                competencia = $scope.registro.competencia.trim();
                descripcion = $scope.registro.descripcion.trim();
                area = parseInt($scope.registro.areaId);
                nivel = parseInt($scope.registro.nivelId);
            },
            function (err) {
                console.error(err);
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



        //Guardar Cambios
        $scope.save = function () {
            var bandera = "0";

            var competenciaMod = $scope.registro.competencia.trim();
            var descripcionMod = $scope.registro.descripcion.trim();
            var areaMod        = parseInt($scope.registro.areaId);
            var nivelMod       = parseInt($scope.registro.nivelId);
           
            debugger;


            if (competencia.toUpperCase() === competenciaMod.toUpperCase() && area === areaMod && nivel === nivelMod) {

                if (descripcion !== descripcionMod) {
                    bandera = "0";
                } else {
                    bandera = "1";
                }
                
            } else {
                
                for (var i = 0; i < $scope.registroCompetencias.length; i++) {
                    var CompetenciaRegistrada = $scope.registroCompetencias[i].competencia.trim();
                    var descripcionRegistrada = $scope.registroCompetencias[i].descripcion.trim();
                    var areaRegistrada        = parseInt($scope.registroCompetencias[i].areaId);
                    var nivelRegistrado       = parseInt($scope.registroCompetencias[i].nivelId);

                    if ((CompetenciaRegistrada.toUpperCase() === competenciaMod.toUpperCase()) ) {
                        bandera = "1";
                    }
                }


            }

            

            if (bandera === "0") {

                if ($scope.NivelCompetenciaForm.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    competenciatecnicaService.update($scope.registro).then(
                           function (result) {
                               toastr.success(result.data);
                               //$state.go("competenciatecnica");
                               $state.go("competenciatecnica", { id: $scope.registro.periodoId });
                           },
                            function (err) {
                                console.error(err);
                            }
                    );
                }
            } else {
                toastr.error("La competencia que desea actualizar, ya fue registrada previamente");
            }
        }


    }

})();