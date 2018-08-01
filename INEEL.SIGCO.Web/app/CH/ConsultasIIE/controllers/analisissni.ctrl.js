(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("analisissniCtrl", ['AuthService', 'DTOptionsBuilder', '$scope', '$state', '$rootScope', 'InventarioRH', '$timeout', 'FechaCHService', analisissniCtrl]);

    function analisissniCtrl(AuthService, DTOptionsBuilder, $scope, $state, $rootScope, InventarioRH, $timeout, FechaCHService) {
        $scope.investigadores = {};
        $scope.parametrosconsulta = {};
        $scope.fecha = FechaCHService.fechainventariochget();
        $scope.carrera = "";


        $scope.consultaranalisissni = function () {
            var claveUnidad = "";

            if (typeof $scope.uoselecionada === 'undefined' || $scope.uoselecionada.claveUnidad === "") {
                toastr.warning("seleccione una Unidad Organizacional");
                return;
            }

            if (typeof $scope.fecha === 'undefined' || $scope.fecha === "") {
                toastr.warning("seleccione una fecha para efectuar la consulta");
                return;
            }

            $scope.investigadores = {};
            //obtener registros
            $scope.parametrosconsulta.claveunidad = $scope.uoselecionada.claveUnidad;
            $scope.parametrosconsulta.fecha = $scope.fecha;
            InventarioRH.getanalisissnixfecha($scope.parametrosconsulta).then(
                function (response) {
                    if (response.data === null || response.data.length <= 0) {
                        toastr.warning("La unidad organizacional seleccionada no cuenta con personal en SNI.", '', { timeOut: 10000, });
                        $scope.investigadores = [];
                    }
                    else {
                        $scope.investigadores = response.data;
                    }

                }
                , function (error) {
                    toastr.error(error.message);
                }
            );
        };


        $scope.reset = function () {
            $scope.fecha = new Date();
          
            $scope.investigadores = {};
            $scope.uoselecionada = {};
           
        };

        $scope.cambiafecha = function () {
            var fechaHoy = new Date();
            if ($scope.fecha > fechaHoy) {
                toastr.warning("La fecha no debe se mayor a la actual.", '', { timeOut: 10000 });
                $scope.fecha = new Date();
            }
            FechaCHService.fechainventariochset($scope.fecha);

           
        };

        $scope.exportar = function () {
            $scope.investpdf = $scope.investigadores;
            $timeout(exportpdf, 100);
        };

        $scope.mostrar = false;
        var exportpdf = function () {
            var imageHeader = logoINEELrepot_;
            $scope.mostrar = true;

            if ($scope.investigadores === null || $scope.investigadores.length <= 0) {
                toastr.warning("Favor de generar una consulta...", '', { timeOut: 10000 });
                return;
            }

            var doc = new jsPDF('l', 'pt');

                var header = function (data) {
                    doc.setFontSize(20);
                    doc.setTextColor(40);
                    doc.setFontStyle('normal');
                    //doc.addImage(imageHeader, 'JPGE', data.settings.margin.left, 40, 150, 31);
                    doc.addImage(imageHeader, 'PNG', data.settings.margin.left - 8, 20, 150, 77);
                    doc.text("Consulta de análisis de personal S.N.I. ", data.settings.margin.left + 170, 60);

                    doc.setFontSize(10);
                    doc.text("(Número de años). ", 620, 60);

                    doc.setFontSize(12);
                    doc.text('Unidad Organizacional: ' + $scope.uoselecionada.nombreUnidad, data.settings.margin.left, 100);
                    doc.text('Información a la fecha: ' + ($scope.fecha.getDate()) + "/" + ($scope.fecha.getMonth() + 1) + "/" + $scope.fecha.getFullYear(), data.settings.margin.left + 500, 100);
                    doc.setFontSize(8);
                    //doc.text('*** Director de División / ** Gerente de Unidad / @ Asistente Administrativo', data.settings.margin.left, 100);
                };
                var totalPagesExp = "{total_pages_count_string}";
                var footer = function (data) {
                    var str = "Página " + data.pageCount;
                    // Total page number plugin only available in jspdf v1.0+
                    if (typeof doc.putTotalPages === 'function') {
                        str = str + " de " + totalPagesExp;
                    }
                    doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
                };

                var options = {
                    beforePageContent: header,
                    afterPageContent: footer,
                    margin: { top: 105 },

                    styles: { cellPadding: 2, overflow: 'linebreak' },
                    headerStyles: {
                        rowHeight: 15, fontSize: 8,
                        textColor: 255, fillColor: [115, 135, 156], fontStyle: 'bold'
                    },
                    bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
                    columnStyles: {
                        0: { halign: 'center' },
                        2: { halign: 'center' },
                        3: { halign: 'center' },
                        4: { halign: 'center' },
                        5: { halign: 'center' },
                        6: { halign: 'center' },
                        7: { halign: 'center' },
                        8: { halign: 'center' },
                        9: { halign: 'center' }
                    }
                };

                var res = doc.autoTableHtmlToJson(document.getElementById("estadisticopdf"));
                doc.autoTable(res.columns, res.data, options);
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    doc.putTotalPages(totalPagesExp);
                }


            
                doc.save("ConsultaAnálisisPersonalS.N.I.pdf");
            $scope.mostrar = false;
            //$timeout(function () { $scope.investpdf = null; }, 100);
        };
        $scope.dtOptions = DTOptionsBuilder.newOptions().withButtons([
            {
                extend: 'excelHtml5',
                text: '<i class="fa fa-download"></i> Descargar Excel',
                className: 'btn btn-success',
                title: 'ConsultaAnálisisPersonalS.N.I'
            },
            {
                text: '<i class="fa fa-download"></i> Descargar PDF',
                key: '1',
                className: 'btn btn-success',
                action: function (e, dt, node, config) {
                    exportpdf();
                }
            }])
            .withDOM('lftr<"default"ip><"clear">B')
            .withOption('order', false)
            .withDisplayLength(10);

        //$scope.$watch("uoselecionada", function () {
        //    if (typeof $scope.uoselecionada !== 'undefined')
        //        $scope.consultaranalisissni();
        //});

        //if (typeof $rootScope.unidad !== 'undefined') {
        //    $scope.uoselecionada = $rootScope.unidad;
        //    $scope.consultaranalisissni();
        //}

    }

})();