(function () {
    'use strict';
    angular
        .module("ineelCR")
        .controller('ClientesProyectosVigentesCtrl', [
            '$scope',
            "$state",
            "MenuService",
            'ClientesCRService',
            ClientesProyectosVigentesCtrl
        ]);

    function ClientesProyectosVigentesCtrl($scope, $state, MenuService, ClientesCRService) {

        // ClientesCRService.getclientesactuales().then(
        ClientesCRService.GetProyectosClientesVigentes().then(
            function (response) {
                if (typeof response.data !== 'undefined' && response.data != null) {
                    $scope.proyectosClientes = response.data;
                }
            },
            function (error) {
                toastr.error(error.data.messageDetail);
                
            }
        );

        function removeAccents(value) {
            return value
                .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u');
        }
        
        $scope.ignoreAccents = function(item) {               
            if (!$scope.search)
                return true;       

            var text = "";
            if(item.nombreUnidad)
            var text = removeAccents(item.nombreUnidad.toLowerCase())
            
            var emp= removeAccents(item.nombreEmpresa.toLowerCase())
            var search = removeAccents($scope.search.toLowerCase());
            return (text.indexOf(search) > -1 || emp.indexOf(search) >-1);
        };


        $scope.visitarSiguientePagina = function () {
            MenuService.setVariable('origenClientes', true);
            $state.go("proyectosvigentes");
        }

    }// function ClientesProyectosVigentesCtrl...
}());
