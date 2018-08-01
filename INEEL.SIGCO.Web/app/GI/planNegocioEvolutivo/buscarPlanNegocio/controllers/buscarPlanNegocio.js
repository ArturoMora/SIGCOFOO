(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("buscarPlanNegocio", ["AuthService", "$scope", "$uibModal", "DTColumnDefBuilder", "DTOptionsBuilder", "MenuService", "planNegocioService", buscarPlanNegocio]);

    function buscarPlanNegocio(AuthService, $scope, $uibModal, DTColumnDefBuilder, DTOptionsBuilder, MenuService, planNegocioService ) {
        $scope.rolId = MenuService.getRolId();
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        $scope.busqueda = false;
        $scope.limpia = false;
        
        //planNegocioService.getAll2().then(
        $scope.buscar = function () {
            planNegocioService.GetConsultaCartera($scope.plan).then(
                function (result) {
                    $scope.registros = result.data;
                    $scope.busqueda = true;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de plan de negocio evolutivo.");
                });
        }

        //Recuperamos los parametros de la BUSQUEDA del usuario
        $scope.plan = MenuService.getVariable('busquedaPlanesNegocio');
        if ($scope.plan == null) {
            $scope.plan = {};
            $scope.paramsDT = {};
            $scope.paramsDT.displayStart = 0; //reiniciamos el parametro de filtrado en DT
        } else {

            $scope.paramsDT = JSON.parse(localStorage.getItem('GIbuscarPlanNegocio' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }

            $scope.buscar();
            MenuService.deleteVariable('busquedaPlanesNegocio');
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('order', [3, 'desc'])
            .withOption('displayStart', $scope.paramsDT.displayStart);

        function stateSaveCallback(settings, data) {
            var stado = $('#GIbuscarPlanNegocio').DataTable().state();
            localStorage.setItem('GIbuscarPlanNegocio' + window.location.pathname, JSON.stringify(stado))
        }

        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null && $scope.limpia) {
                $scope.paramsDT = {};
                $scope.paramsDT.displayStart = 0;
                $scope.limpia = false;
                return $scope.paramsDT;
            }
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('GIbuscarPlanNegocio' + window.location.pathname))
            }

        }

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([3]).withOption('type', 'date'), //definimos el tipo de datos de cada columna 
            DTColumnDefBuilder.newColumnDef([0,2,4,5]).withOption('type', 'string')
        ];

        $scope.reset = function () {
            $scope.plan = null;
            $scope.busqueda = false;
            $scope.limpia = true;
        };

        $scope.openProyecto = function () {
            $scope.desabilitar = true;
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarProyecto.html',
                controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                resolve: {
                    proyectoSelect: function () {
                        $scope.verproyecto = false;
                        return $scope.proyectoSelect;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.plan.proyectoNombre = selectedItem.nombre;
                $scope.plan.proyectoId = selectedItem.proyectoId;

            });
        }

        $scope.cambiar = function (registro) {
            if (registro.accesoPublico == true) {
                registro.tipoAcceso = 1;
            } else {
                registro.tipoAcceso = 2;
            }

            planNegocioService.updateTipoAcceso(registro);
            //$scope.busqueda = false;
            //$scope.buscar();
        }

        $scope.regresar = function (registro) {
            if (registro.accesoPublico == true) {
                registro.accesoPublico = false;
                registro.tipoAcceso = 2;
            } else {
                registro.accesoPublico = true;
            }
        }

    }
})();