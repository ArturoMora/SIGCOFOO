
(function () {
    "use strict";

    angular
        .module("ineelMT")
        .controller("softwarePersonal", ['$scope', '$rootScope', 'AuthService', 'softwarePersonalService',
            '$state', 'DTOptionsBuilder', "DTColumnDefBuilder", softwarePersonal]);
    function softwarePersonal($scope, $rootScope, AuthService, softwarePersonalService,
        $state, DTOptionsBuilder, DTColumnDefBuilder) {
        //Variable API
                
        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        
        $scope.SoftwarePersonal = { "autores": [], "estado": true };
        var clavePersona = AuthService.authentication.userprofile.clavePersona;
        $scope.clavePersonaId = AuthService.authentication.userprofile.clavePersona;
        $scope.registros = [];
        $scope.load = function () {
            $scope.numRegistrosNOpublicados = 0;    
            softwarePersonalService.getAllByUsurio(clavePersona).then(
                function (result) {
                    //$scope.registros = result.data;
                    $scope.registros = [];
                    var r = result.data;
                    for (var i = 0; i < r.length; i++) {
                        
                        if (r[i].clavePersona == clavePersona) {
                            $scope.registros.push(r[i]);
                            continue;
                        } else {
                            if (r[i].estadoFlujoId == 3) {
                                $scope.registros.push(r[i]);
                                continue;
                            }
                        }
                        $scope.numRegistrosNOpublicados = $scope.numRegistrosNOpublicados + 1;
                       
                    }
                },
                function (err) {
                    $scope.registros = [];
                    console.error(err);
                });
        };
        $scope.load();
        $scope.detalles = function (clave) {
            $scope.nombreMiga();
            $state.go("SoftwarePersonalDetails", { id: clave });
        }

        $rootScope.parametros = {};
        $scope.nombreMiga = function () {
            $rootScope.parametros.nombreM = "Mi software";

        }

        $scope.eliminarSW = function (reg) {
            softwarePersonalService.delete(reg.softwarePersonalId).then(
                function (result) {
                    toastr.success(result.data);
                    $scope.load();
                },
                function (error) { }


            );
        }


        $scope.dtColumnDefs = [
               DTColumnDefBuilder.newColumnDef([0, 1, 2, 3]).withOption('type', 'string')
        ];
    }

})();