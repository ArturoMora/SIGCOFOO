(function () {
    'use strict';
    angular
        .module("ineelCR")
        .controller('inicioaliadosCtrl', [
            '$scope',
            'MenuService',
            'AliadosCRService',
            inicioaliadosCtrl
        ]);

    function inicioaliadosCtrl( $scope, MenuService, AliadosCRService) {

        $scope.rolid = MenuService.getRolId();
        $scope.conveniosvigentes = [];
        $scope.aliadoshistoricos = [];
        $scope.expProf = {};
        $scope.limit = 3;
        $scope.limitHistoricos = 3;


        //Obtener  convenios vigentes         
        
        AliadosCRService.getconveniosvigentes().then(
            function (result) {
                $scope.conveniosvigentes = result.data;
                setValuesForGraph();
            },
            function (err) {
                $scope.conveniosvigentes = [];
                toastr.error("No se han podido cargar los registros");
            }
        );

        $scope.total_aliadoshistoricos = 0;
        //obtener convenios historicos 
        AliadosCRService.GetAllConveniosHistoricos().then(
            function (result) {
                $scope.aliadoshistoricos = result.data;
                if ($scope.aliadoshistoricos != null) {
                    $scope.total_aliadoshistoricos = $scope.aliadoshistoricos.length;
                }
            },
            function (err) {
                $scope.aliadoshistoricos = [];
                toastr.error("No se han podido cargar los registros historicos");
            }
        );


        AliadosCRService.GetAllConveniosVigentes().then(
            function (result) {
                $scope.aliadosVigentes = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar los registros vigentes");
            }
        );

        function setValuesForGraph() {
            $scope.labels = [];
            $scope.colores = ['#26B99A', '#F0AD4E', '#73879C', '#03586A'];
            $scope.datos = [];
            

            angular.forEach($scope.conveniosvigentes, function (value, key) {
                $scope.labels.push(value.tipoOrganizacion.nombre);
                $scope.datos.push(value.convenios.length);
            });

            $scope.options = {
                legend: {
                    display: true,
                    position: 'bottom'
                },
            };
            
        }


        // function setValuesForGraph() {
        //     var labels = [];
        //     var datos = [];

        //     angular.forEach($scope.conveniosvigentes, function (value, key) {
        //         labels.push(value.tipoOrganizacion.nombre);
        //         datos.push({ value: value.convenios.length, name: value.tipoOrganizacion.nombre });
        //     });

        //     $scope.expProf.labels = labels;
        //     $scope.expProf.datos = datos;
            
        // }


    }// function inicioaliadosCtrl...
}());
