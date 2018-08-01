(function () {
    "use strict";

    var app = angular.module("ineel.controllers");

    app.controller("NotificationCtrl", ["MenuService", "AuthService", "$scope",  "comunCountService", NotificationCtrl]);
    function NotificationCtrl(MenuService, AuthService, $scope, comunCountService) {
        $scope.rol = MenuService.getRolId();
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        //obtener registros
        $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
        $scope.pendientes = 0;
        //alert($scope.rol);
        if ($scope.rol == 4) {
            comunCountService.notification_GetAllGerenteByClaveCount($scope.authentication.userprofile.claveUnidad).then(
                function (result) {
                    $scope.pendientes = result.data;
                },
                function (error) { }
            );
        } else if ($scope.rol == 1 || $scope.rol == 1026) {
            comunCountService.notification_GetAllCount($scope.clavePersona).then(
                function (result) {
                    //alert("result");
                    $scope.pendientes = result.data;
                },
                function (error) {
                    //alert("error");
                    console.error(error);
                }
            );
        }


    }
})();