(function () {
    "use strict";
    angular
        .module("ineel")
        .controller('indexController', ['$scope', '$location', 'AuthService', 'HOST', '$uibModal','MenuService','NotificacionService', indexController]);

    function indexController($scope, $location, AuthService, HOST, $uibModal, MenuService, NotificacionService) {
        $scope.isSigco = true;
        $scope.isModulo = false;
        $scope.rol = MenuService.getRolId();
        $scope.rolDescripcion = "";
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

        if (AuthService.authentication.userprofile != undefined) {
            $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
        }
        if ((typeof $scope.authentication.isAuth === undefined) || !$scope.authentication.isAuth) {

            //-------------------------------------- logica contemplando index, sigco y modulos HTML ::
            if ($location.$$absUrl.indexOf("newpass") < 1) {
               
                if ($location.$$host.toLowerCase() != HOST.toLowerCase()) {
                    window.location = $location.$$absUrl.replace($location.$$host, HOST);
                }

                if ($location.$$absUrl.indexOf("index.html") < 1 || $location.$$absUrl.indexOf("/#/hom") < 1) {
                    if ($location.$$absUrl.indexOf("sigco.html") < 1) {
                        window.location = "/index.html#/login";
                    }
                }
            }
        } else {
            if ($location.$$host.toLowerCase() != HOST.toLowerCase()) {
                window.location = $location.$$absUrl.replace($location.$$host, HOST);
            }

            if ($location.$$path == '/home' || $location.$$path == '/login') {
                if ($location.$$absUrl.indexOf("index.html") > 0 || $location.$$absUrl.indexOf("/#/hom") > 0) {
                    window.location = "/sigco.html";
                } else if ($location.$$absUrl.indexOf("sigco.html") > 0) {
                    window.location = "/sigco.html#/homeAuthorize";
                }
            } else {

                if ($location.$$absUrl.indexOf(".html") < 0) {
                    window.location = "/sigco.html#/homeAuthorize";
                }
                if ($location.$$absUrl.indexOf("index.html") > 0 || $location.$$absUrl.indexOf("/#/hom") > 0) {
                    if ($location.$$path == '') {
                        window.location = "/sigco.html";
                    }

                }

                if ($location.$$path == '/login') {
                    window.location = "/sigco.html";
                }
            }
        }

        $scope.openchangepassword = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/auth/changepassword.html',
                controller: 'changepasswordCtrl'
            });
        }

        $scope.logOut = function () {
            AuthService.logOut();
            console.log("$scope.logOut: logOut()");
            //$location.path('/home');
            window.location = "/index.html#/login";
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
    };
}());
