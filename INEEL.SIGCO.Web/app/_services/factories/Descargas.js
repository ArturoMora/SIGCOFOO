(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory('DescargasService', ['$http', '$q', 'globalGet', '$crypto', DescargasService]);

    function DescargasService($http, $q, globalGet, $crypto) {
        var API = globalGet.get("api");
        
        var service = {};
        var _getDatos = function (idFile) {
            var solicitud = API + "/Descarga/GetDatos/" + idFile;
            return $http.post(solicitud, idFile).then(
                function (response) {
                    return response;
                });
        }
        var _GetDatosCursos = function (idFile) {
            var solicitud = API + "/Descarga/GetDatosCursos/" + idFile;
            return $http.post(solicitud, idFile).then(
                function (response) {
                    return response;
                });
        }
        
        service.getDatos = _getDatos;
        service.GetDatosCursos = _GetDatosCursos;
        var _downloadControllerAction = function (controllerAction, idFile, fileName) {
            // Use an arraybuffer
            var q = $q.defer();
            var solicitud = API + controllerAction + idFile;
            console.log(solicitud);
            $http({
                method: 'POST',
                url: solicitud,
                params: { id: idFile },
                responseType: 'arraybuffer'
            })
                .success(function (data, status, headers) {
                                        
                    debugger;
                    //service.getDatos(idFile).then(
                    //    function (result) {
                            console.log("getDatos ok ");
                            //console.log(result);
                            var octetStreamMime = 'application/octet-stream';
                            var success = false;
                            // Get the headers
                            headers = headers();
                            // Get the filename from the x-filename header or default to "download.bin"
                            var filename = headers['x-filename'] || fileName || 'descarga.PDF';
                            // Determine the content type from the header or default to "application/octet-stream"
                            var contentType = headers['content-type'] || octetStreamMime;

                            filename = filename;
                            contentType = contentType;

                            try {
                                // Try using msSaveBlob if supported
                                console.log("Trying saveBlob method ...");
                                var blob = new Blob([data], { type: contentType });
                                if (navigator.msSaveBlob)
                                    navigator.msSaveBlob(blob, filename);
                                else {
                                    // Try using other saveBlob implementations, if available
                                    var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
                                    if (saveBlob === undefined) throw "Not supported";
                                    saveBlob(blob, filename);
                                }
                                console.log("saveBlob succeeded");
                                success = true;
                            } catch (ex) {
                                console.log("saveBlob method failed with the following exception:");
                                console.log(ex);
                            }

                            if (!success) {
                                // Get the blob url creator
                                var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                                if (urlCreator) {
                                    // Try to use a download link
                                    var link = document.createElement('a');
                                    if ('download' in link) {
                                        // Try to simulate a click
                                        try {
                                            // Prepare a blob URL
                                            console.log("Trying download link method with simulated click ...");
                                            var blob = new Blob([data], { type: contentType });
                                            var url = urlCreator.createObjectURL(blob);
                                            link.setAttribute('href', url);

                                            // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                                            link.setAttribute("download", filename);

                                            // Simulate clicking the download link
                                            var event = document.createEvent('MouseEvents');
                                            event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                                            link.dispatchEvent(event);
                                            console.log("Download link method with simulated click succeeded");
                                            success = true;

                                        } catch (ex) {
                                            console.log("Download link method with simulated click failed with the following exception:");
                                            console.log(ex);
                                        }
                                    }

                                    if (!success) {
                                        // Fallback to window.location method
                                        try {
                                            // Prepare a blob URL
                                            // Use application/octet-stream when using window.location to force download
                                            console.log("Trying download link method with window.location ...");
                                            var blob = new Blob([data], { type: octetStreamMime });
                                            var url = urlCreator.createObjectURL(blob);
                                            window.location = url;
                                            console.log("Download link method with window.location succeeded");
                                            success = true;
                                        } catch (ex) {
                                            console.log("Download link method with window.location failed with the following exception:");
                                            console.log(ex);
                                        }
                                    }

                                }
                            }

                            if (!success) {
                                // Fallback to window.open method
                                console.log("No methods worked for saving the arraybuffer, using last resort window.open");
                                window.open(httpPath, '_blank', '');
                            }
                            q.resolve(data);
                        //},
                        //function (error) {
                        //    console.log("getDatos error: ");
                        //    console.log(error);
                        //    q.reject(error);
                        //}

                    //);

                })
                .error(function (data, status) {
                    console.log(data);
                    console.log("Request failed with status: " + status);
                    q.reject(status);
                    // Optionally write the error out to scope
                    // $scope.errorDetails = "Request failed with status: " + status;
                });
            return q.promise;
        };
        var _download = function (path, idFile) {
            // Use an arraybuffer
            var q = $q.defer();
            var solicitud = API + path + idFile;
            console.log(solicitud);
            $http({
                method: 'POST',
                url: solicitud,
                params: { id: idFile },
                responseType: 'arraybuffer'
            })
            .success(function (data, status, headers) {
                service.getDatos(idFile).then(
                    function (result) {
                        console.log("getDatos ok ");
                        //console.log(result);
                        var octetStreamMime = 'application/octet-stream';
                        var success = false;
                        // Get the headers
                        headers = headers();
                        // Get the filename from the x-filename header or default to "download.bin"
                        var filename = headers['x-filename'] || 'download.bin';
                        // Determine the content type from the header or default to "application/octet-stream"
                        var contentType = headers['content-type'] || octetStreamMime;

                        filename = result.data.nombre;
                        contentType = result.data.mime;

                        try {
                            // Try using msSaveBlob if supported
                            console.log("Trying saveBlob method ...");
                            var blob = new Blob([data], { type: contentType });
                            if (navigator.msSaveBlob)
                                navigator.msSaveBlob(blob, filename);
                            else {
                                // Try using other saveBlob implementations, if available
                                var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
                                if (saveBlob === undefined) throw "Not supported";
                                saveBlob(blob, filename);
                            }
                            console.log("saveBlob succeeded");
                            success = true;
                        } catch (ex) {
                            console.log("saveBlob method failed with the following exception:");
                            console.log(ex);
                        }

                        if (!success) {
                            // Get the blob url creator
                            var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                            if (urlCreator) {
                                // Try to use a download link
                                var link = document.createElement('a');
                                if ('download' in link) {
                                    // Try to simulate a click
                                    try {
                                        // Prepare a blob URL
                                        console.log("Trying download link method with simulated click ...");
                                        var blob = new Blob([data], { type: contentType });
                                        var url = urlCreator.createObjectURL(blob);
                                        link.setAttribute('href', url);

                                        // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                                        link.setAttribute("download", filename);

                                        // Simulate clicking the download link
                                        var event = document.createEvent('MouseEvents');
                                        event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                                        link.dispatchEvent(event);
                                        console.log("Download link method with simulated click succeeded");
                                        success = true;

                                    } catch (ex) {
                                        console.log("Download link method with simulated click failed with the following exception:");
                                        console.log(ex);
                                    }
                                }

                                if (!success) {
                                    // Fallback to window.location method
                                    try {
                                        // Prepare a blob URL
                                        // Use application/octet-stream when using window.location to force download
                                        console.log("Trying download link method with window.location ...");
                                        var blob = new Blob([data], { type: octetStreamMime });
                                        var url = urlCreator.createObjectURL(blob);
                                        window.location = url;
                                        console.log("Download link method with window.location succeeded");
                                        success = true;
                                    } catch (ex) {
                                        console.log("Download link method with window.location failed with the following exception:");
                                        console.log(ex);
                                    }
                                }

                            }
                        }

                        if (!success) {
                            // Fallback to window.open method
                            console.log("No methods worked for saving the arraybuffer, using last resort window.open");
                            window.open(httpPath, '_blank', '');
                        }
                        q.resolve(data);
                    },
                    function (error) {
                        console.log("getDatos error: ");
                        console.log(error);
                        q.reject(error);
                    }

                    );

            })
            .error(function (data, status) {
                console.log(data);
                console.log("Request failed with status: " + status);
                q.reject(status);
                // Optionally write the error out to scope
               // $scope.errorDetails = "Request failed with status: " + status;
            });
            return q.promise;
        };
        var _downloadCurso = function (path, idFile) {
            // Use an arraybuffer
            var q = $q.defer();
            var solicitud = API + path + idFile;
            console.log(solicitud);
            $http({
                method: 'POST',
                url: solicitud,
                params: { id: idFile },
                responseType: 'arraybuffer'
            })
            .success(function (data, status, headers) {
                service.GetDatosCursos(idFile).then(
                    function (result) {
                        var octetStreamMime = 'application/octet-stream';
                        var success = false;
                        // Get the headers
                        headers = headers();
                        // Get the filename from the x-filename header or default to "download.bin"
                        var filename = headers['x-filename'] || 'download.bin';
                        // Determine the content type from the header or default to "application/octet-stream"
                        var contentType = headers['content-type'] || octetStreamMime;

                        filename = result.data.nombre;
                        contentType = result.data.mime;

                        try {
                            // Try using msSaveBlob if supported
                            console.log("Trying saveBlob method ...");
                            var blob = new Blob([data], { type: contentType });
                            if (navigator.msSaveBlob)
                                navigator.msSaveBlob(blob, filename);
                            else {
                                // Try using other saveBlob implementations, if available
                                var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
                                if (saveBlob === undefined) throw "Not supported";
                                saveBlob(blob, filename);
                            }
                            console.log("saveBlob succeeded");
                            success = true;
                        } catch (ex) {
                            console.log("saveBlob method failed with the following exception:");
                            console.log(ex);
                        }

                        if (!success) {
                            // Get the blob url creator
                            var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                            if (urlCreator) {
                                // Try to use a download link
                                var link = document.createElement('a');
                                if ('download' in link) {
                                    // Try to simulate a click
                                    try {
                                        // Prepare a blob URL
                                        console.log("Trying download link method with simulated click ...");
                                        var blob = new Blob([data], { type: contentType });
                                        var url = urlCreator.createObjectURL(blob);
                                        link.setAttribute('href', url);

                                        // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                                        link.setAttribute("download", filename);

                                        // Simulate clicking the download link
                                        var event = document.createEvent('MouseEvents');
                                        event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                                        link.dispatchEvent(event);
                                        console.log("Download link method with simulated click succeeded");
                                        success = true;

                                    } catch (ex) {
                                        console.log("Download link method with simulated click failed with the following exception:");
                                        console.log(ex);
                                    }
                                }

                                if (!success) {
                                    // Fallback to window.location method
                                    try {
                                        // Prepare a blob URL
                                        // Use application/octet-stream when using window.location to force download
                                        console.log("Trying download link method with window.location ...");
                                        var blob = new Blob([data], { type: octetStreamMime });
                                        var url = urlCreator.createObjectURL(blob);
                                        window.location = url;
                                        console.log("Download link method with window.location succeeded");
                                        success = true;
                                    } catch (ex) {
                                        console.log("Download link method with window.location failed with the following exception:");
                                        console.log(ex);
                                    }
                                }

                            }
                        }

                        if (!success) {
                            // Fallback to window.open method
                            console.log("No methods worked for saving the arraybuffer, using last resort window.open");
                            window.open(httpPath, '_blank', '');
                        }
                        q.resolve("ok");
                    },
                    function (error) {
                        console.error(error);
                        q.reject(error);
                    }

                    );

            })
            .error(function (data, status) {
                console.log(data);
                console.log("Request failed with status: " + status);
                q.reject(status);
                // Optionally write the error out to scope
                // $scope.errorDetails = "Request failed with status: " + status;
            });
            return q.promise;
        };

        var _encriptar = function (id) {

            var cadena = '' + id;
            var encrypted = $crypto.encrypt(cadena, "SIGCO3");  //$crypto.getCryptoKey()

            return encrypted;
        }
        var _desencriptar = function (id) {

            var cadena = '' + id;
         
            var desencriptar = $crypto.decrypt(cadena, "SIGCO3");
            return desencriptar;
        
        }

        var _downloadFile = function (id) {
            return _download("/Descarga/GetFile/", _desencriptar(id))
        }
        var _downloadFileCurso = function (id) {
            return _downloadCurso("/Descarga/GetFileCurso/", _desencriptar(id))
        }
        var _downloadGenericPDF = function (ControllerAction, id, fileName) {
            return _downloadControllerAction(ControllerAction, _desencriptar(id), fileName)
        }

        service.downloadFile = _downloadFile;
        service.downloadFileCurso = _downloadFileCurso;
        service.encriptar = _encriptar;
        service.desencriptar = _desencriptar;
        service.downloadGenericPDF = _downloadGenericPDF;
        
        
        return service;

    }




})();