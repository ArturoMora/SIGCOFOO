(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("buscarPropuestaGet", ["AuthService", "$scope", "$state", "$filter", "DTColumnDefBuilder","DTOptionsBuilder", "MenuService", "$uibModal", "carteraPropuestaService", buscarPropuestaGet]);

    function buscarPropuestaGet(AuthService, $scope, $state, $filter, DTColumnDefBuilder, DTOptionsBuilder, MenuService, $uibModal, carteraPropuestaService) {
        $scope.propuesta = {};
        $scope.claveEmpleado = AuthService.authentication.userprofile.clavePersona;
        $scope.busqueda = false;
        $scope.limpia = false;


        carteraPropuestaService.GetSegmentosMercado().then(function (res) {
            $scope.segmentos = res.data;
        }, function (err) {
            toastr.error("No se han podido cargar los registros de segmentos de mercado");
        });

        //Obtener pendiente colocar el metodo getAllAprobadas
        $scope.buscar = function () {
            if (($scope.propuesta.fechaInicioComparacion != null || $scope.propuesta.fechaInicioComparacion != undefined) &&  //en caso de que la fecha de inicio esta definida pero no la final
                ($scope.propuesta.fechaFinalComparacion == null || $scope.propuesta.fechaFinalComparacion == undefined)) {

                $scope.propuesta.fechaFinalComparacion = new Date();
                $scope.propuesta.busquedaFecha="ok";
            }
            if (($scope.propuesta.fechaFinalComparacion != null || $scope.propuesta.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.propuesta.fechaInicioComparacion == null || $scope.propuesta.fechaInicioComparacion == undefined)) {

                $scope.propuesta.fechaInicioComparacion = new Date(1975, 10, 25);
                $scope.propuesta.busquedaFecha="ok";
            }
            if (($scope.propuesta.fechaFinalComparacion != null || $scope.propuesta.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.propuesta.fechaInicioComparacion != null || $scope.propuesta.fechaInicioComparacion != undefined)) {

                $scope.propuesta.busquedaFecha="ok";
            }
            if (($scope.propuesta.fechaInicioComparacion != null && $scope.propuesta.fechaFinalComparacion != null) && $scope.propuesta.fechaInicioComparacion > $scope.propuesta.fechaFinalComparacion) {
                toastr.error("Favor de introducir un rango válido de fechas");
                return false;
            }
            $scope.propuesta.estadoflujoid = 10; //importante

            carteraPropuestaService.GetConsultaCartera($scope.propuesta).then(
                function (result) {
                    $scope.registros = result.data;
                    $scope.busqueda = true;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de cartera de propuestas de innovación.");
                });

        }

        //Se recuperan los parametros ingresados por el usuario
        $scope.propuesta = MenuService.getVariable('busquedaPropuestas');
        if ($scope.propuesta == null) {
            $scope.propuesta = {};
            $scope.paramsDT = {};
            $scope.paramsDT.displayStart = 0;
        }
        else {
            $scope.paramsDT = JSON.parse(localStorage.getItem('GIbuscarPropuestas' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }
            $scope.buscar();
            MenuService.deleteVariable('busquedaPropuestas');
        }

        $scope.reset = function () {
            $scope.propuesta = {};
            $scope.busqueda = false;
            $scope.limpia = true;
        };


        //Opciones para el datatable
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('order',[1, 'desc'])
            .withOption('displayStart', $scope.paramsDT.displayStart);

        //funcion que guarda el estado del datatable
        function stateSaveCallback(settings, data) {
            var stado = $('#GIbuscarPropuestas').DataTable().state();
            localStorage.setItem('GIbuscarPropuestas' + window.location.pathname, JSON.stringify(stado))
        }

        //funcion que carga el estado del datatable
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
                return JSON.parse(localStorage.getItem('GIbuscarPropuestas' + window.location.pathname))
            }

        }

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([1]).withOption('type', 'date'), //definimos el tipo de datos de cada columna 
            DTColumnDefBuilder.newColumnDef([3,5]).withOption('type', 'string')
        ];

        //Modal de empresas
        $scope.openEmpresa = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarEmpresasGEN/buscarEmpresasGEN.html',
                controller: 'BuscaEmpresasGENCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.propuesta.nombreEmpresa = selectedItem.nombreEmpresa;
                $scope.propuesta.empresaPromotorClave = selectedItem.empresaId;

            });
        }


        //Eliminar
        //$scope.delete = function (registro) {
        //    carteraPropuestaService.delete(registro.propuestaId).then(
        //    function (result) {
        //        var idx = ($scope.registros.indexOf(registro));
        //        $scope.registros.splice(idx, 1);
        //        toastr.success(result.data);
        //    },
        //    function (err) {
        //        toastr.error(err.data.message);
        //    });
        //};
    }
})();