(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("AgregarPreguntaComunidadCtrl", [
            "AuthService",
            "$scope",
            "$uibModalInstance",
            "$filter",
            "PreguntasCPService",
            AgregarPreguntaComunidadCtrl
        ]);

    function AgregarPreguntaComunidadCtrl(AuthService, $scope, $uibModalInstance, $filter, PreguntasCPService) {
        $scope.pregunta = {};
        
        $scope.agregarRegistro = function () {
            if ($scope.preguntaAddForm.$invalid) {
                return false;
            } else {
                if ($scope.rol.administrador) {
                    $scope.pregunta.idPersona = $scope.rol.datosMiembro.idPersonas;
                    $scope.pregunta.idMiembroCP = null;
                } else {
                    $scope.pregunta.idMiembroCP = $scope.rol.datosMiembro.miembroId;
                }
                $scope.pregunta.fechaRegistro = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString();
                $scope.pregunta.idCP = $scope.comunidad.comunidadId;
                

                PreguntasCPService.create($scope.pregunta).then(function (result) {
                    toastr.success("Registro creado exitosamente!");
                    
                    $uibModalInstance.close(result.data);
                }, function (err) {
                    toastr.error("Error al crear el registro");
                    console.log(err);
                });
            }
            
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            toastr.clear();
        }

        

    }

})();