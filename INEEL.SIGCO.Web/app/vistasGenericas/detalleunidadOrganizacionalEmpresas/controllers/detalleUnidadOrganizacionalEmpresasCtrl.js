(function () {
    angular.module("ineel.services")
        .controller("detalleUnidadOrganizacionalEmpresasCtrl", [
            "$http",
            "$scope",
            "globalGet",
            "$rootScope",
            "DTOptionsBuilder",
            "$uibModalInstance",
            detalleUnidadOrganizacionalEmpresasCtrl]);

    function detalleUnidadOrganizacionalEmpresasCtrl($http, $scope, globalGet, $rootScope, DTOptionsBuilder, $uibModalInstance) {
        $scope.dtOptionsHistorial = DTOptionsBuilder.newOptions()
            .withDOM('tp');

        var API = globalGet.get("api");
        var service = {};
        service.GetAllnodes = function (unidadorganizacional) {
            var endPoint = API + "UnidadOrganizacionalEmpresas/GetInformacionNodoEmpresa/";
            return $http.post(endPoint, unidadorganizacional);
        }

        service.ContactosPorNodo = function (id) {
            var endPoint = API + "UnidadOrganizacionalEmpresas/ContactosPorNodo/"+id+"/";
            return $http.get(endPoint);
        }

        service.GetAllByUnidad = function (id) {
            var endPoint = API + "HistorialUnidadesOrganizacionalesEmpresas/GetAllByUnidad/"+id+"/";
            return $http.get(endPoint);
        }


        $scope.getNodo = function () {
            var nodo={'ClaveUnidad': $scope.id};
            service.GetAllnodes(nodo).then(
                function (res) {
                    $scope.nodo = res.data;
                    debugger;
                    $scope.idRol=$rootScope.idRol;
                    if($scope.nodo!=null && $rootScope.idRol==15){
                        $scope.getTitularesHistoricos($scope.id);
                        $scope.getHistorialCambios($scope.id);
                    }

                }, function (err) {
                    toastr.error("Error al cargar el detalle de la unidad organizacional");
                    console.log(err);
                })
        }

        $scope.getTitularesHistoricos = function(id){
            service.ContactosPorNodo(id).then(
                function(res){
                    $scope.titulares= res.data;
                    // $scope.titulares.splice(0,1);
                },function(err){
                    toastr.error("Error al cargar los datos de los titulares");
                    console.log(err);
                }
            )
        }

        $scope.getHistorialCambios = function(id){
            service.GetAllByUnidad(id).then(
                function(res){
                    $scope.historial = res.data;
                },function(err){
                    toastr.error("Error al cargar los datos del historial");
                    console.log(err);
                }
            )
        }

        $scope.getNodo();
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }

})();