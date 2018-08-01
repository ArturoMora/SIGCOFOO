(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("AdministracionComunidadCtrl", [
            "AuthService",
              "$filter",
            "$scope",
            "$state",
            "globalGet",
            "$uibModal",
            "uploadFileACH",
			"$uibModalInstance",
            "DTOptionsBuilder",
            "ComunidadesCPService",
            "ResultadosEsperadosComunidadCPService",
            "MiembrosCPService",
            AdministracionComunidadCtrl
        ]);

    function AdministracionComunidadCtrl(AuthService,   $filter, $scope, $state, globalGet, $uibModal, uploadFileACH, $uibModalInstance, DTOptionsBuilder, ComunidadesCPService, ResultadosEsperadosComunidadCPService, MiembrosCPService) {
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('frtp').withDisplayLength(-1);
        $scope.authentication = AuthService.authentication;
        var API = globalGet.get("api");
        $scope.acceso = [{ 'atributo': "Público", 'valor': true }, { 'atributo': "Restringido", 'valor': false }];
        $scope.comunidad.fechaAlta = new Date($scope.comunidad.fechaAlta);
        $scope.categoria = $scope.comunidad.idCategoria;
        $scope.active1 = true;


        $scope.nombreLider = "";
        $scope.claveLider = "";
        $scope.claveRolLider = 3;

        $scope.nombreSecretario = "";
        $scope.claveSecretario = "";
        $scope.claveRolSecretario = 4;

        $scope.cambioLider = 0;
        $scope.cambioSecretario = 0;

        //Categorias de una comunidad
        $scope.categorias = function () {
            ComunidadesCPService.getAllCategorias().then(function (result) {
                $scope.categorias = result.data;
                setTimeout(estiloArchivo, 500);
                if ($scope.comunidad.idAjunto == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;

                }
            }, function (err) {
                toastr.error("No se han podido cargar los registros de categorías");
                console.log(err);
            });
        }

        //compromisos de una comunidad
        $scope.cargaCompromisos = function () {
            ComunidadesCPService.getAllCompromisos($scope.comunidad.comunidadId).then(function (result) {
                $scope.compromisos = result.data;
            }, function (err) {
                toastr.error("No se han podido cargar los registros de compromisos");
                console.log(err);
            });
        }

        //agrega compromisos de una comunidad
        $scope.agregaMeta = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/modalesCP/AdministracionComunidad/AgregarCompromisosComunidad.html',
                controller: 'AgregarCompromisoComunidadCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.cargaCompromisos();
            });
        }

        //edita compromisos de una comunidad
        $scope.editaMeta = function (obj) {
            $scope.metaEdit = obj;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/modalesCP/AdministracionComunidad/EditarCompromisosComunidad.html',
                controller: 'EditarCompromisoComunidadCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.cargaCompromisos();
            });
        }

        //elimina compromiso
        $scope.eliminaMeta=function(id) {
            //NOTA: Al eliminar una meta tambien se eliminan sus resultados, es una eliminacion en cascada en automatico desde la BD
            ComunidadesCPService.deleteCompromiso(id).then(function(result) {
                toastr.success(result.data);
                $scope.cargaCompromisos();
            },function(err) {
                toastr.error("Error al eliminar el compromiso");
                console.log(err);
            });
        }

        //carga resultados comunidad
        $scope.resultadosPorComunidad = function () {
            ResultadosEsperadosComunidadCPService.getBycomunidad($scope.comunidad.comunidadId).then(
                function (result) {
                    $scope.resultadosComunidad = result.data;
                }, function (err) {
                    toastr.error("Error al cargar los registros de resultados");
                    console.log(err);
                });
        }

        //agrega resultados comunidad
        $scope.agregaResultado = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/modalesCP/AdministracionComunidad/AgregarResultadoComunidad.html',
                controller: 'AgregarResultadoComunidadCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.resultadosPorComunidad();
            });
        }

        //editar resultados comunidad
        $scope.editaResultado = function (obj) {
            $scope.resultadoEdit = obj;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/modalesCP/AdministracionComunidad/EditarResultadoComunidad.html',
                controller: 'EditarResultadoComunidadCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.resultadosPorComunidad();
            });
        }

        //elimina resultado
        $scope.eliminaResultado=function(id) {
            ResultadosEsperadosComunidadCPService.delete(id).then(function (result) {
                $scope.resultadosPorComunidad();
                toastr.success(result.data);
            },function(err) {
                toastr.error("Error al eliminar el resultado");
                console.log(err);
            });
        }

        //switch entre pestanas
        $scope.switchTab = function () {
            $scope.active1 = false;
            $scope.active2 = false;
            $scope.active3 = false;

            switch ($scope.tab) {
                case 1:
                    $scope.active1 = true;
                    break;
                case 2:
                    $scope.active2 = true;
                    $scope.cargaCompromisos();
                    break;
                case 3:
                    $scope.active3 = true;
                    $scope.resultadosPorComunidad();
                    break;
                default:
            }
        }

        var estiloArchivo = function () {

            $(":file").addClass("filestyle");
            $(":file").filestyle({ buttonName: "btn-success" });
            $('.filestyle').each(function () {

                var $this = $(this), options = {
                    'input': $this.attr('data-input') === 'false' ? false : true,
                    'icon': $this.attr('data-icon') === 'false' ? false : true,
                    'buttonBefore': $this.attr('data-buttonBefore') === 'true' ? true : false,
                    'disabled': $this.attr('data-disabled') === 'true' ? true : false,
                    'size': $this.attr('data-size'),
                    'buttonText': $this.attr('data-buttonText'),
                    'buttonName': $this.attr('data-buttonName'),
                    'iconName': $this.attr('data-iconName'),
                    'badge': $this.attr('data-badge') === 'false' ? false : true,
                    'placeholder': $this.attr('data-placeholder')
                };
                $this.filestyle(options);
            });

        }

        //adjunto
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }

            var propiedades = {
                file: adjunto.files[0],
                ext: "png;jpg;jpeg", /* pdf;doc;docx;ppt */
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
                    }
                } else {
                    var error = err.message || "Error al adjuntar";
                    $("#filesGral").filestyle('clear');
                    toastr.error(error);
                }
            });
        };

        function transferComplete(result) {
            //console.log(result);
            $scope.$apply(function () {
                if (result.error === false) {
                    $scope.adminForm.$setDirty();
                    $scope.comunidad.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CP"
                    }
                }
            });
        }

        $scope.deleteFile = function () {
            toastr.success("Imagen eliminada correctamente!");
            $scope.comunidad.Adjunto = null;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
            $scope.regFile = true;
            $scope.adminForm.$setDirty();
        }

        $scope.actualizarComunidad = function () {
            if ($scope.cambioLider == 1) {
                $scope.modificaLider();}

            if ($scope.cambioSecretario == 1) {
                $scope.modificaSecretario();}

            if ($scope.adminForm.$invalid) {
                return false;
            } else {
                ComunidadesCPService.update($scope.comunidad)
                         .then(
                             function (result) {
                                 toastr.success("Comunidad actualizada correctamente!");
                                 $scope.resetCambios();
                                 $uibModalInstance.close(result.data);

                             },
                             function (err) {
                                 console.error(err);
                                 toastr.error("Error al actualizar los datos de la comunidad");
                                 $scope.resetCambios();
                                 $uibModalInstance.close("error");
                             });
            }

        }

        $scope.resetCambios = function () {
            $scope.cambioLider = 0;
            $scope.cambioSecretario = 0;
        }

        $scope.cancel = function () {
          
         
          
            $uibModalInstance.close($scope.comunidad);
            toastr.clear();

            
        }

        $scope.obtenlider = function () {
            MiembrosCPService.getByComunidadLider($scope.comunidad.comunidadId).then(
               function (result) {
                   $scope.liderComunidad = result.data;
                   if (result.data != null) {
                       $scope.nombreLider = $scope.liderComunidad.nombrePersona;
                       $scope.claveLider = $scope.liderComunidad.idPersonas;
                   }
               },
               function (err) {
                   toastr.error("No se han podido cargar los registros");
                   console.log(err);
               });
        }

        $scope.obtensecretario = function () {
            MiembrosCPService.getByComunidadSecretario($scope.comunidad.comunidadId).then(
               function (result) {
                   $scope.secretarioComunidad = result.data;
                   if (result.data != null) {
                       $scope.nombreSecretario = $scope.secretarioComunidad.nombrePersona;
                       $scope.claveSecretario = $scope.secretarioComunidad.idPersonas;
                   }
               },
               function (err) {
                   toastr.error("No se han podido cargar los registros");
                   console.log(err);
               });

        }

        //MODAL PARA SELECCIONAR AL LIDER DE LA COMUNIDAD
        $scope.openLider = function () {
            $scope.selectItem = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
              
                $scope.adminForm.$setDirty();
                $scope.nombreLider = selectedItem.nombreCompleto;
                $scope.claveLider = selectedItem.clavePersona;
                $scope.claveRolLider = 3;

                $scope.cambioLider = 1;
               
            });
        }

        //MODAL PARA SELECCIONAR AL SECRETARIO DE LA COMUNIDAD
        $scope.openSecretario = function () {
            $scope.selectItem = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.adminForm.$setDirty();
                $scope.nombreSecretario = selectedItem.nombreCompleto;
                $scope.claveSecretario = selectedItem.clavePersona;
                $scope.claveRolSecretario = 4;

               
                $scope.cambioSecretario = 1;
            });
        }

        //OBTIENE MIEMBROS DE LA COMUNIDAD
        $scope.miembrosComunidad = function () {
            MiembrosCPService.getMiembrosAdm($scope.comunidad.comunidadId).then(
                function (result) {
                    $scope.miembrosComunidad = result.data;
                },
                function (err) {
                    toastr.error("No se han podido cargar los registros");
                    console.log(err);
                });
        }

        //CAMBIA LIDER DE LA COMUNIDAD
        $scope.modificaLider = function () {
            if ($scope.nombreLider != "") { //Si existe un lider se procede a realizar las operaciones
                var personaYaRegistrada = 0;
                $scope.nuevoLider = {};

                for (var i = 0; i < $scope.miembrosComunidad.length; i++) { //se busca en la lista de miembros
                    if ($scope.miembrosComunidad[i].idPersonas == $scope.claveLider) {
                        debugger;
                        $scope.nuevoLider = $scope.miembrosComunidad[i];  //si el investigador ya existe se guardan los datos en una nueva variable y nuevo rol
                        $scope.nuevoLider.rolId = 3;
                        personaYaRegistrada = 1;
                        break;
                    }
                }


                if (personaYaRegistrada == 1) { // si el investigador ya existe en la lista de miembros
                    if ($scope.liderComunidad != null) {
                        $scope.liderComunidad.rolId = 2; //al viejo lider se le asigna rol de miembro
                        MiembrosCPService.update($scope.liderComunidad).then(function(result){},function(err) {
                            toastr.error("No se ha podido agregar el investigador a la comunidad");
                            console.log(err);
                        });
                    }
                        
                    MiembrosCPService.update($scope.nuevoLider)  //se actualiza el rol del investigador 
                                    .then(
                                        function (result) {
                                            $scope.nuevoLider = {};
                                        },
                                        function (err) {
                                            toastr.error("No se ha podido agregar al investigador a la comunidad");
                                        }
                                    );


                } else { //en caso de que el usuario no esté registrado en la lista de miembros
                    if ($scope.liderComunidad != null) { // Se verifica que la comunidad tenga un lider (para los casos de inforrmación migrada de CP etapa 2)
                        $scope.liderComunidad.rolId = 2;  //Se cambia de rol al viejo lider
                        MiembrosCPService.update($scope.liderComunidad)
                            .then(
                                function (result) { },
                                function (err) {
                                    toastr.error("No se ha podido agregar al investigador a la comunidad");
                                    console.log(err);
                                }
                            );
                    }
                    

                    var miembro = {  //se crea el objeto miembro con los datos del nuevo investigador
                        "fechaAlta": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                        "fechaAceptacion": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                        "aceptacion": false,
                        "nombrePersona": $scope.nombreLider,
                        "idPersonas": $scope.claveLider,
                        "rolId": 3,
                        "idCP": $scope.comunidad.comunidadId,
                        "estado": true
                    };

                    MiembrosCPService.registraMiembro(miembro) //se procede a guardarlo en la bd
                        .then(
                            function(result) { },
                            function(err) {
                                toastr.error("No se ha podido agregar al investigador a la comunidad");
                                console.log(err);
                            }
                        );
                }
            } 

        }//FIN DE CAMBIO DE LIDER 

        //CAMBIA SECRETARIO DE LA COMUNIDAD
        $scope.modificaSecretario = function () {
                     
            if ($scope.nombreSecretario != "") { //verificamos que no sea nulo el nombre del secretario

                var personaYaRegistrada = 0;
                $scope.nuevoSecretario = {};

                for (var i = 0; i < $scope.miembrosComunidad.length; i++) {  //verificamos en la lista de miembros si ya existe la persona que se quiere agregar
                    if ($scope.miembrosComunidad[i].idPersonas == $scope.claveSecretario) {
                        $scope.nuevoSecretario = $scope.miembrosComunidad[i]; //se guardan los datos en caso de que ya exista y su rol se cambia a secretario
                        $scope.nuevoSecretario.rolId = 4;
                        personaYaRegistrada = 1;
                        break;
                    }
                }
              
                if (personaYaRegistrada == 1) { //Si ya existe el investigador en la comunidad
                    if ($scope.secretarioComunidad != null) {
                        $scope.secretarioComunidad.rolId = 2;  //al viejo secretario se le asigna el rol de miembro
                        MiembrosCPService.update($scope.secretarioComunidad)
                        .then(
                              function (result) { }, //no se hay acciones por realizar en este bloque
                              function (err) {
                                  toastr.error("No se ha podido agregar al investigador a la comunidad");
                                  console.log(err);
                              }
                       );
                    }
                    
                    MiembrosCPService.update($scope.nuevoSecretario)  //al investigador que seleccionamos en el modal se le actualiza el rol de secretario en la bd
                    .then(
                            function (result) {
                                $scope.nuevoSecretario = {};
                            },
                            function (err) {
                                toastr.error("No se ha podido agregar al investigador a la comunidad");
                                console.log(err);
                            }
                    );

                }
                else { //Si el investigador no existe en la lista de miembros
                    if ($scope.secretarioComunidad != null) { //Si no hay un secretario registrado en la bd (algunos casos migrados de CP etapa 2)
                        $scope.secretarioComunidad.rolId = 2; // el rol del antiguo secretario cambia a de miembro
                        MiembrosCPService.update($scope.secretarioComunidad)
                        .then(
                                function (result) { },
                                function (err) {
                                    toastr.error("No se ha podido agregar al investigador a la comunidad");
                                }
                          );

                    }
                    
                    var miembro = {  //Se procede a crear el objeto de miembro para guardarlo en la bd
                        "fechaAlta": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                        "fechaAceptacion": ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString(),
                        "aceptacion": true,
                        "nombrePersona": $scope.nombreSecretario,
                        "idPersonas": $scope.claveSecretario,
                        "rolId": 4,
                        "idCP": $scope.comunidad.comunidadId,
                        "estado": true
                    };

                    MiembrosCPService.registraMiembro(miembro)
                    .then(function (result) { },
                              function (err) {
                                  toastr.error("No se ha podido agregar al investigador a la comunidad");
                                  console.log(err);
                              }
                    );
                }
            }
         
        }//FIN DE CAMBIO DE SECRETARIO 


        $scope.categorias();
        // $scope.cargaCompromisos();
        // $scope.resultadosPorComunidad();
        $scope.obtenlider();
        $scope.obtensecretario();
        $scope.miembrosComunidad();
    }

})();