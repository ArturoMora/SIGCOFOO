
(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("organigramaCtrl", ['$scope', '$http', 'InventarioRH', 'FechaCHService', organigramaCtrl])
        .directive('orgChart', orgChart);

    function organigramaCtrl($scope, $http, InventarioRH, FechaCHService) {
        //$scope.fechach = FechaCHService.fechainventariochget();
        $scope.fechach = new Date();
        $scope.unidadOrganizacional = {};

        $scope.cambiafecha = function () {
            FechaCHService.fechainventariochset($scope.fechach);
        };

        $scope.reset = function () {
            
            $scope.fechach = new Date();
            $scope.consultarorganigrama();
        };


        $scope.exporttoPDF = function () {
            html2canvas(document.getElementById("organigrama"), {
                onrendered: function (canvas) {
                    var img = canvas.toDataURL("image/png");
                    var doc = new jsPDF('l', 'pt');
                    doc.addImage(img, 'JPGE', 10, 30);
                    doc.save('organigrama.pdf');
                }
            });

            

        };
        

        $scope.consultarorganigrama = function () {
            //here http get method for get data from database
           
            var fechaactual = new Date();
            if ($scope.fechach > fechaactual) {
                toastr.warning("La fecha no debe ser mayor a la de hoy.", "fecha",  { timeOut: 10000 });
                return false;
            }
             $scope.unidadOrganizacional.fechaEfectiva = $scope.fechach;
            InventarioRH.getorganigrama($scope.unidadOrganizacional).then(function (response) {
                if (typeof response.data !== 'undefined' && response.data !== null) {
                    $scope.unidadesorganizacionales = response.data;
                }

                //Referencia para hacer la graph, https://developers.google.com/chart/interactive/docs/gallery/orgchart
                var newobject = [['Name', 'ReportsTo', 'tooltip']];
                angular.forEach(response.data, function (val) {
                    
                     var tipoO = '';
                     tipoO = val.tipoO == 2 ? 'division': tipoO;
                     tipoO = val.tipoO == 3 ? 'gerencia': tipoO;
                     var nombreResponsable = val.responsable.nombreCompleto;

                     if (val.responsable.estado == 0) {
                         nombreResponsable = "";
                     }
                     

                    newobject.push(
                        [
                            {
                                v: val.claveUnidad.toString(),
                                f: '<div class="customBox ' + tipoO + '"><div><a href="/indexCH.html#/catalogoinvestigadores?u=' + val.claveUnidad + '">' + val.nombreUnidad + '</a></div><div class="title">' + nombreResponsable + '</div></div>'
                            },
                            (val.padre == null ? "" : val.padre),
                            (val.nombreUnidad + ' - ' + nombreResponsable)
                        ]
                    );

                });
                $scope.chartData = newobject;
            });
        };

        $scope.consultarorganigrama();

    }

//Referencia para hacer la graph, https://developers.google.com/chart/interactive/docs/gallery/orgchart
///No se necesita de un plugin para construir la graph, pues ya que las google charts utilizan el motor de html para crearlas y renderizarlas, son nativas
    function orgChart() {
        function link($scope, element, attrs) {
            var chart = new google.visualization.OrgChart(element[0]);
            $scope.$watch('chartData', function (value, oldvalue) {
                if (!value) {
                    return;
                }
                var data = google.visualization.arrayToDataTable(value);
                var options = {
                    allowHtml: true,
                    size: 'small',
                    color:'#F9F9F9'
                    // allowCollapse:true
                };
                chart.draw(data, options);
            })
        }
        return {
            link: link
        };
    }

})();