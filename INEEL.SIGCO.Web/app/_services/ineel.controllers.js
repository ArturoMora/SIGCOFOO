(function () {
    "use strict";

    //var app = angular.module("ineel.controllers", ["ineel.services"])
    var app = angular.module("ineel.controllers",[
            'datatables', 
            'ui.bootstrap', 
            "ineel.services",
            'ngTagsInput', 
            'directivasSIGCO',
            'ngFabForm',
            'ngMessages'])
            .config(function (ngFabFormProvider) {
                ngFabFormProvider.extendConfig({
                    validationsTemplate: 'app/vistasGenericas/validacionesTemplate/DefaultMessagesValidation.html'
                });
            })
            .config(function ($httpProvider) {
                $httpProvider.interceptors.push('authInterceptorService');
    });

    angular.module("ineel.controllers")

        .controller("ProyectoSearchCtrlComun", ["$scope", "$rootScope", "$state", "$stateParams",
            "$http", "globalGet", "DTOptionsBuilder", "DTColumnBuilder", "$compile", "$filter",
            ProyectoSearchCtrlComun])

        .controller("EmpresasSearchCtrlComun", ["$scope", "$rootScope", "$state", "$stateParams",
            "$http", "globalGet", "DTOptionsBuilder", "DTColumnBuilder", "$compile",
            EmpresasSearchCtrlComun])

        .controller("loadDetallePersonalCtrl", ["$stateParams", loadDetallePersonalCtrl]);

    function loadDetallePersonalCtrl($stateParams) {
        window.location = "/indexCH.html#/detallePersonal/" + $stateParams.id;
    }

    function EmpresasSearchCtrlComun($scope, $rootScope, $state, $stateParams,
        $http, globalGet, DTOptionsBuilder, DTColumnBuilder, $compile) {
        var date = new Date();
        var API = globalGet.get("api");
        var tabla = this;
        tabla.dtInstance = {};
        var API = globalGet.get("api");
        function createdRow(row, data, dataIndex) { //IMPORTANTE para ng-click
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }
        //  fecha = $filter('date')(data.fechaInicio, 'yyyy/MM/dd')

        function nombreEmpresa(data, type, full, meta) {
            //empresaDetails
            return '<a class="linkTabla" ui-sref="detalleEmpresas({ id: ' + data.empresaId + '})" title="Detalles">' + data.nombreEmpresa + '</a>';
        }
        tabla.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle('Empresa').renderWith(nombreEmpresa).withOption('defaultContent', '--'),
            DTColumnBuilder.newColumn('nombreTitular', 'Titular').withOption('defaultContent', '--'),
            DTColumnBuilder.newColumn('correo', 'Correo').withOption('defaultContent', '--'),
            DTColumnBuilder.newColumn('telefono', 'Telefono').withOption('defaultContent', '--'),
            DTColumnBuilder.newColumn('ext', 'Ext').withOption('defaultContent', '--'),
            DTColumnBuilder.newColumn('celular', 'Celular').withOption('defaultContent', '--')

        ];
        tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            dataSrc: function (d) {
                $scope.$apply(function () {
                    console.log(d);
                });
                return d.data;
            },
            //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
            data: {
                "nameColumns": "nombreEmpresa;nombreTitular;correo;telefono;ext;celular",
            },
            url: API + "Empresas/getDataComun",
            type: "POST",
            error: function (err) {
                try {
                    //$scope.errorGetData = true;
                    console.log(err);
                    toastr.error(err.statusText);
                } catch (e) { }
            }
        }).withOption('processing', true) //for show progress bar
            .withOption('serverSide', true) // for server side processing
            .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers        
            .withDisplayLength(5) // Page size
            .withOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]])
            .withOption('aaSorting', [1, 'desc']) // for default sorting column // here 0 means first column
            .withOption('initComplete', function () {
                $("div.dataTables_filter input").focus();
            })
            //.withOption('dom', '<"wrapper"ltip>')
            .withOption('language', { sSearch: "Buscar:" })
            .withOption('createdRow', createdRow);//IMPORTANTE para ng-click


    }

    function ProyectoSearchCtrlComun($scope, $rootScope, $state, $stateParams,
        $http, globalGet, DTOptionsBuilder, DTColumnBuilder, $compile, $filter) {
        var date = new Date();
        var API = globalGet.get("api");
        var tabla = this;
        tabla.dtInstance = {};
        var API = globalGet.get("api");
        function createdRow(row, data, dataIndex) { //IMPORTANTE para ng-click
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }
        function detalles(data, type, full, meta) {
            if (data.nombre == undefined || data.nombre == null || data.nombre == 'NULL' || data.nombre == 'null') {
                data.nombre = '';
            }
            return '<td>' +
                '<a class="linkTabla" target="_blank" href="/indexMT.html#/detalleProyecto/'+data.proyectoId+'" title="Detalles">' + data.nombre + '</a>' +
                '</td>';
        }

        function detallesEmpresa(data, type, full, meta) {
            debugger;
            var detalleHtml="";
            if (data.empresaId == undefined || data.empresaId == null) {
                detalleHtml='<td>No disponible</td>';
            }else{
                data.nombreEmpresa= data.nombreEmpresa.replace(/\n/g, "");
                detalleHtml= '<td>' +
                '<a class="linkTabla" target="_blank" href="/indexCR.html#/detalleEmpresas/'+data.empresaId+'" title="Detalles">' + data.nombreEmpresa + '</a>' +
                '</td>';
            }
            return detalleHtml;
        }

        function fechaInicio(data, type, full, meta) {
            var fecha = "";
            try {
                fecha = $filter('date')(data.fechaInicio, 'yyyy/MM/dd')

            } catch (e) { }
            return '<td>' + fecha + '</td>';
        }
        function fechaFin(data, type, full, meta) {
            var fecha = "";
            try {
                fecha = $filter('date')(data.fechaFin, 'yyyy/MM/dd')

            } catch (e) { }
            return '<td>' + fecha + '</td>';
        }

        tabla.dtColumns = [
            DTColumnBuilder.newColumn('proyectoId', 'No. proyecto').withOption('responsivePriority', '1').withOption('defaultContent', 'No disponible'),
            //DTColumnBuilder.newColumn('nombre', 'Proyecto').withOption('defaultContent', '--').withClass('thMaxW400'),
            DTColumnBuilder.newColumn(null).withTitle('Proyecto').renderWith(detalles).withOption('defaultContent', '').withClass('thMaxW400'),
            //DTColumnBuilder.newColumn(null).withTitle('Fecha fin').renderWith(fechaFin).withOption('defaultContent', ''),
            DTColumnBuilder.newColumn('nombreUnidad', 'Unidad organizacional').withOption('defaultContent', 'No disponible'),
            DTColumnBuilder.newColumn(null).withTitle('Cliente').renderWith(detallesEmpresa)

        ];
        tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            dataSrc: function (d) {
                $scope.$apply(function () {
                    console.log(d);
                });
                return d.data;
            },
            //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
            data: {
                "nameColumns": "proyectoId;nombre;nombreUnidad;nombreEmpresa",
            },
            url: API + "Proyectos/busquedaProyectos",
            type: "POST",
            error: function (err) {
                try {
                    //$scope.errorGetData = true;
                    console.log(err);
                    toastr.error(err.statusText);
                } catch (e) { }
            }
        }).withOption('processing', true) //for show progress bar
            .withOption('serverSide', true) // for server side processing
            .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers        
            .withDisplayLength(5) // Page size
            .withOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]])
            .withOption('aaSorting', [3, 'desc']) // for default sorting column // here 0 means first column
            .withOption('initComplete', function () {
                $("div.dataTables_filter input").focus();
            })
            //.withOption('dom', '<"wrapper"ltip>')
            .withOption('language', { sSearch: "Buscar:" })
            .withOption('createdRow', createdRow);//IMPORTANTE para ng-click


    }



})();