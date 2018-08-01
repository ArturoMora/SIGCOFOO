/*AYUDA:
FooEntitiesService nombre de factory en competencias.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("familiacategoriasCtrlGet", ['$scope', 'familiapuestosService', 'familiacategoriasService', 'globalGet', '$state', '$stateParams', "$uibModal", "DTOptionsBuilder", "DTColumnBuilder", "DTColumnDefBuilder", familiacategoriasCtrlGet]);

    function familiacategoriasCtrlGet($scope, familiapuestosService, familiacategoriasService, globalGet, $state, $stateParams, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
       
        var id = $stateParams.id;

        $scope.dtInstance = {};
        //Variables de carga
        $scope.loading = true;
    
        //Obtene ambito
        familiapuestosService.getById(id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (err) {
                console.error(err);
            }        
        );


        familiacategoriasService.GetCategoriaFamilia($stateParams.id).then(
             function (result) {
                 for (var i = 0; i < result.data.length; i++) {
                     if (result.data[i].estado == "1") {
                         result.data[i].estado = true;
                     } else {
                         result.data[i].estado = false;
                     }
                 }

                 $scope.categoria = result.data;
                 $scope.loading = false;
             },
             function (err) {
                 toastr.error("No se han podido cargar las categorías registradas en el sistema");
             }
         );
      


        //Guardar estado
        $scope.saveEstado = function (id, estado) {

            var pagina;
            var _estado;
            var registro;

            if (estado == true) {
                pagina = "Active";
                _estado = 1;
            } else {
                pagina = "Delete";
                _estado = 0;
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + pagina + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        registro = {
                            "categoriaId": id,
                            "estado": _estado
                        };
                        familiacategoriasService.updateEstado(registro);
                        $uibModalInstance.dismiss('cancel');
                        $scope.dtInstance._renderer.rerender();
                    };
                    $scope.cancel = function () {
                        if (estado == true) {
                            estado = false;
                        } else {
                            estado = true;
                        }
                        for (var i = 0; i < $scope.categoria.length; i++) {
                            if ($scope.categoria[i].categoriaId == id) {
                                $scope.categoria[i].estado = estado;
                            }
                        }
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

       
    }

})();