(function () {
    "use strict";

    //var app = angular.module("ineelCR");
    angular
        .module("ineelCR")
        .controller("ContactosEmpresaAddCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$uibModal",
            "$stateParams",
            "EmpresasCRService",
            "ContactosCRService",
            ContactosEmpresaAddCtrl]);

    function ContactosEmpresaAddCtrl(AuthService ,$scope, $state, $uibModal, $stateParams, EmpresasCRService, ContactosCRService) {

        $scope.cargaContactos=function(){
            ContactosCRService.GetAllByEmpresa($stateParams.id).then(
                function(res){
                    $scope.contactos= res.data;
                },function(err){
                    console.log(err);
                }
            );
        }
        
        $scope.cargaContactos();

        $scope.crearContacto = function () {
            $scope.idFromEmpresa=$stateParams.id;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CR/contactos/contactoModal/contactoModalAdd.html',
                controller: 'ContactoModalAddCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.contacto = selectedItem;
                $scope.cargaContactos();
            });
        }

        $scope.eliminaContacto=function(id){
            ContactosCRService.BorrarContacto(id).then(
                function(res){
                    toastr.success(res.data);
                    $scope.cargaContactos();
                },function(err){
                    console.log(err);
                    if(err.data.innerException!=null){
                        toastr.error(err.data.innerException.exceptionMessage, "Error al eliminar el contacto");
                    }else{
                        toastr.error("Puede que tenga relaciones con otros OCs","Error al eliminar el contacto");
                    }
                    
                }
            );
        }

    }
})();
