(function () {
    "use strict";

    angular

        .module("ineelCR")
        .controller("ContactosGetGralCtrl", [
            "$scope",
            "$state",
            "$uibModalInstance",
            "DTOptionsBuilder",
            "DTColumnBuilder",
            "$compile",
            "$uibModal",
            "globalGet",
            "MenuService",
            ContactosGetGralCtrl
        ])

    function ContactosGetGralCtrl($scope,
        $state,
        $uibModalInstance,
        DTOptionsBuilder,
        DTColumnBuilder,
        $compile,
        $uibModal,
        globalGet,
        MenuService
    ) {
        $scope.dataFull = [];
        $scope.loading = true;
        var tabla = this;
        tabla.dtInstance = {};
        tabla.registros = {};
        tabla.message = '';
        tabla.contactoSeleccionado = contactoSeleccionado;
        var API = globalGet.get("api");

        if($scope.empresaId!=null){
            $scope.idFromEmpresa=$scope.empresaId;
        }
        

        tabla.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle(' ').renderWith(imagenPerfil).notSortable(),
            DTColumnBuilder.newColumn(null).withTitle('Nombre Completo').renderWith(nombreCompleto),
            DTColumnBuilder.newColumn("empresa.nombreEmpresa", "Empresa"),
            DTColumnBuilder.newColumn("puesto", "Puesto"),
        ];

        //obtener registros
        $scope.cantidad = 0;
        tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            dataSrc: function (d) {
                $scope.$apply(function () {
                    $scope.cantidad = d.data.length;
                });

                return d.data;
            },
            data: {
                "nameColumns": "adjunto64;nombreContacto;puesto", //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
            },
            url: API + "Contactos/getDataByTrue",
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

        function createdRow(row, data, dataIndex) { //IMPORTANTE para ng-click
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function contactoSeleccionado(entity) {
            $scope.contacto = {};
            $scope.contacto = entity;
            $uibModalInstance.close($scope.contacto);
        }

        function nombreCompleto(data, type, full, meta) {
            tabla.registros[data.contactoId] = data;
            return '<a class="link" style="cursor:pointer" ng-click="showCase.contactoSeleccionado(showCase.registros[' + data.contactoId + '])" title="Selecciona">' + data.nombreCompleto + '</a>';
        }

        function imagenPerfil(data, type, full, meta) {
            if (data.adjunto64 == undefined || data.adjunto64 == null || data.adjunto64 === "") {
                return '<img class="img-circle" src="images/incognito.png" alt="Base64 encoded image" width="50" height="50"/>'
            }
            return '<img class="img-circle" ng-src="data:image/png;base64,' + data.adjunto64 + '" alt="Base64 encoded image" width="50" height="50"/>'
        }

        $scope.validaruta = function () {

        }

        $scope.crearContacto = function () {
            //if (MenuService.getVariable("expertos")) {
            //    $state.go("contactoAdd");
            //} else {
            $scope.vinculo = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CR/contactos/contactoModal/contactoModalAdd.html',
                controller: 'ContactoModalAddCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.contacto = selectedItem;
                $uibModalInstance.close($scope.contacto);
            });
            //}

        }
    }
})();