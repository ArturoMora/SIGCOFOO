(function () {
    "use strict";
    angular
        .module("ineel")
        .controller('graficachCtrl', ['$scope', 'comunService', graficachCtrl]);

    function graficachCtrl($scope, comunService) {
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
                                ctx.fillText(dataset.data[index], bar._model.x, bar._model.y - 6);
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
                xAxes: [{gridLines:
                    {
                            display: false
                        },
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
                        //max: 600,
                        min: 0,
                        stepSize: 100
                    }
                }]
            }
        };
        $scope.colors = ["#F0AD4E", "#26B99A", "#03586A"];

        $scope.colors = [{
            backgroundColor:'rgba(240,173,78,1)',
        },{
            backgroundColor:'rgba(38,185,154,1)',
        },{
            backgroundColor:'rgba(3,88,106,1)',
        }];

        $scope.consultarplantilla = function () {
            comunService.consultarinvestigadoreshome().then(
                function (result) {
                    $scope.datosgrafica = result.data;
                });

        };

        $scope.consultarplantilla();
    };
} ());
