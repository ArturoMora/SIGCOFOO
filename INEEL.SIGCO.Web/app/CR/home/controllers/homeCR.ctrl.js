﻿(function () {
    'use strict';
    angular
        .module("ineelCR")
        .controller('indexControllerCR', [
            '$scope',
            '$location',
            'AuthService',
            'MenuService',
            '$uibModal',
            'NotificacionService',
            homeCRCtrl
        ]);

    function homeCRCtrl($scope, $location, AuthService, MenuService, $uibModal, NotificacionService) {
        $scope.isSigco = false;
        $scope.isModulo = true;
        $scope.modulo = "CR";
        $scope.authentication = AuthService.authentication;
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;

        if ((typeof $scope.authentication.isAuth === undefined) || !$scope.authentication.isAuth) {
            AuthService.logOut();
            window.location = "/index.html#/login";
        }

        NotificacionService.GetAllByEvaluadorFI($scope.ClavePersonaLogin).then(
        function (result) {
            $scope.registros = result.data;
            if ($scope.registros.length > 0) {
                $scope.externas = true;
            } else {
                $scope.externas = false;
            }
        });
        $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
        $scope.rol = MenuService.getRolId();
        $scope.funciones = MenuService.getMenuCR();
        $scope.rolDescripcion = MenuService.getRolDescripcion();
        $scope.rolId = MenuService.getRolId();
        MenuService.getModulos().then(
            function (result) { $scope.modulos = result.data },
            function (error) { toastr.error("no se han podido cargar los Modulos"); }
        );

        $scope.openchangepassword = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/auth/changepassword.html',
                controller: 'changepasswordCtrl'
            });
        }

        $scope.logOut = function () {
            AuthService.logOut();
            window.location = "/index.html#/login";
        }

        $scope.getNotificaciones = function () {
            NotificacionService.notificacionesSolicitudes($scope.rol, $scope.clavePersona).then(
                function (result) {
                    $scope.soliResult = result.data;
                    $scope.externas = false;
                },
                function (error) {
                    toastr.error(error);
                });
        }

        $scope.getNotificaciones($scope.rol, $scope.clavePersona);
        //$scope.authentication = AuthServiceCR.authentication;
    }
}());
