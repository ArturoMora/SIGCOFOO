(function () {
    "use strict";
    angular
        .module("ineel")
        .controller('homeauthorizeCtrl', ['$scope', '$location', 'AuthService', 'MenuService', 'comunService', homeauthorizeCtrl]);

    function homeauthorizeCtrl($scope, $location, AuthService, MenuService, comunService) {
        $scope.gerente = 4;//4 for Gerente
        $scope.mostrarSolicitudes = false;
        $scope.authentication = AuthService.authentication;


        if ((typeof $scope.authentication.isAuth === undefined) || !$scope.authentication.isAuth) {
            AuthService.logOut();
            window.location = "/index.html#/login";
        }


        $scope.$parent.rolDescripcion = MenuService.getRolDescripcion();
        MenuService.getModulos().then(
            function (result) { $scope.modulos = result.data },
            function (error) { toastr.error("no se han podido cargar los Modulos"); }
        );
        $scope.ultimosOC = [];
        if (typeof $scope.authentication.isAuth !== undefined
            && !$scope.authentication.isAuth) {
            $location.path('/home');
        } else {

            $scope.ultimosOC = [];
            $scope.idRol = MenuService.getRolId(); // de cualquier getMenu[Modulo]
            if ($scope.idRol == $scope.gerente || $scope.idRol == 5 || $scope.idRol == 16) {
                $scope.mostrarSolicitudes = true
                comunService.SolicitudAccesoTop($scope.authentication.userprofile.claveUnidad, 8, 4).then(
                    function (result) {
                        $scope.ultimosOC = result.data;
                    },
                    function (error) {
                        $scope.ultimosOC = [];
                    }
                );
            }
            comunService.getOCtopRaw(11).then(
                function (result) { $scope.nuevosOCs = result.data; },
                function (error) { $scope.nuevosOCs = []; }
            );

        }
    };
}());
