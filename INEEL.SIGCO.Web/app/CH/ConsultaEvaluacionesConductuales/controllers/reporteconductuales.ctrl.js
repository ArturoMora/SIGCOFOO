/*AYUDA:
FooEntitiesService nombre de factory en personalarea.service.js
*/

(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("reporteconductualesCtrlGet", ['$rootScope', '$scope', 'detalleevaluacionconductualService', 'evaluacionconductualService', 'globalGet', '$state', '$stateParams', reporteconductualesCtrlGet]);

    function reporteconductualesCtrlGet($rootScope, $scope, detalleevaluacionconductualService, evaluacionconductualService, globalGet, $state, $stateParams) {
        var id = $stateParams.id;

               
        if (typeof $rootScope.parametros !== 'undefined')
            if ($rootScope.parametros.periodo !== null || typeof $rootScope.parametros.periodo !== 'undefined') {
                $scope.periodo       = $rootScope.parametros.periodo;
                $scope.nombreUnidad = $rootScope.parametros.nombreunidad;
                $scope.claveUnidad = $rootScope.parametros.unidad;
                $scope.clave         = $rootScope.parametros.clave;
                $scope.nombre        = $rootScope.parametros.nombre;
                $scope.cateemp       = $rootScope.parametros.cateemp;
                $scope.catcomp       = $rootScope.parametros.catcomp;
                $scope.calificacion  = $rootScope.parametros.calificacion;
                $scope.evaluacionId  = $rootScope.parametros.evaluacionId;
                $scope.claveCateNom  = $rootScope.parametros.idcategoriacompetencia;
                $scope.categoriaem   = $rootScope.parametros.categoriaem;
                $scope.nombreFamilia = $rootScope.parametros.nombreFamilia;
               
                detalleevaluacionconductualService.getByClaveEvaluacion(id).then(
                    function (result) {
                        $scope.competenciasaevaluar = result.data;
                        $scope.loading = false;
                    },
                    function (err) {
                        toastr.error("No se han podido cargar las evaluaciones del periodo y unidad seleccionados");
                    }
                );

                evaluacionconductualService.getById(id).then(
                   function (result) {
                       $scope.datosevaluado = result.data;
                   },
                   function (err) {
                       toastr.error("No se han podido cargar la información registrada en el sistema");
                   }
                );
        }


        $rootScope.parametros = {};
        $scope.parametrosTransferencia = function () {
            $rootScope.parametros.clave = $scope.clave;
            $rootScope.parametros.nombre = $scope.nombre;
            $rootScope.parametros.cateemp = $scope.cateemp;
            $rootScope.parametros.catcomp = $scope.catcomp;
            $rootScope.parametros.calificacion = $scope.calificacion;
            $rootScope.parametros.periodo = $rootScope.parametros.periodo;
            $rootScope.parametros.unidad = $scope.claveUnidad;
            $rootScope.parametros.nombreunidad = $scope.nombreUnidad;
            $rootScope.parametros.idcategoriacompetencia = $scope.claveCateNom;
            $rootScope.parametros.nombreFamilia = $scope.nombreFamilia;
            $rootScope.parametros.evaluacionId = $scope.evaluacionId;
        }


        $scope.imprimirReporte = function () {

            var today  = new Date();
            var yyyy   = today.getFullYear();
            var mmmm   = today.getMonth();
            var dddd   = today.getDate();
            
            // var canvas = document.getElementById("myChart");
            //var img = canvas.toDataURL("image/png");
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
                headerStyles: { fontSize: 8, halign: 'center', valign: 'middle' },
                bodyStyles: { fontSize: 6, valign: 'middle', halign: 'left' },
                columnStyles: {
                    0: { halign: 'left', columnWidth: 50 }
                }
            };

            /*
            doc.setFontSize(12);
            doc.setFontType("bold");
            doc.text('Resultado de la evaluci\u00F3n', 40, 40);
            doc.text('Información a la fecha: ' + dddd + "/" + mmmm + "/" + yyyy, 210, 40);
            // doc.addImage(img, 'JPGE', 10, 150);
            var res = doc.autoTableHtmlToJson(document.getElementById("matriz"));
            doc.autoTable(res.columns, res.data, options);
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }
           
           */

            var res = doc.autoTableHtmlToJson(document.getElementById("personal"));
            doc.setFontSize(12);
            doc.text('Evaluado', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });

            var res = doc.autoTableHtmlToJson(document.getElementById("matriz"));
            doc.setFontSize(12);
            doc.text('Resultados de la evaluación', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });

            var res = doc.autoTableHtmlToJson(document.getElementById("anotaciones"));
            doc.setFontSize(12);
            doc.text('', 40, doc.autoTableEndPosY() + 30);
            doc.autoTable(res.columns, res.data, {
                startY: doc.autoTableEndPosY() + 40,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 15, fontSize: 8 },
                bodyStyles: { rowHeight: 12, fontSize: 8, valign: 'top', halign: 'left' },
            });

            doc.save('reporte.pdf');

        }
       


    }

})();