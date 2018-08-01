(function () {
    "use strict";

    angular

        .module("ineelCR")
        .controller("ContactosGetCtrl", [
            "$scope",
            "ContactosCRService",
            "DTOptionsBuilder",
            "DTColumnBuilder",
            "$compile",
            "$uibModal",
            "globalGet",
            "$location",
            "MenuService",
            "authInterceptorService",
            ContactosGetCtrl
        ])

    function ContactosGetCtrl(
        $scope,
        ContactosCRService,
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
        tabla.registros = {};
        tabla.message = '';
        tabla.edit = edit;
        tabla.eliminacionLogica = eliminacionLogica;
        var API = globalGet.get("api");
        var headers = authInterceptorService.requestServerSide();

        tabla.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle(' ').renderWith(imagenPerfil),
            DTColumnBuilder.newColumn(null).withTitle('Nombre Completo').renderWith(nombreCompleto).withOption('responsivePriority', '1'),
            // DTColumnBuilder.newColumn("empresa.nombreEmpresa", "Empresa"),
            DTColumnBuilder.newColumn(null).withTitle('Empresas').renderWith(listaEmpresas),
            DTColumnBuilder.newColumn("estadoContacto", "Estado"),
            DTColumnBuilder.newColumn(null).withTitle('\u00bfEst\u00e1 activo?').renderWith(EstaActivo).withOption('responsivePriority', '1'), 
            DTColumnBuilder.newColumn(null).withTitle('Opciones').renderWith(actionsHtml).withClass('thAjuste text-center').notSortable().withOption('responsivePriority', '1')
        ];

        //Eliminar la variable expertos para indicar que no es ese flujo
        MenuService.setVariable('expertos', false);

        //obtener registros
        tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            dataSrc: function (d) {
                return d.data;
            },
            headers: headers,
            data: {
                "nameColumns": "adjunto64;nombreContacto;empresa.nombreEmpresa;estadoContacto;estado" //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
            },
            url: API + "Contactos/getData",
            type: "POST"
        }).withOption('processing', true) //for show progress bar
            .withOption('serverSide', true) // for server side processing
            .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers        
            .withDisplayLength(5) // Page size
            .withOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]])
            .withOption('aaSorting', [1, 'asc']) // for default sorting column // here 0 means first column
            .withOption('createdRow', createdRow)
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
            
            $location.path('editar/' + entity.contactoId)
        }

        function nombreCompleto(data, type, full, meta) {
            
            return '<a class="link" ui-sref="contactoDetails({ id: ' + data.contactoId + '})" title="Detalles">' + (data.tituloPersona == null ? '' : data.tituloPersona.nombre) + ' ' + data.nombreCompleto + '</a>';
        }

        function listaEmpresas(data, type, full, meta) {
            if(data.empresas!=null){
                var lista="<ul>";
                for(var c=0; c< data.empresas.length; c++){
                    lista+= "<li>"+data.empresas[c]+ "</li>";
                }
                return lista+"</ul>";
            }else{
                return;
            }
            
        }

        function imagenPerfil(data, type, full, meta) {
            //adjunto64
            if (data.adjunto64 == undefined || data.adjunto64 == null || data.adjunto64 === "") {
                return '<img class="img-thumbnail" src="images/user.png" alt="Base64 encoded image" width="50" height="50"/>'
            }
            return '<img class="img-thumbnail" ng-src="data:image/png;base64,' + data.adjunto64 + '" alt="Base64 encoded image" width="50" height="50"/>'
        }

        function EstaActivo(data, type, full, meta) {
            tabla.registros[data.contactoId] = data;
            var value = false;
            if (data.estado == 1) {
                return '<input type="checkbox" class="btn btn-info btn-circle"  value="' + value + '" checked="true" ng-click="showCase.eliminacionLogica(showCase.registros[' + data.contactoId + '])" />';
            } else {
                return '<input type="checkbox" class="btn btn-info btn-circle"  value="' + value + '" ng-click="showCase.eliminacionLogica(showCase.registros[' + data.contactoId + '])" />';
            }
        }

        function actionsHtml(data, type, full, meta) {
            tabla.registros[data.contactoId] = data;
            return '<td>' +
                '<a class="btn btn-warning"  ng-click="showCase.edit(showCase.registros[' + data.contactoId + '])" title="Editar">'
                + '<i class="glyphicon glyphicon-pencil"></i>'
            '</a>'
            '</td>'
        }

        function saveEstado(data, TabledtInstance) {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/registroLogico' + (data.estado == true ? 'Delete' : 'Active') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        data.estado = !data.estado;
                        ContactosCRService.updateEstado(data).then(
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