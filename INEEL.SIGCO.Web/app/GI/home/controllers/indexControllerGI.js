(function () {
    'use strict';
    angular
        .module("ineelGI")
        .controller('indexControllerGI', ['$scope', '$location',
            'AuthService', 'MenuService', 'NuevoOCService', '$uibModal','NotificacionService', indexControllerGI]);

    function indexControllerGI($scope, $location, AuthService, MenuService, NuevoOCService, $uibModal, NotificacionService) {
        $scope.isSigco = false;
        $scope.isModulo = true;
        $scope.modulo = "GI";
        $scope.modulos = [];
        $scope.authentication = AuthService.authentication;
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        NotificacionService.GetAllByEvaluadorFI($scope.ClavePersonaLogin).then(
        function (result) {
            $scope.registros = result.data;
            if ($scope.registros.length > 0) {
                $scope.externas = true;
            } else {
                $scope.externas = false;
            }
        });
        $scope.rol = MenuService.getRolId();
        $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
        $scope.funciones = MenuService.getMenuGI();
        $scope.rolDescripcion = MenuService.getRolDescripcion();
        MenuService.getModulos().then(
            function (result) { $scope.modulos = result.data },
            function (error) { toastr.error("no se han podido cargar los Modulos"); }
        );
        $scope.logOut = function () {
            AuthService.logOut();
            window.location = "/index.html#/login";
        }
        $scope.nuevosOCs = [];

        $scope.openchangepassword = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/auth/changepassword.html',
                controller: 'changepasswordCtrl'
            });
        }

        $scope.getNotificaciones = function () {
            NotificacionService.notificacionesSolicitudes($scope.rol, $scope.clavePersona).then(
                function (result) {
                    $scope.soliResult = result.data;
                },
                function (error) {
                    toastr.error(error);
                });
        }
    }
}());