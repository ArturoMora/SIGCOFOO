(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("solicitudFIAgregar", ['AuthService', '$scope', 'productoInnovadorService', "$stateParams", "globalGet", "$rootScope", "adjuntarArchivo", "$state", solicitudFIAgregar]);

    function solicitudFIAgregar(AuthService, $scope, productoInnovadorService, $stateParams, globalGet, $rootScope, adjuntarArchivo, $state) {
        window.scrollTo(0, 0)
        var id = $rootScope.getGlobalID();
        $scope.registro = {};
        var API = globalGet.get("api");
        $scope.rg = {};
        $scope.rg.productoId = id;
        $scope.rg.productoGISolicitudArchivosInnovacion = [];
        $scope.rg.productoGISolicitudArchivosSuperior = [];
        $scope.rg.productoGISolicitudArchivosFase = [];
        $scope.rg.afirmo = false;
        //Obtener datos de usuario
        $scope.authentication = AuthService.authentication;
        //Extraer informacion del periodo//
        productoInnovadorService.getPeriodo().then(
            function (result) {
                $scope.periodo = result.data;
            },
            function (error) {
                toastr.error(error);
            });
        //obtener el registro a mostrar
        
        productoInnovadorService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (error) {
                toastr.error(error);
            });

        $scope.getFileDetails = function (adjunto) {
            
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'GI' };
                    var aux = {
                        'adjunto': Adjunto
                    };
                    if ($scope.rg.productoGISolicitudArchivosInnovacion.length > 0) {
                        for (var i = 0; i < $scope.rg.productoGISolicitudArchivosInnovacion.length; i++) {
                            if (aux.adjunto.nombre == $scope.rg.productoGISolicitudArchivosInnovacion[i].adjunto.nombre) {
                                toastr.warning("El archivo ya existe");
                                $(":file").filestyle('clear');
                                return false;
                            }
                        }
                    }
                    $scope.rg.productoGISolicitudArchivosInnovacion.push(aux);
                    $scope.ValidForm.$setDirty();
                    $(":file").filestyle('clear');
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }
        //alert("jajaj");
        $scope.getFileDetails2 = function (adjunto) {
            
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'GI' };
                    var aux = {
                        'adjunto': Adjunto
                    };
                    if ($scope.rg.productoGISolicitudArchivosSuperior.length > 0) {
                        for (var i = 0; i < $scope.rg.productoGISolicitudArchivosSuperior.length; i++) {
                            if (aux.adjunto.nombre == $scope.rg.productoGISolicitudArchivosSuperior[i].adjunto.nombre) {
                                toastr.warning("El archivo ya existe");
                                $(":file").filestyle('clear');
                                return false;
                            }
                        }
                    }
                    $scope.rg.productoGISolicitudArchivosSuperior.push(aux);
                    $scope.ValidForm.$setDirty();
                    $(":file").filestyle('clear');
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }
        $scope.getFileDetails3 = function (adjunto) {
            adjuntarArchivo.uploadOneFile(adjunto, 'pdf;doc;docx', '8').then(
                function (result) {
                    var Adjunto = { RutaCompleta: result.fullPathFile, nombre: result.nameFile, ModuloId: 'GI' };
                    var aux = {
                        'adjunto': Adjunto
                    };
                    if ($scope.rg.productoGISolicitudArchivosFase.length > 0) {
                        for (var i = 0; i < $scope.rg.productoGISolicitudArchivosFase.length; i++) {
                            if (aux.adjunto.nombre == $scope.rg.productoGISolicitudArchivosFase[i].adjunto.nombre) {
                                toastr.warning("El archivo ya existe");
                                $(":file").filestyle('clear');
                                return false;
                            }
                        }
                    }
                    $scope.rg.productoGISolicitudArchivosFase.push(aux);
                    $scope.ValidForm.$setDirty();
                    $(":file").filestyle('clear');
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }

        $scope.eliminaradjunto1 = function (registro) {
            var idx = ($scope.rg.productoGISolicitudArchivosInnovacion.indexOf(registro));
            $scope.rg.productoGISolicitudArchivosInnovacion.splice(idx, 1);
        };

        $scope.eliminaradjunto2 = function (registro) {
            var idx = ($scope.rg.productoGISolicitudArchivosSuperior.indexOf(registro));
            $scope.rg.productoGISolicitudArchivosSuperior.splice(idx, 1);
        };
        $scope.eliminaradjunto3 = function (registro) {
            var idx = ($scope.rg.productoGISolicitudArchivosFase.indexOf(registro));
            $scope.rg.productoGISolicitudArchivosFase.splice(idx, 1);
        };


        $scope.agregar = function () {
            if ($scope.rg.productoGISolicitudArchivosInnovacion.length < 1) {
                toastr.error("Ingrese al menos una evidencia de innovación");
                return false;
            }
            if ($scope.rg.productoGISolicitudArchivosSuperior.length < 1) {
                toastr.error("Ingrese al menos una evidencia de desarrollo superior");
                return false;
            }
            if ($scope.rg.productoGISolicitudArchivosFase.length < 1) {
                toastr.error("Ingrese al menos una evidencia de fase de desarrollo");
                return false;
            }

            productoInnovadorService.addFI($scope.rg).then(
                   function (result) {
                       toastr.success(result.data);
                       $scope.registro.Movimiento = "Se envía la solicitud de FIN al comité";
                       productoInnovadorService.RegistrarMovimientoProducto($scope.registro).then();
                       $state.go("productoInnovador");
                   },
                   function (err) {
                       console.error(err);
                       $scope.desabilitar = false;
                   });
        }
    }
})();