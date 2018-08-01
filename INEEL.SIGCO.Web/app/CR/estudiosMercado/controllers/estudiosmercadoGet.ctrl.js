(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("estudiosmercadoCtrlGet", [
            "AuthService",
            "$scope",
            "$state",
            "DTOptionsBuilder",
            "DTColumnDefBuilder",
            "EstudioMercadoService",
            "MenuService",
            "$uibModal",
            estudiosmercadoCtrlGet
        ]);

    function estudiosmercadoCtrlGet(AuthService, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder, EstudioMercadoService, MenuService, $uibModal) {
        $scope.authentication = AuthService.authentication;
        $scope.idRol = MenuService.getRolId();
        $scope.expProf = {};
        $scope.est = {};
        $scope.busqueda = false;
        $scope.limpia = false;


     
        $scope.buscar = function () {
            if (($scope.est.fechaInicioComparacion != null || $scope.est.fechaInicioComparacion != undefined) &&  //en caso de que la fecha de inicio esta definida pero no la final
                ($scope.est.fechaFinalComparacion == null || $scope.est.fechaFinalComparacion == undefined)) {

                $scope.est.fechaFinalComparacion = new Date();
                $scope.est.busquedaFecha="ok";
            }
            if (($scope.est.fechaFinalComparacion != null || $scope.est.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.est.fechaInicioComparacion == null || $scope.est.fechaInicioComparacion == undefined)) {

                $scope.est.fechaInicioComparacion = new Date(1975, 10, 25);
                $scope.est.busquedaFecha="ok";
            }
            if (($scope.est.fechaFinalComparacion != null || $scope.est.fechaFinalComparacion != undefined) && //en caso de que el usuario escriba las fechas manualmente
                ($scope.est.fechaInicioComparacion != null || $scope.est.fechaInicioComparacion != undefined)) {

                $scope.est.busquedaFecha='ok';
            }
            if (($scope.est.fechaInicioComparacion != null && $scope.est.fechaFinalComparacion != null) && $scope.est.fechaInicioComparacion > $scope.est.fechaFinalComparacion) {
                toastr.error("Favor de introducir un rango válido de fechas");
                return false;
            }
            EstudioMercadoService.GetConsultaParametrizadaEstudios($scope.est).then(function (res) {
                $scope.estudios = res.data;
                $scope.busqueda = true;
            }, function (err) {
                toastr.error("Error al cargar los datos de estudios de mercado");
                console.log(err);
            });
        }


        //Se recuperan los datos de la previa busqueda ingresada por el usuario
        $scope.est = MenuService.getVariable('consultaEstudiosMercado');
        if ($scope.est == null) {
            $scope.est = {};
            $scope.paramsDT = {};
            $scope.paramsDT.displayStart = 0;
        } else {
            $scope.paramsDT = JSON.parse(localStorage.getItem('tableEstudiosMercadoConsulta' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }
            $scope.buscar();
            MenuService.deleteVariable('consultaEstudiosMercado');
        }

        //Opciones de inicializacion en las tablas
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart)
            .withOption('order', [5, 'desc']);

        //Por cada accion del Datatable se ejecuta este callback
        function stateSaveCallback(settings, data) {
            var stado = $('#tableEstudiosMercadoConsulta').DataTable().state();
            localStorage.setItem('tableEstudiosMercadoConsulta' + window.location.pathname, JSON.stringify(stado))
        }

        //En conjunto con el callback anterior se guarda y recupera el state del datatatable
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
                return JSON.parse(localStorage.getItem('tableEstudiosMercadoConsulta' + window.location.pathname))
            }

        }

        //carga las graficas de estudios mercado
        EstudioMercadoService.graficaEstudiosMercado().then(
            function (result) {
                $scope.datosgrafica = result.data;
                $scope.expProf.labels = $scope.datosgrafica.etiqetas;
                $scope.expProf.datos = $scope.datosgrafica.numConvenios;
            },
            function (err) {
                toastr.error("No se han podido cargar la información de Estudios de Mercado");
            });

        //guardamos los parametros de busqueda del usuario antes de ir a editar el registro
        $scope.editarRegistro = function (id) {
            MenuService.setVariable('consultaEstudiosMercado', $scope.est);
            $state.go('estudiomercadoEdit', { id: id });
        }

        //guardamos los parametros de busqueda del usuario antes de visualizar el detalle del registro
        $scope.detalleRegistro = function (id) {
            MenuService.setVariable('consultaEstudiosMercado', $scope.est);
            $state.go('estudiomercadoDetalles', { id: id });

        }

        $scope.reset = function () {
            $scope.est = {};
            $scope.unidadOselect = {};
            $scope.busqueda = false;
            $scope.limpia = true;
        };

        $scope.eliminaRegistro = function (registro) {
            $scope.descripcionRow = registro.tema;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        $scope.delete(registro, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };


        $scope.delete = function (registro, $uibModalInstance) {
            EstudioMercadoService.delete(registro.estudiosMercadoId).then(
                    function (result) {
                        toastr.success(result.data);
                        $scope.buscar();
                        $uibModalInstance.close();
                    },
                    function (err) {
                        toastr.error(err.data.message);
                    });
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
                $scope.est.proyectoNombre = selectedItem.nombre;
                $scope.est.proyectoId = selectedItem.proyectoId;

            });
        }

        //Importante
        //Las siguientes lineas permiten que el filtrado default de un datatable funcione, ya que durante todo el desarrollo del sigco no funcionaban (hasta ahora \(*u*)/ )
        //El filtrado no funciona cuando dentro de un <td> hay elementos html, como  lo son <a></a> , <div></div>, etc
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([0, 1,2, 3]).withOption('type', 'string') //definimos el tipo de datos de cada columna 
            
        ];


    }
})();