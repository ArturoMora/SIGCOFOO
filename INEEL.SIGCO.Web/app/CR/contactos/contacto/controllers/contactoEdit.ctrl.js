(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ContactoEditCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$stateParams",
            "globalGet",
            "uploadFileACH",
            "ContactosCRService",
            "PaisesService",
            "TituloPersonaCRService",
            "$uibModal",
            "MenuService",
            ContactoEditCtrl
        ]);

    function ContactoEditCtrl(AuthService, $scope, $state, $stateParams, globalGet, uploadFileACH, ContactosCRService, PaisesService, TituloPersonaCRService, $uibModal, MenuService) {
        $scope.tab = 1;
        $scope.active1 = "active";
        $scope.active2 = "";
        $scope.active3 = "";
        var paisId = 0;
        var estadoId = 0;

        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });

        var API = globalGet.get("api");
        $scope.contacto = {};
        $scope.regFile = true;

        $scope.newTAB = function () {
            $scope.active1 = "";
            $scope.active2 = "";
            $scope.active3 = "";

            switch ($scope.tab) {
                case 1:
                    $scope.active1 = "active";
                    break;
                case 2:
                    $scope.active2 = "active";
                    break;
                case 3:
                    $scope.active3 = "active";
                    break;
                default:
            }
        }

        $scope.contacto_id = $stateParams.id;
        if($scope.contacto_id == null || $scope.contacto_id== undefined){
            toastr.error("Contacto no existente");
            $rootScope.globalRegresar();
            return false;
        }

        ContactosCRService.getEmpresasByTrue().then(
            function (result) {
                $scope.empresas = result.data;
            },
            function (err) {
                toastr.error(err);
            });

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

        ContactosCRService.getContacto($scope.contacto_id).then(
            function (result) {
                $scope.contacto = result.data;
                paisId = $scope.contacto.paisId;
                estadoId = $scope.contacto.estadoId;

                $scope.ngFile = true;

                if (paisId != null) {
                    PaisesService.getEstado(paisId).then(
                        function (result) {
                            $scope.estados = result.data;
                        },
                        function (err) {
                            toastr.error(err);
                        });
                }

                if ($scope.contacto.estadoId != null) {
                    PaisesService.getMunicipio($scope.contacto.estadoId).then(
                        function (result) {
                            $scope.municipios = result.data;
                        },
                        function (err) {
                            toastr.error(err);
                        });
                }

            },
            function (err) {
                toastr.error("Error al cargar los datos del contacto");
                console.error(err);
            });

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
                            $scope.contacto.munipio = '';
                            $scope.contacto.edo = '';
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

        $scope.gotoagregarempresa = function () {
            MenuService.setVariable('contactoempresa', true);
            MenuService.setVariable("contacto", $scope.contacto);
            $state.go("empresaAdd");
        }

        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
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
                    $scope.contacto.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CR"
                    }
                    $scope.ngFile = false;
                }
            });
            
        }
        //#endregion info gral

        $scope.saveContacto = function () {
            if ($scope.contactoForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            else {
                $scope.contacto.autor = AuthService.authentication.nombreCompleto;
                $scope.desactivar = true;
                ContactosCRService.update($scope.contacto).then(
                    function (result) {
                        toastr.success(result.data);
                    },
                    function (err) {
                        $scope.desactivar = false;
                        toastr.error(err);
                    });
            }
        };

        $scope.unidadOrganizacionalEmpresas = {};

        $scope.openEstructuraOrg = function (idEmpresa) {

            if (idEmpresa == undefined || idEmpresa === null || idEmpresa === "") {
                toastr.error("debe seleccionar una empresa");
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
                    if (selectedItem != null) {
                        debugger;
                        $scope.unidadOrganizacionalEmpresas = selectedItem;
                        $scope.contacto.claveUnidad = $scope.unidadOrganizacionalEmpresas.claveUnidad;
                        $scope.contacto.unidadOrganizacionalEmpresas = {}
                        $scope.contacto.unidadOrganizacionalEmpresas.nombreUnidad = selectedItem.nombreUnidad;
                    }
                });
            }
        }

        $scope.limpiar = function () {
            if($scope.contacto.unidadOrganizacionalEmpresas!=undefined){
                $scope.contacto.unidadOrganizacionalEmpresas.nombreUnidad = "";
            }
            
            $scope.contacto.claveUnidad = null;
        }

        $scope.estadoContacto = function () {

            $scope.estadoContactos =
                [
                    { nombre: 'En revisión', value: 'En revisión' },
                    { nombre: 'Revisado', value: 'Revisado' },
                    { nombre: 'Cancelado', value: 'Cancelado' }
                ];
            $scope.contacto.estadoContacto = 'En revisión';
        }

        $scope.estadoContacto();
    }
})();
