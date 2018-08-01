(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("formacionacademicaDetailsCtrl", ['AuthService', '$scope', 'FormacionAcademicaService', "$stateParams","globalGet", formacionacademicaDetailsCtrl]);

    function formacionacademicaDetailsCtrl(AuthService, $scope, FormacionAcademicaService, $stateParams, globalGet) {
        window.scrollTo(0, 0)
        var id = $stateParams.id;
        $scope.id2 = $stateParams.id2;
        $scope.registro = {};
        var API = globalGet.get("api");
        $scope.urlDescarga = API + "Descarga/GetFile";
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del usuario//

        //obtener el registro a mostrar
        FormacionAcademicaService.getFormacionAcadId(id).then(
            function (result) {
                FormacionAcademicaService.Persona(result.data.clavePersona).then(
                function (result) {
                    $scope.registro.nombreCompleto = result.data.nombreCompleto;
                    });
                debugger;
                $scope.registro = result.data;
                if ($scope.registro.fechaInicio != null) {
                    $scope.registro.fechaInicio = new Date($scope.registro.fechaInicio);
                    if ($scope.registro.fechaInicio.getFullYear() == 1900 || $scope.registro.fechaInicio.getFullYear() == 1899) {
                        $scope.inicioAux = $scope.registro.fechaInicio;
                        $scope.registro.fechaInicio = null;
                    }
                }


                if ($scope.registro.fechaTermino != null) {
                    $scope.registro.fechaTermino = new Date($scope.registro.fechaTermino);
                    if ($scope.registro.fechaTermino.getFullYear() == 1900 || $scope.registro.fechaTermino.getFullYear() == 1899) {
                        $scope.inicioAux = $scope.registro.fechaTermino;
                        $scope.registro.fechaTermino = null;
                    }
                }
                debugger;
                if ($scope.registro.adjunto == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    $scope.archivos = 1;
                }
            },
            function (error) {
                toastr.error(error);
            });
    }
})();