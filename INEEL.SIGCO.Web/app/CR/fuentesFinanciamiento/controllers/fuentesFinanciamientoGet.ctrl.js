(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("FuentesFinanciamientoGetCtrl", [
            "$scope",
            "FuentesFinanciamientoCRService",
            "$uibModal",
            "MenuService",
            FuentesFinanciamientoGetCtrl
        ]);


    function FuentesFinanciamientoGetCtrl( $scope, FuentesFinanciamientoCRService, $uibModal, MenuService) {

        $scope.idRol = MenuService.getRolId();


        $scope.VarRetorno = MenuService.OrigenInicioConvocatoriaGet();
      

        //Trae las fuentes de financiamiento y los datos de las tablas foraneas con las que se relaciona
        //Denotese la terminaci�n FKs del service
        $scope.buscar=function(){
            FuentesFinanciamientoCRService.getFuentesFinanciamientoAllFKs().then(
                function (result) {
                    $scope.fuentesFinanciamiento = result.data;
    
                },
                function (err) {
                    console.error("No se han podido cargar los registros");
                }
            );
        }
        
        $scope.buscar();

        $scope.mostrarAlerta=function(){
            toastr.error("La fuente tiene relacionada varios fondos, elimine cada uno primero");
        }

        $scope.eliminarRegistro=function(id){
            FuentesFinanciamientoCRService.DeleteFuenteWithFKS(id).then(function(res){
                $scope.buscar();
                toastr.success(res.data);
            },function(err){
                toastr.error("Error al intentar eliminar el registro");
                console.log(err);
            });
        }

        $scope.PonEnCero = function () {
            MenuService.OrigenInicioConvocatoriaReset();
        }

        //Guardar estado
        $scope.saveEstado = function (fuenteF) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (fuenteF.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        FuentesFinanciamientoCRService.UpdateEstado(fuenteF).then(function (result) {
                            console.log(result.data);
                        }, function (err) {
                            $scope.cancel();
                        });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.fuentesFinanciamiento.indexOf(fuenteF));
                        $scope.fuentesFinanciamiento[idx].estado = !$scope.fuentesFinanciamiento[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }


    }


})();