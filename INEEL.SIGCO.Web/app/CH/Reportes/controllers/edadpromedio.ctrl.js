(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("edadpromedioCtrl", [
            "AuthService",
            "$scope",
            'InventarioRH',
            'FechaCHService',
            edadpromedioCtrl]);
    function edadpromedioCtrl(AuthService, $scope, InventarioRH,FechaCHService) {
        // $scope.fechach = new Date();
        $scope.fechach = FechaCHService.fechainventariochget();
        var ok = new Date(FechaCHService.fechainventariochget()).toLocaleDateString("en-US");
        ok = ok.split('/').join('-');
        InventarioRH.informacion(ok).then(
            function (result) {
                $scope.resultados = result.data;
                var labels = [];
                var datas = [];
                for (var i = 0; i < $scope.resultados.length; i++) {
                    labels.push($scope.resultados[i].label + " (" + $scope.resultados[i].y + ")");
                    datas.push($scope.resultados[i].y);
                }
                var data = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Edad",
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: "#1ABB9C",
                            borderColor: "#1ABB9C",
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: "#1ABB9C",
                            pointBackgroundColor: "#fff",
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "#1ABB9C",
                            pointHoverBorderColor: "#1ABB9C",
                            pointHoverBorderWidth: 2,
                            pointRadius: 3,
                            pointHitRadius: 10,
                            data: datas,
                            spanGaps: false,
                        }
                    ]
                };
                var ctx = document.getElementById("myChart");
                $scope.myLineChart = new Chart(ctx, {
                    type: 'line',
                    data: data,
                    options: {
                        scales: {
                            xAxes: [{
                                display: true
                            }],
                            yAxes: [{
                                display: true,
                                ticks: {
                                    min: 0,
                                    stepSize: 10
                                }
                            }],
                        }
                    },

                });
            });

        $scope.cambiafecha = function () {
            if($scope.fechach === undefined){
                return false;
            }
            $scope.myLineChart.destroy();
            
            var fecha = new Date($scope.fechach).toLocaleDateString("en-US");
            var fechaaux = new Date($scope.fechach);
            var auxfecha = new Date("01/01/2006");
            var fechaHoy = new Date();
            //ValidarFecha
            debugger;
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
            InventarioRH.informacion(fecha).then(
                function (result) {
                    var labels = [];
                    var datas = [];
                    $scope.resultados = result.data;
                    for (var i = 0; i < $scope.resultados.length; i++) {
                        labels.push($scope.resultados[i].label + " (" + $scope.resultados[i].y + ")");
                        datas.push($scope.resultados[i].y);
                    }
                    var data = {
                        labels: labels,
                        datasets: [
                            {
                                label: "Edad",
                                fill: false,
                                lineTension: 0.1,
                                backgroundColor: "rgba(75,192,192,0.4)",
                                borderColor: "rgba(75,192,192,1)",
                                borderCapStyle: 'butt',
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: 'miter',
                                pointBorderColor: "rgba(75,192,192,1)",
                                pointBackgroundColor: "#fff",
                                pointBorderWidth: 1,
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                                pointHoverBorderColor: "rgba(220,220,220,1)",
                                pointHoverBorderWidth: 2,
                                pointRadius: 3,
                                pointHitRadius: 10,
                                data: datas,
                                spanGaps: false,
                            }
                        ]
                    };
                    var ctx = document.getElementById("myChart");
                    $scope.myLineChart = new Chart(ctx, {
                        type: 'line',
                        data: data,
                        options: {
                            scales: {
                                xAxes: [{
                                    display: true
                                }],
                                yAxes: [{
                                    display: true,
                                    ticks: {
                                        min: 0,
                                        stepSize: 10
                                    }
                                }],
                            }
                        },
                    });
                });

        };

        $scope.exportGrafica = function () {
            var fecha = new Date($scope.fechach).toLocaleDateString("es-ES");
            var canvas = document.getElementById("myChart");
            var img = canvas.toDataURL("image/png");


          
            var doc = new jsPDF('l', 'mm');

            var width = doc.internal.pageSize.width - (doc.internal.pageSize.width *0.20);
            var height = doc.internal.pageSize.height - (doc.internal.pageSize.width * .20);

            //var doc = new jsPDF('p', 'pt');
            var imageHeader = logoINEELrepot_;
            //doc.addImage(imageHeader, 'JPGE', 10, 10, 60, 10);
            doc.addImage(imageHeader, 'JPGE', 10, 8, 55, 28);

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text('Edad promedio del personal de investigaci\u00F3n', 80, 20);

            doc.setFontSize(8);
            doc.setFontType("bold");
            doc.text('Informaci\u00F3n al '+fecha, 160, 30);

            doc.addImage(img, 'JPG', 15, 30, width, height);
            doc.save('EdadPromedioPersonal.pdf');
        };
    }

})();