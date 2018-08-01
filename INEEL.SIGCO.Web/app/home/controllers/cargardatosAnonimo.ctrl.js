(function () {
    "use strict";

    angular
        .module("ineel")
        .controller("cargardatosAnonimo", ['$q', "$scope", "$state", "$location",
            "AuthService",  "comunService", cargardatosAnonimo]);

    function cargardatosAnonimo($q, $scope, $state, $location,
        AuthService, comunService) {

        $scope.authentication = AuthService.authentication;
        if ($scope.authentication == null || $scope.authentication.isAuth == false) {
            if ($location.$$absUrl.indexOf("index.html") < 1) {
                window.location = "/index.html";
            }
            
        }
        $scope.model = { mt: {}, ch: {}, cr: {}, pi: {}, gi: {}, cp: {} }
        $scope.model.mt.itf = 1147;
        $scope.model.gi.superioresOfertaI = 25;
        $scope.model.gi.equiparablesOfertaI = 84;
        $scope.model.gi.superioreOfertaNac = 87;

        $scope.model.cp.totalComunidades = 41;
        $scope.model.cp.totalMiembros = 407;


        $scope.model.cr.enSeguimiento = 407;
        $scope.model.cr.atendidas = 87;

        $scope.model.pi.totalPropiedadInd = 41;
        $scope.model.pi.totalDerechosAutor = 701;
        
        $scope.bannerSelect = [];
        $scope.myInterval = 3000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        //$scope.banners = [];        
        //comunService.listaBanners().then(
        //    function (result) {
        //        $scope.banners = result.data;

        //    }, function (err) {
        //        console.error(err);
        //        toastr.error(err.data.message);
        //    });

        $scope.nuevosOCs = [];
        comunService.getOCtopRaw(11).then(
            function (result) { $scope.nuevosOCs = result.data; },
            function (error) {
                console.error(error);
                $scope.nuevosOCs = [];
            }
        );


    }
}());