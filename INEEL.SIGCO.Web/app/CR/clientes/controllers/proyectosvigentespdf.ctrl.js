(function() {
    "use strict";

    angular
        .module("ineelDESCARGAS")
        .controller("proyectosvigentesPDFCtrl", [
            "$scope",
            "MenuService",
            "$window",
            "$timeout",
            proyectosvigentesPDFCtrl
        ]);

    function proyectosvigentesPDFCtrl($scope, MenuService, $window,$timeout) {

        $scope.proyectos = {};

        $scope.proyectos = MenuService.getVariable("proyectosvigentes");

        if ($scope.proyectos == null) {
            alert("No se encontro información de proyectos vigentes.");
            $window.close();
        }

        var generarPDF = function() {
            var doc = new jsPDF('l', 'pt');

            var totalPagesExp = "{total_pages_count_string}";
            var footer = function(data) {
                var str = "Página " + data.pageCount;
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    str = str + " de " + totalPagesExp;
                }
                doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
            };


            var options = {
                afterPageContent: footer,
                margin: { top: 50 },
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { fontSize: 10, halign: 'center', valign: 'middle' },
                bodyStyles: { fontSize: 9, valign: 'middle', halign: 'left' }
            };

            doc.setFontSize(12);
            doc.text("Consulta de Proyectos vigentes ", 40, 40);
            var res = doc.autoTableHtmlToJson(document.getElementById("proyectosvigentes"));
            doc.autoTable(res.columns, res.data, options);
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }

            doc.save("ProyectosVigentes.pdf");
            MenuService.deleteVariable("proyectosvigentes");
            $timeout(function(){$window.close();}, 250);
        };  

        if($scope.proyectos !== null)
        $timeout(generarPDF, 250);

    }


})();