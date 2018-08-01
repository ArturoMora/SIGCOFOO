(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("investigadoresgerenciaCtrl", [
            "AuthService",
            "$scope","$state",
            'InventarioRH',
            'FechaCHService',
            investigadoresgerenciaCtrl]);
    function investigadoresgerenciaCtrl(AuthService, $scope, $state, InventarioRH,FechaCHService) {
        // $scope.fechach = new Date();
        $scope.fechach = FechaCHService.fechainventariochget();
        var ok = new Date( FechaCHService.fechainventariochget()).toLocaleDateString("en-US");
        ok = ok.split('/').join('-');
        $scope.resultadosFull= [];
        InventarioRH.investigadoresgerencia(ok).then(
            function (result) {
                $scope.resultados = result.data;
                if ($scope.resultados != null) {
                    for (var i = 0; i < $scope.resultados.length; i++) {
                        for (var g = 0; g < $scope.resultados[i].gerencias.length; g++) {
                            $scope.resultadosFull.push($scope.resultados[i].gerencias[g]);
                        }
                    }
                        
                    }
                }
            );

        $scope.cambiafecha = function () {
            if ($scope.fechach === undefined) {
                return false;
            }
            
            $scope.resultados = null;
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
            $state.reload();
            ////////////////
            fecha = fecha.split('/').join('-');
            //InventarioRH.investigadoresgerencia(fecha).then(
            //    function (result) {
            //        $scope.resultados = result.data;
            //    });
        };

        $scope.exportGrafica = function () {
            var fecha = new Date($scope.fechach).toLocaleDateString("es-ES");
            var bodyStyles = { rowHeight: 9, fontSize: 7, valign: 'top', halign: 'left' };
            var columnStyles = {
                    0: { columnWidth: 150 },
                    1: { columnWidth: 80 },
                    2: { columnWidth: 60 },
                    3: { columnWidth: 80 },
                    4: { columnWidth: 40 },
                };

            var imageHeader = logoINEELrepot_;
            generateReportPDF_("InvestigadoresGerencia",
                'Investigadores por gerencia',
                "",
                "",
                'Información al:' + fecha,
                bodyStyles, columnStyles, 'gerenciass',
                imageHeader
            );



        };
    }

})();