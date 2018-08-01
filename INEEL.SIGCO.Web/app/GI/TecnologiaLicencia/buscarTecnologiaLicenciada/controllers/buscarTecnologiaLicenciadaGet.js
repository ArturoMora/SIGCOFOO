(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("buscarTecnologiaLicenciada", ["AuthService", "$scope", "DTColumnDefBuilder", "DTOptionsBuilder", "tecnologiaLicenciadaService", "MenuService", buscarTecnologiaLicenciada]);

    function buscarTecnologiaLicenciada(AuthService, $scope, DTColumnDefBuilder, DTOptionsBuilder, tecnologiaLicenciadaService, MenuService) {
        //Para este formulario se utilizaron funciones almacenadas en $rootScope para el guardado de datos
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        $scope.UOUPersonaLogin = AuthService.authentication.userprofile.claveUnidad;
        $scope.rolId = MenuService.getRolId();

        $scope.tec = {};
        $scope.busqueda = false;

        //estados de licenciamiento
        tecnologiaLicenciadaService.ListaEstadoLicenciamiento().then(function (res) {
            $scope.estados = res.data;
        }, function (err) {
            toastr.error("Error al cargar los datos de estados de licenciamientos");
            console.log(err);
        });

        //tipos de pi
        tecnologiaLicenciadaService.ListaTipoPropiedadIndustrial().then(function (res) {
            $scope.tipos = res.data;
            var da = { 'id': 9999, 'nombre': "Derechos de autor" };
            $scope.tipos.push(da)
        }, function (err) {
            toastr.error("Error al cargar los datos de tipo de propiedad industrial");
            console.log(err);
        });


        $scope.buscar = function () {
            $scope.tec.busqueda = "normal";
            //tecnologiaLicenciadaService.GetAllCartera().then(
            tecnologiaLicenciadaService.GetAllConsultaParametrizadaTecnologia($scope.tec).then(
                function (result) {
                    $scope.registros = result.data;
                    $scope.busqueda = true;
                }, function (err) {
                    toastr.error("No se han podido cargar los registros de tecnologías licenciadas.");
                });
        }

        $scope.tec = MenuService.getVariable('busquedaTecnologia');
        if ($scope.tec == null) {
            $scope.tec = {};
            $scope.paramsDT = {};
            $scope.paramsDT.displayStart = 0;
        }
        else {
            $scope.paramsDT = JSON.parse(localStorage.getItem('GIbuscarTecnologiaLicenciadaGet' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }
            $scope.buscar();
            MenuService.deleteVariable('busquedaTecnologia');
        }

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([1,3,5]).withOption('type', 'string') //definimos el tipo de datos de cada columna 
            
        ];

        //Opciones para el datatable
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);

        //funcion que guarda el estado del datatable
        function stateSaveCallback(settings, data) {
            var stado = $('#GIbuscarTecnologiaLicenciadaGet').DataTable().state();
            localStorage.setItem('GIbuscarTecnologiaLicenciadaGet' + window.location.pathname, JSON.stringify(stado))
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
                return JSON.parse(localStorage.getItem('GIbuscarTecnologiaLicenciadaGet' + window.location.pathname))
            }

        }

        //resetea los parametros de busqueda
        $scope.reset = function () {
            $scope.tec = {};
            $scope.unidadOselect = null;
            $scope.busqueda = false;
            $scope.limpia = true;

        };
    }
})();