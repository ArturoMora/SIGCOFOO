(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("ResultadosComunidadGetCtrl", [
            "AvanceResultadosCPService",
            "AuthService",
            "$scope",
            "$uibModal",
            "DTOptionsBuilder",
            ResultadosComunidadGetCtrl
        ]);

    function ResultadosComunidadGetCtrl(AvanceResultadosCPService, AuthService, $scope, $uibModal, DTOptionsBuilder) {
        // $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.authentication = AuthService.authentication;
        
        $scope.obtenerResultadosComunidad = function () {
            AvanceResultadosCPService.getByComunidad($scope.comunidad.comunidadId).then(function (result) {
                $scope.avances = result.data;
            },function(err) {
                toastr.error("Error al obtener los registros de avances");
                console.log(err);
            });
        }

        $scope.agregaAvance=function() {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/modalesCP/AvanceResultados/AgregarAvanceResultados.html',
                controller: 'AgregarAvanceResultadosCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.obtenerResultadosComunidad(); //llamar a la tabla de resultados;
            });
        }

        $scope.listaMiembros= function(e){
            if(e!=null || e!=undefined){
                var cadena="";
                if(e.length>0){
                    e.forEach(element => {
                        cadena+= element.participacion+"% "+ element.miembro.nombrePersona +"<br/>"  ;
                    });

                    return cadena;
                }
            }else{
                return "No disponible"
            }
        }

        $scope.editarAvance = function (objeto) {
            $scope.registroEdit = objeto;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/modalesCP/AvanceResultados/EditarAvanceResultados.html',
                controller: 'EditarAvanceResultadosCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.obtenerResultadosComunidad(); 
            });
        }

        $scope.eliminaRegistro = function (id) {
            AvanceResultadosCPService.delete(id).then(function (result) {
                toastr.success(result.data);
                $scope.obtenerResultadosComunidad();
            }, function (err) {
                toastr.error("Error al eliminar el registro");
                console.log(err);
            });
           
        }

        $scope.obtenerResultadosComunidad();
    }

})();