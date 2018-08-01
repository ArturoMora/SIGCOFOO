
(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("InformeBecarioInternoGetCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$timeout",
            "MenuService",
            "InformeBecarioCHService", "globalGet", '$uibModal', '$filter',
            "DTOptionsBuilder", "DTColumnBuilder", "$compile", "authInterceptorService", "$rootScope", InformeBecarioInternoGetCtrl]);

    function InformeBecarioInternoGetCtrl(AuthService, $scope, $state, $timeout, MenuService, InformeBecarioCHService, globalGet, $uibModal, $filter,
        DTOptionsBuilder, DTColumnBuilder, $compile, authInterceptorService, $rootScope) {
        $scope.datePicker = getRangoDeFechaDefault(0, 0, 10);

        $scope.authentication = AuthService.authentication;
        var API = globalGet.get("api");

        $scope.busqueda = {}; //scope global
        var tablaBecariosInternos = this;
        tablaBecariosInternos.dtInstance = {};
        $scope.mostrarTabla = false;

        $scope.FechaValida = false;
        $scope.limpia = false;

        var headers = authInterceptorService.requestServerSide();


        function createdRow(row, data, dataIndex) { //IMPORTANTE para ng-click
            return $timeout(function () {
                // Recompiling so we can bind Angular directive to the DT
                return $compile(angular.element(row).contents())($scope);
            },1);
        }

        //Columnas que llevara la tabla
        tablaBecariosInternos.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle('Becario').renderWith(columnaBecario).withOption('responsivePriority', '1').withOption('defaultContent', ''),
            DTColumnBuilder.newColumn("fechaInicioBeca", "Per&iacute;odo").withOption('defaultContent', '').renderWith(renderFecha),
            DTColumnBuilder.newColumn("institucion.descripcion", "Instituci&oacute;n").withOption('defaultContent', ''),
            DTColumnBuilder.newColumn("estadoFlujo.descripcion", "Estado").withOption('defaultContent', ''),
            DTColumnBuilder.newColumn("becaInterna.descripcion", "Tipo de beca").withOption('defaultContent', ''),
            DTColumnBuilder.newColumn(null).withTitle('Opciones').renderWith(actionsHtml).withClass('thAjuste text-center').notSortable().withOption('responsivePriority', '2')
        ];

        $scope.loadTablaBecariosInternos = function () {
            var fechaInicio=$filter('date')($scope.busqueda.fechaInicioBeca, 'dd/MM/yyyy');
            var fechaFin=$filter('date')($scope.busqueda.fechaTerminoBeca, 'dd/MM/yyyy');
            tablaBecariosInternos.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                dataSrc: function (d) {
                    return d.data;
                },
                headers: headers,
                //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
                data: {
                    "nameColumns": "nombrePersona;fechaInicioBeca;institucion.descripcion;estadoFlujo.descripcion;becaInterna.descripcion",
                    "Becario": $scope.busqueda.clavePersona,
                    "Institucion": $scope.busqueda.institucionID,
                    "TipoBeca": $scope.busqueda.tipoBeca,
                    "NuevaFechaInicio": fechaInicio,
                    "NuevaFechaTermino": fechaFin,
                    "BusquedaFecha": $scope.busqueda.busquedaFecha,
                },
                url: API + "BecarioInterno/getData",
                type: "POST",
                error: function (err) {
                    try {
                        console.log(err);
                        toastr.error(err.statusText);
                    } catch (e) { }
                }
            }).withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers        
                .withDisplayLength(5) // Page size
                .withOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]])
                // .withOption('aaSorting', [0, 'desc']) // for default sorting column // here 0 means first column
                .withOption('language', { sSearch: "Filtrar:" })
                .withOption('stateSaveCallback', stateSaveCallback)
                .withOption('stateLoadCallback', stateLoadCallback)
                .withOption('displayStart', $scope.paramsDT.displayStart)
                .withOption('createdRow', createdRow)//IMPORTANTE para ng-click;
                .withOption('order', [0, 'asc']);
        }

        

        $scope.buscar = function () {
            $scope.mostrarTabla = false;
            if (($scope.busqueda.fechaInicioBeca != null || $scope.busqueda.fechaInicioBeca != undefined) &&  //en caso de que la fecha de inicio esta definida pero no la final
                ($scope.busqueda.fechaTerminoBeca == null || $scope.busqueda.fechaTerminoBeca == undefined)) {

                $scope.busqueda.fechaTerminoBeca = new Date();
                $scope.busqueda.busquedaFecha = "ok";
            }
            if (($scope.busqueda.fechaTerminoBeca != null || $scope.busqueda.fechaTerminoBeca != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.busqueda.fechaInicioBeca == null || $scope.busqueda.fechaInicioBeca == undefined)) {

                $scope.busqueda.fechaInicioBeca = new Date(1975, 10, 25);
                $scope.busqueda.busquedaFecha = "ok";
            }
            if ($scope.busqueda.fechaTerminoBeca != null && $scope.busqueda.fechaInicioBeca != null) {
                $scope.busqueda.busquedaFecha = "ok";
            }

            tablaBecariosInternos.dtOptions = [];
            $scope.loadTablaBecariosInternos();
            $scope.mostrarTabla = true;
        }

        
        
        

        //Funcion para renderizar la columna de becarios
        function columnaBecario(data, type, full, meta) {
            return '<td>' +
                '<a ng-click="setVariable(' + '&#39;' + 'consultaInformesBecariosInternosGet' + '&#39;' + ', busqueda)" ui-sref="InformeBecarioInternoDetails({id: ' + data.becarioInternoId + '})" title="Detalles">'
                + data.nombrePersona +
                '</a>'
            '</td>'
        }


        //Funcion para renderizar la fecha 
        function renderFecha(data, type, row, meta) {
            var fechaInicioBeca = $filter('date')(row.fechaInicioBeca, 'dd/MM/yyyy');
            var fechaTerminoBeca = $filter('date')(row.fechaTerminoBeca, 'dd/MM/yyyy');

            fechaInicioBeca == null ? 'No disponible' : fechaInicioBeca;
            fechaTerminoBeca == null ? 'No disponible' : fechaTerminoBeca;

            return fechaInicioBeca + ' - ' + fechaTerminoBeca;
        }

        function actionsHtml(data, type, full, meta) {
            return '<td>' +
                '<a class="btn btn-warning" ng-click="setVariable(' + '&#39;' + 'consultaInformesBecariosInternosGet' + '&#39;' + ', busqueda)" ui-sref="InformeBecarioInternoEdit({id: ' + data.becarioInternoId + '})" title="Editar">'
                + '<i class="glyphicon glyphicon-pencil"></i>' +
                '</a>' +
                '<a class="btn btn-danger"  ng-really-click="deleteBecario(' + data.becarioInternoId + ')" title="Eliminar">'
                + '<i class="glyphicon glyphicon-trash"></i>' +
                '</a>' +
                '</td>';
        }


        //Tipos de becas internas ***
        InformeBecarioCHService.getTiposBecasInternas().then(
            function (result) {
                $scope.tipoBecas = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Tipos de beca");
            }
        );

        //Instituciones
        InformeBecarioCHService.getInstituciones().then(
            function (result) {
                 $scope.instituciones = result.data;
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de Tipos de beca");
            }
        );

        //modal instituciones ***
        $scope.openInstituciones = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listainstituciones.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $uibModalInstance.close(item);
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.busqueda.nombreInstitucion = selectedItem.descripcion;
                $scope.busqueda.institucionID = selectedItem.institucionID;

            });

        }

        //Buscar personal de investigacion ***
        $scope.openPersonal = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.busqueda.nombreBecario = selectedItem.nombreCompleto;
                $scope.busqueda.clavePersona = selectedItem.clavePersona;
            });

        }

        ///Validar rango de fechas
        $scope.validarFechasInicio = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.busqueda.FechaInicioBeca);
            $scope.finalDateComparacion = new Date($scope.busqueda.FechaTerminoBeca);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                $scope.busqueda.FechaInicio = "dd/mm/yyyy";
                return false;
            }
            if ($scope.inicioDateComparacion < $scope.finalDateComparacion) {
                $scope.FechaValida = true;
            }

        }

        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.busqueda.FechaInicioBeca);
            $scope.finalDateComparacion = new Date($scope.busqueda.FechaTerminoBeca);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                $scope.busqueda.FechaTermino = "dd/mm/yyyy";
                return false;
            }
            if ($scope.inicioDateComparacion < $scope.finalDateComparacion) {
                $scope.FechaValida = true;
            }

        }


        $scope.LimpiarCampos = function () {
            $scope.busqueda = {};
            $scope.mostrarTabla = false;
            $scope.limpia = true;
        }

        //Elimina al becario
        $scope.deleteBecario = function (id) {
            InformeBecarioCHService.deleteBecarioInterno(id).then(
                function (res) {
                    toastr.success(res.data);
                    $state.reload();
                }, function (err) {
                    console.log(err);
                }
            )
        }

        $scope.busqueda = MenuService.getVariable('consultaInformesBecariosInternosGet');
        
        if ($scope.busqueda == null) {
            $scope.busqueda = {};
            $scope.paramsDT = {};
            $scope.paramsDT.displayStart = 0;
            // $timeout($scope.buscar(), 0);
        } else {
            $scope.paramsDT = JSON.parse(localStorage.getItem('tablaInformesBecariosInternos' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }
            $timeout($scope.buscar(), 0);
            MenuService.deleteVariable('consultaInformesBecariosInternosGet');
        }


        //***********Funciones para guardar manualmente el estado del datatable**********************\\

        function stateSaveCallback(settings, data) {
            var stado = $('#tablaInformesBecariosInternos').DataTable().state();
            localStorage.setItem('tablaInformesBecariosInternos' + window.location.pathname, JSON.stringify(stado))
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
                return JSON.parse(localStorage.getItem('tablaInformesBecariosInternos' + window.location.pathname))
            }
        }

        // $scope.buscar();



    }
})();