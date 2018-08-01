(function () {
    "use strict";

    angular.module("directivasSIGCO")
        .controller('echartGraphCtrl', ['$scope', '$uibModal', echartGraphCtrl])
        .directive('echartGraph', function () {
            return {
                restrict: 'ACE',
                templateUrl: 'app/vistasGenericas/directivas/echart/echart1.html',
                controller: "echartGraphCtrl",
                require: 'ngModel',
                scope: {
                    idgraph: "@idgraph",
                    titulo: "@titulo",
                    stilo: "=stilo",
                    labels: "=?labels",
                    datos: "=?datos",
                    showLabels:"@showLabels",
                    ngModel: '=',
                }
            };
        });

    function echartGraphCtrl($scope, $uibModal) {
        debugger;
        console.log('foooo');
        var theme = {
            color: [
                '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
                '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
            ],

            title: {//color del nombre del titulo de la graph
                itemGap: 8,
                textStyle: {
                    fontWeight: 'normal',
                    color: '#408829'
                }
            },

            dataRange: {
                color: ['#1f610a', '#97b58d']
            },

            toolbox: {
                color: ['#408829', '#408829', '#408829', '#408829']
            },

            tooltip: { //Fondo translucido, se muestra cuando se pasa el cursor encima del pie chart
                backgroundColor: 'rgba(0,0,0,0.5)', //colores del fondo
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#408829',
                        type: 'dashed'
                    },
                    crossStyle: {
                        color: '#408829'
                    },
                    shadowStyle: {
                        color: 'rgba(200,200,200,0.3)'
                    }
                }
            },

            dataZoom: {  //no se utiliza actualmente en la plantilla
                dataBackgroundColor: '#eee',
                fillerColor: 'rgba(64,136,41,0.2)',
                handleColor: '#408829'
            },
            grid: { //no se utiliza actualmente en la plantilla
                borderWidth: 0
            },

            categoryAxis: {
                axisLine: {
                    lineStyle: {
                        color: '#408829'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#eee']
                    }
                }
            },

            valueAxis: {
                axisLine: {
                    lineStyle: {
                        color: '#408829'
                    }
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#eee']
                    }
                }
            },
            timeline: {
                lineStyle: {
                    color: '#408829'
                },
                controlStyle: {
                    normal: { color: '#408829' },
                    emphasis: { color: '#408829' }
                }
            },

            k: {
                itemStyle: {
                    normal: {
                        color: '#68a54a',
                        color0: '#a9cba2',
                        lineStyle: {
                            width: 1,
                            color: '#408829',
                            color0: '#86b379'
                        }
                    }
                }
            },
            map: {
                itemStyle: {
                    normal: {
                        areaStyle: {
                            color: '#ddd'
                        },
                        label: {
                            textStyle: {
                                color: '#c12e34'
                            }
                        }
                    },
                    emphasis: {
                        areaStyle: {
                            color: '#99d2dd'
                        },
                        label: {
                            textStyle: {
                                color: '#c12e34'
                            }
                        }
                    }
                }
            },
            force: {
                itemStyle: {
                    normal: {
                        linkStyle: {
                            strokeColor: '#408829',
                        }
                    }
                }
            },
            chord: {
                padding: 4,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        },
                        chordStyle: {
                            lineStyle: {
                                width: 1,
                                color: 'rgba(128, 128, 128, 0.5)'
                            }
                        }
                    },
                    emphasis: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        },
                        chordStyle: {
                            lineStyle: {
                                width: 1,
                                color: 'rgba(128, 128, 128, 0.5)'
                            }
                        }
                    }
                }
            },
            gauge: {
                startAngle: 225,
                endAngle: -45,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                        width: 8
                    }
                },
                axisTick: {
                    splitNumber: 10,
                    length: 12,
                    lineStyle: {
                        color: 'auto'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: 'auto'
                    }
                },
                splitLine: {
                    length: 18,
                    lineStyle: {
                        color: 'auto'
                    }
                },
                pointer: {
                    length: '90%',
                    color: 'auto'
                },
                title: {
                    textStyle: {
                        color: '#333'
                    }
                },
                detail: {
                    textStyle: {
                        color: 'auto'
                    }
                }
            },
            textStyle: {
                fontFamily: 'Arial, Verdana, sans-serif'
            }
        };
        function loadGraphEChart(labels, datos, tit, element, mostrarLabels) {
            
            //echart Pie           
            var echartPie = echarts.init(document.getElementById(element), theme);
            debugger;
            echartPie.setOption({
                title: {
                    text: tit,
                    x: 'left'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) { //Se activa al pasar el cursor encima de cada parte del pie chart
                        console.log("params");
                        console.log(params);    
                        var result = params.seriesName + "<br/>";
                        if ((params.seriesName.length * 1.4) > params.name.length) { //formatea el texto 
                            result += "<b>" + params.name + "</b><br/><br/>";
                        }else{
                        var tokens = params.name.split(" ");
                        var dataName = "";
                        for (var i = 0; i < tokens.length; i++) {
                            dataName += tokens[i];
                            if (((i + 1) % 3) == 0) {
                                dataName += " <br/>";
                            } else {
                                dataName += " ";
                            }
                        }
                        if (dataName.endsWith('<br/>')) {
                            result += "<b>" + dataName +"</b><br/>";
                        } else {
                            result +="<b>"+ dataName + "</b><br/><br/>";
                        }
                        }
                        result += params.value + " (" + params.percent + "%)";
                        return result;
                    },
                    //formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {                    
                    y: 'bottom', ///posicion donde se mostraran los labels
                    data: labels,
                 
                },
                toolbox: { //elementos de la barra de las graficas
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: true, title: tit, lang: [tit, 'Aceptar'] },

                        magicType: {
                            show: true,
                            type: ['pie', 'funnel']                           
                        },
                        restore: {
                            show: false,
                            title: "Datos originales"
                        },
                        saveAsImage: {
                            show: false,
                            title: "Descargar"
                        }
                    }
                },
                series: [{ // caracteristicas del piechart
                    name: tit,
                    type: 'pie', //tipo de graph
                    radius: '45%', //radio de la grafica
                    center: ['45%', '48%'], //posicion dentro del elmento a anidarse
                    data: datos.sort(function (a, b) { return a.value - b.value; }),
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: mostrarLabels  //linea que enlaza la graph con el texto
                        }
                    },
                }]
            });
        }
        $scope.$watchCollection("datos", function (newValue, oldValue) {            
            if (newValue === oldValue) {
                return;
            }
            debugger;
            var mostrarLabels = true;
            if ($scope.labels != undefined)
                if ($scope.datos != undefined) {
                    if ($scope.showLabels != undefined) {
                        mostrarLabels = ("true" == String($scope.showLabels)) ? true : false;
                    }
                    loadGraphEChart($scope.labels, $scope.datos, $scope.titulo, $scope.idgraph, mostrarLabels);
                }
        });
    }

}());

