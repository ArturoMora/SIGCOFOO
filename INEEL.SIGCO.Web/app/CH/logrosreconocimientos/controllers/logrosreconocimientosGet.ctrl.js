(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("logrosreconocimientosCtrlGet", ["AuthService", "$scope", "$rootScope", "logrosreconocimientosService", "$uibModal", logrosreconocimientosCtrlGet]);

    function logrosreconocimientosCtrlGet(AuthService, $scope, $rootScope, logrosreconocimientosService, $uibModal) {
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        $scope.editarGestion = 0;
        //obtener clave de usuario
        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        if ($scope.idGF == null) {
            $scope.numEmp = AuthService.authentication.userprofile.clavePersona;
        } else {
            $scope.numEmp = $scope.idGF;
            $scope.editarGestion = 1;
        }
        $rootScope.idG = "";
        $scope.setId = function (id) {
            //alert(id);
            $rootScope.idG = id;
        }
        //Obtener todos los registros del usuario que inicio sesion
        logrosreconocimientosService.getbyclave($scope.numEmp).then(
            function (result) {
                $scope.registros = result.data;
                $scope.loading = false;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de Logros y Reconocimientos");
            }
            );

        $scope.open = function (registro) {
            $scope.descripcionRow = registro.cursoImpartido;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        $scope.delete(registro, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };


        //Eliminar registro SNI
        $scope.delete = function (registro, $uibModalInstance) {
            logrosreconocimientosService.delete(registro.logrosReconocimientosId).then(
                    function (result) {
                        var idx = ($scope.registros.indexOf(registro));
                        $scope.registros.splice(idx, 1);
                        toastr.success(result.data);
                        $uibModalInstance.dismiss('close');
                    },
                    function (err) {
                        toastr.error(err.data.message);
                    });
        };


    }
})();