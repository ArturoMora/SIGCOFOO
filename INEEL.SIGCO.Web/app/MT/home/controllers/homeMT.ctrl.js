(function () {
    'use strict';
    angular
        .module("ineelMT")
        .controller('indexControllerMT', ['$scope', '$location',
            'AuthService', 'MenuService', 'NuevoOCService', '$uibModal', 'NotificacionService', 'IndicadoresMTService', indexControllerMT]);

    function indexControllerMT($scope, $location, AuthService, MenuService, NuevoOCService, $uibModal, NotificacionService, IndicadoresMTService) {
        $scope.isSigco = false;
        $scope.isModulo = true;
        $scope.modulo = "MT";
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
        $scope.rol = MenuService.getRolId();
        // $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
        $scope.funciones = MenuService.getMenuMT();
        MenuService.getModulos().then(
            function (result) { $scope.modulos = result.data },
            function (error) { toastr.error("no se han podido cargar los Modulos"); }
        );
        $scope.rolDescripcion = MenuService.getRolDescripcion();
        
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
            NotificacionService.notificacionesSolicitudes($scope.rol, $scope.ClavePersonaLogin).then(
                function (result) {
                    $scope.soliResult = result.data;
                },
                function (error) {
                    toastr.error(error);
                });
        }


        $scope.registraAcceso = function () {

           
            var datos = {
                "claveEmpleado": $scope.ClavePersonaLogin,
                "fecha": new Date(),
                "modulo": "MT"               
            }

            IndicadoresMTService.AddAccesoModulos(datos).then(
                function (result) {
                    //$scope.soliResult = result.data;
                },
                function (error) {
                    toastr.error(error);
                });
        }

        $scope.registraAcceso();


    }
}());