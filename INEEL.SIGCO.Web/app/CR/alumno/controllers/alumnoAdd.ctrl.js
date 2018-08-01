(function () {
    "use strict";

    angular
    .module("ineelCR")
    .controller("AlumnoAddCtrl", [
        "$scope",
        "$state",
        "$stateParams",
        "AlumnoCRService",
        AlumnoAddCtrl
    ]);

    function AlumnoAddCtrl($scope, $state, $stateParams, AlumnoCRService) {

        $scope.AddAlumno = function () {

            if ($scope.alumnoAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }


            AlumnoCRService.create($scope.alumno).then(
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