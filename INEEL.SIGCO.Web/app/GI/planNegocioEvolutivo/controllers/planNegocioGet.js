(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("planNegocioGet", ["AuthService", "$scope", "MenuService", "DTColumnDefBuilder", "$uibModal", "DTOptionsBuilder", "planNegocioService", planNegocioGet]);

    function planNegocioGet(AuthService, $scope, MenuService, DTColumnDefBuilder, $uibModal, DTOptionsBuilder, planNegocioService) {
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        $scope.busqueda = false;
        $scope.limpia = false;
        $scope.plan={};

        ////Obtener
        $scope.buscar = function () {
            $scope.plan.clavePersona = $scope.ClavePersonaLogin;
            //planNegocioService.getbyclave2($scope.plan).then(
            planNegocioService.GetMisPlanesAnualesConsulta($scope.plan).then(
                function (result) {
                    $scope.registros = result.data;
                    $scope.busqueda = true;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de plan de negocio evolutivo.");
                });
        }

        $scope.paramsDT = JSON.parse(localStorage.getItem('GIplanNegocio' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }


        

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('order', [3, 'desc'])
            .withOption('displayStart', $scope.paramsDT.displayStart);


        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([0,5,6]).withOption('type', 'string'),
            DTColumnDefBuilder.newColumnDef([3]).withOption('type', 'date')
        ];

        function stateSaveCallback(settings, data) {
            var stado = $('#GIplanNegocio').DataTable().state();
            localStorage.setItem('GIplanNegocio' + window.location.pathname, JSON.stringify(stado))
        }

        function stateLoadCallback(settings) {
            
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('GIplanNegocio' + window.location.pathname))
            }

        }

        $scope.buscar();
        
    }
})();
