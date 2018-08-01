(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory('ExportJsPDF', ['$http', '$q', 'localStorageService', 'globalGet', ExportJsPDF]);

    function ExportJsPDF($http, $q, localStorageService, globalGet) {
        var API = globalGet.get("api");

        var service = {};

        function footer(doc, total) {
            var size = doc.internal.getFontSize();
            doc.setFontSize(10);
            doc.text(180, 285, doc.page + ' de ' + total);
            doc.setFontSize(size);
            doc.page++;
        };
        function splitAndSave(filename, img, HtmltoPdfPageHeight, defered) {
            //https://rawgit.com/MrRio/jsPDF/master/docs/jsPDF.html para generar pdfs 
            var doc;
            doc = new jsPDF();

            var croppingYPosition = 0;

            
            HtmltoPdfPageHeight = Math.ceil(doc.internal.pageSize.height * 3.77 * 1.5559);
            
            if (HtmltoPdfPageHeight > img.height) {
                HtmltoPdfPageHeight = img.height;
            }
           
           
            var count = Math.ceil((img.height) / HtmltoPdfPageHeight);
          
           
            doc.page = 1;
            for (var i = 1; i <= count; i++) {
                
                if (i == 1)
                    croppingYPosition = 0;
                else
                    doc.addPage();


                var sourceX = 0;
                var sourceY = croppingYPosition;
                debugger;
                var croppingImageHeight = (img.height - (HtmltoPdfPageHeight * (i - 1))) > HtmltoPdfPageHeight ? HtmltoPdfPageHeight : (img.height - (HtmltoPdfPageHeight * (i - 1)));
               
                var destX = 0;
                var destY = 0;
                var croppedCanvas = document.createElement('canvas'); //Canvas using to resize main canvas
                croppedCanvas.setAttribute('height', croppingImageHeight);
               
                croppedCanvas.setAttribute('width', img.width);
                var ctx = croppedCanvas.getContext("2d");
                ctx.drawImage(img, sourceX,                                //drawImage(img, startX, startY, originalW, originalH, destX, destY, destW, destH);
                    sourceY,
                    img.width,
                    HtmltoPdfPageHeight,
                    destX,
                    destY,
                    img.width,
                    HtmltoPdfPageHeight);
                var imageToAddatPdf = new Image(); //Final image exporting in pdf page
                imageToAddatPdf = Canvas2Image.convertToJPEG(croppedCanvas);
                doc.addImage(imageToAddatPdf.src, 'JPEG', 10, 10, 185, 0);
                croppingYPosition += HtmltoPdfPageHeight;
                footer(doc, count);
            }

            doc.save(filename + '.pdf');
            defered.resolve("Archivo generado OK");
        }
        var _toPDF = function (divID, filename, pdfHeight) {
            debugger;
            var defered = $q.defer();
            var promise = defered.promise;  
            try {
                
                var doc;                
                var HtmltoPdfPageHeight;
               
                if (pdfHeight > 0) {
                    HtmltoPdfPageHeight = pdfHeight;
                } else {
                    HtmltoPdfPageHeight = 1200;
                }


                document.getElementById(divID).style.backgroundColor = "#FAF8F8";
                debugger;
                var node = document.getElementById(divID);
               
                debugger;
                var img = new Image();
                debugger;
                //https://github.com/tsayen/dom-to-image para generar imagenes a partir de elementos htmls
                if (navigator.msSaveBlob) { //nena de IE
                    
                    html2canvas(node, {
                        onrendered: function (canvas) {
                            var img = new Image();
                            debugger;
                            img.src = canvas.toDataURL("image/jpeg;base64;");
                            img.onload = function () {
                                debugger;
                                splitAndSave(filename, img, HtmltoPdfPageHeight, defered);
                            }
                        }
                    });
                }
                else { // otro navegador
                    debugger;
                domtoimage.toPng(node, { bgcolor: "#FAF8F8", quality: 1.0 })
                    .then(function (imgData) {
                        debugger;
                        img.src = imgData;
                            img.onload = function () {
                                debugger;
                                splitAndSave(filename, img, HtmltoPdfPageHeight, defered);
                            }
                        
                    })          
                    .catch(function (error) {
                        defered.reject(error);
                        console.log(error);
                        });
                }
            } catch (error) { defered.reject(error); }; 
            return promise;
        };

        service.toPDF = _toPDF;

        return service;

    }

})();