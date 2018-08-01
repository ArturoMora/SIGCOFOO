(function () {
    'use strict';
    angular
        .module("ineelGI")
        .controller('ejemploValidacionCtrlGI', ['$scope',
            'AuthService', 'NuevoOCService', 'MenuService', 'comunCountService','ngFabForm', ejemploValidacionCtrlGI]);

    function ejemploValidacionCtrlGI($scope, AuthService, NuevoOCService, MenuService, comunCountService, ngFabForm) {
        $scope.modulo = "GI";
        $scope.authentication = AuthService.authentication;
        var ClavePersona = $scope.authentication.userprofile.clavePersona
        $scope.idRol = MenuService.getRolId();
        $scope.submit = function () {
            alert('Form submitted');
        };
        //$scope.defaultFormOptions = ngFabForm.config;
        $scope.customFormOptions = { "validationsTemplate": false };
    }
}());