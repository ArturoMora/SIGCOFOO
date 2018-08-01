(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("composicionespescialidadesCtrl", [
            "AuthService",
            "$scope", "$state",
            'InventarioRH',
            'FechaCHService',
            composicionespescialidadesCtrl]);
    function composicionespescialidadesCtrl(AuthService, $scope,$state, InventarioRH, FechaCHService) {
        //$scope.fechach = new Date();
        $scope.fechach = FechaCHService.fechainventariochget();
        var ok = $scope.fechach.toLocaleDateString("en-US");
        ok = ok.split('/').join('-');
        InventarioRH.composicionespescialidades(ok).then(
            function (result) {
                $scope.resultados = result.data;
            });

        $scope.cambiafecha = function () {
            if($scope.fechach === undefined){
                return false;
            }            
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
            $state.reload();
            ////////////////
            fecha = fecha.split('/').join('-');
            InventarioRH.composicionespescialidades(fecha).then(
                function (result) {                    
                    $scope.resultados = result.data;
                });
        };

        $scope.exportGrafica = function () {
            var fecha = new Date($scope.fechach).toLocaleDateString("es-ES");

            var doc = new jsPDF('p', 'pt');
            //var doc = new jsPDF('l', 'mm');
            debugger;
            var imageHeader = logoINEELrepot_;
            doc.addImage(imageHeader, 'PNG', 50, 30, 150, 77);

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text('Composición de especialidades', 230, 60);
            doc.setFontSize(8);
            doc.setFontType("bold");
            doc.text('Informaci\u00F3n al ' + fecha, 380, 95);

            var res = doc.autoTableHtmlToJson(document.getElementById("obj"));
            doc.autoTable(res.columns, res.data, {
                startY: 100,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8, halign: 'center' },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top' },
                columnStyles: {
                    0: { columnWidth: 200 },
                    1: { columnWidth: 60, halign: 'center' },
                }
            });

            doc.save('ComposiciónEspecialidades.pdf');
        };
    }

})();