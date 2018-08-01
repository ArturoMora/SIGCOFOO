    (function () {
        'use strict';
        angular
            .module("ineelGI")
            .controller('homeCtrlGI', ['$scope',
                'AuthService', 'NuevoOCService', 'MenuService', 'comunCountService','$filter', homeCtrlGI]);

        function homeCtrlGI($scope, AuthService, NuevoOCService, MenuService, comunCountService, $filter) {
                $scope.modulo = "GI";
                $scope.authentication = AuthService.authentication;
                var ClavePersona = $scope.authentication.userprofile.clavePersona
                $scope.idRol = MenuService.getRolId();
                $scope.nuevosOCs = [];
                $scope.model = {
                    compendioFI: 0,
                    stl: 0,
                    productos: 0,
                    planNegocio: 0,
                    propuestas: 0,
                    ideaInnovadora:0
                };


                if ((typeof $scope.authentication.isAuth === undefined) || !$scope.authentication.isAuth) {
                    AuthService.logOut();
                    window.location = "/index.html#/login";
                }



                NuevoOCService.GetTopByMODULO($scope.modulo, 15).then(
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
                        console.log(result);
                    },
                    function (error) {
                        $scope.nuevosOCs = [];
                        console.log(error);
                    }
                );
                comunCountService.GI.CountIdeaInnovadora().then(
                    function (result) {
                        
                        $scope.model.ideaInnovadora = result.data;
                    },
                    function (error) { }
                );
                comunCountService.GI.CountPropuesta().then(
                    function (result) {
                        
                        $scope.model.propuestas = result.data;
                    },
                    function (error) {  }
                );
                comunCountService.GI.CountPlanNegocioEvolutivo().then(
                    function (result) {
                        
                        $scope.model.planNegocio = result.data;
                    },
                    function (error) {  }
                );
                comunCountService.GI.CountProductosGI().then(
                    function (result) {
                        
                        $scope.model.productos = result.data;
                    },
                    function (error) {  }
                );
                comunCountService.GI.CountSTL().then(
                    function (result) {
                        
                        $scope.model.stl = result.data;
                    },
                    function (error) {  }
                );
                comunCountService.GI.CountFI().then(
                    function (result) {
                        
                        $scope.model.compendioFI = result.data;
                    },
                    function (error) {  }
                );

        }
    }());