(function () {
    "use strict";

    angular.module("directivasSIGCO", [])
        .controller('uoModalCtrl', ['$scope', '$uibModal', uoModalCtrl])
        .controller('loadImageModalCtrl', ['$scope', '$uibModal', loadImageModalCtrl])
        .controller('loadContactoModalCtrl', ['$scope', '$uibModal', loadContactoModalCtrl])
        .controller("logicaDinamicCtrlLoadImage", ["$scope", "$uibModalInstance", logicaDinamicCtrlLoadImage])
        .controller("logicaDinamicCtrlLoadContacto", ["$scope", "$uibModalInstance", "$http", "globalGet", logicaDinamicCtrlLoadContacto])
        .controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', ModalInstanceCtrl])
        .controller('selectPersonasCtrl', ['$scope', '$uibModalInstance', 'personasService', selectPersonasCtrl])
        .controller('loadProyectoModal', ['$scope', '$uibModal', loadProyectoModal])
        .controller('loadEmpresaModal', ['$scope', '$uibModal', loadEmpresaModal])
        .controller('uoModaldivCtrl', ['$scope', '$uibModal', uoModaldivCtrl])
        .controller('uoModalEmpresasCtrl', ['$scope', '$uibModal', uoModalEmpresasCtrl])
        // .controller('loadAlertForm',['$scope','$uibModal',loadAlertForm])
        .directive('selectAutores', ['$uibModal', function ($uibModal) {
            return {
                restrict: 'A',
                scope: {
                    autores: "="
                },
                link: function (scope, element, attrs) {
                    element.bind('click', function () {

                        var modalInstance = $uibModal.open({
                            size: 'lg',
                            templateUrl: 'app/vistasGenericas/selectPersonas.html',
                            controller: 'selectPersonasCtrl'
                        });

                        modalInstance.result.then(function (selectedItem) {
                            var autor = {};
                            autor.nombreCompleto = selectedItem.nombreCompleto;
                            autor.clavePersona = selectedItem.clavePersona;
                            autor.esExterno = false;
                            try {
                                var existe = false;
                                if (scope.autores != null) {

                                    for (var i = 0; i < scope.autores.length; i++) {
                                        if (scope.autores[i].clavePersona == autor.clavePersona) {
                                            existe = true;
                                            break;
                                        }
                                    }
                                    if (!existe) {
                                        scope.autores.push(autor);
                                    }
                                    else {
                                        toastr.error("El autor ya se encuentra en la lista.");
                                    }
                                }
                            } catch (errIE11) { }

                        }, function () {

                        });
                    });
                }
            }
        }])
        .directive('noDirtyCheck', function() {
            //Previene que al interactuar con un elemento de un formulario, este influya en la propiedad $dirty del formulario en general
            return {
              restrict: 'A',
              require: 'ngModel',
              link: function(scope, elm, attrs, ctrl) {
                ctrl.$pristine = false;
              }
            }
        })
        .directive('ngReallyClick', ['$uibModal',
            function ($uibModal) {
            // debugger;
                return {
                    restrict: 'A',
                    scope: {
                        ngReallyClick: "&",
                        item: "=",
                        ngReallyCancel: "&"
                    },
                    link: function (scope, element, attrs) {
                        element.bind('click', function () {
                            var message = attrs.ngReallyMessage || "&iquest;Seguro de ejecutar esta operaci&oacute;n&#63;";

                            var modalHtml = '<div class="modal-header">Confirmaci&oacuten<button type="button" class="close" ng-click="cancel()" data-dissmiss="modal">x</button></div><div class="modal-body">' + message + '</div>';
                            modalHtml += '<div class="modal-footer"><button class="btn btn-success" ng-click="ok()">Confirmar</button><button class="btn btn-primary" ng-click="cancel()">Cancelar</button></div>';

                            var modalInstance = $uibModal.open({
                                template: modalHtml,
                                controller: ModalInstanceCtrl
                            });

                            modalInstance.result.then(function () {
                                // debugger;
                                scope.ngReallyClick({ item: scope.item });
                            }, function () {
                                //Modal dismissed
                                scope.ngReallyCancel({ item: scope.item });
                            });
                            //*/

                        });

                    }
                }
            }
        ])
        .directive('uoModal', function () {
            return {
                restrict: 'ACE',
                templateUrl: function (elem, attrs) {
                    return attrs.templateUrl || 'app/vistasGenericas/uomodal.html';
                },
                //templateUrl: 'app/vistasGenericas/uomodal.html',
                controller: "uoModalCtrl",
                require: 'ngModel',
                scope: {
                    arreglo: "=?enarreglo",
                    fechauo: "=?fecha",
                    nivelMin: "=?nivelMin",
                    nivelMax: "=?nivelMax",
                    ngModel: '=',
                    stateForm: "=?",
                }
            };
        })
        .directive('uoModaldiv', function () {
            return {
                restrict: 'ACE',
                templateUrl: function (elem, attrs) {
                    return attrs.templateUrl || 'app/vistasGenericas/uomodal2.html';
                },
                //templateUrl: 'app/vistasGenericas/uomodal.html',
                controller: "uoModaldivCtrl",
                require: 'ngModel',
                scope: {
                    arreglo: "=?enarreglo",
                    fechauo: "=?fecha",
                    nivelMin: "=?nivelMin",
                    nivelMax: "=?nivelMax",
                    rol: "=?rol",
                    clave: "=?clave",
                    ngModel: '=',
                    stateForm: "=?",
                    
                }
            };
        })
        .directive('uoModalEmpresas', function () {
            return {
                restrict: 'AE',
                templateUrl: function (elem, attrs) { //elemen = el elemento html como tal
                    //attrs = atributos del elemento(funciones, directivas, etc)
                    debugger;
                    if(attrs.plantilla){
                        switch(attrs.plantilla)
                        {
                            case "1":
                            return attrs.templateUrl || 'app/vistasGenericas/detalleunidadOrganizacionalEmpresas/uomodalEmpresas.html';
                            break;
                            case "2":
                            return attrs.templateUrl || 'app/vistasGenericas/detalleunidadOrganizacionalEmpresas/uomodalEmpresasBoton.html';
                            break;
                        }
                    }else{
                        return attrs.templateUrl || 'app/vistasGenericas/detalleunidadOrganizacionalEmpresas/uomodalEmpresas.html';
                    }
                    
                },
                controller: "uoModalEmpresasCtrl",
                scope: {
                    arreglo: "=?enarreglo",
                    ngModel: '=?',
                    stateForm: "=?",
                    readonly:"=?",
                    requerido: "@",
                    clave: "="
                    
                }
            };
        })
        .directive('loadStatus', function () {
            return {
                restrict: 'ACE',
                template: '<a ng-click="openModal()" class="linkTabla">{{descripcion}}</a>',
                controller: "loadImageModalCtrl",
                require: 'ngModel',
                scope: {
                    tipo: '@',
                    estado: "@",
                    descripcion: '@'
                }
            };
        })
        .directive('loadContacto', function () {
            return {
                restrict: 'ACE',
                template: '<a ng-click="openModalContacto()" class="linkTabla">{{descripcion}}</a>',
                controller: "loadContactoModalCtrl",
                scope: {
                    registroid: '@',
                    descripcion: '@'
                }
            };
        })
        .directive('uoModal2', function () {
            return {
                restrict: 'ACE',
                templateUrl: 'app/vistasGenericas/uomodal2.html',
                controller: "uoModalCtrl",
                require: 'ngModel',
                scope: {
                    arreglo: "=?enarreglo",
                    fechauo: "=?fecha",
                    nivelMin: "=?nivelMin",
                    nivelMax: "=?nivelMax",
                    ngModel: '=',
                    requerido: "@",
                    stateForm: "=?",
                }
            };
        })
        .directive('loadProyectos',function() {
            return{
                restrict: 'AE',
                template: '<a ng-click="openModalProyecto()" class="linkTabla">{{idproyecto}}</a>',
                controller: "loadProyectoModal",
                scope: {
                    idproyecto: "@"
                }
            };

        })
        .directive('loadEmpresas', function () {
            return {
                restrict: 'AE',
                template: '<a ng-click="openModalEmpresa()" style="text-decoration: underline; cursor: pointer;">{{empresa}}</a>',
                controller: "loadEmpresaModal",
                scope: {
                    empresa: "@",
                    idempresa: "@"
                }
            };
        })
        .directive('autoFocusCampo', function($timeout) {
            return {
                restrict: 'AC',
                link: function(_scope, _element) {
                    $timeout(function(){
                        _element[0].focus();
                    }, 0);
                }
            };
        })
        .directive('confirmaRegresar',['$uibModal', 
        function($uibModal){
            return{
                restrict:'A',
                scope:{
                    stateForm: "=",
                    confirmaRegresar: "&", //estas propiedades son las que se ponen en el html y que bind-iaremos a la directiva
                    cancelarRegresar: "&",
                    mensaje: "@",
                    // coleccion: "<"
                },//no lleva controlador esta directiva, porque como tal en la funcion link se tiene toda la logica, para mas informacion ver el tema de $compile en angular js
                //tema a profundidad: https://docs.angularjs.org/api/ng/service/$compile#-scope-
                //ayuda en general sobre directivas: https://docs.angularjs.org/guide/directive
                link: function(scope, element, attr){ //Se hace un bind al momento de hace clic
                    element.bind("click",function(){

                        if(scope.stateForm.$dirty){ //validamos el formulario, si ha sido tocado entonces se desplega un modal para confirmar
                            var msj= scope.mensaje || "La información ingresada no se guardará, ¿seguro desea salir sin guardar los cambios?";  //Si no se agrega un mesaje se carga uno default
                            var modalHtml = '<div class="modal-header">Confirmaci&oacuten<button type="button" class="close" ng-click="cancel()" data-dissmiss="modal">x</button></div><div class="modal-body">' + msj + '</div>';
                            modalHtml += '<div class="modal-body"><button class="btn btn-success" ng-click="ok()">Confirmar</button><button class="btn btn-primary" ng-click="cancel()">Cancelar</button></div>';

                            //abre el modal preguntando al usuario su confirmacion 
                            var modalInstance = $uibModal.open({
                                template: modalHtml,
                                controller: ModalInstanceCtrl
                            });
                            
                            modalInstance.result.then(function () {
                                //cuando el usuario acepta regresar
                                scope.confirmaRegresar()
                            }, function () {
                                //Cuando el modal se cierra
                                scope.cancelarRegresar()
                            });
                        }else{
                            scope.confirmaRegresar()
                        }
                    })
                }
                
            }//end return
        }//end funcion
    ]);

    function loadEmpresaModal($scope, $uibModal) {
        if ($scope.idempresa != undefined) {
            //$scope.idEmpresa = idEmpresa;
            $scope.openModalEmpresa = function () {
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    templateUrl: 'app/vistasGenericas/detallesEmpresaGEN/empresaDetailsGEN.html',
                    controller: 'EmpresaDetailsGENCtrl',
                    scope: $scope
                });
            }
        } else {
            console.log('Falta agregar el parametro "idEmpresa" a la llamada de la directiva "loadEmpresas"');
        }

        
    }
    function loadProyectoModal($scope, $uibModal, $uibModalInstance) {
        $scope.openModalProyecto = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/detallesProyectosGEN/proyectoDetailsGEN.html',
                controller: 'ProyectoDetailsGENCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
            });
        }
    }
    function selectPersonasCtrl($scope, $uibModalInstance, personasService) {
        jQuery.fn.DataTable.ext.type.search.string = function (data) { return !data ? '' : typeof data === 'string' ? data.replace(/έ/g, 'ε').replace(/ύ/g, 'υ').replace(/ό/g, 'ο').replace(/ώ/g, 'ω').replace(/ά/g, 'α').replace(/ί/g, 'ι').replace(/ή/g, 'η').replace(/\n/g, ' ').replace(/[áÁ]/g, 'a').replace(/[éÉ]/g, 'e').replace(/[íÍ]/g, 'i').replace(/[óÓ]/g, 'o').replace(/[úÚ]/g, 'u').replace(/ê/g, 'e').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/è/g, 'e').replace(/ï/g, 'i').replace(/ü/g, 'u').replace(/ã/g, 'a').replace(/õ/g, 'o').replace(/ç/g, 'c').replace(/ì/g, 'i') : data; };
        $scope.click = false;
        $scope.nueva = false;
        $scope.persona = {};
        $scope.empleado = {};
        $scope.empleados = [];
        $scope.empleadoSelect = {};


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.buscar = function (persona) {
            $scope.click = true;
            personasService.GetPersonas(persona).then(
                function (result) {
                    $scope.empleados = result.data;
                    $scope.click = false;
                    if ($scope.empleados.length === 0) {
                        toastr.warning("Ning&uacute;n resultado");
                    } else {
                        toastr.success("Seleccione el registro dando click");
                    }
                },
                function (err) {
                    $scope.proyectos = [];
                    toastr.error(err.data.message || "Error al procesar su solicitud");
                    $scope.click = false;
                }
            );
        }

        $scope.ok = function () {
            $scope.empleado = $scope.empleadoSelect.emp;
            $uibModalInstance.close($scope.empleado);
        }
    }
    function ModalInstanceCtrl($scope, $uibModalInstance) {
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
    function uoModalEmpresasCtrl($scope, $uibModal) {
        $scope.uoselecionada = [];
        $scope.openModal = function () {
            if(!$scope.clave){
                console.log("Falta definir la clave de la empresa en la llamada a la directiva")
                return false;
            }
            
            $scope.requerido = (typeof $scope.requerido) === "undefined" ?  true : $scope.requerido;
            $scope.readonly = (typeof $scope.readonly) === "undefined" ?  false : $scope.readonly;
            $scope.arreglo = typeof $scope.arreglo === 'undefined' ? false : $scope.arreglo;

            $scope.idEmpresa = $scope.clave;
            
            $scope.selectItem = {};
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
                if(!$scope.readonly){
                    if ($scope.arreglo) {
                        $scope.uoselecionada.push(selectedItem);
                        $scope.ngModel = $scope.uoselecionada;
                    } else {
                        $scope.ngModel = selectedItem;
                    }
    
                    //****Para la validacion de formularios al momento de ingresar datos y no guardarlos, en teoria no debe de alterar el funcionamiento de la directiva */
                    if($scope.stateForm){
                        $scope.stateForm.$setDirty();
                    }
                }
                    
            });
        }

        $scope.verDetalle = function(id){
            $scope.id = id.$modelValue.claveUnidad.trim();  //$modelValue retorna el $scope de un elemento
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/detalleunidadOrganizacionalEmpresas/detalleUnidadOrganizacionalEmpresas.html',
                controller: 'detalleUnidadOrganizacionalEmpresasCtrl',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });
        }
    }



    function uoModalCtrl($scope, $uibModal) {
        $scope.uoselecionada = [];
        $scope.requerido = (typeof $scope.requerido) === "undefined" ?  true : $scope.requerido;
        $scope.openModal = function () {
            $scope.fechauo = typeof $scope.fechauo === 'undefined' ? new Date() : $scope.fechauo;
            $scope.arreglo = typeof $scope.arreglo === 'undefined' ? false : $scope.arreglo;
            $scope.nivelMin = typeof $scope.nivelMin === 'undefined' ? -50 : $scope.nivelMin;
            $scope.nivelMax = typeof $scope.nivelMax === 'undefined' ? +50 : $scope.nivelMax;
            
            $scope.selectItem = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/EstructuraOrganizacional.html',
                controller: 'EstructuraOrganizacionalFilterGetCtrl',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                if ($scope.arreglo) {
                    $scope.uoselecionada.push(selectedItem);
                    $scope.ngModel = $scope.uoselecionada;
                } else {
                    $scope.ngModel = selectedItem;
                }

                //****Para la validacion de formularios al momento de ingresar datos y no guardarlos, en teoria no debe de alterar el funcionamiento de la directiva */
                if($scope.stateForm){
                    $scope.stateForm.$setDirty();
                }


            });
        }
    }



    function uoModaldivCtrl($scope, $uibModal) {
        $scope.uoselecionada = [];
        $scope.requerido = (typeof $scope.requerido) === "undefined" ? true : $scope.requerido;
        $scope.openModal = function () {
            $scope.arreglo = typeof $scope.arreglo === 'undefined' ? false : $scope.arreglo;
            $scope.nivelMin = typeof $scope.nivelMin === 'undefined' ? -50 : $scope.nivelMin;
            $scope.nivelMax = typeof $scope.nivelMax === 'undefined' ? +50 : $scope.nivelMax;
            $scope.rol = typeof $scope.nivelMin === 'undefined' ? '' : $scope.rol;
            $scope.clave = typeof $scope.nivelMax === 'undefined' ? '' : $scope.clave;

            $scope.selectItem = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/EstructuraOrganizacionalDiv.html',
                controller: 'EstructuraOrganizacionalDivFilterGetCtrl',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                if ($scope.arreglo) {
                    $scope.uoselecionada.push(selectedItem);
                    $scope.ngModel = $scope.uoselecionada;
                } else {
                    $scope.ngModel = selectedItem;
                }

                //****Para la validacion de formularios al momento de ingresar datos y no guardarlos, en teoria no debe de alterar el funcionamiento de la directiva */
                if ($scope.stateForm) {
                    $scope.stateForm.$setDirty();
                }


            });
        }
    }

    function loadImageModalCtrl($scope, $uibModal) {
        $scope.uoselecionada = [];
        $scope.openModal = function () {


            var modalHtml = '<div class="modal-header">Estado<button type="button" class="close" ng-click="cancel()" data-dissmiss="modal">x</button></div><div class="modal-body"><div  class="center"> <img src="{{imagen}}" alt="{{descripcion}}"></div></div>';
            modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">Cerrar</button></div>';

            var modalInstance = $uibModal.open({
                size: 'lg',
                template: modalHtml,
                controller: 'logicaDinamicCtrlLoadImage',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
            });
        }
    };
    function loadContactoModalCtrl($scope, $uibModal) {
        $scope.openModalContacto = function () {
            var modalHtml = '<div class="modal-header">Contacto<button type="button" class="close" ng-click="cancel()" data-dissmiss="modal">x</button></div><div class="modal-body"><div class="row"><div class="col-xs-2"></div><div class="col-xs-10"><div ng-include="\'app/CR/contactos/contacto/contactoComun.html\'"></div></div></div>     </div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">Cerrar</button></div>';

            var modalInstance = $uibModal.open({
                size: 'xs',
                template: modalHtml,
                controller: 'logicaDinamicCtrlLoadContacto',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
            });
        }
    };
    function logicaDinamicCtrlLoadImage($scope, $uibModalInstance) {

        $scope.imagen = "sin imagen";
        if ($scope.tipo == 'EGA') {
            if ($scope.estado == 0 || $scope.estado == 1) {
                $scope.imagen = "/images/estados/CH/EGA01.PNG";
            }

            if ($scope.estado == 2) {
                $scope.imagen = "/images/estados/CH/EGA03.PNG";
            }
            if ($scope.estado == 8) {
                $scope.imagen = "/images/estados/CH/EGA02.PNG";
            }
            if ($scope.estado == 3) {
                $scope.imagen = "/images/estados/CH/EGA04.PNG";
            }
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        $scope.ok = function () {
            $uibModalInstance.close($scope.nodoSeleccionado);
        }
    }
    function logicaDinamicCtrlLoadContacto($scope, $uibModalInstance, $http, globalGet) {
        // console.log("escope: ");
        // console.log($scope);
        var API = globalGet.get("api");
        var service = {};
        // Get Contacto
        service.getContacto = function (contactoId) {
            var endpoint = API + "Contactos/GetContacto/" + contactoId;
            return $http.get(endpoint);
        }
        service.getContacto($scope.registroid).then(
            function (result) {
                $scope.contacto = result.data;
            },
            function (err) {
                console.error(err);
            });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        $scope.ok = function () {
            $uibModalInstance.close($scope.nodoSeleccionado);
        }
    }
}());
