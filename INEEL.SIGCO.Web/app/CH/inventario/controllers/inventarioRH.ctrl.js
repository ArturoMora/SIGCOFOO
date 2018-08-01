(function () {
    'use strict';
    angular
        .module("ineelCH")
        .controller('inventarioRHCtrl', ['MenuService', '$scope', 'AuthService', '$stateParams', '$rootScope', 'gestionfichasService', '$state', '$uibModal', '$http', 'globalGet', 'comunDetailsService', '$window', inventarioRHCtrl]);
    angular
        .module("ineelCH")
        .controller("editarFotoCtrl", ["$scope", "$uibModalInstance", "gestionfichasService", "globalGet", "uploadFileACH", editarFotoCtrl]);

    function inventarioRHCtrl(MenuService, $scope, AuthService, $stateParams, $rootScope, gestionfichasService, $state, $uibModal, $http, globalGet, comunDetailsService, $window) {

        $scope.authentication = AuthService.authentication;
        $scope.experiencia = true;
        $scope.guardar = true;
        $scope.detail = false;
        if (MenuService.getRolId() == 1) {
            $scope.detail = true;
        }
        $rootScope.origen = "FichaCurricular";//no cambiar
        $rootScope.setOrigen("CH");
        //Gestion de ficha
        $scope.id = $rootScope.GestionFichasClave;

        if ($scope.id == null) {
            $scope.datosUsuario = AuthService.authentication.userprofile;
            comunDetailsService.getPersonaById($scope.datosUsuario.clavePersona).then(
                function (result) {
                    $scope.persona = result.data;
                },
                function (err) {
                    $scope.persona = {};
                    toastr.error("No se han podido cargar los registros de Ponencias");
                }
            );

            comunDetailsService.getalmamater($scope.datosUsuario.clavePersona).then(
                function (result) {
                    $scope.almamater = result.data;
                    if($scope.almamater.fechaTermino!=null){
                        $scope.almamater.fechaTermino = new Date($scope.almamater.fechaTermino);
                    }
                    
                },
                function (err) {
                    $scope.persona = {};
                    toastr.error("No se han podido cargar los registros de Ponencias");
                }
            );

            comunDetailsService.getExtractoById($scope.datosUsuario.clavePersona).then(
                function (result) {
                    $scope.extractoProfesional = {};
                    if (result.data != null) {
                        $scope.extractoProfesional = result.data;
                        $scope.extractoProfesional.extracto = $scope.extractoProfesional.extracto.replace(/\n/g, '<br/>');
                    }


                },
                function (err) {
                    $scope.extractoProfesional = {};
                    toastr.error("No se han podido cargar los datos de semblanza profesional");
                }
            );
        } else {

            gestionfichasService.getByClaveSoloUno($scope.id).then(
                function (result) {
                    $scope.datosUsuario = result.data.persona;
                    comunDetailsService.getPersonaById($scope.datosUsuario.clavePersona).then(
                        function (result) {
                            $scope.persona = result.data;
                        },
                        function (err) {
                            $scope.persona = {};
                            toastr.error("No se han podido cargar los registros de Ponencias");
                        }
                    );

                    comunDetailsService.getalmamater($scope.datosUsuario.clavePersona).then(
                        function (result) {
                            $scope.almamater = result.data;
                        },
                        function (err) {
                            $scope.persona = {};
                            toastr.error("No se han podido cargar los registros de Ponencias");
                        }
                    );

                    comunDetailsService.getExtractoById($scope.datosUsuario.clavePersona).then(
                        function (result) {
                            $scope.extractoProfesional = {};
                            if (result.data != null) {
                                $scope.extractoProfesional = result.data;
                                $scope.extractoProfesional.extracto = $scope.extractoProfesional.extracto.replace(/\n/g, '<br/>');
                            }


                        },
                        function (err) {
                            $scope.extractoProfesional = {};
                            toastr.error("No se han podido cargar los datos de semblanza profesional");
                        }
                    );
                });
        }
        $rootScope.GestionFichasClave = $scope.id;

        $scope.seccion = $stateParams.seccion;
        //$scope.seccionaptitudes = false;
        $scope.seccionf = false;
        $scope.seccioni = false;
        $scope.seccions = false;
        $scope.secciond = false;
        $scope.secciona = false;
        $scope.seccionbi = false;
        $scope.secciontd = false;
        $scope.seccionbe = false;
        $scope.seccionbpub = false;
        $scope.seccionbd = false;
        $scope.seccioned = false;
        $scope.seccionee = false;
        $scope.seccionpon = false;
        $scope.seccionpartipro = false;
        $scope.seccioncursointerno = false;
        $scope.secciondaexterno = false;
        $scope.seccionpiexterno = false;
        $scope.capacitacionesycert = false;
        $scope.logrosreconocimientos = false;
        $scope.certificacionesobtenidas = false;
        $scope.capitulo = false;

        $scope.seccion = $stateParams.seccion;
        $scope.seccionPrevia = null;
        function loadSeccion(seccionState) {
            switch (seccionState) {
                case 'fichapersonal.publicacion':
                    $scope.seccionbpub = true;
                    break;
                //case 'fichapersonal.aptitudes':
                //    $scope.seccionaptitudes = true;
                //    break;
                case 'fichapersonal.asociacion':
                    $scope.secciona = true;
                    break;
                case 'fichapersonal.becariodirigido':
                    $scope.seccionbd = true;
                    break;
                case 'fichapersonal.becarioexterno':
                    $scope.seccionbe = true;
                    break;
                case 'fichapersonal.becariointerno':
                    $scope.seccionbi = true;
                    break;
                case 'fichapersonal.capacitacionesycert':
                    $scope.capacitacionesycert = true;
                    break;
                case 'fichapersonal.capitulo':
                    $scope.capitulo = true;
                    break;
                case 'fichapersonal.certificacionesobtenidas':
                    $scope.certificacionesobtenidas = true;
                    break;
                case 'fichapersonal.cursointerno':
                    $scope.seccioncursointerno = true;
                    break;
                case 'fichapersonal.daexterno':
                    $scope.secciondaexterno = true;
                    break;
                case 'fichapersonal.experienciadocente':
                    $scope.seccioned = true;
                    break;
                case 'fichapersonal.experienciaexterna':
                    $scope.seccionee = true;
                    break;
                case 'fichapersonal.fa':
                    $scope.seccionf = true;
                    break;
                case 'fichapersonal.idiomas':
                    $scope.seccioni = true;
                    break;

                case 'fichapersonal.distincion':
                    $scope.secciond = true;
                    break;

                case 'fichapersonal.participacion':
                    $scope.seccionpartipro = true;
                    break;
                case 'fichapersonal.ponencia':
                    $scope.seccionpon = true;
                    break;
                case 'fichapersonal.piexterno':
                    $scope.seccionpiexterno = true;
                    break;


                case 'fichapersonal.tesisdirigida':
                    $scope.secciontd = true;
                    break;

                case 'fichapersonal.sni':
                    $scope.seccions = true;

                    break;
                case 'logrosreconocimientos':
                    //pendiente
                    $scope.logrosreconocimientos = true;
                    break;
                default:
                    //alert("Ninguna sección previa");
                    console.error("Ninguna sección previa");
                    break;
            }
            $state.go(seccionState);//se asume distinto a null y state valido
        }
        switch ($scope.seccion) {

            case 'seccionaptitudes':
                $scope.seccionaptitudes = true;
                break;
            case 'formacionacademica':
                $scope.seccionf = true;

                break;
            case 'idiomas':
                $scope.seccioni = true;
                break;
            case 'sni':
                $scope.seccions = true;

                break;
            case 'distincion':
                $scope.secciond = true;
                break;
            case 'asociacion':
                $scope.secciona = true;
                break;
            case 'becariointerno':
                $scope.seccionbi = true;
                break;
            case 'tesisdirigida':
                $scope.secciontd = true;
                break;
            case 'becarioexterno':
                $scope.seccionbe = true;
                break;
            case 'publicacion':
                $scope.seccionbpub = true;
                break;
            case 'becariodirigido':
                $scope.seccionbd = true;
                break;
            case 'experienciadocente':
                $scope.seccioned = true;
                break;
            case 'experienciaexterna':
                $scope.seccionee = true;
                break;
            case 'ponencia':
                $scope.seccionpon = true;
                break;
            case 'participacion':
                $scope.seccionpartipro = true;
                break;
            case 'cursointerno':
                $scope.seccioncursointerno = true;
                break;
            case 'daexterno':
                $scope.secciondaexterno = true;
                break;
            case 'piexterno':
                $scope.seccionpiexterno = true;
                break;
            case 'capacitacionesycert':
                $scope.capacitacionesycert = true;
                break;
            case 'logrosreconocimientos':
                $scope.logrosreconocimientos = true;
                break;
            case 'certificacionesobtenidas':
                $scope.certificacionesobtenidas = true;
                break;
            case 'capitulo':
                $scope.capitulo = true;
                break;

            default:
                $scope.seccionPrevia = $rootScope.getVariable("CHficha");
                if ($scope.seccionPrevia != undefined && $scope.seccionPrevia != null) {
                    loadSeccion($scope.seccionPrevia);
                }
                //console.error("Selección icorrecta, $scope.seccion=" + $scope.seccion);
                break;
        }

        var timeout = window.setTimeout(scroll, 500);
        function scroll() {
            $window.scrollTo(0, angular.element($('div[ui-view="' + $scope.seccion + '"]'))[0].offsetTop + 600);
        }

        $scope.getadjunto64 = function () {

            gestionfichasService.getadjunto64($scope.datosUsuario.clavePersona).then(
                function (result) {
                    $scope.datosUsuario.adjunto64 = result.data;
                },
                function (err) {
                    toastr.error("Error al obtener la imagen.");
                }
            );

        }
        //$scope.getadjunto64();

        $scope.salir = function () {
            $rootScope.GestionFichasClave = null;
            $rootScope.GestionFichasNombre = null;
            $state.go("gestionfichas");
        }

        $scope.editar = function () {
            $scope.experiencia = false;
            $scope.guardar = false;
        }

        $scope.save = function () {
            debugger;
            var usr = {
                fechaEfectiva: $scope.persona.fechaEfectiva,
                ClavePersona: $scope.persona.clavePersona,
                ExperienciaPrevia: $scope.persona.experienciaPrevia
            };
            gestionfichasService.updateUserExperience(usr).then(

                function (result) {
                    $scope.experiencia = true;
                    $scope.guardar = true;
                },
                function (err) {
                    toastr.error("Error al actualizar");
                }
            );
        }



        $scope.openEditarFoto = function () {

            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CH/inventario/editarFoto.html',
                controller: 'editarFotoCtrl',
                resolve: {
                    datosUsuario: function () {
                    }
                },
                scope: $scope
            });

            modalInstance.result.then(function (result) {
                $scope.persona.adjunto64 = result.adjunto64;
               // $scope.persona.detallePersona.adjunto = result.detallePersona.adjunto;
            });

        }

        $scope.openEditarExtracto = function () {

            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: "app/CH/extractoProfesional/ExtractoProfesional.html",
                controller: "ExtractoProfesionalCtrlAdd",
                resolve: {
                    datosUsuario: function () {
                    }
                },
                scope: $scope
            });

            modalInstance.result.then(function (result) {
                $scope.extractoProfesional.extracto = result.replace(/\n/g, '<br/>');;
            });

        }

    }

    function editarFotoCtrl($scope, $uibModalInstance, gestionfichasService, globalGet, uploadFileACH) {
        var API = globalGet.get("api");
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.deshabilitarguardar = true;

        $scope.restableceFoto = function () {
           
            $scope.persona.detallePersona.adjunto = null;
            
            gestionfichasService.eliminarfoto($scope.datosUsuario).then(
                function(result) {
                    $scope.datosUsuario = result.data;
                    $uibModalInstance.close($scope.datosUsuario);
                },function(err) {
                    toastr.error("Error al actualizar");
                    console.log(err);
                });
        }

        $scope.guardarFoto = function () {
            gestionfichasService.guardarfoto($scope.datosUsuario).then(
                function (result) {
                    $scope.datosUsuario = result.data;
                    $scope.persona.detallePersona.adjunto = result.data.detallePersona.adjunto;
                    $uibModalInstance.close($scope.datosUsuario);
                },
                function (err) {
                    toastr.error("Error al actualizar");
                }
            );
        }



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
                        console.log("result:");
                        console.log(result);

                        if (!result.error) {
                            transferComplete(result);
                        } else {
                            toastr.error(result.message);
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        toastr.error(error);
                    }

                });
        };
        function transferComplete(result) {
            $scope.datosUsuario.detallePersona = {};
            $scope.$apply(function () {
                if (result.error === false) {
                    $scope.datosUsuario.detallePersona.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.deshabilitarguardar = false;
                }
            });

        }

    }
}());
