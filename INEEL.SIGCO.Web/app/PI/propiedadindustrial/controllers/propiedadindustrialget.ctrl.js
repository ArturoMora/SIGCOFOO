(function () {
    'use strict';
    angular
        .module("ineelPI")
        .controller('propiedadindustrialgetCtrl', [
            '$scope'
            , '$state'
            , 'MenuService'
            , 'PropiedadIndustrialService'
            , 'DTOptionsBuilder'
            , 'CatalogosPIService'
            , propiedadindustrialgetCtrl]);

    function propiedadindustrialgetCtrl($scope, $state, MenuService, PropiedadIndustrialService, DTOptionsBuilder, CatalogosPIService) {
        $scope.pis = [];
        $scope.rolid = MenuService.getRolId();
        $scope.grafica = {};
        $scope.busqueda = false;
        $scope.paramsDT = {};
        $scope.limpia = false;

        CatalogosPIService.gettipospinactivos().then(
            function (result) {
                $scope.tipos = result.data;
            }, function (error) {
                toastr.error(error.data.message);
            });

        CatalogosPIService.getestadosdelprocesoactivos().then(
            function (result) {
                $scope.estados = result.data;
            }, function (error) {
                toastr.error(error.data.message);
            });

        $scope.buscar = function () {
            $scope.busqueda = false;
            $scope.datos2 = {};
            if (($scope.pi.fechaInicioComparacion != null || $scope.pi.fechaInicioComparacion != undefined) &&  //en caso de que la fecha de inicio este definida pero no la final
               ($scope.pi.fechaFinalComparacion == null || $scope.pi.fechaFinalComparacion == undefined)) {

                $scope.pi.fechaFinalComparacion = new Date();
                $scope.pi.busquedaFecha="ok";
            }
            if (($scope.pi.fechaFinalComparacion != null || $scope.pi.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.pi.fechaInicioComparacion == null || $scope.pi.fechaInicioComparacion == undefined)) {

                $scope.pi.fechaInicioComparacion = new Date(1975, 10, 25);
                $scope.pi.busquedaFecha="ok";
            }
            if (($scope.pi.fechaFinalComparacion != null || $scope.pi.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.pi.fechaInicioComparacion != null || $scope.pi.fechaInicioComparacion != undefined)) {

                $scope.pi.busquedaFecha="ok";
            }
            if (($scope.pi.fechaInicioComparacion != null && $scope.pi.fechaFinalComparacion != null) && $scope.pi.fechaInicioComparacion > $scope.pi.fechaFinalComparacion) {
                toastr.error("Favor de introducir un rango válido de fechas");
                return false;
            }

            PropiedadIndustrialService.getpireporte($scope.pi)
                .then(function (result) {
                    $scope.busqueda = true;
                    $scope.datos2 = result.data;
                }, function (err) {
                    toastr.error("Error al cargar los datos de propiedad industrial");
                    console.log(err);
                });


        }

        $scope.pi = MenuService.getVariable('busquedaPI');
        if ($scope.pi == null) {
            $scope.pi = {};
            $scope.paramsDT.displayStart = 0; //reiniciamos el parametro de filtrado en DT
        } else {

            $scope.paramsDT = JSON.parse(localStorage.getItem('tablePropiedadIndustrialConsulta' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }

            $scope.buscar();
            MenuService.deleteVariable('busquedaPI');
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart)
            .withButtons([
                {
                    extend: 'excelHtml5',
                    text: '<i class="fa fa-download"></i> Descargar Excel',
                    className: 'btn btn-success',
                    title: 'ResultadosBusquedaPI',
                    exportOptions: { //define que columnas exportar de la tabla
                        columns: [0, 1, 2, 3, 4, 5, 6]
                    }
                }])
            .withDOM('lftr<"default"pB>i');


        function stateSaveCallback(settings, data) {
            var stado = $('#tablePropiedadIndustrialConsulta').DataTable().state();
            localStorage.setItem('tablePropiedadIndustrialConsulta' + window.location.pathname, JSON.stringify(stado))
        }

        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null && $scope.limpia) {
                $scope.paramsDT = {};
                $scope.paramsDT.displayStart = 0;
                $scope.limpia = false;
                return $scope.paramsDT;
            }
            if ($scope.paramsDT != null) {
                // console.log($('#tablePropiedadIndustrialConsulta').DataTable().state());
                return $scope.paramsDT;
            } else {
                // console.log($('#tablePropiedadIndustrialConsulta').DataTable().state());
                return JSON.parse(localStorage.getItem('tablePropiedadIndustrialConsulta' + window.location.pathname))
            }

        }

        $scope.detalleRegistro = function (id) {
            MenuService.setVariable('busquedaPI', $scope.pi);
            $state.go('propiedadindustrialdetalle', { id: id });
        }

        $scope.editarRegistro = function (id) {
            MenuService.setVariable('busquedaPI', $scope.pi);
            $state.go('propiedadindustrialeditar', { id: id });
        }

        $scope.historialRegistro = function (id) {
            MenuService.setVariable('busquedaPI', $scope.pi);
            $state.go('historialpin', { id: id });
        }


        PropiedadIndustrialService.getdatosgrafica().then(
            function (response) {
                $scope.datos = response.data;
                setValuesForGraph();

            },
            function (error) {
                toastr.error(error.message);
            }
        );

        function setValuesForGraph() {
            var labels = [];
            var datos = [];
            var datosvigentes = [];
            var legend = [];


            legend.push('Trámite');
            legend.push('Vigente');

            angular.forEach($scope.datos.tramite, function (value, key) {
                labels.push(value.etiqueta);
                datos.push(value.cantidad);
            });
            angular.forEach($scope.datos.vigente, function (value, key) {

                datosvigentes.push(value.cantidad);
            });
            $scope.grafica.legend = legend;
            $scope.grafica.etiquetas = labels;
            $scope.grafica.series = [{
                name: 'Trámite',
                type: 'bar',
                data: datos
            }, {
                name: 'Vigente',
                type: 'bar',
                data: datosvigentes
            }];


            generagrafica();

        }


        $scope.reset = function () {
            $scope.busqueda = false;
            $scope.pi = {};
            $scope.fechaInicioComparacion = null;
            $scope.fechaFinalComparacion = null;
            $scope.unidadOselect = null;
            $scope.limpia = true;
            //$('#tablePropiedadIndustrialConsulta').DataTable().state.clear();
            //var table = $('#tablePropiedadIndustrialConsulta').DataTable().state();
            //table.search.search = "";
            //table.start = 0;
        };

        var theme = {
            color: [
                '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
                '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
            ],

            title: {
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

            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.5)',
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

            dataZoom: {
                dataBackgroundColor: '#eee',
                fillerColor: 'rgba(64,136,41,0.2)',
                handleColor: '#408829'
            },
            grid: {
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
                            strokeColor: '#408829'
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
        }

        function generagrafica() {
            var echartBar = echarts.init(document.getElementById('graficapin'), theme);

            echartBar.setOption({
                title: {
                    text: 'Estadística'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    y: 'bottom',
                    data: $scope.grafica.legend
                },
                toolbox: {
                    show: false
                },
                calculable: false,
                xAxis: [{
                    type: 'category',
                    nameRotate: 9,
                    nameTextStyle: {
                        fontWeight: 'lighter',
                        fontSize: 6,

                    },
                    data: $scope.grafica.etiquetas
                }],
                yAxis: [{
                    type: 'value',
                    name: 'Cantidad',
                    nameLocation: 'middle'
                }],
                series: $scope.grafica.series
            });
        }



        function removeAccents(data) {
            return data
                .replace(/έ/g, 'ε')
                .replace(/[ύϋΰ]/g, 'υ')
                .replace(/ό/g, 'ο')
                .replace(/ώ/g, 'ω')
                .replace(/ά/g, 'α')
                .replace(/[ίϊΐ]/g, 'ι')
                .replace(/ή/g, 'η')
                .replace(/\n/g, ' ')
                .replace(/á/g, 'a')
                .replace(/é/g, 'e')
                .replace(/í/g, 'i')
                .replace(/ó/g, 'o')
                .replace(/ú/g, 'u')
                .replace(/ê/g, 'e')
                .replace(/î/g, 'i')
                .replace(/ô/g, 'o')
                .replace(/è/g, 'e')
                .replace(/ï/g, 'i')
                .replace(/ü/g, 'u')
                .replace(/ã/g, 'a')
                .replace(/õ/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/ì/g, 'i');
        }

        var searchType = jQuery.fn.DataTable.ext.type.search;

        searchType.string = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data) :
                    data;
        };

        searchType.html = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data.replace(/<.*?>/g, '')) :
                    data;
        };




    }
}());