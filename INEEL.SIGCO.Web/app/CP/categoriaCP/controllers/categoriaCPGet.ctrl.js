(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("CategoriaCPGetCtrl", [
            "AuthService",
            "$scope",
            "CategoriaCPService",
            "$uibModal",
            CategoriaCPGetCtrl
        ]);

    function CategoriaCPGetCtrl(AuthService, $scope, CategoriaCPService, $uibModal) {

        $scope.authentication = AuthService.authentication;
        CategoriaCPService.getAllCategorias().then(
            function (result) {
                $scope.categorias = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros");
            });

        $scope.saveEstado = function (categoria) {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (categoria.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        CategoriaCPService.updateEstado(categoria).then(
                            function (result) {

                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.categorias.indexOf(categoria));
                        $scope.categorias[idx].estado = !$scope.categorias[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }


        function removeAccents(data) {
            return data
                .replace(/έ/g, 'ε')
                .replace(/[ύϋΰ]/g, 'υ')
                .replace(/ό/g, 'ο')
                .replace(/ώ/g, 'ω')
                .replace(/ά/g, 'α')
                .replace(/[ίϊΐ]/g, 'ι')
                .replace(/ή/g, 'η')
                .replace(/\n/g, ' ')
                .replace(/á/g, 'a')
                .replace(/é/g, 'e')
                .replace(/í/g, 'i')
                .replace(/ó/g, 'o')
                .replace(/ú/g, 'u')
                .replace(/ê/g, 'e')
                .replace(/î/g, 'i')
                .replace(/ô/g, 'o')
                .replace(/è/g, 'e')
                .replace(/ï/g, 'i')
                .replace(/ü/g, 'u')
                .replace(/ã/g, 'a')
                .replace(/õ/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/ì/g, 'i');
        }

        var searchType = jQuery.fn.DataTable.ext.type.search;

        searchType.string = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data) :
                    data;
        };

        searchType.html = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data.replace(/<.*?>/g, '')) :
                    data;
        };


    }

})();