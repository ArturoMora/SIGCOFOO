(function () {
    "use strict";

    //var app = angular.module("ineelCR");
    angular
        .module("ineelCR")
        .controller("EmpresaEditCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$uibModal",
            "MenuService",
            "$stateParams",
            "globalGet",
            "uploadFileACH",
            "TiposOrganizacionCRService",
            "EmpresasCRService",
            "PaisesService",
            "comunService",
            EmpresaEditCtrl]);

    function EmpresaEditCtrl(AuthService ,$scope, $state, $uibModal, MenuService, $stateParams, globalGet, uploadFileACH,TiposOrganizacionCRService, EmpresasCRService, PaisesService,comunService) {
        var paisId = 0;
        var estadoId = 0;
        var paisIdRS = 0;
        var estadoIdRS = 0;
        $scope.tab = 1;
        $scope.active1 = "active";
        $scope.active2 = "";
        $scope.active3 = "";
        $scope.active4 = "";
        $scope.active5 = "";
        $scope.active6 = "";

        var API = globalGet.get("api");
        $scope.empresa = {};
        $scope.regFile = true;

        $scope.newTAB = function () {
            $scope.active1 = "";
            $scope.active2 = "";
            $scope.active3 = "";
            $scope.active4 = "";
            $scope.active5 = "";
            $scope.active6 = "";
            $scope.active7 = "";

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
                case 4:
                    $scope.active4 = "active";
                    break;
                case 5:
                    $scope.active5 = "active";
                    break;
                case 6:
                    $scope.active6 = "active";
                    break;
                case 7:
                    $scope.active7 = "active";  
                    break;
                default:
            }
        }

        
        var retornoEmpresa= MenuService.getVariable("fromEmpresas");
        if(retornoEmpresa){
            $scope.tab = 6;
            $scope.newTAB();
            $state.go("empresaEdit.contactoEmpresaAdd", { seccion: 'contactoEmpresaAdd' });
        }
        MenuService.deleteVariable("fromEmpresas");

        $scope.empresa_id = $stateParams.id;
           
        if($scope.empresa_id == null || $scope.empresa_id== undefined){
            toastr.error("Empresa no existente");
            $rootScope.globalRegresar();
            return false;
        }

        $scope.openContacto = function () {
            $scope.vinculo = {};
            $scope.empresaId = $scope.empresa_id;  //Necesaria para crear el contacto
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/ContactosGetGral.html',
                controller: 'ContactosGetGralCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.empresa.contacto= selectedItem;
                $scope.empresa.contactoId= selectedItem.contactoId;
                
            });
        }

        TiposOrganizacionCRService.getTiposOrganizacionByTrue().then(
           function (result) {
               $scope.tiposOrganizaciones = result.data;
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

        EmpresasCRService.getEmpresa($scope.empresa_id).then(
            function (result) {
                $scope.empresa = result.data;
                paisId = $scope.empresa.paisId;
                estadoId = $scope.empresa.estadoId;
                paisIdRS = $scope.empresa.paisIdRS;
                estadoIdRS = $scope.empresa.estadoIdRS;
                $scope.excepcion = result.data.nombreEmpresa.replace(/ /g, "").replace(/\n/g, "");
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

                if ($scope.empresa.estadoId != null) {
                    PaisesService.getMunicipio($scope.empresa.estadoId).then(
                       function (result) {
                           $scope.municipios = result.data;
                       },
                       function (err) {
                           toastr.error(err);
                       });
                }

                if (paisIdRS != null) {
                    PaisesService.getEstado(paisIdRS).then(
                        function (result) {
                            $scope.estadosR = result.data;
                        },
                        function (err) {
                            toastr.error(err);
                        });
                }

                if ($scope.empresa.estadoIdRS != null) {
                    PaisesService.getMunicipio($scope.empresa.estadoIdRS).then(
                       function (result) {
                           $scope.municipiosR = result.data;
                       },
                       function (err) {
                           toastr.error(err);
                       });
                }
            },
            function (err) {
                
                toastr.error("Error al cargar los datos de la empresa");
                console.log(err);
            });

        PaisesService.getPaises().then(
         function (result) {
             $scope.paisesR = result.data;
         },
         function (err) {
             toastr.error(err);
         });

        $scope.cargaEstado = function () {
            if ($scope.empresa.paisId == null || $scope.empresa.paisId == 'undefined') {
                $scope.empresa.localidad = '';
                $scope.empresa.estado = '';
                $scope.empresa.municipio = '';
                $scope.estados = [];
                $scope.municipios = [];
            }
            else {
                if ($scope.empresa.paisId == 16) {
                    PaisesService.getEstado($scope.empresa.paisId).then(
                    function (result) {
                        $scope.empresa.munipio = '';
                        $scope.empresa.edo = '';
                        $scope.estados = result.data;
                    },
                    function (err) {
                        toastr.error(err);
                    });
                } else {
                    $scope.empresa.localidad = '';
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
                $scope.empresa.edoR = '';
                $scope.empresa.municipioR = '';
                $scope.empresa.localidadRS = '';
                $scope.estadosR = [];
                $scope.municipiosR = [];
            }
            else {
                if ($scope.empresa.paisIdRS == 16) {
                    PaisesService.getEstado($scope.empresa.paisIdRS).then(
                    function (result) {
                        $scope.empresa.localidadRS = '';
                        $scope.empresa.municipioR = '';
                        $scope.empresa.edoR = '';
                        $scope.estadosR = result.data;
                    },
                    function (err) {
                        toastr.error(err);
                    });
                } else {
                    $scope.estadosR = [];
                    $scope.municipiosR = [];
                    $scope.empresa.edoR = '';
                    $scope.empresa.municipioR = '';
                    $scope.empresa.localidadRS = '';
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
                $scope.municipiosR = [];
            }
        }
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
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
                    // console.log("result:");
                    // console.log(result);
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
            $scope.$apply(function () {
                if (result.error === false) {
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.empresa.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CR"
                    }
                    $scope.ngFile = false;
                }
            });
        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////

        $scope.estadoEmpresa = function () {

            $scope.estadoEmpresas =
                [
                    { nombre: 'En revisi\u00f3n', value: 'En revisi\u00f3n' },
                    { nombre: 'Revisado', value: 'Revisado' },
                    { nombre: 'Cancelado', value: 'Cancelado' }
                ];

            $scope.empresa = { estadoEmpresa: $scope.estadoEmpresas[0].value };
        }

        $scope.estadoEmpresa();

        $scope.updateEmpresa = function () {
            var nombre = $scope.empresa.nombreEmpresa;
            var tipoOrganizacion = $scope.empresa.tipoOrganizacionId;
            var validado = $scope.empresa.estadoEmpresa;

            if ((nombre == null || nombre == undefined || nombre == "") || (tipoOrganizacion == null || tipoOrganizacion == undefined || tipoOrganizacion == "") || validado == undefined || validado == "" || validado == null) {
                toastr.error("Complete los campos requeridos");
                return false;
            }
            else {
                var registro = { "dato": nombre.replace(/ /g, "").replace(/\n/g, ""), "origen": "Empresa", "excepcion": $scope.excepcion };
                comunService.ValidacionExistCR(registro).then(function(result) {
                    $scope.existente = result.data;
                    if ($scope.existente) {
                        toastr.warning("El registro ya existe");
                        return false;
                    } else {

                        $scope.empresa.autor = AuthService.authentication.nombreCompleto;
                        if($scope.empresa.contacto!=null){
                            $scope.empresa.nombreTitular = $scope.empresa.contacto.nombreCompleto;
                        }
                        
                        $scope.desactivar = true;
                        EmpresasCRService.update($scope.empresa).then(
                            function (result) {
                                toastr.success(result.data);
                                $state.go("empresasGet");
                            },
                            function (err) {
                                toastr.error(err.data.exceptionMessage);
                                $scope.desactivar = false;
                                console.log(err);
                            });
                    }
                });
                
            }

        };
    }
})();
