(function () {
    "use strict";

    angular.module("directivasSIGCO")
        .controller('ModalnfoCtrl', ['$scope', '$uibModalInstance', ModalnfoCtrl])
        .directive('ngInfoClick', ['$uibModal',
            function ($uibModal) {

                return {
                    restrict: 'A',
                    scope: {
                        ngInfoClick: "&",
                        item: "="
                    },
                    link: function (scope, element, attrs) {
                        element.bind('click', function () {
                            var message = attrs.ngInfoMessage || "Bienvenido";
                            var titulo = attrs.ngInfoTitulo || "SIGCO";

                            var modalHtml = '<div class="modal-header">' + titulo + '<button type="button" class="close" ng-click="cancel()" data-dissmiss="modal">x</button></div><div class="modal-body">' + message + '</div>';
                            modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="cancel()">Cerrar</button></div>';

                            var modalInstance = $uibModal.open({
                                template: modalHtml,
                                controller: ModalnfoCtrl
                            });

                            modalInstance.result.then(function () {
                                //scope.ngReallyClick({ item: scope.item });
                            }, function () {
                                //Modal dismissed
                            });
                            //*/

                        });

                    }
                }
            }
        ]);

    function ModalnfoCtrl($scope, $uibModalInstance) {
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
}());