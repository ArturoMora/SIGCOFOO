(function () {
    'use strict';
    angular
        .module("ineelDESCARGAS")
        .controller('DescargasQ', ['$scope', '$location','$stateParams',
            'AuthService', 'MenuService', 'DescargasService', '$window', DescargasQ])
    .controller('DescargasCursos', ['$scope', '$location','$stateParams',
            'AuthService', 'MenuService', 'DescargasService', '$window', DescargasCursos]);
    function DescargasCursos($scope, $location, $stateParams, AuthService,
        MenuService, DescargasService, $window) {
        debugger;
        $scope.authentication = AuthService.authentication;
        if ($scope.authentication.isAuth == false) {
            toastr.error("Usuario no autenticado");
        }
        var token=$stateParams.id; 
        //$scope.decrypted = DescargasService.desencriptar(token);
        $scope.descarga = false;
        $scope.loading = true;
        DescargasService.downloadFileCurso(token).then(
            function (result) {
                console.log(result);
                $scope.descarga = true;
                $scope.loading = false;
            },
        function(error){
            console.log(error);
            $scope.loading = false;

        }
            );
        $scope.close = function () {
            $window.close();
        }
    }
    function DescargasQ($scope, $location, $stateParams, AuthService,
      MenuService, DescargasService, $window) {
        debugger;
        $scope.authentication = AuthService.authentication;
        var token = $stateParams.id;
        //$scope.decrypted = DescargasService.desencriptar(token);
        $scope.descarga = false;
        $scope.loading = true;
        DescargasService.downloadFile(token).then(
            function (result) {
                console.log("descarga OK");
                console.log(result);
                $scope.descarga = true;
                $scope.loading = false;
            },
        function (error) {
            console.log("descarga error");
            console.log(error);
            $scope.loading = false;

        }
            );
        $scope.close = function () {
            //alert("foo");
            $window.close();
        }
    }
}());