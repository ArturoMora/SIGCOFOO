(function () {
    'use strict';
    angular
        .module("ineelCR")
        .controller('inicioclientesCtrl', [
            '$scope',
            "$state",
            "MenuService",
            'ClientesCRService',
            inicioclientesCtrl
        ]);

    function inicioclientesCtrl($scope, $state, MenuService, ClientesCRService) {

        // ClientesCRService.getclientesactuales().then(
        // ClientesCRService.GetProyectosClientesVigentes().then(
        //     function (response) {
        //         if (typeof response.data !== 'undefined' && response.data != null) {
        //             $scope.proyectosClientes = response.data;
        //         }
        //     },
        //     function (error) {
        //         toastr.error(error.data.messageDetail);
                
        //     }
        // );

        ClientesCRService.CountProyectosClientesVigentes().then(
            function (response) {
                if (typeof response.data !== 'undefined' && response.data != null) {
                    $scope.vigentes = response.data;
                }
            },
            function (error) {
                toastr.error(error.data.messageDetail);
                
            }
        );

        ClientesCRService.CountProyectosClientesHistoricos().then(
            function (response) {
                if (typeof response.data !== 'undefined' && response.data != null) {
                    $scope.historicos = response.data;
                }
            },
            function (error) {
                toastr.error(error.data.messageDetail);
                
            }
        );

        $scope.cambiaEstilo=function(p1, p2){
            var pestaniaActiva= document.getElementById(p1);
            var pestaniaInactiva= document.getElementById(p2);
            pestaniaActiva.setAttribute("style","color: #ffffff !important;");
            pestaniaInactiva.setAttribute("style","color: #515356 !important");
        }

        $scope.now = new Date();

        function removeAccents(value) {
            return value
                .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u');
        }
        
        $scope.ignoreAccents = function(item) {               
            if (!$scope.search)
                return true;       
            var text = removeAccents(item.nombreUnidad.toLowerCase())
            var emp= removeAccents(item.nombreEmpresa.toLowerCase())
            var search = removeAccents($scope.search.toLowerCase());
            return (text.indexOf(search) > -1 || emp.indexOf(search) >-1);
        };


        $scope.visitarSiguientePagina = function () {
            MenuService.setVariable('origenClientes', true);
            $state.go("proyectosvigentes");
        }

    }// function inicioclientesCtrl...
}());
