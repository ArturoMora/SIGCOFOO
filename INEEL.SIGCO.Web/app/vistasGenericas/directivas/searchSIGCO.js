
(function () {
    "use strict";
    angular.module("directivasSIGCO")
            .directive('searchPersonalModal', function () {
                return {
                    restrict: 'ACE',
                    templateUrl: 'app/vistasGenericas/search/personasInit.html',
                    controller: "uoSearchPersonalModalCtrl",
                    require: 'ngModel',
                    scope: {                        
                        titulo: "@titulo",
                        tipo: "=?tipo",/* para futura clasificación sindicalizdo, honorarios, etc*/
                        ngModel: '=',
                    }
                };
            })
    .controller('uoSearchPersonalModalCtrl', ['$scope', '$uibModal', uoSearchPersonalModalCtrl])
    .controller("PersonalSearchCtrl",
    ["$scope", "$state", "$stateParams",
        "$uibModal", "$uibModalInstance",
        "$http", "globalGet",
        "DTOptionsBuilder", "DTColumnBuilder","$compile",
        PersonalSearchCtrl]);

    function uoSearchPersonalModalCtrl($scope, $uibModal) {
        $scope.uoselecionada = [];
        $scope.openModal = function () {
            debugger;
            $scope.titulo = typeof $scope.titulo === 'undefined' ? " " : $scope.titulo;
            
            $scope.selectItem = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/search/search.html',
                controller: 'PersonalSearchCtrl as showCase',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.ngModel = selectedItem;
            });
        }

    }

    function PersonalSearchCtrl($scope, $state, $stateParams, $uibModal, $uibModalInstance,
    $http, globalGet, DTOptionsBuilder, DTColumnBuilder, $compile) {
        var API = globalGet.get("api");
        var tabla = this;
        tabla.dtInstance = {};
        var API = globalGet.get("api");
        function createdRow(row, data, dataIndex) { //IMPORTANTE para ng-click
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }
        function detalles(data, type, full, meta) {
            return '<td>' +
                '<a class="linkTabla" ui-sref="SoftwarePersonalDetails({ id: ' + data.clavePersona + '})" title="Detalles">' + data.nombreCompleto + '</a>' +
                '</td>';
        }
        tabla.dtColumns = [
            DTColumnBuilder.newColumn('clavePersona', 'No. empleado').withOption('responsivePriority', '1').withOption('defaultContent', '--'),
DTColumnBuilder.newColumn(null).withTitle('Nombre').renderWith(detalles).withOption('responsivePriority', '2').withOption('defaultContent', ''),
DTColumnBuilder.newColumn('nombreUnidad', 'Unidad').withOption('defaultContent', '--'),
DTColumnBuilder.newColumn('correo', 'Correo').withOption('defaultContent', '--'),
DTColumnBuilder.newColumn('extension', 'Extension').withOption('defaultContent', '--'),
DTColumnBuilder.newColumn('estado', 'Estado').withOption('defaultContent', '--')
        ];
        tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            dataSrc: function (d) {
                return d.data;
            },
            //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
            data: {
                "nameColumns": "nombre;clavePersona;estado"
                //"ClaveUnidad": $scope.Palabra.claveUnidad,
            },
            url: API + "Personas/getData",
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
            .withOption('aaSorting', [0, 'desc']) // for default sorting column // here 0 means first column
            //.withOption('dom', '<"wrapper"ltip>')
            .withOption('language', { sSearch: "filtrar:" })
            .withOption('createdRow', createdRow);//IMPORTANTE para ng-click


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        $scope.ok = function () {
            $uibModalInstance.close($scope.nodoSeleccionado);
        }

    }

})();