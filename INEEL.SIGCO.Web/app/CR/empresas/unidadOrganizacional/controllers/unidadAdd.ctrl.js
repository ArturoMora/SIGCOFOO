(function () {
    "use strict";

    angular
        .module("ineelCR")
        .directive('textOnly', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attr, ngModelCtrl) {
                    function fromUser(text) {
                        if (text) {

                            var transformedInput = text.replace(/[^A-Za-z]/g, '');

                            if (transformedInput !== text) {
                                ngModelCtrl.$setViewValue(transformedInput);
                                ngModelCtrl.$render();
                            }
                            return transformedInput;
                        }
                        return undefined;
                    }
                    ngModelCtrl.$parsers.push(fromUser);
                }
            };
        })
        .controller("UnidadAddCtrl", [
            "$timeout",
            "AuthService",
            "$scope",
            "$stateParams",
            "$uibModal",
            "$http",
            "globalGet",
            "PaisesService",
            "UnidadesCRService",
            UnidadAddCtrl
        ]);

    function UnidadAddCtrl($timeout, AuthService, $scope, $stateParams, $uibModal, $http, globalGet, PaisesService, UnidadesCRService) {

        $scope.empresaSubUnidadAdd = {};
        $scope.empresaUnidadAdd = {};
        $scope.empresaUnidadEdit = {};
        $scope.empresaUnidad = {};
        $scope.empresaUnidad.empresaId = $stateParams.id;
        var cveUnidad = 0;
        $scope.estados = [];
        $scope.municipios = [];
        $scope.patronClave = "";

        CargarUnidades();

        PaisesService.getPaises().then(
            function (result) {
                $scope.paises = result.data;
            },
            function (err) {
                toastr.error(err);
            });

        $scope.cargaEstado = function () {
            $scope.empresaUnidadEdit.edo = '';
            $scope.empresaUnidadEdit.municipio = '';
            if ($scope.empresaUnidadAdd.paisId == null || $scope.empresaUnidadAdd.paisId == 'undefined') {
                $scope.empresaUnidadAdd.estado = '';
                $scope.empresaUnidadAdd.municipio = '';
                $scope.estados = [];
                $scope.municipios = [];
            }
            else {
                if ($scope.empresaUnidadAdd.paisId == 16) {
                    PaisesService.getEstado($scope.empresaUnidadAdd.paisId).then(
                        function (result) {
                            $scope.empresaUnidadAdd.munipio = '';
                            $scope.empresaUnidadAdd.edo = '';
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
            if ($scope.empresaUnidadAdd.estadoId != null) {
                PaisesService.getMunicipio($scope.empresaUnidadAdd.estadoId).then(
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

        $scope.cargaEstadoEdit = function () {

            $scope.empresaUnidadEdit.edo = '';
            $scope.empresaUnidadEdit.munipio = '';
            if ($scope.empresaUnidadEdit.paisId == null || $scope.empresaUnidadEdit.paisId == 'undefined') {
                $scope.empresaUnidadEdit.edo = '';
                $scope.empresaUnidadEdit.munipio = '';
                $scope.estados = [];
                $scope.municipios = [];
            }
            else {
                if ($scope.empresaUnidadEdit.paisId == 16) {
                    PaisesService.getEstado($scope.empresaUnidadEdit.paisId).then(
                        function (result) {
                            $scope.empresaUnidadEdit.munipio = '';
                            $scope.empresaUnidadEdit.edo = '';
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

        $scope.cargaMunicipioEdit = function () {
            if ($scope.empresaUnidadEdit.estadoId != null) {
                PaisesService.getMunicipio($scope.empresaUnidadEdit.estadoId).then(
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

        $scope.cargaEstadoSub = function () {
            if ($scope.empresaSubUnidadAdd.paisId == null || $scope.empresaSubUnidadAdd.paisId == 'undefined') {
                $scope.empresaSubUnidadAdd.munipio = '';
                $scope.empresaSubUnidadAdd.edo = '';
                $scope.estados = [];
                $scope.municipios = [];
            }
            else {
                if ($scope.empresaSubUnidadAdd.paisId == 16) {
                    PaisesService.getEstado($scope.empresaSubUnidadAdd.paisId).then(
                        function (result) {
                            $scope.empresaSubUnidadAdd.munipio = '';
                            $scope.empresaSubUnidadAdd.edo = '';
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

        $scope.cargaMunicipioSub = function () {

            if ($scope.empresaUnidad.estadoId != null) {
                PaisesService.getMunicipio($scope.empresaUnidad.estadoId).then(
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

        $scope.creaClaveEmpresa = function (palabra) {
            if (palabra != '') {
                
                palabra = palabra.toUpperCase();
                palabra = removeAccents(palabra);
                var palabrasArray = palabra.split(" ");
                var clave = "";
                if (palabrasArray.length > 1) { //Nombres de empresa con varias palabras
                    for (var c = 0; c < palabrasArray.length; c++) {
                        clave += palabrasArray[c].charAt(0);
                    }
                } else { //Empresas con nombres de una sola palabra, como motorola, samsung, etc
                    var cantCaracteres = Math.round((palabra.length / 2));
                    clave += palabra.substring(0, cantCaracteres);
                }

                var fecha = new Date();
                clave += fecha.getDay().toString() + fecha.getMonth().toString() + fecha.getFullYear().toString() + fecha.getHours().toString();
                return clave;
            }

        }

        function removeAccents(param){
            return param.replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n')
                        .replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Í/g, 'I').replace(/Ó/g, 'O').replace(/Ú/g, 'U').replace(/Ñ/g, 'N');
                        
        }

        $scope.addUnidad = function () {
            $scope.empresaUnidadAdd = {};
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/unidadOrganizacional/unidadAdd.html',
                size: 'lg',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {

                        if ($scope.empresaUnidadAdd.nombreUnidad == undefined || $scope.empresaUnidadAdd.nombreUnidad == "") {
                            toastr.error("Complete los datos requeridos");
                            return false;
                        }
                        if ($scope.listaUnidades.length == 0) {  //Primer nodo

                            $scope.empresaUnidadAdd.claveUnidad = $scope.creaClaveEmpresa($scope.empresa.nombreEmpresa);
                            var claveUnidad = { "ClaveUnidad": $scope.empresaUnidadAdd.claveUnidad };
                            UnidadesCRService.ValidadorClaves(claveUnidad).then(//modificar
                                function (res) {
                                    if (res.data) {
                                        toastr.error("El registro ya existe, favor de verificar la Clave Unidad");
                                        return false;
                                    } else {
                                        $scope.crearUnidad($uibModalInstance);
                                    }
                                }, function (err) {
                                    toastr.error(err.data.exceptionMessage);
                                    console.log(err);
                                }
                            );

                        } else {
                            $scope.crearUnidad($uibModalInstance);
                        }

                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.crearUnidad = function ($uibModalInstance) {
            // 
            if ($scope.listaUnidades.length == 0) {  //Es la lista de nodos de la unidad organizacional
                $scope.patronClave = $scope.empresaUnidadAdd.claveUnidad;  //El patron es CFE, PEMEX,etc. este patron se usa para agregar futuros nodos en la unidad organizacional
            } else {
                if ($scope.patronClave == "") {
                    $scope.patronClave = $scope.retornaPatronClaveEmpresa();//En caso de que ya existan registros y se deseen agregar nuevos se recupera el patron que tienen las claves de las empresas
                }
                $scope.empresaUnidadAdd.claveUnidad = $scope.patronClave;
            }

            $scope.empresaUnidadAdd.estado = 1;
            $scope.empresaUnidadAdd.fechaEfectiva = new Date();
            $scope.empresaUnidadAdd.padre = null;
            $scope.empresaUnidadAdd.empresaId = $scope.empresaUnidad.empresaId
            if ($scope.empresaUnidadAdd.campoAgrupador) {  //Para los nodos que son campos agrupadores 
                $scope.empresaUnidadAdd.descripcion = $scope.empresa.nombreEmpresa;     //En caso de que lo sea su nombre no se tomara en cuenta para crear la descripcion del nodo
            } else {
                $scope.empresaUnidadAdd.descripcion = $scope.empresa.nombreEmpresa + "\\" + $scope.empresaUnidadAdd.nombreUnidad;
            }

            if ($scope.contacto != null) {
                $scope.empresaUnidadAdd.contactoId = $scope.contacto.contactoId;
                $scope.empresaUnidadAdd.puesto = "Titular";
            }

            $scope.empresaUnidadAdd.autor = AuthService.authentication.nombreCompleto;
            // else{
            //     $scope.empresaUnidadAdd.nombreTitular = "Vaca"
            // }

            UnidadesCRService.CrearArbolUnidadOrganizacional($scope.empresaUnidadAdd).then(
                function (result) {
                    CargarUnidades();
                    toastr.success(result.data);
                    $uibModalInstance.dismiss('cancel');
                },
                function (err) {
                    toastr.error(err.data.exceptionMessage);
                    console.log(err);
                });
        }

        ///Funciones que se llaman cuando se hacen operaciones con el arbol organizacional
        $scope.treeCallbacks = {
            dragStop: function (event) {
                var unidadDestino = {};
                if (event.dest.nodesScope.$nodeScope == null) { //nodo destino
                    unidadDestino.claveUnidad = null;
                    unidadDestino.nombreUnidad = null;
                } else {  //nodo origen
                    unidadDestino = event.dest.nodesScope.$nodeScope.$modelValue;
                }

                var unidadOrigen = event.source.nodeScope.$modelValue;
                if (unidadDestino.claveUnidad != unidadOrigen.padre) {  //Solo si hay un cambio de padres se ejecuta la actualizacion
                    unidadOrigen.padre = unidadDestino.claveUnidad;
                    unidadOrigen.nombrePadre = unidadDestino.nombreUnidad;

                    unidadOrigen.comentarios = "La unidad no tenía padre";
                    if (event.source.nodeScope.$parentNodeScope != null) {
                        unidadOrigen.comentarios = "El padre anterior era " + event.source.nodeScope.$parentNodeScope.$modelValue.nombreUnidad;
                    }

                    UnidadesCRService.ActualizaArbol(unidadOrigen).then(
                        function (result) {
                            toastr.success(result.data);
                            CargarUnidades();
                        },
                        function (err) {
                            toastr.error("Error al actualizar la información");
                            console.log(err);
                        });
                }
                return true;

            }
        };

        $scope.subUnidad = function (scope) {
            $scope.empresaSubUnidadAdd = {};
            $scope.empresaUnidad = scope.$modelValue;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/unidadOrganizacional/subUnidadAdd.html',
                size: 'lg',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {

                        if ($scope.empresaSubUnidadAdd.subnombreUnidad == undefined) {
                            toastr.error("Complete los datos requeridos");
                            return false;
                        }

                        $scope.empresaSubUnidadAdd.estado = 1;
                        $scope.empresaSubUnidadAdd.fechaEfectiva = new Date();
                        $scope.empresaSubUnidadAdd.padre = $scope.empresaUnidad.id;
                        $scope.empresaSubUnidadAdd.empresaId = $scope.empresaUnidad.empresaId;

                        $scope.empresaSubUnidadAdd.nombreUnidad = $scope.empresaSubUnidadAdd.subnombreUnidad;
                        if ($scope.empresaUnidad.descripcion == null) {
                            $scope.empresaSubUnidadAdd.descripcion = $scope.empresa.nombreEmpresa + "\\" + $scope.empresaUnidad.nombreUnidad + "\\" + $scope.empresaSubUnidadAdd.subnombreUnidad;
                        } else {
                            if ($scope.empresaSubUnidadAdd.campoAgrupador) {  //En caso de que sea un campo agrupador, el nombre del campo no aparecera en la descripcion de la unidad
                                $scope.empresaSubUnidadAdd.descripcion = $scope.empresaUnidad.descripcion;
                            }
                            else {
                                $scope.empresaSubUnidadAdd.descripcion = $scope.empresaUnidad.descripcion + "\\" + $scope.empresaSubUnidadAdd.subnombreUnidad;
                            }

                        }

                        if ($scope.patronClave != "") {//El patron es necesario para seguir creando nodos en la estructura organizacional
                            $scope.empresaSubUnidadAdd.claveUnidad = $scope.patronClave;  //scope.patronclave es una copia del patron que el usuario ingreso por primera vez
                        } else {
                            $scope.empresaSubUnidadAdd.claveUnidad = $scope.retornaPatronClaveEmpresa();  //En caso de que ya existan registros y se deseen agregar nuevos se recupera el patron que tienen las claves de las empresas
                        }


                        if ($scope.contacto != null) {
                            $scope.empresaSubUnidadAdd.contactoId = $scope.contacto.contactoId;
                            $scope.empresaSubUnidadAdd.puesto = "Titular";
                        }

                        $scope.empresaSubUnidadAdd.autor = AuthService.authentication.nombreCompleto;
                        $scope.empresaSubUnidadAdd.nombrePadre = $scope.empresaUnidad.nombreUnidad;

                        UnidadesCRService.CrearArbolUnidadOrganizacional($scope.empresaSubUnidadAdd).then(
                            function (result) {
                                toastr.success(result.data);
                                CargarUnidades();
                                $uibModalInstance.dismiss('cancel');
                            },
                            function (err) {
                                toastr.error(err.data.exceptionMessage);
                            });


                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });

        };


        $scope.retornaPatronClaveEmpresa = function () {
            var nodo = $scope.listaUnidades[0];  //es el arreglo de unidades organizacionales (los nodos raices)   
            var patron = nodo.claveUnidad.replace(/[0-9]/g, '');  //Quita de CFE1.9 el 1.9
            return patron;
        }


        $scope.openContacto = function () {
            $scope.vinculo = {};
            $scope.empresaId = $scope.empresaUnidad.empresaId;  //Necesaria para crear el contacto
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/ContactosGetGral.html',
                controller: 'ContactosGetGralCtrl as showCase',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.contacto = selectedItem;
                ///Para los casos de edicion
                $scope.empresaUnidadEdit.contacto = {};
                $scope.empresaUnidadEdit.contacto = selectedItem;
                $scope.empresaUnidadEdit.contactoId = selectedItem.contactoId;

            });
        }


        $scope.delete = function (scope) {
            var dato = scope.$modelValue
            var cveUnidad = dato.claveUnidad;
            $scope.descripcionRow = dato.nombreUnidad;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        var hijos = dato.nodes;
                        if (hijos.length > 0 || dato.children.length > 0) {
                            toastr.error("No se puede eliminar la unidad, ya que contiene unidades dependientes");
                            $uibModalInstance.dismiss('cancel');
                        } else {
                            var claveUnidad = { "ClaveUnidad": cveUnidad };
                            UnidadesCRService.deleteUnidad(claveUnidad).then(
                                function (result) {
                                    toastr.success(result.data);
                                    CargarUnidades();
                                    $uibModalInstance.dismiss('cancel');
                                },
                                function (err) {
                                    if (err.data.exceptionMessage != null) {
                                        toastr.error(err.data.exceptionMessage, "Error al eliminar la unidad");
                                        console.log(err);
                                    } else {
                                        toastr.error("Puede que tenga contactos asociados", "Error al eliminar la unidad");
                                        console.log(err);
                                    }

                                    $uibModalInstance.dismiss('cancel');
                                });
                        }
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

        $scope.seleccionarNodo = function (scope) {

            var nodeData = scope.$modelValue;
            $scope.nodoSeleccionado = nodeData;
            $scope.empresaUnidadEdit = $scope.nodoSeleccionado;
            $scope.empresaUnidadEdit.oldValueUnidad = angular.copy(nodeData.nombreUnidad);  //Hacemos una copia del viejo valor del nombre de la unidad, por si cambia
            $scope.empresaUnidadEdit.oldValueCampoAgrupador = angular.copy($scope.empresaUnidadEdit.campoAgrupador);  //Copia del valor del campo agrupador
            $scope.empresaUnidadEdit.oldValueTitular = angular.copy($scope.empresaUnidadEdit.contactoId);  //Copia del valor del contacto
            CargaEdoMunis();
            var modalInstance = $uibModal.open({
                templateUrl: 'app/CR/empresas/unidadOrganizacional/unidadEdit.html',
                size: 'lg',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {

                        if ($scope.empresaUnidadEdit.nombreUnidad == '' || $scope.empresaUnidadEdit.nombreUnidad == null || $scope.empresaUnidadEdit.nombreUnidad == undefined) {
                            toastr.error("Se requiere el nombre de la unidad");
                        } else {

                            $scope.empresaUnidadEdit.newValueUnidad = $scope.empresaUnidadEdit.nombreUnidad;  //Nuevo valor del nombre de la unidad organizacional

                            if ($scope.contacto != null) {
                                // $scope.empresaUnidadEdit.contactoId= $scope.contacto.contactoId;
                                $scope.empresaUnidadEdit.puesto = "Titular";
                            }

                            if ($scope.empresaUnidadEdit.contactoId == null && $scope.empresaUnidadEdit.oldValueTitular) {
                                $scope.empresaUnidadEdit.accion = "eliminar";
                            }

                            UnidadesCRService.ActualizaArbol($scope.empresaUnidadEdit).then(
                                function (result) {

                                    toastr.success(result.data);
                                    CargarUnidades();
                                    $uibModalInstance.dismiss('cancel');
                                },
                                function (err) {
                                    toastr.error("Error al actualizar la información");
                                    console.log(err);
                                });

                        }
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

        function CargarUnidades() {
            var API = globalGet.get("api");
            var service = {};
            service.GetAllnodes = function (empresaUnidad) {
                var endPoint = API + "UnidadOrganizacionalEmpresas/GetAllnodes";
                return $http.post(endPoint, empresaUnidad);

            }

            $scope.nodoSeleccionado = {};
            $scope.listaUnidades = [];

            $scope.contacto = null;
            $scope.toggle = function (scope) {

                scope.toggle();
                $scope.newSubItem(scope);
            };
            $scope.moveLastToTheBeginning = function () {
                var a = $scope.listaUnidades.pop();
                $scope.listaUnidades.splice(0, 0, a);
            };
            $scope.resultX = {};
            $scope.newSubItem = function (scope) {
                var nodeData = scope.$modelValue;

                service.GetAllnodes(nodeData).then(
                    function (result) {
                        $scope.resultX = {};
                        var r = result.data;
                        $scope.resultX = r;
                        if (r != null && r.length > 0 && r[0].children != null && r[0].children.length > 0) {
                            //alert("push");
                            nodeData.nodes = r[0].children;

                        } else {
                            nodeData.hoja = true;
                        }

                        if ($scope.resultX.contacto != null) {
                            $scope.contacto = $scope.resultX.contacto;
                        }
                    },
                    function (err) {
                        toastr.error("Error al cargar los datos de las unidades");
                        console.log(err);
                    }
                );
            };

            $scope.collapseAll = function () {
                $scope.$broadcast('angular-ui-tree:collapse-all');
            };

            $scope.expandAll = function () {
                $scope.$broadcast('angular-ui-tree:expand-all');
            };


            var itemEO = { padre: null, EmpresaId: $scope.empresaUnidad.empresaId }
            service.GetAllnodes(itemEO).then(
                function (result) {

                    $scope.listaUnidades = result.data;
                    // if($scope.listaUnidades.contacto!=null){
                    //     $scope.contacto= $scope.listaUnidades.contacto;
                    // }

                    return $timeout(function () {
                        $scope.collapseAll();

                    }, 0);
                },
                function (err) {
                    toastr.error("Error al cargar los datos de las unidades");
                    console.log(err);
                }
            );
        }

        function CargaEdoMunis() {
            if ($scope.empresaUnidadEdit.paisId == null || $scope.empresaUnidadEdit.paisId == 'undefined') {
                $scope.empresaUnidadEdit.edo = '';
                $scope.empresaUnidadEdit.municipio = '';
                $scope.estados = [];
                $scope.municipios = [];
            }
            else {
                if ($scope.empresaUnidadEdit.paisId == 16) {
                    PaisesService.getEstado($scope.empresaUnidadEdit.paisId).then(
                        function (result) {
                            $scope.empresaUnidadEdit.munipio = '';
                            $scope.empresaUnidadEdit.edo = '';
                            $scope.estados = result.data;
                        },
                        function (err) {
                            toastr.error(err);
                        });
                } else {
                    $scope.estados = [];
                }
            }
            if ($scope.empresaUnidadEdit.estadoId != null) {
                PaisesService.getMunicipio($scope.empresaUnidadEdit.estadoId).then(
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
    }
})();
