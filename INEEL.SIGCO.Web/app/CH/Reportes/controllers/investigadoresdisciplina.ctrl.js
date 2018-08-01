(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("investigadoresdisciplinaCtrl", [
            "AuthService",
            "$scope",
            'InventarioRH',
            'FechaCHService',
            investigadoresdisciplinaCtrl]);
    function investigadoresdisciplinaCtrl(AuthService, $scope, InventarioRH, FechaCHService) {
        // $scope.fechach = new Date();
        $scope.fechach = FechaCHService.fechainventariochget();
        console.log($scope.fechach);
        var ok = $scope.fechach.toLocaleDateString("en-US");
        ok = ok.split('/').join('-');
        InventarioRH.investigadoresdisciplina(ok).then(
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
            InventarioRH.investigadoresdisciplina(fecha).then(
                function (result) {
                    $scope.resultados = result.data;
                });
        };

        $scope.exportGrafica = function () {
            var fecha = new Date($scope.fechach).toLocaleDateString("es-ES");

            var doc = new jsPDF('p', 'pt');
            //var doc = new jsPDF('l', 'mm');
            
            var imageHeader = logoINEELrepot_;
            //doc.addImage(imageHeader, 'JPGE', 50, 40, 150, 31);
            doc.addImage(imageHeader, 'JPGE', 50, 20, 150, 77);
            

            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text('Distribución de investigadores por disciplina', 230, 60);
            doc.setFontSize(8);
            doc.setFontType("bold");
            doc.text('Informaci\u00F3n al ' + fecha, 380, 80);

            var res = doc.autoTableHtmlToJson(document.getElementById("obj"));
            var width = doc.internal.pageSize.width;


            doc.autoTable(res.columns, res.data, {
                startY: 100,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8, halign: 'center' },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top' },
                columnStyles: {
                    0: { columnWidth: (width /2)},
                    1: { columnWidth: ((width / 2) - 80), halign: 'center' },
                }
            });

            doc.save('DistribuciónInvestigadoresDisciplina.pdf');
        };
    }

})();