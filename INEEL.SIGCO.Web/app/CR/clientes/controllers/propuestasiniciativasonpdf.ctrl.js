(function () {
    "use strict";

    angular
        .module("ineelDESCARGAS")
        .controller("propuestasiniciativasonPDFCtrl", [
            "$scope",
            "MenuService",
            "$window",
            "$timeout",
            propuestasiniciativasonPDFCtrl
        ]);

    function propuestasiniciativasonPDFCtrl($scope, MenuService, $window, $timeout) {
        $scope.propuestas = MenuService.getVariable("propuestas");
        $scope.iniciativas = MenuService.getVariable("iniciativas");
        $scope.oportunidades = MenuService.getVariable("oportunidades");

        if ($scope.propuestas === null && $scope.iniciativas === null && $scope.oportunidades === null) {
            alert("No se encontro información");
            $window.close();
        }
        var generarPDFPropuestas = function () {
            var doc = new jsPDF('l', 'pt');

            var totalPagesExp = "{total_pages_count_string}";
            var footer = function (data) {
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
                headerStyles: { fontSize: 10, halign: 'left', valign: 'middle' },
                bodyStyles: { fontSize: 9, valign: 'middle', halign: 'left' },
                columnStyles: {
                    2: { halign: 'right' }
                }
            };

            doc.setFontSize(12);
            doc.text("Consulta de propuestas", 40, 40);
            var res = doc.autoTableHtmlToJson(document.getElementById("propuestas"));
            doc.autoTable(res.columns, res.data, options);
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }

            doc.save("Propuestas.pdf");
            MenuService.deleteVariable("propuestas");
            $timeout(function () { $window.close(); }, 250);
        };

        var generarPDFIniciativas = function () {
            var doc = new jsPDF('l', 'pt');

            var totalPagesExp = "{total_pages_count_string}";
            var footer = function (data) {
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
                headerStyles: { fontSize: 10, halign: 'left', valign: 'middle' },
                bodyStyles: { fontSize: 9, valign: 'middle', halign: 'left' },
                columnStyles: {
                    3: { halign: 'right' }
                }
            };

            doc.setFontSize(12);
            doc.text("Consulta de Iniciativas", 40, 40);
            var res = doc.autoTableHtmlToJson(document.getElementById("iniciativas"));
            doc.autoTable(res.columns, res.data, options);
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }

            doc.save("Iniciativas.pdf");
            MenuService.deleteVariable("iniciativas");
            $timeout(function () { $window.close(); }, 250);
        };

        var generarPDFON = function () {
            var doc = new jsPDF('l', 'pt');

            var totalPagesExp = "{total_pages_count_string}";
            var footer = function (data) {
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
                headerStyles: { fontSize: 10, halign: 'left', valign: 'middle' },
                bodyStyles: { fontSize: 9, valign: 'middle', halign: 'left' }
            };

            doc.setFontSize(12);
            doc.text("Consulta de Oportunidades de Negocio", 40, 40);
            var res = doc.autoTableHtmlToJson(document.getElementById("oportunidades"));
            doc.autoTable(res.columns, res.data, options);
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }

            doc.save("Oportunidades.pdf");
            MenuService.deleteVariable("oportunidades");
            $timeout(function () { $window.close(); }, 250);
        };

        if ($scope.propuestas !== null)
            $timeout(generarPDFPropuestas, 250);

        if ($scope.iniciativas !== null)
            $timeout(generarPDFIniciativas, 250);

        if ($scope.oportunidades !== null)
            $timeout(generarPDFON, 250);
    }


})();