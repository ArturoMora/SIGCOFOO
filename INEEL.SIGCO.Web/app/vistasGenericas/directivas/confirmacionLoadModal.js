(function () {
    "use strict";

    angular.module("directivasSIGCO")
        .controller('ModalConfirmaLoadCtrl', ['$scope', '$uibModalInstance', ModalConfirmaLoadCtrl])
        .directive('ngConfirmaLoadClick', ['$uibModal',
            function ($uibModal) {

                return {
                    restrict: 'A',
                    scope: {
                        ngYes: "&",
                        ngNo: "&",
                        item: "="
                    },
                    link: function (scope, element, attrs) {
                        debugger;
                        //element.on("click", function (e) {
                            debugger;
                            var message = attrs.ngConfirmaLoadMessage || "Bienvenido";
                            var titulo = attrs.ngConfirmaLoadTitulo || "SIGCO";

                            var modalHtml = '<div class="modal-header">' + titulo + '<button type="button" class="close" ng-click="cancel()" data-dissmiss="modal">x</button></div><div class="modal-body">' + message + '</div>';
                            modalHtml += '<div class="modal-footer"><button class="btn btn-success" ng-click="ok()">SI</button><button class="btn btn-primary" ng-click="cancel()">No</button></div>';

                            var modalInstance = $uibModal.open({
                                template: modalHtml,
                                controller: ModalConfirmaLoadCtrl
                            });

                            modalInstance.result.then(function () {
                                scope.ngYes({ item: scope.item });
                            }, function () {
                                scope.ngNo({ item: scope.item });
                            });
                            //*/

                        //});

                    }
                }
            }
        ]);

    function ModalConfirmaLoadCtrl($scope, $uibModalInstance) {
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
}());