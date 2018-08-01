(function () {

    "use strict";

    angular
    .module("ineelCR")
    .controller("AlumnoDetailsCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "AlumnoCRService",
        AlumnoDetailsCtrl
    ]);


                            
    function AlumnoDetailsCtrl($scope, $state, $stateParams, AlumnoCRService) {
        

        $scope.ImprimeSexo = function (Cadena) {

            if (Cadena == "F") {
                return "Femenino";
            }
            else {
                return "Masculino";
            }

        };

        // Se trae los datos del alumno con base en su Id
        $scope.alumnoId = $stateParams.id;
        AlumnoCRService.get($scope.alumnoId).then(
            function (result) {
                $scope.alumno = result.data;
            },
            function (err) {
                toastr.error(result.data);
                //console.error(err);
            });


    }
})();