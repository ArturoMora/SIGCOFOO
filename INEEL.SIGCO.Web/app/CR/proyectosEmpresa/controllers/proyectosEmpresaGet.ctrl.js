(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ProyectosEmpresaGetCtrl", [
            "AuthService",
            "$scope",
            "DTOptionsBuilder",
            "DTColumnBuilder",
            "$compile",
            "globalGet",
            "ProyectosEmpresaCRService",
            "authInterceptorService",
            ProyectosEmpresaGetCtrl
        ]);




    function ProyectosEmpresaGetCtrl(AuthService, $scope, DTOptionsBuilder, DTColumnBuilder, $compile, globalGet, ProyectosEmpresaCRService, authInterceptorService) {
        $scope.authentication = AuthService.authentication;
        $scope.proyectosEmpresa = [];

        /* CODIGO PARA TABLA SERVER SIDE*/
        var headers = authInterceptorService.requestServerSide();
        $scope.loading = true;
        var tabla = this;
        tabla.dtInstance = {};
        tabla.registros = [];
        tabla.message = '';

        var API = globalGet.get("api");

        tabla.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle('N\u00famero').renderWith(idProyecto),
            DTColumnBuilder.newColumn("nombre", "Proyecto"),
            DTColumnBuilder.newColumn("nombreJefeProyecto", "Jefe de proyecto"),

        ];


        //obtener registros
        tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            dataSrc: function (d) {
                return d.data;
            },
            headers: headers,
            data: {
                "nameColumns": "proyectoId;nombre;nombreJefeProyecto" //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
            },
            url: API + "ProyectosEmpresa/GetAllTecnicosServerSide",
            type: "POST"
        }).withOption('processing', true) //for show progress bar
            .withOption('serverSide', true) // for server side processing
            .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
            .withDisplayLength(5) // Page size
            .withOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]])
            .withOption('aaSorting', [0, 'asc']) // for default sorting column // here 0 means first column
            .withOption('createdRow', createdRow);//IMPORTANTE para ng-click
        $scope.loading = false;

        function createdRow(row, data, dataIndex) { //IMPORTANTE para ng-click
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }



        function idProyecto(data, type, full, meta) {
            return '<a class="link" ui-sref="proyectosEmpresaAdd({ id: \'' + data.proyectoId + '\'})" title="Detalles">' + data.proyectoId + '</a>';
        }



        ProyectosEmpresaCRService.getProyectosTecnicos().then(
            function (result) {
                $scope.proyectosEmpresa = result.data;
            },
            function (err) {
                toastr.error(err);
            });
    }
})();