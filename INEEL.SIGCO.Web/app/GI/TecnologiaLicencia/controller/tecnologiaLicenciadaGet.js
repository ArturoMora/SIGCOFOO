(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("tecnologiaLicenciada", ["AuthService", "$scope", "MenuService","DTColumnDefBuilder", "DTOptionsBuilder", "tecnologiaLicenciadaService", tecnologiaLicenciada]);

    function tecnologiaLicenciada(AuthService, $scope, MenuService, DTColumnDefBuilder, DTOptionsBuilder, tecnologiaLicenciadaService) {
        //Para este formulario se utilizaron funciones almacenadas en $rootScope para el guardado de datos
        $scope.ClavePersonaLogin = AuthService.authentication.userprofile.clavePersona;
        $scope.UOUPersonaLogin = AuthService.authentication.userprofile.claveUnidad;
        $scope.rolId = MenuService.getRolId();
        $scope.proyecto = false;

        $scope.tec = {};
        $scope.busqueda = false;

        //tipos de pi
        // tecnologiaLicenciadaService.ListaTipoPropiedadIndustrial().then(function (res) {
        //     $scope.tipos = [];
        //     $scope.tipos = res.data;
        //     var da = { 'id': 9999, 'nombre': "Derechos de autor" };
        //     $scope.tipos.push(da)
        // }, function (err) {
        //     toastr.error("Error al cargar los datos de tipo de propiedad industrial");
        //     console.log(err);
        // });


        //estados de licenciamiento
        // tecnologiaLicenciadaService.ListaEstadoLicenciamiento().then(function (res) {
        //     $scope.estados = res.data;
        // }, function (err) {
        //     toastr.error("Error al cargar los datos de estados de licenciamientos");
        //     console.log(err);
        // });

        $scope.buscar = function () {
            if ($scope.rolId == 15 || $scope.rolId == 1030) {
                // tecnologiaLicenciadaService.getAllTecnologiasLicenciadas().then( //consulta original
                tecnologiaLicenciadaService.GetAllConsultaParametrizadaTecnologia($scope.tec).then(
                    function (result) {
                        $scope.registros = result.data;
                        $scope.busqueda = true;
                    }, function (err) {
                        toastr.error("No se han podido cargar los registros de tecnologías licenciadas.");
                    });
            } else {
                $scope.proyecto = true;
                $scope.tec.claveEmpleado = $scope.ClavePersonaLogin;
                $scope.tec.unidadOrganizacionalId = $scope.UOUPersonaLogin;
                // tecnologiaLicenciadaService.getAllByEmpleado($scope.tec.claveEmpleado).then(  //consulta original
                tecnologiaLicenciadaService.GetConsultaByEmpleado($scope.tec).then(
                    function (result) {
                        console.log('get consulta by empleado');
                        $scope.registros = result.data;
                        $scope.busqueda = true;
                    }, function (err) {
                        toastr.error("No se han podido cargar los registros de tecnologías licenciadas.");
                    });
            }
        }

        $scope.paramsDT = JSON.parse(localStorage.getItem('GIMitecnologialicenciada' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        if ($scope.paramsDT == null) {
           $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
           $scope.paramsDT.displayStart = 0;
        }




        // //Se recuperan los parametros ingresados por el usuario
        // $scope.tec = MenuService.getVariable('busquedaMiTecnologia');
        // if ($scope.tec == null) {
        //     $scope.tec = {};
        //     $scope.paramsDT = {};
        //     $scope.paramsDT.displayStart = 0;
        // }
        // else {
        //$scope.paramsDT = JSON.parse(localStorage.getItem('GIMitecnologialicenciada' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
        // if ($scope.paramsDT == null) {
        //     $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
        //     $scope.paramsDT.displayStart = 0;
        // }
        // $scope.buscar();
        //     MenuService.deleteVariable('busquedaMiTecnologia');
        // }

        //Opciones para el datatable
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);

        //funcion que guarda el estado del datatable
        function stateSaveCallback(settings, data) {
            var stado = $('#GIMitecnologialicenciada').DataTable().state();
            localStorage.setItem('GIMitecnologialicenciada' + window.location.pathname, JSON.stringify(stado))
        }

        //funcion que carga el estado del datatable
        function stateLoadCallback(settings) {
            // if ($scope.paramsDT != null && $scope.limpia) {
            //     $scope.paramsDT = {};
            //     $scope.paramsDT.displayStart = 0;
            //     $scope.limpia = false;
            //     return $scope.paramsDT;
            // }
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('GIMitecnologialicenciada' + window.location.pathname))
            }

        }




        //resetea los parametros de busqueda
        // $scope.reset = function () {
        //     $scope.tec = {};
        //     $scope.unidadOselect = null;
        //     $scope.busqueda = false;
        //     $scope.limpia = true;
        // };

        //Eliminar
        $scope.delete = function (registro, id) {

            tecnologiaLicenciadaService.delete(registro.tecnologiaLicenciadaId).then(
                function (result) {
                    debugger;
                    //table.row("#" + id).remove().draw(false);
                    var idx = ($scope.registros.indexOf(registro));
                    $scope.registros.splice(idx, 1);
                    toastr.success(result.data);
                },
            function (err) {
                toastr.error(err.data.message);
            });
        };


        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([4,5]).withOption('type', 'string') //definimos el tipo de datos de cada columna

        ];


        $scope.buscar();

    }
})();
