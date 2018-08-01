(function () {
    'use strict';
    angular
        .module("ineelCR")
        .controller('inicioconvocatoriasCtrl', [
            '$filter',
            '$scope',
            "$state",
            'MenuService',
            'FuentesFinanciamientoCRService',
            'ConvocatoriasCRService',
            inicioconvocatoriasCtrl
        ]);

    function inicioconvocatoriasCtrl($filter, $scope, $state, MenuService, FuentesFinanciamientoCRService, ConvocatoriasCRService) {
        $scope.rolid = MenuService.getRolId();

       

        $scope.convocatoriasvigentes = [];
        $scope.convocatoriasnacionales = [];
        $scope.fuentesfinanciamiento = [];
        $scope.convocatoriasinternacionales = [];
       

        FuentesFinanciamientoCRService.getFuentesFinanciamientoAllFKs().then(
            function (result) {
                $scope.fuentesfinanciamiento = result.data;
               
            },
            function (err) {
                console.error("No se han podido cargar los registros");
            }
        );

        $scope.visualizarConvocatorias = function (tipo) {
            MenuService.setVariable('tipoConvocatoria', tipo);
            MenuService.OrigenInicioConvocatoriaSet();
            $state.go('convocatoriasGet');
        }


        $scope.visualizarFuentes = function () {
           
            MenuService.OrigenInicioConvocatoriaSet();
            $state.go('fuentesFinanciamientoGet');
        }




        // convocatorias vigente 
        ConvocatoriasCRService.getconvocatoriasvigentes().then(
            function (result) {
                $scope.convocatoriasvigentes = result.data;
                $scope.convocatoriasnacionales = $filter('filter')($scope.convocatoriasvigentes, function (item) {
                    return item.tipoFuenteFinanciamiento !== null && item.tipoFuenteFinanciamiento.descripcion.match('Nacional');
                });
                $scope.convocatoriasinternacionales = $filter('filter')($scope.convocatoriasvigentes, function (item) {
                    return item.tipoFuenteFinanciamiento !== null && item.tipoFuenteFinanciamiento.descripcion.match('Internacional');
                });

                setValuesForLoadGraph();
            },
            function (err) {
                toastr.error("No se han podido cargar los registros")
                console.error(err);
            }
        );



        function setValuesForLoadGraph() {
            $scope.labels = ['Nacionales', 'Internacionales'];
            $scope.colores = ['#26B99A', '#F0AD4E'];

            $scope.options = {
                legend: {
                    display: true,
                    position: 'bottom'
                },
            };

            $scope.data = [$scope.convocatoriasnacionales.length, $scope.convocatoriasinternacionales.length]
        }

    }// function inicioconvocatoriasCtrl...
}());
