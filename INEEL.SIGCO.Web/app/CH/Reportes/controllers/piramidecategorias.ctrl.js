(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("piramidecategoriasCtrl", [
            "AuthService",
            "$scope",
            'InventarioRH',
            'FechaCHService',
            piramidecategoriasCtrl]);
    function piramidecategoriasCtrl(AuthService, $scope, InventarioRH, FechaCHService) {
        // $scope.fechach = new Date();
        $scope.fechach = FechaCHService.fechainventariochget();
        var ok = new Date(FechaCHService.fechainventariochget()).toLocaleDateString("en-US");
        ok = ok.split('/').join('-');
        ///Variables graficas
        var ctx = document.getElementById("myChart");
        var ctx2 = document.getElementById("myChart2");
        /////
        InventarioRH.piramide(ok).then(
            function (result) {
                $scope.result = result.data;
                var data = {
                    labels: $scope.result.investigadoresnivel,
                    datasets: [{
                        label: "Investigadores",
                        backgroundColor: ['rgba(26, 187, 156, 1)', 'rgba(26, 187, 156, 1)', 'rgba(26, 187, 156, 1)', 'rgba(26, 187, 156, 1)', 'rgba(26, 187, 156, 1)', 'rgba(26, 187, 156, 1)', 'rgba(26, 187, 156, 1)', 'rgba(26, 187, 156, 1)', 'rgba(26, 187, 156, 1)', 'rgba(26, 187, 156, 1)', 'rgba(26, 187, 156, 1)', 'rgba(26, 187, 156, 1)', 'rgba(26, 187, 156, 1)', 'rgba(26, 187, 156, 1)'],
                        data: $scope.result.investigadorescount,
                    }]
                };
                var data2 = {
                    labels: $scope.result.extralevel, datasets:
                    [{
                        label: "Mando Medios", backgroundColor: ['rgba(26, 187, 156, 1)', 'rgba(26, 187, 156, 1)'],
                        data: $scope.result.extracount
                    }]
                };
                $scope.myBarChart = new Chart(ctx, {
                    type: 'bar',
                    data: data,
                    options: {
                        animation: { onComplete: function () { var chartInstance = this.chart; var ctx = this.chart.ctx; ctx.font = this.font; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) { var meta = chartInstance.controller.getDatasetMeta(i); ctx.fillStyle = '#000000'; Chart.helpers.each(meta.data.forEach(function (bar, index) { if (!meta.hidden) { ctx.fillText(dataset.data[index], bar._model.x, bar._model.y - 10); } }), this) }), this); } },
                        tooltips: { enabled: true },
                        legend: { display: true, position: 'bottom' },
                        scales: {
                            xAxes: [{
                                scaleLabel: { display: true, labelString: 'Categorías', }, ticks: { maxRotation: 90, minRotation: 90 },
                            }], yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Número de investigadores'
                                }, ticks: { max: 100, min: 0, stepSize: 20 }
                            }]
                        },
                    }
                });
                $scope.myBarChart2 = new Chart(ctx2, { type: 'bar', data: data2, options: { animation: { onComplete: function () { var chartInstance = this.chart; var ctx = this.chart.ctx; ctx.font = this.font; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) { var meta = chartInstance.controller.getDatasetMeta(i); ctx.fillStyle = '#000000'; Chart.helpers.each(meta.data.forEach(function (bar, index) { if (!meta.hidden) { ctx.fillText(dataset.data[index], bar._model.x, bar._model.y - 10); } }), this) }), this); } }, tooltips: { enabled: true }, legend: { display: true, position: 'bottom' }, scales: { xAxes: [{ scaleLabel: { display: true, labelString: 'Categorías', } }], yAxes: [{ scaleLabel: { display: true, labelString: 'Número de Mando Medios' }, ticks: { max: 25, min: 0, stepSize: 5 } }] }, } });
                /////////Hasta aqui
            });

        $scope.cambiafecha = function () {
            if ($scope.fechach === undefined) {
                return false;
            }
            $scope.myBarChart.destroy();
            $scope.myBarChart2.destroy();

            var fecha = new Date($scope.fechach).toLocaleDateString("en-US");
            var fechaaux = new Date($scope.fechach);
            var auxfecha = new Date("01/01/2006");
            var fechaHoy = new Date();
            //ValidarFecha
           
            if (fechaaux > fechaHoy || fechaaux < auxfecha) {
                toastr.error("La fecha debe estar comprendida dentro del 01/01/2006 al " + fechaHoy.toLocaleDateString("es-ES"), '', { timeOut: 10000 });
                $scope.error = true;
                return false;
            } else {
                $scope.error = false;
            }
            FechaCHService.fechainventariochset($scope.fechach);
            ////////////////
            fecha = fecha.split('/').join('-');
            InventarioRH.piramide(fecha).then(
                function (result) {
                    $scope.result = result.data;
                    var data = { labels: $scope.result.investigadoresnivel, datasets: [{ label: "Investigadores", backgroundColor: ['#1ABB9C', '#1ABB9C', '#1ABB9C', '#1ABB9C', '#1ABB9C', '#1ABB9C', '#1ABB9C', '#1ABB9C', '#1ABB9C', '#1ABB9C', '#1ABB9C', '#1ABB9C', '#1ABB9C', '#1ABB9C'], data: $scope.result.investigadorescount, }] };
                    var data2 = { labels: $scope.result.extralevel, datasets: [{ label: "Mando Medios", backgroundColor: ['#1ABB9C', '#1ABB9C'], data: $scope.result.extracount }] };
                    $scope.myBarChart = new Chart(ctx, { type: 'bar', data: data, options: { animation: { onComplete: function () { var chartInstance = this.chart; var ctx = this.chart.ctx; ctx.font = this.font; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) { var meta = chartInstance.controller.getDatasetMeta(i); ctx.fillStyle = '#000000'; Chart.helpers.each(meta.data.forEach(function (bar, index) { if (!meta.hidden) { ctx.fillText(dataset.data[index], bar._model.x, bar._model.y - 10); } }), this) }), this); } }, tooltips: { enabled: true }, legend: { display: true, position: 'bottom' }, scales: { xAxes: [{ scaleLabel: { display: true, labelString: 'Categorías', }, ticks: { maxRotation: 90, minRotation: 90 }, }], yAxes: [{ scaleLabel: { display: true, labelString: 'Número de investigadores' }, ticks: { max: 100, min: 0, stepSize: 20 } }] }, } });
                    $scope.myBarChart2 = new Chart(ctx2, { type: 'bar', data: data2, options: { animation: { onComplete: function () { var chartInstance = this.chart; var ctx = this.chart.ctx; ctx.font = this.font; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) { var meta = chartInstance.controller.getDatasetMeta(i); ctx.fillStyle = '#000000'; Chart.helpers.each(meta.data.forEach(function (bar, index) { if (!meta.hidden) { ctx.fillText(dataset.data[index], bar._model.x, bar._model.y - 10); } }), this) }), this); } }, tooltips: { enabled: true }, legend: { display: true, position: 'bottom' }, scales: { xAxes: [{ scaleLabel: { display: true, labelString: 'Categorías', } }], yAxes: [{ scaleLabel: { display: true, labelString: 'Número de Mando Medios' }, ticks: { max: 25, min: 0, stepSize: 5 } }] }, } });
                    /////////Hasta aqui
                });
        };

        $scope.exportGrafica = function () {
            var fecha = new Date($scope.fechach).toLocaleDateString("es-ES");
            var canvas = document.getElementById("myChart");
            var img = canvas.toDataURL("image/png");
            var canvas2 = document.getElementById("myChart2");
            var img2 = canvas2.toDataURL("image/png");
            var doc = new jsPDF('l', 'mm');

            var width = doc.internal.pageSize.width - (doc.internal.pageSize.width * 0.20);
            var width1 = doc.internal.pageSize.width - (doc.internal.pageSize.width * 0.10);
            var height = doc.internal.pageSize.height - (doc.internal.pageSize.width * 0.20);


            //var doc = new jsPDF('p', 'pt');
            var imageHeader = logoINEELrepot_;
            //doc.addImage(imageHeader, 'JPGE', 10, 10, 60, 10);
            doc.addImage(imageHeader, 'JPGE', 10, 9, 60, 31);

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text('PIR\u00C1MIDE DE CATEGOR\u00CDAS DEL PERSONAL DE INVESTIGACI\u00D3N', 120, 20);

            doc.setFontSize(8);
            doc.setFontType("bold");
            doc.text('Informaci\u00F3n al ' + fecha, 220, 30);

            var res = doc.autoTableHtmlToJson(document.getElementById("table1"));
            doc.autoTable(res.columns, res.data, {
                startY: 35,
                styles: { cellPadding: 2, overflow: 'linebreak', halign: 'center' },
                headerStyles: { rowHeight: 5, fontSize: 7 },
                bodyStyles: { rowHeight: 6, fontSize: 8, valign: 'top', halign: 'left' },
                margin: { left: 10 },
                columnStyles: {
                    0: { columnWidth: 22 },
                    1: { columnWidth: 18, halign: 'center' },
                    2: { columnWidth: 18, halign: 'center' },
                    3: { columnWidth: 18, halign: 'center' },
                    4: { columnWidth: 18, halign: 'center' },
                    5: { columnWidth: 18, halign: 'center' },
                    6: { columnWidth: 18, halign: 'center' },
                    7: { columnWidth: 18, halign: 'center' },
                    8: { columnWidth: 18, halign: 'center' },
                    9: { columnWidth: 18, halign: 'center' },
                    10: { columnWidth: 18, halign: 'center' },
                    11: { columnWidth: 18, halign: 'center' },
                    12: { columnWidth: 18, halign: 'center' },
                    13: { columnWidth: 18, halign: 'center' },
                    14: { columnWidth: 18, halign: 'center' },
                }
            });
            doc.addImage(img, 'JPGE', 10, 60,  width1, height);
            doc.addPage();



            var imageHeader = logoINEELrepot_;
            //doc.addImage(imageHeader, 'JPGE', 10, 10, 60, 10);
            doc.addImage(imageHeader, 'JPGE', 10, 9, 60, 31);

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text('PIR\u00C1MIDE DE CATEGOR\u00CDAS', 120, 20);

            doc.setFontSize(8);
            doc.setFontType("bold");
            doc.text('Informaci\u00F3n al ' + fecha, 220, 30);

            var res2 = doc.autoTableHtmlToJson(document.getElementById("table2"));
            doc.autoTable(res2.columns, res2.data, {
                startY: 40,
                styles: { cellPadding: 2, overflow: 'linebreak', halign: 'center' },
                headerStyles: { rowHeight: 8, fontSize: 10 },
                bodyStyles: { rowHeight: 6, fontSize: 10, valign: 'top', halign: 'left' },
                margin: { left: 10 },
                columnStyles: {
                    0: { columnWidth: 30 },
                    1: { columnWidth: 30, halign: 'center' },
                    2: { columnWidth: 30, halign: 'center' }
                }
            });

            doc.addImage(img2, 'JPGE', 10, 60, width, height);

            doc.save('PiramideCategorias.pdf');
        };
    }

})();