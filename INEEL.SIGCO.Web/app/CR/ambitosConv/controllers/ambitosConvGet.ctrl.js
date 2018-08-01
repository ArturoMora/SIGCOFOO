(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("AmbitosConvGetCtrl", [
        "AuthService",
        "$scope",
        "AmbitosConvCRService",
        "$uibModal",
        AmbitosConvGetCtrl
        ]);

    function AmbitosConvGetCtrl(AuthService, $scope, AmbitosConvCRService, $uibModal) {
        $scope.authentication = AuthService.authentication;
        $scope.dtInstance = {};
        AmbitosConvCRService.getAmbitosConv().then(
            function (result) {
                $scope.ambitosConv = result.data;

            },
            function (err) {
                console.error("No se han podido cargar los registros");
            }
            );

        $scope.saveEstado = function (ambito) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (ambito.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                   $scope.ok = function () {
                       AmbitosConvCRService.UpdateEstado(ambito).then(
                           function (result) {
                               console.log(result.data);
                           },
                            function (err) {
                                $scope.cancel();
                            });
                       $uibModalInstance.close();
                   };
                    $scope.cancel = function () {
                        var idx = ($scope.ambitosConv.indexOf(ambito));
                        $scope.ambitosConv[idx].estado = !$scope.ambitosConv[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
    }


})();