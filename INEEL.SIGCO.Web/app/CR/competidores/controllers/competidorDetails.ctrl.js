(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("CompetidorDetailsCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$stateParams",
            "CompetidoresCRService",
            "DTOptionsBuilder",
            'MenuService',
            '$uibModal',
            'comunService',
            CompetidorDetailsCtrl
        ]);

    function CompetidorDetailsCtrl(AuthService, $scope, $state, $stateParams, CompetidoresCRService, DTOptionsBuilder, MenuService, $uibModal, comunService) {
        $scope.idRol = MenuService.getRolId();
        $scope.permiso = 0;
        $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
        $scope.unidadPersona = AuthService.authentication.userprofile.claveUnidad;
        $scope.isGerenteComercializacion = false;
        $scope.isGerentePropietario = false;
        $scope.competidor_id = $stateParams.id;


        $scope.obtenerPermisos = function () {
            var busquedaAcceso = {
                "clavePersonaSolicitante": $scope.clavePersona,
                "tipoInformacionId": 24,
                "informacionOCId": $scope.competidor_id,
                "moduloId": "CR",
                "tipoArchivo": "vtc"
            };

            CompetidoresCRService.accesoArchivo(busquedaAcceso).then(
                function (result) {
                    $scope.permiso = result.data;
                    busquedaAcceso.tipoArchivo = "tarifa";
                    CompetidoresCRService.accesoArchivo(busquedaAcceso).then(
                        function (result) {
                            $scope.permisoTarifa = result.data;
                        },
                        function (error) {
                            toastr.error(error);
                        });

                },
                function (error) {
                    toastr.error(error);
                });
        }

        $scope.obtenerPermisos();




        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt');

        $scope.tarifa = [];
        $scope.vtc = [];
        $scope.adjuntos = {};

        $scope.servicios = {};
        $scope.productos = {};


        CompetidoresCRService.getCompetidor($scope.competidor_id).then(
            function (result) {

                $scope.competidores = result.data;
                if ($scope.idRol == 4 && $scope.unidadPersona == $scope.competidores.claveUnidad) {
                    $scope.isGerentePropietario = true;
                }
                if ($scope.competidores.unidadOrganizacional != null) {
                    var Jerarquia = {
                        UnidadOrganizacionalId: $scope.competidores.unidadOrganizacional.claveUnidad,
                        JefeHiperonimo: $scope.clavePersona
                    };
                    comunService.isJefeHiperonimoByUnidadOrganizacionalId(Jerarquia).then(
                        function (result) {
                            $scope.esjefe = result.data;
                        },
                        function (error) { }
                    );
                }

                $scope.adjuntos = $scope.competidores.adjuntoPorCompetidor;
                $scope.servicios = $scope.competidores.servicioPorCompetidor;
                $scope.productos = $scope.competidores.productoPorCompetidor;

                //Carga la tarifa y vtc
                if ($scope.adjuntos.length > 0) {
                    angular.forEach($scope.adjuntos, function (value, key) {
                        //
                        if (value.tarifa == true) {
                            $scope.tarifa.push(value);
                        }
                        if (value.vtc == true) {
                            $scope.vtc.push(value);
                        }
                    });
                }

                var estado = "";
                var municipio = "";
                var localidad = "";
                var colonia = "";
                var calle = "";
                var cp = "";

                if ($scope.competidores.empresa.calle != null && $scope.competidores.empresa.calle != undefined) {
                    calle = $scope.competidores.empresa.calle;
                }
                if ($scope.competidores.empresa.colonia != null && $scope.competidores.empresa.colonia != undefined) {
                    colonia = ' ' + $scope.competidores.empresa.colonia;
                }
                if ($scope.competidores.empresa.localidad != null && $scope.competidores.empresa.localidad != undefined) {
                    localidad = ', ' + $scope.competidores.empresa.localidad;
                }

                if ($scope.competidores.empresa.municipios) {
                    if ($scope.competidores.empresa.municipios.nombreMunicipio != null && $scope.competidores.empresa.municipios.nombreMunicipio != undefined) {
                        municipio = ', ' + $scope.competidores.empresa.municipios.nombreMunicipio;
                    }
                }
                if ($scope.competidores.empresa.estados) {
                    if ($scope.competidores.empresa.estados.nombreEstado != null && $scope.competidores.empresa.estados.nombreEstado != undefined) {
                        estado = ', ' + $scope.competidores.empresa.estados.nombreEstado;
                    }
                }
                if ($scope.competidores.empresa.cp != null && $scope.competidores.empresa.cp != undefined) {
                    cp = ', C.P. ' + $scope.competidores.empresa.cp;
                }

                $scope.competidores.direccion = calle + colonia + localidad + municipio + estado + cp;

            },
            function (err) {
                console.error(err);
            });

        //Guardar estado
        $scope.consultaEstado = function (estado) {
            var _estado;

            if (estado == true) {
                _estado = "Activo";
            } else if (estado == false) {
                _estado = "Inactivo";
            }
            return _estado;
        }


        $scope.acceso = function (opcion) {
            //opcion = vtc | tarifa
            var tipoDocumento = "vtc";
            if (opcion == "tarifa") {
                tipoDocumento = "de comparación de tarifas";
            }
            $scope.message = "Acceso al archivo " + tipoDocumento + " del competidor <b>" + $scope.competidores.empresa.nombreEmpresa + "</b> ";
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/SolicitarAccesoGenerico.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function (justif) {
                        $scope.var = modalInstance.result;
                        //Enviar Correo     
                        var Tipo = "accesoGEN";
                        var estado = 8;// 8,9,10
                        //var Texto = "solicita descargar los archivos adjuntos de cursos relacionadas al proyecto <b> ";
                        //$scope.EnviarCorreo(justificacion, Tipo, Texto, estado);
                        var justificacion = "Acceso al archivo " + tipoDocumento + ": " + justif;
                        $uibModalInstance.dismiss('cancel');
                        var Texto = $scope.message + "<br/>";
                        $scope.GuardarSolicitudAcceso(justificacion, Tipo, Texto, estado, opcion);
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.GuardarSolicitudAcceso = function (justificacion, Tipo, Texto, estado, opcion) {

            var solicitud = {
                "clavePersonaSolicitante": $scope.clavePersona,
                "tipoInformacionId": 24,
                "informacionOCId": $scope.competidor_id,
                "idAdicional": opcion,
                "fechaSolicitud": new Date(),
                "unidadAutorizadoraId": $scope.competidores.unidadOrganizacional.claveUnidad,
                "estadoFlujoId": estado,
                "moduloId": "CR"
            };

            comunService.solicitarAcceso(solicitud).then(
                function (result) {
                    $scope.GuardarBitacoraAcceso(result.data.solicitudAccesoId, justificacion, Tipo, Texto, estado);
                    toastr.success("Solicitud enviada");

                    $state.reload();
                    $scope.solicitudExistente = true;

                },
                function (err) {
                    toastr.error("Problema al enviar la solicitud");
                    console.error(err);
                });
        }
        $scope.GuardarBitacoraAcceso = function (idNewSolicitudAcceso, justificacion, Tipo, Texto, estado) {
            //EstadoFlujoId	Descripcion :: //2	Revisión
            var bitacora = {
                "solicitudAccesoId": idNewSolicitudAcceso,
                "fechaMovimiento": new Date(),
                "clavePersona": $scope.clavePersona,
                "descripcion": "Se envió la solicitud",
                "estadoFlujoId": estado,
                "rolAutorizador": 4,
                "UnidadOrganizacionalId": $scope.competidores.unidadOrganizacional.claveUnidad,
                "justificacion": justificacion
            };
            comunService.AddBitacoraSolicitudesAcceso(bitacora).then(
                function (result) { $scope.EnviarCorreo(justificacion, Tipo, Texto, estado); },
                function (error) { }
            );
        }

        $scope.EnviarCorreo = function (justificacion, Tipo, Texto) {
            var Mail = {
                "Modulo": "Capital Relacional",
                "Empleado": $scope.authentication.userprofile.nombreCompleto,
                "Seccion": "CR / Competidor",
                "justificacion": justificacion,
                "Descripcion1": Texto,
                "TipoCorreo": Tipo,
                "UnidadOrganizacionalId": $scope.competidores.unidadOrganizacional.claveUnidad,
                "Subject": "Solicitud de acceso"
            };
            //tipo accesoGEN funciona para cualquier notificación dirigida al responsable de una unidad org
            comunService.mailNotificacion(Mail);
        }

        $scope.regresar = function () {
            var absUrl = $location.absUrl();

            var arrayUrl = absUrl.split("IndexCR.html");
            var host = arrayUrl[0];
            var to = "sigco.html#/SolicitudesAcceso"
            window.location = host + to;
        }


        //Verifica persmisos acceso gerentes
        CompetidoresCRService.verificaGerenteComercializacion($scope.clavePersona).then(
            function (res) {
                if (res.data != null) {
                    $scope.isGerenteComercializacion = true;
                }
            }, function (err) {
                console.log(err);
            }
        );

    }
})();



