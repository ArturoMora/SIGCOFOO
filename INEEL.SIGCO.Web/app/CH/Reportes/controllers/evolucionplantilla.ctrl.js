(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("evolucionplantillaCtrl", [
            "$scope","$rootScope","$state",
            "FechaCHService",
            "InventarioRH",
            evolucionplantillaCtrl]);
    function evolucionplantillaCtrl($scope, $rootScope, $state, FechaCHService, InventarioRH) {
        $scope.fechach = FechaCHService.fechainventariochget();
        $scope.parametrosconsulta = {};
        $scope.promedios = [];
        $scope.options = {
            animation: {
                onComplete: function () {
                    var chartInstance = this.chart;
                    var ctx = this.chart.ctx;
                    ctx.font = this.font;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";

                    Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        ctx.fillStyle = dataset.backgroundColor;
                        Chart.helpers.each(meta.data.forEach(function (bar, index) {
                            if (!meta.hidden) {
                                ctx.fillText(dataset.data[index], bar._model.x, bar._model.y - 10);
                            }
                        }), this)
                    }), this);
                }
            },
            tooltips: { enabled: true },
            legend: {
                display: true, position: 'bottom',
                //  reverse: true,
                labels: {
                    // boxWidth: 60,

                }
            }, scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Años'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Número de investigadores'
                    },
                    ticks: {
                        max: 800,
                        min: 0,
                        stepSize: 200
                    }
                }]
            }
        };
        $scope.colors = ["#08AFBF", "#3A70DC"];
        $scope.colors = [{
            backgroundColor: 'rgba(38,185,154,1)',
        }, {
            backgroundColor: 'rgba(3,88,106,1)',
        }];

        $scope.cambiafecha = function () {
          
            if ($scope.fechach === undefined) {
                return false;
            }
            var fehcaMininma = $rootScope.datePicker.FechaOptions.minDate;
            var fechaHoy = new Date();
            if (Date.parse($scope.fechach)) {

                if ($scope.fechach > fechaHoy) {
                    toastr.warning("La fecha no debe se mayor a la actual.", '', { timeOut: 10000 });
                    $scope.fechach = new Date();
                } else
                    if (fehcaMininma > $scope.fechach) {
                        $scope.fechach = new Date();
                    } else {
                        FechaCHService.fechainventariochset($scope.fechach);
                        $state.reload();
                    }
            } else {
                //Not a valid date
            }
        };

        $scope.consultarplantilla = function () {
            //alert("consulta");
           
            var fechamin = new Date("01/01/2006");
            var fechaactual = new Date();
            //ValidarFecha
            if ($scope.fechach > fechaactual || $scope.fechach < fechamin) {
                toastr.warning("La fecha debe estar comprendida dentro del 01/01/2006 al " + fechaactual.toLocaleDateString("es-ES"), '', { timeOut: 10000 });
                return false;
            }
            $scope.parametrosconsulta.fecha = $scope.fechach;
            $scope.promedios = [];
            InventarioRH.consultarplantilla($scope.parametrosconsulta).then(
                function (result) {
                    $scope.datosgrafica = result.data;
                    var inv = $scope.datosgrafica.datos[0];
                    var posg = $scope.datosgrafica.datos[1];
                    for (var i = 0; i < $scope.datosgrafica.datos[0].length; i++) {
                        $scope.promedios.push((parseInt(posg[i]) * 100) / parseInt(inv[i]));
                    }
                });

        };

        $scope.exportpdf = function () {
            var canvas = document.getElementById("myChart");
            var img = canvas.toDataURL("image/png");

            var imageHeader = logoINEELrepot_;
            var doc = new jsPDF('l', 'pt');


            var width = doc.internal.pageSize.width - (doc.internal.pageSize.width * 0.05);
            var height = doc.internal.pageSize.height - (doc.internal.pageSize.width * 0.20);

            var totalPagesExp = "{total_pages_count_string}";
            var footer = function (data) {
                var str = "Página " + data.pageCount;
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    str = str + " de " + totalPagesExp;
                }
                doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
            };
            var header = function (data) {
                doc.setFontSize(20);
                doc.setTextColor(40);
                doc.setFontStyle('normal');
                //doc.addImage(imageHeader, 'JPGE', data.settings.margin.left, 40, 150, 31);
                doc.addImage(imageHeader, 'PNG', data.settings.margin.left - 8, 20, 150, 77);
                doc.text('Evoluci\u00F3n de la plantilla del personal de investigaci\u00F3n', data.settings.margin.left + 170, 60);

                doc.setFontSize(10);
                doc.text("", 620, 60);

                doc.setFontSize(12);
                doc.text("", data.settings.margin.left, 90);
                doc.text('Información a la fecha: ' + ($scope.fechach.getDate()) + "/" + ($scope.fechach.getMonth() + 1) + "/" + $scope.fechach.getFullYear(), data.settings.margin.left + 500, 90);
                doc.setFontSize(8);
                //doc.text('*** Director de División / ** Gerente de Unidad / @ Asistente Administrativo', data.settings.margin.left, 100);
            };
            var options = {
                beforePageContent: header,
                afterPageContent: footer,
                margin: { top: 130 },
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: {
                    fontSize: 8, halign: 'center', valign: 'middle',
                    textColor: 255, fillColor: [115, 135, 156], rowHeight: 23, fontStyle: 'bold'
                },
                bodyStyles: { fontSize: 6, valign: 'middle', halign: 'center' },
                columnStyles: {
                    0: { halign: 'left', columnWidth: 50 }
                }
            };

            doc.setFontSize(12);
            //doc.setFontType("bold");
            //doc.text('Evoluci\u00F3n de la plantilla', 40, 40);
            //doc.text('Información a la fecha: ' + ($scope.fechach.getDate()) + "/" + ($scope.fechach.getMonth() + 1) + "/" + $scope.fechach.getFullYear(), 210, 40);
            doc.addImage(img, 'JPGE', 10, 250, width, height-110);
            var res = doc.autoTableHtmlToJson(document.getElementById("datosgrafica"));
            doc.autoTable(res.columns, res.data, options);
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }
            doc.save('evolucionplantilla.pdf');
        };

        $scope.consultarplantilla();
    }

})();