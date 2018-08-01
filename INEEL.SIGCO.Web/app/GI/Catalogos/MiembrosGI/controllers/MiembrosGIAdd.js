(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("MiembrosGIAdd", ["AuthService", "$scope", "$state", "MiembrosGIService", IdeaInnovadoraGet]);

    function IdeaInnovadoraGet(AuthService, $scope, $state, MiembrosGIService) {
        $scope.persona = {};
        MiembrosGIService.getGrupoEvaluadores().then(
            function (result) {
                $scope.gruposEvaluadores = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de grupos evaluadores.");
                console.log(err);
            });

        $scope.eliminaMiembro=function() {
            $scope.persona = {};
        }


        $scope.agregarMiembro = function () {
            
            //{clavePersona: "00013", nombreCompleto: "Juan Arredondo Gallegos", claveUnidad: "94", tipoContratoId: "5", estado: 0, …}
            if ($scope.miembroForm.$invalid || $scope.persona.length>0) {
                toastr.error("Agregue los campos requeridos");
                return false;
            } else {
                $scope.miembro = {};
                $scope.miembro.ClavePersona = $scope.persona.clavePersona;
                $scope.miembro.NombrePersona = $scope.persona.nombreCompleto;
                $scope.miembro.Activo = true;
                $scope.miembro.ComiteGIId = $scope.grupoId;
                MiembrosGIService.addMiembro($scope.miembro)
                    .then(function (res) {
                        if (res.data == "Registro creado exitosamente!") {
                            toastr.success(res.data);
                        } else {
                            toastr.error(res.data);
                        }
                        $state.go("miembrosGI");
                    },
                        function (err) {
                            if (err.data.innerException != null) {
                                toastr.error(err.data.innerException.exceptionMessage);
                            } else {
                                toastr.error(err.data.message);
                            }
                            console.log(err);
                        });
            }
      
        }


    }
})();