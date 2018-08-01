(function () {
    "use strict";
    angular
        .module("ineelGI")
        .controller("solicitudFIEditar", ['AuthService', '$scope', 'productoInnovadorService', "$stateParams", "globalGet", "$rootScope", "adjuntarArchivo", "$state", solicitudFIEditar]);

    function solicitudFIEditar(AuthService, $scope, productoInnovadorService, $stateParams, globalGet, $rootScope, adjuntarArchivo, $state) {
        productoInnovadorService.GetInPeriodoReplicaByActivo().then(
            function (result) {
                $scope.repechaje = result.data;
                if ($scope.repechaje != true) {
                    toastr.error("No hay periodo disponible");
                    $state.go("productoInnovador");
                }
            },
            function (error) {
                toastr.error(error);
            });



        window.scrollTo(0, 0)
        var id = $rootScope.getGlobalID();
        $scope.registro = {};
        var API = globalGet.get("api");
        $scope.rg = {};
        $scope.rg.productoId = id;
        $scope.rg.productoGISolicitudArchivosInnovacion = [];
        $scope.rg.productoGISolicitudArchivosSuperior = [];
        $scope.rg.productoGISolicitudArchivosFase = [];
        $scope.productoGISolicitudArchivosInnovacionEliminados = [];
        $scope.productoGISolicitudArchivosSuperiorEliminados = [];
        $scope.productoGISolicitudArchivosFaseEliminados = [];
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
        debugger;
        productoInnovadorService.getbyid(id).then(
            function (result) {
                $scope.registro = result.data;
            },
            function (error) {
                toastr.error(error);
            });

        productoInnovadorService.getSolicitudById(id).then(
            function (result) {
                $scope.rg = result.data;
                $scope.rg.afirmo = true;
            },
            function (error) {
                toastr.error(error);
            });

        $scope.getFileDetails = function (adjunto) {
            debugger;
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
                    $(":file").filestyle('clear');
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }
        //alert("jajaj");
        $scope.getFileDetails2 = function (adjunto) {
            debugger;
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
                    $(":file").filestyle('clear');
                },
                function (error) {
                    $(":file").filestyle('clear');
                }
            );
        }

        $scope.eliminaradjunto1 = function (registro) {
            debugger;
            var aux = registro;
            if (aux.adjuntoId != undefined) {
                aux.adjunto.nombre = "eliminar";
                $scope.productoGISolicitudArchivosInnovacionEliminados.push(aux)
            }
            var idx = ($scope.rg.productoGISolicitudArchivosInnovacion.indexOf(registro));
            $scope.rg.productoGISolicitudArchivosInnovacion.splice(idx, 1);
        };

        $scope.eliminaradjunto2 = function (registro) {
            var aux = registro;
            if (aux.adjuntoId != undefined) {
                aux.adjunto.nombre = "eliminar";
                $scope.productoGISolicitudArchivosSuperiorEliminados.push(aux)
            }
            var idx = ($scope.rg.productoGISolicitudArchivosSuperior.indexOf(registro));
            $scope.rg.productoGISolicitudArchivosSuperior.splice(idx, 1);
        };
        $scope.eliminaradjunto3 = function (registro) {
            debugger;
            var aux = registro;
            if (aux.adjuntoId != undefined) {
                aux.adjunto.nombre = "eliminar";
                $scope.productoGISolicitudArchivosFaseEliminados.push(aux)
            }
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

            for (var a1 = 0; a1 < $scope.productoGISolicitudArchivosInnovacionEliminados.length; a1++) {
                $scope.rg.productoGISolicitudArchivosInnovacion.push($scope.productoGISolicitudArchivosInnovacionEliminados[a1]);
            }
            for (var a1 = 0; a1 < $scope.productoGISolicitudArchivosSuperiorEliminados.length; a1++) {
                $scope.rg.productoGISolicitudArchivosSuperior.push($scope.productoGISolicitudArchivosSuperiorEliminados[a1]);
            }
            for (var a1 = 0; a1 < $scope.productoGISolicitudArchivosFaseEliminados.length; a1++) {
                $scope.rg.productoGISolicitudArchivosFase.push($scope.productoGISolicitudArchivosFaseEliminados[a1]);
            }
            debugger;
            productoInnovadorService.addFI($scope.rg).then(
                   function (result) {
                       toastr.success(result.data);
                       $state.go("productoInnovador");
                   },
                   function (err) {
                       console.error(err);
                       $scope.desabilitar = false;
                   });
        }
    }
})();