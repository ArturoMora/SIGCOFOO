(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("EmpresaAddCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "globalGet",
            "uploadFileACH",
            "TiposOrganizacionCRService",
            "EmpresasCRService",
            "PaisesService",
            "MenuService",
            "comunService",
            EmpresaAddCtrl
        ]);

    function EmpresaAddCtrl(AuthService, $scope, $state, globalGet, uploadFileACH, TiposOrganizacionCRService, EmpresasCRService, PaisesService, MenuService, comunService) {
        var paisId = 0;
        var estadoId = 0;
        var paisIdRS = 0;
        var estadoIdRS = 0;

        var API = globalGet.get("api");
        $scope.empresa = {};
        $scope.contactoempresa = MenuService.getVariable('contactoempresa');
        $scope.rolid = MenuService.getRolId();

        if ($scope.contactoempresa) {
            $scope.contacto = MenuService.getVariable("contacto");
            MenuService.setVariable('contactoempresa', false);
        }

        PaisesService.getPaises().then(
            function (result) {
                $scope.paises = result.data;
            },
            function (err) {
                toastr.error(err);
            });

        PaisesService.getPaises().then(
            function (result) {
                $scope.paisesR = result.data;
            },
            function (err) {
                toastr.error(err);
            });

        TiposOrganizacionCRService.getTiposOrganizacionByTrue().then(
            function (result) {
                $scope.tiposOrganizaciones = result.data;
            },
            function (err) {
                toastr.error(err);
            });

        $scope.cargaEstado = function () {
            if ($scope.empresa.paisId == null || $scope.empresa.paisId == 'undefined') {
                $scope.empresa.estado = '';
                $scope.empresa.municipio = '';
                $scope.empresa.localidad = '';
                $scope.estados = [];
                $scope.municipios = [];
            }
            else {
                if ($scope.empresa.paisId == 16) {
                    PaisesService.getEstado($scope.empresa.paisId).then(
                        function (result) {
                            $scope.empresa.munipio = '';
                            $scope.empresa.localidad = '';
                            $scope.empresa.edo = '';
                            $scope.estados = result.data;
                        },
                        function (err) {
                            toastr.error(err);
                        });
                } else {
                    $scope.estados = [];
                }
            }
        }

        $scope.cargaMunicipio = function () {
            if ($scope.empresa.estadoId != null) {
                PaisesService.getMunicipio($scope.empresa.estadoId).then(
                    function (result) {
                        $scope.municipios = result.data;
                    },
                    function (err) {
                        toastr.error(err);
                    });
            }
            else {
                $scope.municipios = [];
            }
        }

        $scope.cargaEstadoRS = function () {
            if ($scope.empresa.paisIdRS == null || $scope.empresa.paisIdRS == 'undefined') {
                $scope.empresa.estadoR = '';
                $scope.empresa.localidadRS = '';
                $scope.empresa.municipioR = '';
                $scope.estadosR = [];
                $scope.municipios = [];
            }
            else {
                if ($scope.empresa.paisIdRS == 16) {
                    PaisesService.getEstado($scope.empresa.paisIdRS).then(
                        function (result) {
                            $scope.empresa.munipioR = '';
                            $scope.empresa.localidadRS = '';
                            $scope.empresa.edoR = '';
                            $scope.estadosR = result.data;
                        },
                        function (err) {
                            toastr.error(err);
                        });
                } else {
                    $scope.estadosR = [];
                }
            }
        }

        $scope.cargaMunicipioRS = function () {
            if ($scope.empresa.estadoIdRS != null) {
                PaisesService.getMunicipio($scope.empresa.estadoIdRS).then(
                    function (result) {
                        $scope.municipiosR = result.data;
                    },
                    function (err) {
                        toastr.error(err);
                    });
            }
            else {
                $scope.municipios = [];
            }
        }

        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "png;jpg;jpeg;img", /* pdf;doc;docx;ppt */
                type: '*', /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            uploadFileACH.upload(propiedades,
                function (err, result) {
                    if (!err) {
                        if (!result.error) {
                            transferComplete(result);

                        } else {
                            toastr.error(result.message);
                            $("#filesGral").filestyle('clear');
                        }
                    } else {
                        $("#filesGral").filestyle('clear');
                        var error = err.message || "Error al adjuntar";
                        toastr.error(error);
                    }
                });
        };
        function transferComplete(result) {
            console.log("aqui");
            console.log(result);
            $scope.$apply(function () {
                if (result.error === false) {
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.empresa.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CR"
                    }
                }
            });
        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////     

        $scope.estadoEmpresa = function () {

            $scope.estadoEmpresas =
                [
                    { nombre: '-   Selecciona estado de la empresa   -', value: '' },
                    { nombre: 'En revisi\u00f3n', value: 'En revisi\u00f3n' },
                    { nombre: 'Revisado', value: 'Revisado' },
                    { nombre: 'Cancelado', value: 'Cancelado' }
                ];
            if ($scope.rolid !== 15) {
                $scope.empresa = { estadoEmpresa: $scope.estadoEmpresas[1].value };
            } else {
                $scope.empresa = { estadoEmpresa: $scope.estadoEmpresas[0].value };
            }

        }

        $scope.estadoEmpresa();

        $scope.AddEmpresa = function () {

            if ($scope.empresaAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                //var registro = { "dato": $scope.empresa.nombreEmpresa.replace(/ /g, "").replace(/\n/g, ""), "origen": "Empresa" };
                //comunService.ValidacionExistCR(registro)
                //    .then(function (result) {
                        //$scope.existente = result.data;
                        //if ($scope.existente == true) {
                        //    toastr.warning("El registro ya existe");
                        //    return false;
                        //} else {
                            $scope.empresa.nombreEmpresa = $scope.empresa.nombreEmpresa.replace(/\n/g, "");
                            $scope.empresa.autor = AuthService.authentication.nombreCompleto;
                            $scope.empresa.fecharegistro = new Date(),
                                $scope.empresa.estado = 1;
                            $scope.desactivar = true;

                            EmpresasCRService.createEmpres($scope.empresa).then(
                                function (result) {
                                    toastr.success("Registro creado correctamente");
                                    if ($scope.contactoempresa) {
                                        $scope.contacto.empresa = result.data
                                        $scope.contacto.empresaId = result.data.empresaId;
                                    }
                                    $scope.validaruta();
                                },
                                function (err) {
                                    toastr.error(err.data.exceptionMessage);
                                    console.error(err);
                                    $scope.desactivar = false;
                                });

                        //}
                    //});
            }
        };

        $scope.validaruta = function () {
            if (!$scope.contactoempresa) {
                $state.go("empresasGet");
            } else {
                MenuService.setVariable("contacto", $scope.contacto);
                $state.go("contactoAdd");
            }
        }
    }
})();
