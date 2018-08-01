(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("carteraPropuestaGet", ["AuthService", "$scope", "DTColumnDefBuilder", "DTOptionsBuilder", "carteraPropuestaService", carteraPropuestaGet]);

    function carteraPropuestaGet(AuthService, $scope, DTColumnDefBuilder, DTOptionsBuilder, carteraPropuestaService) {
        $scope.claveEmpleado = AuthService.authentication.userprofile.clavePersona;

        $scope.busqueda = false;
        $scope.limpia = false;
        $scope.propuesta = {};


        $scope.paramsDT = JSON.parse(localStorage.getItem('GITablaGetcarteraPropuestas' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
            $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
            $scope.paramsDT.displayStart = 0;
        }

        $scope.buscar = function () {
            $scope.propuesta.clavePersona = $scope.claveEmpleado;
            //carteraPropuestaService.GetAllCarterabyEmpleado($scope.claveEmpleado).then(
            carteraPropuestaService.GetConsultaCartera($scope.propuesta).then(
                function (result) {
                    $scope.registros = result.data;
                    $scope.busqueda = true;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros de cartera de propuestas de innovación.");
                });

        }

        $scope.buscar();

        //Opciones para el datatable

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([3, 4, 5]).withOption('type', 'string') //definimos el tipo de datos de cada columna

        ];

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);

        //funcion que guarda el estado del datatable
        function stateSaveCallback(settings, data) {
            var stado = $('#GITablaGetcarteraPropuestas').DataTable().state();
            localStorage.setItem('GITablaGetcarteraPropuestas' + window.location.pathname, JSON.stringify(stado))
        }

        //funcion que carga el estado del datatable
        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('GITablaGetcarteraPropuestas' + window.location.pathname))
            }

        }



        

        //Eliminar
        $scope.delete = function (registro, id) {
            carteraPropuestaService.DeletePropuestaConPlan(id).then(
                function (res) {
                    var idx = ($scope.registros.indexOf(registro));
                    $scope.registros.splice(idx, 1);
                    toastr.success(res.data);
                }, function (err) {
                    console.log(err);
                    toastr.error("Error al eliminar el plan de negocio");
                }
            );

        };
    }
})();
