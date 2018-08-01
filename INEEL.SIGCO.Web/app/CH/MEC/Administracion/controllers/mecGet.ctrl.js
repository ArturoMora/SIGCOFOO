(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("mecAdministracionTecnicaCtrlGet", ["AuthService", "$scope", "$rootScope", "MECService", "$uibModal", mecAdministracionTecnicaCtrlGet]);

    function mecAdministracionTecnicaCtrlGet(AuthService, $scope, $rootScope, MECService, $uibModal) {
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //obtener clave de usuario
        $scope.numEmp = AuthService.authentication.userprofile.clavePersona;
        $rootScope.idG = "";
        $scope.setId = function (id) {
            $rootScope.idG = id;
        }
        MECService.getAllTecnica().then(
            function (result) {
                $scope.registrosTecnicos = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de Competencia Técnica");
            }
            );
        MECService.getAllConductual().then(
            function (result) {
                $scope.registrosConductual = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros de Competencia Conductual");
            }
            );

        $scope.openTecnico = function (registro) {
            $scope.descripcionRow = "Competencia Técnica";
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        $scope.deleteTecnico(registro, $uibModalInstance);
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };


        //Eliminar registro SNI
        $scope.deleteTecnico = function (registro, $uibModalInstance) {
            MECService.deleteTecnica(registro.manualCompetenciaTecnicaId).then(
                    function (result) {
                        MECService.getAllTecnica().then(
                            function (result) {
                                $scope.registrosTecnicos = result.data;
                            },
                            function (err) {
                                toastr.error("No se han podido cargar los registros de Competencia Técnica");
                            }
                            );
                        //var idx = ($scope.registrosTecnicos.indexOf(registro));
                        //$scope.registrosTecnicos.splice(idx, 1);
                        //toastr.success(result.data);
                        $uibModalInstance.dismiss('close');
                    },
                    function (err) {
                        toastr.error(err.data.message);
                    });
        };

        $scope.openConductual = function (registro) {
            $scope.descripcionRow = "Competencia Conductual";
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        $scope.deleteConductual(registro, $uibModalInstance);
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };


        //Eliminar registro SNI
        $scope.deleteConductual = function (registro, $uibModalInstance) {
            MECService.deleteConductual(registro.manualCompetenciaConductualId).then(
                    function (result) {
                        MECService.getAllConductual().then(
                        function (result) {
                            $scope.registrosConductual = result.data;
                        },
                        function (err) {
                            toastr.error("No se han podido cargar los registros de Competencia Conductual");
                        }
                        );
                        //var idx = ($scope.registrosConductual.indexOf(registro));
                        //$scope.registrosConductual.splice(idx, 1);
                        //toastr.success(result.data);
                        $uibModalInstance.dismiss('close');
                    },
                    function (err) {
                        toastr.error(err.data.message);
                    });
        };

    }
})();