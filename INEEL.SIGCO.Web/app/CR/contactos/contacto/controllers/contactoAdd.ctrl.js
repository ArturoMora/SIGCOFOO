(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ContactoAddCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "globalGet",
            "uploadFileACH",
            "ContactosCRService",
            "PaisesService",
            "TituloPersonaCRService",
            "$uibModal",
            "MenuService",
            ContactoAddCtrl
        ]);

    function ContactoAddCtrl(AuthService, $scope, $state, globalGet, uploadFileACH,
        ContactosCRService, PaisesService, TituloPersonaCRService, $uibModal, MenuService) {
        var API = globalGet.get("api");
        $scope.contacto = MenuService.getVariable("contacto");
        if ($scope.contacto === null) {
            $scope.contacto = {};
        }
        MenuService.deleteVariable("contacto");

        $scope.regFile = true;
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });

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
                            $("#filesGral").filestyle('clear');
                            toastr.error(result.message);
                        }
                    } else {
                        $("#filesGral").filestyle('clear');
                        var error = err.message || "Error al adjuntar";
                        toastr.error(error);
                    }
                });
        };
        function transferComplete(result) {
            $scope.$apply(function () {
                if (result.error === false) {
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.contacto.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CR"
                    }
                }
            });
        }
        PaisesService.getPaises().then(
            function (result) {
                $scope.paises = result.data;
            },
            function (err) {
                toastr.error(err);
            });

        TituloPersonaCRService.getallactivos()
            .then(function (result) {
                $scope.titulos = result.data;
            }, function (err) {
                toastr.error(err);
            }
            );

        $scope.cargaEstado = function () {
            if ($scope.contacto.paisId == null || $scope.contacto.paisId == 'undefined') {
                $scope.contacto.estado = '';
                $scope.contacto.municipio = '';
                $scope.estados = [];
                $scope.municipios = [];
            }
            else {
                if ($scope.contacto.paisId == 16) {
                    PaisesService.getEstado($scope.contacto.paisId).then(
                        function (result) {
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
            if ($scope.contacto.estadoId != null) {
                PaisesService.getMunicipio($scope.contacto.estadoId).then(
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

        ContactosCRService.getEmpresasByTrue().then(
            function (result) {
                $scope.empresas = result.data;
            },
            function (err) {
                toastr.error(err);
            });

        $scope.AddContacto = function () {
            if ($scope.contactoAddForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            else {
                $scope.contacto.autor = AuthService.authentication.nombreCompleto;
                $scope.contacto.fechaRegistro = new Date();
                $scope.contacto.estado = 1;
                $scope.desactivar = true;
                ContactosCRService.create($scope.contacto).then(
                    function (result) {
                        toastr.success(result.data);
                        $scope.validaruta();
                    },
                    function (err) {
                        $scope.desactivar = false;
                        toastr.error(err);
                    });
            }
        };

        $scope.ElementoSeleccionado = {};

        $scope.openEstructuraOrg = function (idEmpresa) {
            if (idEmpresa == undefined || idEmpresa === null || idEmpresa === "") {
                toastr.error("debe seleccionar la empresa");
            } else {
                $scope.selectItem = {};
                $scope.idEmpresa = idEmpresa;
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    templateUrl: 'app/vistasGenericas/EstructuraOrganizacionalEmpresas.html',
                    controller: 'EstructuraOrganizacionalEmpresasFilterGetCtrl',
                    resolve: {
                        selectItem: function () {
                            return $scope.selectItem;
                        }
                    },
                    scope: $scope
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.ElementoSeleccionado = selectedItem;
                    if (selectedItem != null) {
                        $scope.contacto.claveUnidad = selectedItem.claveUnidad;
                    }
                });
            }
        }

        $scope.limpiar = function () {
            $scope.ElementoSeleccionado.nombreUnidad = "";
        }

        $scope.estadoContacto = function () {
            $scope.estadoContactos =
                [
                    { nombre: 'En revisión', value: 'En revisión',id: 0 },
                    { nombre: 'Revisado', value: 'Revisado', id:1 },
                    { nombre: 'Cancelado', value: 'Cancelado',id: 2 }
                ];
            $scope.contacto.estadoContacto = 'En revisión';
        }

        $scope.gotoagregarempresa = function () {
            MenuService.setVariable('contactoempresa', true);
            MenuService.setVariable("contacto", $scope.contacto);
            $state.go("empresaAdd");
        }

        $scope.recuperadatos = function () {
            $scope.contacto = MenuService.getVariable("contacto");
        }

        $scope.validaruta = function () {

            if (!$scope.expertos) {
                $state.go("contactosGet");
            } else {
                $state.go("expertosadd");
            }
        }

        $scope.estadoContacto();
        $scope.expertos = MenuService.getVariable('expertos');
        if ($scope.expertos) {
            $scope.recuperadatos();
        }
    }
})();
