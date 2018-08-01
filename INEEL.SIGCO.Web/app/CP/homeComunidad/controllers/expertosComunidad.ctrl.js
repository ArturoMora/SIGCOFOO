(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("ExpertosComunidadCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$uibModal",
            "globalGet",
            "$http",
            "MiembrosCPService",
            ExpertosComunidadCtrl
        ]);
    
    function ExpertosComunidadCtrl(AuthService, $scope, $state,  $uibModal, globalGet, $http,  MiembrosCPService) {
        $scope.authentication = AuthService.authentication;
        //$scope.comunidad.comunidadId = $stateParams.id;

        $scope.elementosSelectContactos = [];

        $scope.contactos = {};
        $scope.contactos.selected = undefined;

        $scope.botonAgregarContacto = false;
        $scope.botonRegistrarExperto = false;

        $scope.muestraPanelAgregar = false;
        $scope.boculta = false;
        $scope.bmuestra = true;

        $scope.objetoEliminar = {};
        $scope.objetoActualizar = {};
        
        $scope.clavePersonaExperto = "";

        $scope.especialidadRespaldo = "";

        var API = globalGet.get("api");
        var endPointContactos = API + "Contactos/GetAllForSelect/";
           

        MiembrosCPService.getByComunidadLider($scope.comunidad.comunidadId).then(
         function (result) {
             $scope.liderComunidad = result.data;
          
         }, function (err) {
             toastr.error("Se presentó un problema al obtener sus credenciales de acceso a está comunidad");
             console.log(err);
         });
      
        $scope.eliminarTotalMente = function (obj) {
            $scope.objetoEliminar = obj;
            MiembrosCPService.deleteExterno($scope.objetoEliminar.expertoId).then(
               function (result) {
                   toastr.success("Registro eliminado exitosamente!");
                   var idx = ($scope.expertos.indexOf($scope.objetoEliminar));
                   $scope.expertos.splice(idx, 1);
                   $scope.objetoEliminar = {};
               },
               function (err) {
                   toastr.error("No se ha podido eliminar el registro");
                   console.log(err);
               });

        }

        $scope.refreshelementosSelectContactos = function (search) {
            $scope.botonAgregarContacto = false;
            $scope.botonRegistrarExperto = false;

            if (search != undefined && search.length > 1) {
                //var params = { vocabulario: search, sensor: false };

                var getDatos = endPointContactos;
                return $http.post(getDatos, { "cadena": search }).then(function (response) {                  
                    $scope.elementosSelectContactos = response.data;
                    if ($scope.elementosSelectContactos == null || $scope.elementosSelectContactos.length == 0) {
                        $scope.elementosSelectContactos = [];
                       // $scope.elementosSelectContactos.push({ "proyectoId": "Sin resultados con este criterio", "nombre": "" });
                        toastr.error("El contacto que desea agregar no se encuentra registrado en el sistema");
                        $scope.contactos = {};
                        $scope.botonAgregarContacto = true;
                        $scope.botonRegistrarExperto = false;
                    } else {
                        $scope.botonRegistrarExperto = true;
                        $scope.botonAgregarContacto = false;
                    }
                },
                function (error) {
                    $scope.contactos = {};
                    toastr.error("Error al recuperar los datos de los contactos registrados en el sistema");
                    console.log(error);
                }
                );
            } else {
              
                $scope.elementosSelectContactos = [];
                $scope.contactos = {};
            }
        };

        $scope.contacto = {};
        $scope.crearContacto = function () {
                $scope.botonAgregarContacto = false;
                $scope.selectItem = {};
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    templateUrl: 'app/vistasGenericas/contactoModalCPAdd.html',
                    controller: 'ContactoModalCPAddCtrl',
                    resolve: {
                        selectItem: function () {
                            return $scope.selectItem;
                        }
                    },
                    scope: $scope
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.contactos.selected = selectedItem;
                    $scope.contactos.selected.nombre = selectedItem.nombreContacto + " " + selectedItem.apellidoPaterno + " " + selectedItem.apellidoMaterno;
                    $scope.contactos.selected.clave = selectedItem.contactoId;
                    $scope.botonRegistrarExperto = true;
                    
                });
        }
         
        //llenar el combo de lineas de investigacion 
        $scope.llenarlineasInvestigacion = function () {
            MiembrosCPService.getLineasDesarrolloTecnologico().then(
                function (response) {
                    $scope.lineas = response.data;
                },
                function (error) {
                    toastr.warning(error.data.message);
                }
            );
        };

        //obtener expertos registrados en la comunidad
        $scope.obtenExpertos = function () {
            MiembrosCPService.obtenExpertosPorComunidad($scope.comunidad.comunidadId).then(
                function (response) {
                    $scope.expertos = response.data;          
                },
                function (error) {
                    toastr.warning(error.data.message);
                }
            );        
        };
       
        $scope.openMiembro = function () {
            $scope.selectItem = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/directivas/buscarPersonasActivasDirective/buscarPersonasActivasModalFilterGet.html',
                controller: 'PersonasActivasModalFilterGetCtrl',
                resolve: {
                    selectItem: function () {
                        return $scope.selectItem;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.botonRegistrarExperto = true;
                $scope.investigador = selectedItem.nombreCompleto;
                $scope.clavePersonaExperto = selectedItem.clavePersona;

            });
        }

        //OCULTA ELEMENTOS ASOCUADO AL DROW LIST DE TIPO DE EXPERTO
        $scope.ocultaElementos = function () {
            $scope.botonRegistrarExperto = false;
        }

        $scope.llenarlineasInvestigacion();

        $scope.obtenExpertos();

        $scope.muestraPanel = function () {
            
            $scope.muestraPanelAgregar = true;
            $scope.boculta = true;
            $scope.bmuestra = false;
        }

        $scope.ocultaPanel = function () {
            $scope.muestraPanelAgregar = false;
            $scope.boculta = false;
            $scope.bmuestra = true;
        }

        //REGISTRA EXPERTO INTERNO O EXTERNO
        $scope.registrarExperto = function () {
            if ($scope.liderComunidad != null) {
                var personaYaRegistrada = 0;

                for (var i = 0; i < $scope.expertos.length; i++) {
                    if ($scope.tipoExperto == 2) {
                        if (parseInt($scope.expertos[i].contactoId) == parseInt($scope.contactos.selected.clave)) {
                            personaYaRegistrada = 1;
                            break;
                        }
                    } else {

                        if ($scope.tipoExperto == 1) {

                            if ($scope.expertos[i].clavePersona == $scope.clavePersonaExperto) {
                                personaYaRegistrada = 1;
                                break;
                            }
                        }
                    }
                }

                if (personaYaRegistrada == 0) {

                    if ($scope.tipoExperto == 2) {

                        if ($scope.lineadeinvestigacion == undefined || $scope.contactos.selected.clave == null || $scope.especialidad == undefined) {
                            toastr.error("Complete los campos requeridos");
                            return false;
                        }

                    } else {
                        if ($scope.tipoExperto == 1) {
                            if ($scope.lineadeinvestigacion == undefined || $scope.clavePersonaExperto == "" || $scope.especialidad == undefined) {
                                toastr.error("Complete los campos requeridos");
                                return false;
                            }
                        }
                    }

                    $scope.experto = {};

                    if ($scope.tipoExperto == 2) {
                        //experto externoo
                        $scope.experto.contactoId = $scope.contactos.selected.clave;
                        $scope.experto.tipoExperto = 2;
                        $scope.experto.especialidad = $scope.especialidad;
                        $scope.experto.lineaDesarrolloTecnologicoId = $scope.lineadeinvestigacion.lineaDesarrolloTecnologicoId;
                        $scope.experto.investigadores = null;
                        $scope.experto.investigadorLiderAsociado = $scope.liderComunidad.idPersonas;
                        $scope.experto.ComunidadId = $scope.comunidad.comunidadId;
                        $scope.experto.ClavePersona = "";
                        $scope.experto.estado = true;
                    } else {
                        //experto interno
                        if ($scope.tipoExperto == 1) {
                            //$scope.experto.contactoId = null;
                            $scope.experto.tipoExperto = 1;
                            $scope.experto.especialidad = $scope.especialidad;
                            $scope.experto.lineaDesarrolloTecnologicoId = $scope.lineadeinvestigacion.lineaDesarrolloTecnologicoId;
                            $scope.experto.investigadores = null;
                            $scope.experto.investigadorLiderAsociado = $scope.liderComunidad.idPersonas;
                            $scope.experto.ComunidadId = $scope.comunidad.comunidadId;
                            $scope.experto.ClavePersona = $scope.clavePersonaExperto;
                            $scope.experto.estado = true;
                        }
                    }

                    var nomInvest = "";
                    var foto = "";

                    nomInvest = $scope.investigador;

                    MiembrosCPService.crearExpertoSinInvestigadores($scope.experto).then(
                        function (result) {
                            toastr.success("Registro creado exitosamente!");
                            result.data.nombreCompleto = nomInvest;
                            $scope.expertos.push(result.data);

                            $scope.elementosSelectContactos = [];
                            $scope.contactos = {};
                            $scope.especialidad = "";
                            $scope.investigador = "";
                            $scope.tipoExperto = -1;
                            $scope.clavePersonaExperto = "";

                            $scope.botonRegistrarExperto = false;
                            $scope.botonAgregarContacto = false;

                            $scope.muestraPanelAgregar = false;
                            $scope.boculta = false;
                            $scope.bmuestra = true;
                            //$scope.lineadeinvestigacion.lineaDesarrolloTecnologicoId = null;
                        },
                        function (error) {
                            toastr.error(error.data.message);
                        });


                } else {
                    toastr.error("El contacto seleccionado ya se encuentra registrado como miembro experto en la comunidad");

                    $scope.elementosSelectContactos = [];
                    $scope.contactos = {};
                    $scope.especialidad = "";
                    $scope.investigador = "";
                    $scope.tipoExperto = -1;
                    $scope.clavePersonaExperto = "";

                    $scope.botonRegistrarExperto = false;
                    $scope.botonAgregarContacto = false;

                    $scope.muestraPanelAgregar = false;
                    $scope.boculta = false;
                    $scope.bmuestra = true;
                }
            } else {
                toastr.error("La comunidad no cuenta con un lider registrado, agregue uno en la sección de administración de la comunidad");
                $scope.muestraPanelAgregar = false;
                $scope.boculta = false;
                $scope.bmuestra = true;
            }

        }//FIN DE REGISTRAR EXPERTO
     
        $scope.deleteMiembro = function (obj) {
            $scope.objetoEliminar = obj;
            $scope.datosUsuario = "Ex";
            $scope.mensajeEliminacion = "Seguro que desea eliminar al experto seleccionado";
            
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/homeComunidad/eliminacionModal/eliminacionFisica.html',
                controller: 'eliminarMiembroCPCtrl',
                scope: $scope
            });
        }


        $scope.actualizarExpertoExterno=function(obj){
            $scope.expertoPosibleEdicion=obj;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/homeComunidad/expertosModal/expertosEdit.html',
                controller: 'expertoCPEditCtrl',
                scope: $scope
            });   
            modalInstance.result.then(function (selectedItem) {
                var index= $scope.expertos.indexOf($scope.expertoPosibleEdicion);
                $scope.expertos[index]=selectedItem;
            });
        }
        $scope.objetoAActualizar = function (obj) {

            $scope.especialidadRespaldo = obj.especialidad;
            $scope.objetoActualizar = obj;
            
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/homeComunidad/expertosModal/expertosEdit.html',
                controller: 'expertoCPEditCtrl',
                scope: $scope
            });
        }


    }

})();