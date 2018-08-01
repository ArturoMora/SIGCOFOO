(function () {

    "use strict";

    angular
    .module("ineelCR")
    .controller("AlumnoEditCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "AlumnoCRService",
        AlumnoEditCtrl
    ]);


                            
    function AlumnoEditCtrl($scope, $state, $stateParams, AlumnoCRService) {
        
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

        $scope.EditAlumno = function () {

            if ($scope.alumnoForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }





            AlumnoCRService.update($scope.alumno).then(
                function (result) {
                    toastr.success(result.data);
                    $state.go("alumnoGetAll");
                },
                function (err) {
                    toastr.error(result.data);
                    //console.error(err);
                });
        };
    }
})();