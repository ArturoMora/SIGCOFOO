(function () {
    "use strict";

    var app = angular.module("ineelCH");

    app.controller("CongresoCtrlGet", ["AuthService", "$scope", "$http",
        "CongresoService", "$uibModal",
        "DTOptionsBuilder", "DTColumnBuilder", "globalGet", "$compile", "$state", "$location","authInterceptorService",
        CongresoCtrlGet]);
    function CongresoCtrlGet(AuthService, $scope, $http,
        CongresoService, $uibModal,
        DTOptionsBuilder, DTColumnBuilder, globalGet, $compile, $state, $location, authInterceptorService) {
        var headers = authInterceptorService.requestServerSide();
        $scope.registroscongresos = [];
        var tabla = this;
        tabla.dtInstance = {};
        tabla.registros = {};
        tabla.message = '';
        tabla.edit = edit;
        tabla.eliminacionLogica = eliminacionLogica;

        //Variables de carga
        $scope.loading = true;
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;
        var API = globalGet.get("api");
        tabla.dtColumns = [
            DTColumnBuilder.newColumn("nombreCongreso", "Congreso").withOption('responsivePriority', '1').withOption('defaultContent', ''),
            DTColumnBuilder.newColumn("numero", "Número").withClass('thAjuste text-center'),
            DTColumnBuilder.newColumn(null).withTitle('¿Está activo?').renderWith(EstaActivo).withClass('thAjuste text-center').withOption('responsivePriority', '1').withOption('defaultContent', ''),
            DTColumnBuilder.newColumn(null).withTitle('Opciones').renderWith(actionsHtml).withClass('thAjuste text-center').notSortable().withOption('responsivePriority', '1').withOption('defaultContent', '')
        ];
        //obtener registros
        tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            dataSrc: function (d) {
                console.log("datasrc");                
                $scope.$apply(function () {                    
                    $scope.registroscongresos = d.data;                    
                });
                return d.data;
            },
            headers: headers,
            data: {
                "nameColumns": "congresoId;nombreCongreso;numero;fechaEfectiva;estado" //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
            },
            url: API + "/Congreso/getData",
            type: "POST"
        })
        .withOption('processing', true) //for show progress bar
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
        function eliminacionLogica(person) {
            saveEstado(person, tabla.dtInstance);
        }
        function edit(person) {
            //tabla.message = 'edit: ' + JSON.stringify(person);            
            $location.path('editarcongreso/' + person.congresoId)
        }

        function EstaActivo(data, type, full, meta) {
            tabla.registros[data.congresoId] = data;
            var value = false;
            if (data.estado == 1) {
                return '<input type="checkbox" class="btn btn-info btn-circle"  value="' + value + '" checked="true" ng-click="showCase.eliminacionLogica(showCase.registros[' + data.congresoId + '])" />';
            } else {
                return '<input type="checkbox" class="btn btn-info btn-circle"  value="' + value + '" ng-click="showCase.eliminacionLogica(showCase.registros[' + data.congresoId + '])" />';
            }
        }
        function actionsHtml(data, type, full, meta) {
            tabla.registros[data.congresoId] = data;
            return '<a class="btn btn-warning" ng-click="showCase.edit(showCase.registros[' + data.congresoId + '])" title="Editar">' +
        '<i class="glyphicon glyphicon-pencil"></i></a>';
        }
        //Guardar estado        
        function saveEstado(data, TabledtInstance) {
            var id = data.congresoId;
            var estado = data.estado;
            var descripcion = data.nombreCongreso;
            console.log("saveEstado");
            $scope.descripcionRow = descripcion;
            var pagina;
            var _estado;
            var registro;

            if (estado == true || estado == 1) {

                pagina = "Delete";
                _estado = 0;
            } else {
                pagina = "Active";
                _estado = 1;
            }
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/registroLogico' + pagina + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        registro = {
                            "congresoId": id,
                            "estado": _estado
                        };
                        CongresoService.UpdateEstado(registro).then(
                            function (success) {
                                TabledtInstance.reloadData();
                            },
                            function (err) {
                                TabledtInstance.reloadData();
                            }
                        );
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        TabledtInstance.reloadData();
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
    }
})();