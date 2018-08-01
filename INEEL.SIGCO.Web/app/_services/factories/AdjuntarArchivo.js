//dependencia: globalINEEL.js <- uploadFileACH
; (function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory('adjuntarArchivo', ['$http', '$q', 'globalGet','uploadFileACH', adjuntarArchivo]);

    function adjuntarArchivo($http, $q, globalGet, uploadFileACH) {
        var API = globalGet.get("api");
        var service = {};   
       

        var propiedades = {
            ext: "*", /* pdf;doc;docx;ppt */
            size: '8', /* cantidad entera en MB*/
        }
        var _uploadOneFile = function (adjunto, extensionesArchivo, sizeMB) {
            var defered = $q.defer();
            var promise = defered.promise;  
            try {
                var files = [];
                    if (adjunto.files.length <= 0) { return false; }
                    files.push(adjunto.files[0]);
                    
                    var propiedades = {
                        file: adjunto.files[0],
                        ext: extensionesArchivo || "*",
                        type: Date.now(), /* */
                        size: sizeMB  || 8, /* cantidad entera en MB*/
                        api: API + "FileUploadMT/UploadFiles/"
                    }
                    //pueden utilizar la misma API para los diferentes modulos: API + "FileUploadMT/UploadFiles/"
                    uploadFileACH.upload(propiedades,
                        function (err, result) {
                            
                            if (!err) {
                                if (!result.error) {
                                    defered.resolve(result);

                                } else {
                                    toastr.error(result.message);
                                    defered.reject(err);
                                }
                            } else {
                                var error = err.message || "Error al adjuntar";
                                toastr.error(error);
                                defered.reject(error);
                            }
                            
                        });

            }
            catch (error) { defered.reject(error); }; 
            return promise;
        };
        service.uploadOneFile = _uploadOneFile;
        
        return service;

    }

})();