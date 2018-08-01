(function () {
    "use strict";

    angular

        .module("ineelCR")
        .controller("EmpresasGetGralCtrl", [
            "$scope",
            "$uibModalInstance",
            "DTOptionsBuilder",
            "DTColumnBuilder",
            "$compile",
            "$uibModal",
            "globalGet",
            EmpresasGetGralCtrl
        ])

    function EmpresasGetGralCtrl($scope, $uibModalInstance, DTOptionsBuilder, DTColumnBuilder, $compile, $uibModal, globalGet,) {
        $scope.dataFull = [];
        $scope.loading = true;
        var tabla = this;
        tabla.dtInstance = {};
        tabla.registros = [];
        tabla.message = '';
        tabla.empresaSeleccionado = empresaSeleccionado;
        var API = globalGet.get("api");

        tabla.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle(' ').renderWith(imagenPerfil).notSortable(),
            DTColumnBuilder.newColumn(null).withTitle('Empresa').renderWith(nombreEmpresa),
            DTColumnBuilder.newColumn("nombreTitular", "Titular"),
        ];

        //obtener registros
        tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            dataSrc: function (d) {
                $scope.$apply(function () {
                    $scope.cantidad = d.data.length;
                });
                return d.data;
            },
            data: {
                "nameColumns": "adjunto64;nombreEmpresa;nombreTitular;estado" //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
            },
            url: API + "Empresas/getDataForModal",
            type: "POST"
        }).withOption('processing', true) //for show progress bar
        .withOption('serverSide', true) // for server side processing
        .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
        .withDisplayLength(5) // Page size
        .withOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]])
        .withOption('aaSorting', [1, 'asc']) // for default sorting column // here 0 means first column
        .withOption('createdRow', createdRow);//IMPORTANTE para ng-click
        $scope.loading = false;

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        function createdRow(row, data, dataIndex) { 
            $compile(angular.element(row).contents())($scope);
        }

        function empresaSeleccionado(entity) {
            
            $scope.empresa = {};
            $scope.empresa = entity;
            $uibModalInstance.close($scope.empresa);
        }

        function nombreEmpresa(data, type, full, meta) {
            tabla.registros[data.empresaId] = data;
            return '<a class="link" style="cursor:pointer" ng-click="showCase.empresaSeleccionado(showCase.registros[' + data.empresaId + '])" title="Selecciona">' + data.nombreEmpresa + '</a>';
        }

        function imagenPerfil(data, type, full, meta) {
            if (data.adjunto64 == undefined || data.adjunto64 == null || data.adjunto64 === "") {
                return '<img class="img-thumbnail" src="images/incognito.png" alt="Base64 encoded image" width="50" height="50"/>'

            }
            return '<img class="img-thumbnail" ng-src="data:image/png;base64,' + data.adjunto64 + '" alt="Base64 encoded image" width="50" height="50"/>'
        }

        $scope.crearEmpresa = function () {
            $scope.vinculo = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CR/empresas/empresaModal/empresaModalAdd.html',
                controller: 'EmpresaModalAddCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                debugger;
                $scope.contacto = selectedItem;
                $uibModalInstance.close($scope.contacto);
            });
        }
    }
})();
