(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("InicioComunidadGetCtrl", [
            "AuthService",
            "$sce",
            "$scope",
            "$stateParams",
            "$uibModal",
            "NoticiasCPService",
            "ComunidadesCPService",
            "AgendaCPService",
            "MiembrosCPService",
            "PostComunidadCPService",
            InicioComunidadGetCtrl
        ]);

    function InicioComunidadGetCtrl(AuthService, $sce, $scope, $stateParams, $uibModal, NoticiasCPService, ComunidadesCPService, AgendaCPService, MiembrosCPService, PostComunidadCPService) {
        var idComunidad = $scope.comunidad.comunidadId;
        $scope.authentication = AuthService.authentication;
        
        $scope.ultimoRegistro = 0;
        $scope.topeRegistros = 0;
        $scope.nuevoPost = false;
        $scope.nuevoComentario = {};
        $scope.idEventoActualizar = 0;
        $scope.postis = [];
        $scope.fooComent = "";

        $scope.cargaNoticias = function () {
            NoticiasCPService.getBycomunidad(idComunidad)
            .then(function (res) {
                $scope.comunidad.noticias = res.data;
            },
                function (err) {
                    toastr.error("Error al cargar las noticias de la comunidad");
                    console.log(err);
                });
        }

        $scope.agregaNoticia = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/modalesCP/Noticias/AgregarNoticiaComunidad.html',
                controller: 'AgregarNoticiaComunidadCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.cargaNoticias();
            });
        }

        $scope.eliminaNoticia = function (noticia) {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        ComunidadesCPService.deleteNoticia(noticia.noticiaId).then(function (result) {
                            toastr.success(result.data);
                            $scope.cargaNoticias();
                            $uibModalInstance.close();
                        }, function (err) {
                            toastr.error("Error al eliminar la noticia");
                            console.log(err);
                        });
                    }, $scope.cancel = function () {
                        $uibModalInstance.close();
                    }
                },
                scope: $scope
            });
        }

        $scope.editaNoticia = function (objeto) {
            $scope.noticiaEditar = objeto;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/modalesCP/Noticias/EditarNoticiaComunidad.html',
                controller: 'EditarNoticiaComunidadCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.cargaNoticias();
            });
        };

        $scope.cargaPost = function () {
            if ($scope.ultimoRegistro == 0 || $scope.nuevoPost==true) {
                var busqueda = { 'idComunidad': $scope.comunidad.comunidadId, 'ultimoPost': $scope.ultimoPost };
                PostComunidadCPService.getByComunidadSinComentarios(busqueda)
                    .then(function (res) {
                        $scope.postes = res.data;
                        var timeout = window.setTimeout(250);
                        
                        $scope.cargaRegistros();
                    },
                        function (err) {
                            toastr.error("Error al conseguir registros");
                            console.log(err);
                        });
            } else {
                $scope.cargaRegistros();
            }
        }

        $scope.cargaRegistros = function () {
            if ($scope.nuevoPost) {
                $scope.topeRegistros = 0;
                $scope.ultimoRegistro = 0;
                $scope.nuevoPost = false;
                $scope.postis = [];
            }
            if ($scope.topeRegistros != $scope.postes.length) {
                for (var c = $scope.ultimoRegistro; c < $scope.postes.length; c++) {
                    $scope.postis.push($scope.postes[c]);
                    $scope.ultimoRegistro++;
                    $scope.topeRegistros = $scope.postis.length;
                    break;
                }
            }
        }

        $scope.verComentarios = function (id) {
            PostComunidadCPService.getComentariosByPost(id).then(function (res) {
                $scope.idPostActual = id;
                $scope.comentariosPost = res.data;
                
            },function(err) {
                toastr.error("Error al recuperar los comentarios de la publicación");
                console.log(err);
            });
        }

        $scope.agregaPost = function () {
            if ($scope.post != null) {
                $scope.postForBuild = {
                    'descripcion': $scope.post,
                    'idComunidad': $scope.comunidad.comunidadId
                };
                if ($scope.rol.administrador) {
                    $scope.postForBuild.idPersona = $scope.rol.datosMiembro.userprofile.clavePersona;
                } else {
                    $scope.postForBuild.idMiembroCP = $scope.rol.datosMiembro.miembroId;
                }

                PostComunidadCPService.create($scope.postForBuild)
                    .then(function(res) {
                            toastr.success("Registro creado exitosamente!");
                            $scope.post = null;
                            $scope.nuevoPost = true;
                            $scope.crearPost = false; // variable que indica si se creó o no un post
                            $scope.cargaPost();
                        },
                        function(err) {
                            toastr.error("Error al crear el post");
                            console.log(err);
                        });
            } else {
                toastr.error("Debes de ingresar contenido para la publicaci&oacute;n");
                return false;
            }
            
        }

        $scope.agregarComentario = function (idPost, comentarioUsuario,numPost) {
            
            $scope.nuevoComentario.postId = idPost;
            $scope.nuevoComentario.comentario = comentarioUsuario;
            if ($scope.nuevoComentario.comentario != null) { //Si el comentario esta vacio
                if ($scope.rol.administrador || ($scope.comunidad.tipoAcceso && $scope.rol.invitado)) { //Si los que comentan son el administrador o invitados
                    $scope.nuevoComentario.idPersona = $scope.rol.datosMiembro.userprofile.clavePersona;
                } else {
                    $scope.nuevoComentario.idMiembroCP = $scope.rol.datosMiembro.miembroId; //Si son miembros ...
                }
                PostComunidadCPService.createComentario($scope.nuevoComentario)
                    .then(function(res) {
                        toastr.success("Comentario agregado exitosamente!");
                        var x = document.getElementById(idPost); //se elimina el contenido de la caja de texto
                            x.value = "";
                            $scope.verComentarios($scope.idPostActual);
                            $scope.postis[numPost].numeroComentarios += 1;
                            //for (var c = 0; c < $scope.postis.length; c++) {
                            //    if ($scope.postis[c].postId == idPost) {

                            //    }
                            //}
                        },
                        function(err) {
                            toastr.error("Error al crear el comentario");
                            console.log(err);
                        });
            } else {
                toastr.error("Escriba un comentario");
                return false;
            }

            
        }

        $scope.eventosRegistrados = function () {
            AgendaCPService.getByComunidad(idComunidad).then(
                 function (result) {
                     $scope.eventos = result.data;
                 },
                 function (err) {
                     toastr.error("No se han podido cargar los registros");
                 });
        }

        $scope.modificarEvento = function (id) {
            $scope.idEventoActualizar = id;

            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/CP/homeComunidad/eventosModal/eventosEdit.html',
                controller: 'eventosCPEditCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.eventosRegistrados();
            });
            
           

        }

        $scope.notificacionEventoMiembros = function (id, obj) {

            var fechaReunion = new Date(obj.fechaReunion);
            var horaReunion = new Date(obj.horaReunion);

            var Mail = {
                "Modulo": "Comunidades de Práctica",
                "Empleado": "Lider de la comunidad",
                "Descripcion1": obj.asunto,
                "Descripcion2": obj.lugar,
                "Descripcion3": " el día " + (fechaReunion.getDay() + 1) + "/" + (fechaReunion.getMonth() + 1) + "/" + fechaReunion.getFullYear() + " a las " + horaReunion.getHours() + ":" + horaReunion.getMinutes(),
                "Descripcion4": $scope.comunidad.descripcion,
                "Seccion": "Notificación de eventos",
                "TipoCorreo": "NotificacionEventosCP",
                "id": idComunidad,
                "agenda": obj
            };

            MiembrosCPService.enviaNotificaciones(Mail).then(
              function (result) {
                  //console.log(result);
                  if (result.data == "enviado") {
                      toastr.success("Se ha notificado a los miembros de la comunidad sobre el evento");
                      $scope.eventosRegistrados();
                  } else {
                      toastr.error("Falla en el envío de notificaciones a los miembros de la comunidad");
                  }

              },
              function (err) {
                  toastr.error("Falla en el envío de notificaciones a los miembros de la comunidad");
              });

        }



        $scope.eventosRegistrados();
        $scope.cargaNoticias();
        $scope.cargaPost();

    }

})();