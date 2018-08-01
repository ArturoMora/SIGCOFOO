(function () {
    "use strict";

    angular

        .module("ineelCR")
        .controller("EmpresasGetCtrl", [
            "$scope",
            "EmpresasCRService",
            "DTOptionsBuilder",
            "DTColumnBuilder",
            "$compile",
            "$uibModal",
            "globalGet",
            "$location",
            "MenuService",
            "authInterceptorService",
            EmpresasGetCtrl
        ])

    function EmpresasGetCtrl($scope,
        EmpresasCRService,
        DTOptionsBuilder,
        DTColumnBuilder,
        $compile,
        $uibModal,
        globalGet,
        $location,
        MenuService,
        authInterceptorService
    ) {
        var tabla = this;
        tabla.dtInstance = {};
        tabla.registros = [];
        tabla.message = '';
        tabla.edit = edit;
        tabla.eliminacionLogica = eliminacionLogica;
        var API = globalGet.get("api");
        var headers = authInterceptorService.requestServerSide();
        tabla.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle(' ').renderWith(imagenPerfil).notSortable(),
            DTColumnBuilder.newColumn(null).withTitle('Empresa').renderWith(nombreEmpresa).withOption('responsivePriority', '0').withClass('maxWith220 sin-desborde'),
            DTColumnBuilder.newColumn("nombreTitular", "Titular"),
            DTColumnBuilder.newColumn(null).withTitle('\u00bfEst\u00e1 activo?').renderWith(EstaActivo).withOption('responsivePriority', '1'),
            DTColumnBuilder.newColumn(null).withTitle('Opciones').renderWith(actionsHtml).withOption('responsivePriority', '1').withClass('thAjuste text-center').notSortable()
        ];

        MenuService.setVariable('expertos', false);

        //obtener registros
        tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            dataSrc: function (d) {
                return d.data;
            },
            headers: headers,
            data: {
                "nameColumns": "adjunto64;nombreEmpresa;nombreTitular;estado" //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
            },
            url: API + "Empresas/getData",
            type: "POST"
        }).withOption('processing', true) //for show progress bar
            .withOption('serverSide', true) // for server side processing
            .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
            .withDisplayLength(5) // Page size
            .withOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]])
            .withOption('aaSorting', [1, 'asc']) // for default sorting column // here 0 means first column
            .withOption('createdRow', createdRow)//IMPORTANTE para ng-click
            .withOption('responsive', true);

        function createdRow(row, data, dataIndex) { //IMPORTANTE para ng-click
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function eliminacionLogica(entity) {
            saveEstado(entity, tabla.dtInstance);
        }

        function edit(entity) {
            //tabla.message = 'edit: ' + JSON.stringify(entity);
            $location.path('editar/' + entity.empresaId)
        }

        function nombreEmpresa(data, type, full, meta) {
            return '<a class="link" ui-sref="empresaDetails({ id: ' + data.empresaId + '})" title="Detalles">' + data.nombreEmpresa + '</a>';
        }

        function imagenPerfil(data, type, full, meta) {
            //adjunto64
            if (data.adjunto64 == undefined || data.adjunto64 == null || data.adjunto64 === "") {
                return '<img class="img-thumbnail" src="images/empresa.png" alt="Base64 encoded image" width="50" height="50"/>'

            }
            return '<img class="img-thumbnail" ng-src="data:image/png;base64,' + data.adjunto64 + '" alt="Base64 encoded image" width="50" height="50"/>'
        }

        function EstaActivo(data, type, full, meta) {
            tabla.registros[data.empresaId] = data;
            var value = false;
            if (data.estado == 1) {
                return '<input type="checkbox" class="btn btn-info btn-circle"  value="' + value + '" checked="true" ng-click="showCase.eliminacionLogica(showCase.registros[' + data.empresaId + '])" />';
            } else {
                return '<input type="checkbox" class="btn btn-info btn-circle"  value="' + value + '" ng-click="showCase.eliminacionLogica(showCase.registros[' + data.empresaId + '])" />';
            }
        }

        function actionsHtml(data, type, full, meta) {
            tabla.registros[data.empresaId] = data;
            return '<td>' +
                '<a class="btn btn-warning" ui-sref="empresaEdit({ id: ' + data.empresaId + ' })" title="Editar">'
                + '<i class="glyphicon glyphicon-pencil"></i></a></td>'
        }

        function saveEstado(data, TabledtInstance) {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/registroLogico' + (data.estado == true ? 'Delete' : 'Active') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        data.estado = !data.estado;
                        EmpresasCRService.updateEstado(data).then(
                            function (success) {
                                TabledtInstance.DataTable.page(TabledtInstance.DataTable.page()).draw(false);
                            },
                            function (err) {
                                toastr.error(err.data.exceptionMessage);
                                $scope.cancel();
                            }
                        );
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        TabledtInstance.DataTable.page(TabledtInstance.DataTable.page()).draw(false);
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
    }
})();
