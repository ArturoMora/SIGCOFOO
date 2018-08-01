(function () {
    'use strict';
    angular
        .module("ineelCH")
        .controller('homeCHCtrl', ['$scope', '$location', 'AuthService', 'MenuService', 'NuevoOCService', 'DTOptionsBuilder', '$filter', 'comunCountService', homeCHCtrl])
        .controller('IndexCHCtrl', ['$scope', '$location', '$rootScope', 'AuthService', 'MenuService', 'DTOptionsBuilder', '$uibModal','NotificacionService', IndexCHCtrl]);

    function IndexCHCtrl($scope, $location, $rootScope, AuthService, MenuService, DTOptionsBuilder, $uibModal, NotificacionService) {
        $scope.isSigco = false;
        $scope.isModulo = true;
        $scope.modulo = "CH";
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
        $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
        $scope.funciones = MenuService.getMenuCH();
       
        MenuService.getModulos().then(
            function (result) { $scope.modulos = result.data },
            function (error) { toastr.error("no se han podido cargar los Modulos"); }
        );

        $scope.rolDescripcion = MenuService.getRolDescripcion();

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

        //$scope.reseteaFicha=function(){
        //    $rootScope.GestionFichasClave=null;
        //}

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

    function homeCHCtrl($scope, $location, AuthService, MenuService, NuevoOCService, DTOptionsBuilder, $filter, comunCountService) {

        $scope.authentication = AuthService.authentication;
        $scope.rolDescripcion = MenuService.getRolDescripcion();
        $scope.idRol = MenuService.getRolId();
        $scope.modulo = "CH";
        $scope.nuevosOCs = [];
        $scope.model = {
            compTecnicas: 0,
            compConductuales: 0,
            inventarioRH: 0,
            compAlcanzadas: 0,
            metodoEvaluacionComp: 0,
            familiaPuestos: 0,
        };
        //TODO: pendiente recuperar los valores para cada attr de  $scope.model
        NuevoOCService.GetTopByMODULO($scope.modulo, 10).then(
            function (result) {
                $scope.nuevosOCs = [];
                var tmp = result.data;

                if (tmp != null) {
                    var black = false;
                    for (var i = 0; i < tmp.length; i++) {
                        black = $filter('BlackListOC')(tmp[i].ocs.oCsRolesBlackList, $scope.idRol);
                        if (!black) {
                            $scope.nuevosOCs.push(tmp[i]);
                        }
                    }
                }

            },
            function (error) {
                $scope.nuevosOCs = [];
                console.log(error);
            }
        );

        comunCountService.CH.countExpertos().then(
            function (result) { $scope.model.inventarioRH = result.data; },
            function (error) { $scope.model.inventarioRH = 0; }
        );
        comunCountService.CH.countFamiliasPuestos(1).then(
            function (result) { $scope.model.familiaPuestos = result.data; },
            function (error) { $scope.model.familiaPuestos = 0; }
        );
        comunCountService.CH.countConductualAndTecnica(true).then( //actualmente no se usa el estado, queda preparado
            function (result) { $scope.model.metodoEvaluacionComp = result.data; },
            function (error) { $scope.model.metodoEvaluacionComp = 0; }
        );


    
}
}());
