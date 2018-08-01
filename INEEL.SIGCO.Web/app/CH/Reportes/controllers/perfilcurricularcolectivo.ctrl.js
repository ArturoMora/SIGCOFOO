(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("perfilcurricularcolectivoCtrl", [
            "AuthService",
            "$scope",
            'InventarioRH',
            'FechaCHService', '$filter',
            perfilcurricularcolectivoCtrl]);
    function perfilcurricularcolectivoCtrl(AuthService, $scope, InventarioRH, FechaCHService, $filter) {
        // $scope.fechach = new Date();
        var fechaActual = new Date();

        var _minDate = new Date("01/01/2006");
        var _maxDate = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() - 1);
        $scope.datePicker = { FechaOptions: { minDate: _minDate, maxDate: _maxDate } };

        //$scope.fechach = FechaCHService.fechainventariochget();
        $scope.fechach = new Date();
        var ok = new Date(FechaCHService.fechainventariochget()).toLocaleDateString("en-US");
        ok = ok.split('/').join('-');

        $scope.expProf = {};
        $scope.edades = {};
        function setValuesExpProf() {
            var labels = ['[0,10] años', '(10,20] años', '(20,30] años', '(30,40] años', 'más de 40 años'];
            var datos = [{
                value: $scope.resultados.masde40Experiencia,
                name: 'más de 40 años'
            }, {
                value: $scope.resultados.de30A40AniosExperiencia,
                name: '(30,40] años'
            }, {
                value: $scope.resultados.de20A30AniosExperiencia,
                name: '(20,30] años'
            }, {
                value: $scope.resultados.de10A20AniosExperiencia,
                name: '(10,20] años'
            }, {
                value: $scope.resultados.menorde10AniosExperiencia,
                name: '[0,10] años'
            }];

           
            $scope.expProf.labels = labels;
            $scope.expProf.datos = datos;
        }
        function setValuesEdades() {
            var datosEdad = [{
                value: $scope.resultados.edadmasde50,
                name: 'más de 50 años'
            }, {
                value: $scope.resultados.edad41A50,
                name: '(40,50] años'
            }, {
                value: $scope.resultados.edad31A40,
                name: '(30,40] años'
            }, {
                value: $scope.resultados.edad21A30,
                name: '(20,30] años'
            }];
            var labelsEdad = ['más de 50 años', '(40,50] años', '(30,40] años', '(20,30] años'];
            $scope.edades.datos = datosEdad;
            $scope.edades.labels = labelsEdad;
        }

        InventarioRH.informacionPerfilCurricular(ok).then(
            function (result) {
                $scope.resultados = result.data;
                setValuesExpProf(); //seteo de valores para la gráfica
                setValuesEdades();
                
            },
            function (error) { }
        );

        $scope.cambiafecha = function () {
            if ($scope.fechach === undefined) {
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
            ////////////////
            fecha = fecha.split('/').join('-');
            InventarioRH.informacionPerfilCurricular(fecha).then(
                function (result) {
                    $scope.resultados = result.data;
                    setValuesExpProf();
                    setValuesEdades();
                }, function (error) { });
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
            doc.text('PERFIL CURRICULAR COLECTIVO', 230, 60);
            doc.setFontSize(8);
            doc.setFontType("bold");
            doc.text('Informaci\u00F3n al ' + fecha, 400, 80);


            var res = doc.autoTableHtmlToJson(document.getElementById("tablaPadre"));
            doc.autoTable(res.columns, res.data, {
                theme: 'plain',
                startY: 90,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: { rowHeight: 12, fontSize: 10 },
                bodyStyles: { rowHeight: 12, fontSize: 10, valign: 'top', halign: 'left' },
                margin: { left: 210 },
                columnStyles: {
                    0: { columnWidth: 30 }
                }
            });

            var div1 = document.getElementById("nv1");
            var div1C = div1.childNodes[0].childNodes[0].childNodes[0];;
            div1C.setAttribute("id", "Div1");

            var canvas1 = document.getElementById("Div1");
            var img1 = canvas1.toDataURL("image/png",0.8);
            doc.addImage(img1, 'JPG', 60, 170, 230, 200);




            var div2 = document.getElementById("nv2");
            var div2C = div2.childNodes[0].childNodes[0].childNodes[0];;
            div2C.setAttribute("id", "Div2");

            var canvas2 = document.getElementById("Div2");
            var img2 = canvas2.toDataURL("image/png");
            doc.addImage(img2, 'JPG', 330, 170, 230, 200);

            //var res = doc.autoTableHtmlToJson(document.getElementById("hijo1-1"));
            //doc.autoTable(res.columns, res.data, {
            //    theme: 'plain',
            //    startY: doc.autoTableEndPosY() + 50,
            //    styles: { cellPadding: 2, overflow: 'linebreak' },
            //    headerStyles: {
            //        rowHeight: 12, fontSize: 10,
            //        textColor: 255, fillColor: [115, 135, 156], fontStyle: 'bold'
            //    },
            //    bodyStyles: { rowHeight: 12, fontSize: 10, valign: 'top', halign: 'left' },
            //    columnStyles: {
            //        0: { columnWidth: 130 },
            //        1: { columnWidth: 30 }
            //    }
            //});
            //var res = doc.autoTableHtmlToJson(document.getElementById("hijo1-2"));
            //doc.autoTable(res.columns, res.data, {
            //    theme: 'plain',
            //    startY: 205,
            //    styles: { cellPadding: 2, overflow: 'linebreak' },
            //    headerStyles: {
            //        rowHeight: 12, fontSize: 10,
            //        textColor: 255, fillColor: [115, 135, 156], fontStyle: 'bold'
            //    },
            //    bodyStyles: { rowHeight: 12, fontSize: 10, valign: 'top', halign: 'left' },
            //    margin: { left: 400 },
            //    columnStyles: {
            //        0: { columnWidth: 130 },
            //        1: { columnWidth: 30 }
            //    }
            //});
            var res = doc.autoTableHtmlToJson(document.getElementById("hijo2-1"));
            doc.autoTable(res.columns, res.data, {
                theme: 'striped',
                startY: doc.autoTableEndPosY() + 270,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: {
                    rowHeight: 12, fontSize: 10,
                    textColor: 255, fillColor: [115, 135, 156], fontStyle: 'bold'
                },
                bodyStyles: { rowHeight: 12, fontSize: 10, valign: 'top', halign: 'left' },
                columnStyles: {
                    0: { columnWidth: 130 },
                    1: { columnWidth: 30 }
                }
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("hijo2-2"));
            doc.autoTable(res.columns, res.data, {
                theme: 'striped',
                startY: 408,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: {
                    rowHeight: 12, fontSize: 10,
                    textColor: 255, fillColor: [115, 135, 156], fontStyle: 'bold'
                },
                bodyStyles: { rowHeight: 12, fontSize: 10, valign: 'top', halign: 'left' },
                margin: { left: 210 },
                columnStyles: {
                    0: { columnWidth: 140 },
                    1: { columnWidth: 30 }
                }
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("hijo2-3"));
            doc.autoTable(res.columns, res.data, {
                theme: 'striped',
                startY: 408,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: {
                    rowHeight: 12, fontSize: 10,
                    textColor: 255, fillColor: [115, 135, 156], fontStyle: 'bold'
                },
                bodyStyles: { rowHeight: 12, fontSize: 10, valign: 'top', halign: 'left' },
                margin: { left: 400 },
                columnStyles: {
                    0: { columnWidth: 130 },
                    1: { columnWidth: 30 }
                }
            });
            var res = doc.autoTableHtmlToJson(document.getElementById("hijo3-1"));
            doc.autoTable(res.columns, res.data, {
                theme: 'striped',
                startY: doc.autoTableEndPosY() + 90,
                styles: { cellPadding: 2, overflow: 'linebreak' },
                headerStyles: {
                    rowHeight: 16, fontSize: 10,
                    textColor: 255, fillColor: [115, 135, 156], fontStyle: 'bold'
                },
                bodyStyles: { rowHeight: 20, fontSize: 10, valign: 'top', halign: 'left' },
                columnStyles: {
                    0: { columnWidth: 5 },
                    1: { columnWidth: 100 },
                    2: { columnWidth: 50, halign: 'center' },
                    3: { columnWidth: 80, halign: 'center' },
                    4: { columnWidth: 35 },
                    5: { columnWidth: 35 },
                    6: { columnWidth: 100, halign: 'center' },
                    7: { columnWidth: 120, halign: 'center' }
                }
            });
           
            var fechaDoc = '' + $filter('date')($scope.fechach, 'yyyy-MM-dd');

                      
            doc.save('perfilcurricularcolectivo' + fechaDoc + '.pdf');
        };
    }

})();