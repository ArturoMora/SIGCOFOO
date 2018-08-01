(function () {
    "use strict";
    angular.module("ineel.controllers")
        .controller("PersonaDetailsComunCtrl",
            [
                "AuthService", "comunDetailsService", "CapYcertifService", "PonenciaService", "PublicacionService",
                "DAExternoService", "CursoInternoCHService", "ParticipacionService",
                "ExperienciaExternaService", "ExperienciaDocenteService", "BecarioDirigidoService", "BecarioExternoServiceCH",
                "TesisDirigidaService", "DistincionService", "SNIService", "AsociacionesService",
                "FormacionAcademicaService", "IdiomasService", "$scope", "$state", "$stateParams",
                "DTOptionsBuilder", "$http", "globalGet", "$filter", "$uibModal", "MenuService",
                PersonaDetailsComunCtrl]);

    function PersonaDetailsComunCtrl(AuthService, comunDetailsService, CapYcertifService, PonenciaService, PublicacionService,
        DAExternoService, CursoInternoCHService, ParticipacionService,
        ExperienciaExternaService, ExperienciaDocenteService, BecarioDirigidoService, BecarioExternoServiceCH,
        TesisDirigidaService, DistincionService, SNIService, AsociacionesService,
        FormacionAcademicaService, IdiomasService, $scope, $state, $stateParams,
        DTOptionsBuilder, $http, globalGet, $filter, $uibModal, MenuService) {
        $scope.rolId = MenuService.getRolId();
        $scope.authentication = AuthService.authentication;
        var empleadoId = AuthService.authentication.userprofile.clavePersona;
        var clavePersona = $stateParams.id;
        $scope.idPersona = $stateParams.id;
        $scope.mismo = empleadoId == clavePersona;
        $scope.skills = 3;
        $scope.duenio = false;
        $scope.fechaParaIgnorar = '2001-01-01T00:00:00';

        if (empleadoId == clavePersona) {
            $scope.duenio = true;
        }
        var API = globalGet.get("api");
        $scope.API = API;
        var service = {};
        var estados = "3"; //"3,8"
        var estados2 = 10;
        var aniosAtras = 5;
        $scope.limiteBecariosMostrados=10;  //limite de registros de becarios a mostrar en la ficha curricular
        
        $scope.full = true;
        $scope.validando = false;
        $scope.validador = function () {
            $scope.validando = true;
        };

        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.dtOptions2 = DTOptionsBuilder.newOptions().withDOM('lrtip');
        comunDetailsService.FA_GetByClaveEstadoFlujo(clavePersona, estados).then(
            function (result) {
                $scope.registrosfa = result.data;
                $scope.loading = false;
            },
            function (err) {
                $scope.registrosfa = [];
                toastr.error("No se han podido cargar los registros de formación académica.");
            });

        $scope.percent = 65;
        $scope.idioma = {};
        $scope.idioma.porcentajeGradoDominio = 40;
        $scope.idiomas = [];
        IdiomasService.getbyclave(clavePersona).then(
            function (result) {
                $scope.idiomas = $filter('filter')(result.data, { estadoFlujoId: 3 });
            },
            function (err) {
                $scope.idiomas = [];
                toastr.error("No se han podido cargar los registros de idiomas.");
            }
        );
        AsociacionesService.getbyclave(clavePersona).then(
            function (result) {
                $scope.registroasociacion = result.data;
            },
            function (err) {
                $scope.registroasociacion = [];
                toastr.error("No se han podido cargar los registros de Asociaciones");
            });
        comunDetailsService.SNI_GetByClaveEstadoFlujo(clavePersona, aniosAtras, estados).then(
            function (result) {
                $scope.registrosni = result.data;
                $scope.loading = false;
            },
            function (err) {
                $scope.registrosni = [];
                toastr.error("No se han podido cargar los registros de SNI");
            }
        );

        DistincionService.getbyclave(clavePersona).then(
            function (result) {
                $scope.registrosdistincion = $filter('filter')(result.data, { estadoFlujoId: 3 });
                //$scope.registrosdistincion = $filter('orderBy')($scope.registrosdistincion, { 'fechaDistincion': true });
            },
            function (err) {
                $scope.registrosdistincion = [];
                toastr.error("No se han podido cargar los registros de Distincion");
            }
        );
        comunDetailsService.BecarioInterno_getbyclave(clavePersona).then(
            function (result) {
                $scope.registrosBI = result.data;
            },
            function (err) {
                $scope.registrosBI = [];
                toastr.error("No se han podido cargar los registros de Becario interno");
            }
        );
        TesisDirigidaService.getbyclave(clavePersona).then(
            function (result) {
                $scope.registrosTD = result.data;
                $scope.loading = false;
            },
            function (err) {
                $scope.registrosTD = [];
                toastr.error("No se han podido cargar los registros de Tesis Dirigidas");
            }
        );

        //Becas que tuviste en el ineel antes de ser empleado
        comunDetailsService.GetEstanciasDeInvestigadoresEnInstituto(clavePersona).then(
            function (result) {
                $scope.becarios = result.data;
            },
            function (err) {
                $scope.becarios = [];
                toastr.error("No se han podido cargar los registros");
            }
        );

        //Becarios que tuviste a cargo
        comunDetailsService.GetBecariosDirigidosByPersona(clavePersona).then(
            function (result) {
                $scope.registrosBD = result.data;
                $scope.loading = false;
            },
            function (err) {
                $scope.registrosBD = [];
                toastr.error("No se han podido cargar los registros de Becario Dirigido");
            }
        );
        comunDetailsService.ExpDocente_GetByClaveEstadoFlujo(clavePersona, estados).then(
            function (result) {
                $scope.registrosED = result.data;
                $scope.loading = false;
            },
            function (err) {
                $scope.registrosED = [];
                toastr.error("No se han podido cargar los registros de Experiencia Docente");
            }
        );
        ExperienciaExternaService.getbyclave(clavePersona).then(
            function (result) {
                try {
                    $scope.registrosEE = $filter('filter')(result.data, { estadoFlujoId: 3 });
                    $scope.registrosEE = $filter('orderBy')($scope.registrosEE, { 'proyecto.fechaInicio': true });

                } catch (e) { }

                $scope.loading = false;
            },
            function (err) {
                $scope.registrosEE = [];
                toastr.error("No se han podido cargar los registros de Experiencia Externa");
            }
        );

        comunDetailsService.ParticipacionP_GetByClaveEstadoFlujo(clavePersona, aniosAtras, estados).then(
            function (result) {
                $scope.registrosPP = result.data;
                $scope.loading = false;
            },
            function (err) {
                $scope.registrosPP = [];
                toastr.error("No se han podido cargar los registros de Participación de Proyecto");
            }
        );
        CursoInternoCHService.getbyclave(clavePersona).then(
            function (result) {
                $scope.registrosCursos = result.data;
                $scope.loading = false;
            },
            function (err) {
                $scope.registrosCursos = [];
                toastr.error("No se han podido cargar los registros de Curso Interno");
            }
        );


        // aqui estoy  
        //
        //

        //DAExternoService.getbyclave(clavePersona).then(
        //    function (result) {
        //        $scope.registrosDA = result.data;
        //        debugger;
        //        $scope.loading = false;
        //    },
        //    function (err) {
        //        $scope.registrosDA = [];
        //        toastr.error("No se han podido cargar los registros de Derechos de Autor");
        //    }
        //    );

        comunDetailsService.SolicitudesDA_GetByClaveEmpleado(clavePersona).then(
            function (result) {


                $scope.registrosDA = $filter('filter')(result.data, { estadoFlujo: { estadoFlujoId: 3 } });
                //console.log("registrosDA:");
                //console.log($scope.registrosDA);
                $scope.loading = false;
            },
            function (err) {
                $scope.registrosDA = [];
                toastr.error("No se han podido cargar los registros de Derechos de Autor");
            }
        );


        PublicacionService.getbyclave(clavePersona).then(
            function (result) {
                $scope.registrosArticulos = $filter('filter')(result.data, { estadoFlujoId: 3 });
                $scope.loading = false;
            },
            function (err) {
                $scope.registrosArticulos = [];
                toastr.error("No se han podido cargar los registros de Publicacion");
            }
        );
        PonenciaService.getbyclave(clavePersona).then(
            function (result) {
                $scope.registrosPonencia = $filter('filter')(result.data, { estadoFlujoId: 3 });

                $scope.loading = false;
            },
            function (err) {
                $scope.registrosPonencia = [];
                toastr.error("No se han podido cargar los registros de Ponencias");
            }
        );

        comunDetailsService.AutorSoftware_GetByClaveEmpleado(clavePersona).then(
            function (result) {
                $scope.registrosSW = result.data;
                $scope.loading = false;
            },
            function (err) {
                $scope.registrosSW = [];
                toastr.error("No se han podido cargar los registros de Ponencias");
            }
        );
        comunDetailsService.AutorInternoCapitulo_GetAllByAutor(clavePersona, estados).then(
            function (result) {
                $scope.registrosCapLib = result.data; // $filter('filter')(result.data, { "capitulos.estadoFlujoId": 3 });
                $scope.loading = false;
            },
            function (err) {
                $scope.registrosCapLib = [];
                toastr.error("No se han podido cargar los registros de cap. de libros");
            }
        );
        $scope.imagen64 = null;
        $scope.setImagen = function (adjuntoId) {

            if (adjuntoId != undefined && adjuntoId != null) {
                comunDetailsService.getadjunto64(adjuntoId).then(
                    function (result) {
                        $scope.imagen64 = result.data;
                    }, function (error) {
                        $scope.imagen64 = null;
                    }
                );


            }
        }

        comunDetailsService.getPersonaById(clavePersona).then(
            function (result) {
                $scope.persona = result.data;

                //$scope.setImagen($scope.persona.adjuntoId);
                $scope.loading = false;

                console.log(result.data);
            },
            function (err) {
                $scope.persona = {};
                toastr.error("No se han podido cargar los registros de Ponencias");
            }
        );




        ////COMP
        //$scope.getByClave = function (clave) {
        //    $scope.competenciasaevaluar = [];
        //    if (!(clave == undefined || clave==null))
        //    comunDetailsService.getByClaveEvaluacion(clave).then(
        //    function (result) {
        //        console.log("result.data");
        //        console.log(result.data);
        //        $scope.competenciasaevaluar = result.data;
        //    },
        //    function (err) {

        //        $scope.competenciasaevaluar = [];
        //        toastr.error("No es posible recuperar datos de evaluación de competencias conductuales");
        //    }
        //    );
        //}
        function loadCompetenciasGraph(LabelsIn, valuesA, valuesB, radar) {


            if (true) {

                var ctx = document.getElementById(radar);
                var data = {
                    labels: LabelsIn,

                    datasets: [{
                        label: "Exigido",
                        backgroundColor: "rgba(3, 88, 106, 0.2)",
                        borderColor: "rgba(3, 88, 106, 0.80)",
                        pointBorderColor: "rgba(3, 88, 106, 0.80)",
                        pointBackgroundColor: "rgba(3, 88, 106, 0.80)",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        data: valuesA
                    }, {
                        label: "Real",
                        backgroundColor: "rgba(38, 185, 154, 0.2)",
                        borderColor: "rgba(38, 185, 154, 0.85)",
                        pointColor: "rgba(38, 185, 154, 0.85)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: valuesB
                    }]
                };

                var canvasRadar = new Chart(ctx, {
                    type: 'radar',
                    data: data,
                    options: {
                        responsive: true,
                        scale: {
                            ticks: {
                                display: false,
                                beginAtZero: true
                            }
                        }
                    }
                });

            }
        }

        comunDetailsService.getCompetencias(clavePersona).then(

            function (result) {
                //alert("foo");
                $scope.competencias = result.data;
                $scope.loading = false;
                try {
                    //debugger;
                    var conductuales = $scope.competencias.info.competencias;
                    var labels = [];
                    var esperado = [];
                    var real = [];
                    for (var i = 0; i < conductuales.length; i++) {
                        var c = conductuales[i];
                        labels.push(c.matrizSind.relaciones.competenciasSind.competencia);
                        esperado.push(c.valorEsperado);
                        real.push(c.valorReal);
                    }
                    loadCompetenciasGraph(labels, esperado, real, "canvasRadar1");

                } catch (ex) {
                    //console.log(ex);
                }

                try {
                    //debugger;
                    var conductuales = $scope.competencias.conductuales.competencias;
                    var labels = [];
                    var esperado = [];
                    var real = [];
                    for (var i = 0; i < conductuales.length; i++) {
                        var c = conductuales[i];
                        labels.push(c.competencia);
                        esperado.push(c.nivel);
                        real.push(c.valorReal);
                    }
                    //for (var c in conductuales) {
                    //    debugger;
                    //    labels.push(c.competencia);
                    //    esperado.push(c.nivel);
                    //    real.push(c.valorReal);
                    //}
                    loadCompetenciasGraph(labels, esperado, real, "canvasRadar");

                } catch (ex) {
                    //alert("ex");
                    //console.log(ex);
                }


            },
            function (err) {
                $scope.competencias = [];
                toastr.error("No hay información de competencias disponible en el sistema");
            }
        );
        ////COMP
        //comunDetailsService.EvaluacionConductual_GetTopByPersona(clavePersona).then(
        //    function (result) {
        //        $scope.datosevaluado = result.data;
        //        $scope.getByClave($scope.datosevaluado.claveEvaluacion);
        //        $scope.loading = false;
        //    },
        //    function (err) {
        //        $scope.datosevaluado = {};
        //        toastr.error("No se han podido cargar los registros de Ponencias");
        //    }
        //    );
        ////COMP
        //comunDetailsService.getByEmpleadoListTecnica(clavePersona).then(
        //        function (result) {                  
        //            $scope.competenciasaevaluarTecnicaList = result.data;
        //        },
        //        function (err) {

        //            $scope.competenciasaevaluarTecnicaList = [];
        //            toastr.error("Error al recuperar el listado de evaluaciones técnicas");
        //            console.log(":::");
        //            console.log(err);
        //        }
        //        );



        comunDetailsService.getExtractoById(clavePersona).then(
            function (result) {
                //console.log("ex:");
                //console.log(result);
                $scope.extractoProfesional = result.data;
                if ($scope.extractoProfesional == null) {
                    //$scope.extractoProfesional = { extracto: null };
                } else {
                    $scope.extractoProfesional.extracto = $scope.extractoProfesional.extracto.replace(/\n/g, '<br/>')
                }

            },
            function (err) {
                $scope.extractoProfesional = {};
                toastr.error("No se han podido cargar los datos de extracto profesional");
            }
        );
        comunDetailsService.Capacitacion_GetByClavePersonaANDestadoFlujo(clavePersona, 3).then(
            function (result) {
                //console.log("ex:");
                //console.log(result);
                $scope.CapacitacionYcertificacion = $filter('filter')(result.data, { estadoFlujoId: 3 });

            },
            function (err) {
                $scope.CapacitacionYcertificacion = [];
                toastr.error("No se han podido cargar los datos de capacitación");
            }
        );
        comunDetailsService.CertificacionesObtenidas_GetByClavePersonaANDestadoFlujo(clavePersona, 3).then(
            function (result) {
                //console.log("ex:");
                //console.log(result);
                $scope.certificacionesObtenidas = $filter('filter')(result.data, { estadoFlujoId: 3 });

            },
            function (err) {
                $scope.certificacionesObtenidas = [];
                toastr.error("No se han podido cargar los datos de certificación");
            }
        );

        //comunDetailsService.logrosDestacadosByClaveEmpleado(clavePersona).then(
        //     function (result) {
        //         $scope.LogrosReconocimientos = result.data;
        //     },
        //     function (err) {
        //         $scope.LogrosReconocimientos = [];
        //         toastr.error("No se han podido cargar los datos de Logros y Reconocimientos1");
        //     }
        //);
        comunDetailsService.getalmamater(clavePersona).then(
            function (result) {
                $scope.almamater = result.data;
            },
            function (err) {
                $scope.almamater = {};
                toastr.error("No se han podido cargar los datos de almamater");
            }
        );
        //movimientos  
        comunDetailsService.getMovimientoPuesto(clavePersona).then(
            function (result) {



                $scope.MovimientoPuesto = result.data;



            },
            function (err) {
                $scope.MovimientoPuesto = {};
                toastr.error("No se han podido cargar los datos de MovimientoPuesto");
            }
        );

        //comunDetailsService.getMovimientoUnidadOrg(clavePersona).then(
        comunDetailsService.getMovimientoUnidadOrgNew(clavePersona).then(
            function (result) {
                $scope.MovimientoUnidadOrg = result.data;
            },
            function (err) {
                $scope.MovimientoUnidadOrg = {};
                toastr.error("No se han podido cargar los datos de Movimiento Unidad Organizacional");
            }
        );

        comunDetailsService.getMovimientoCategoria(clavePersona).then(
            function (result) {
                $scope.MovimientoCategoria = result.data;
            },
            function (err) {
                $scope.MovimientoCategoria = {};
                toastr.error("No se han podido cargar los datos de Categorias");
            }
        );
        $scope.toogle = function () {
            setTimeout(function () {
                $('[data-toggle="tooltip"]').tooltip();
            }, 1000);

        };
        $scope.AptitudesEmpleadoCant = 0;
        $scope.adicionales = 0;
        $scope.loadList = function () {
            comunDetailsService.AptitudesEmpleado_GetAllByEmpleado(clavePersona, empleadoId).then(
                function (result) {

                    setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.validando = false;
                            $scope.AptitudesEmpleado = result.data;
                            $scope.AptitudesEmpleadoCant = $scope.AptitudesEmpleado.length;
                            if ($scope.AptitudesEmpleadoCant > 3)
                                $scope.adicionales = $scope.AptitudesEmpleadoCant - 3;
                            setTimeout(function () {
                                $scope.toogle();
                            }, 500);
                        });

                    }, 1000);

                },
                function (err) {
                    $scope.AptitudesEmpleado = [];
                    $scope.AptitudesEmpleadoCant = 0;
                    $scope.validando = false;
                    toastr.error("No se han podido cargar los datos de Aptitudes Empleado");
                }
            );
        }
        $scope.loadList();
        $scope.loadListLikes = function (idAptitud, clavePersona, nombreAptidud, cant) {
            if (cant > 0) {
                $scope.API = API;
                $scope.aptidud = nombreAptidud
                $scope.cant = cant;
                $scope.clavePersona = clavePersona;
                $scope.idAptitud = idAptitud;
                var modalInstance = $uibModal.open({
                    size: 'md',
                    templateUrl: 'app/vistasGenericas/_details/personal/Likes/otorgantesLikeGet.html',
                    controller: function ($uibModalInstance) {
                        $scope.personasOtorgantes = [];
                        comunDetailsService.LikesLinked_GetAllById_Empleado(idAptitud, clavePersona).then(
                            function (result) {
                                $scope.personasOtorgantes = result.data;
                            },
                            function (err) {
                                $scope.personasOtorgantes = {};
                                toastr.error("No se han podido cargar los datos de Personas Otorgantes");
                            }
                        );
                        $scope.ok = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    scope: $scope
                });
            }
            else {
                toastr.info("No existen validaciones para esta aptitud");
            }
        }
        $scope.votar = function (aptitudId, aprobadoVisitante) {
            //alert("arg: " + aprobadoVisitante);
            var status = true;
            if (aprobadoVisitante == 1) {
                status = false;
            } else {
                status = true;
            }
            var model = {
                Aprobador: empleadoId,
                Empleado: clavePersona,
                Tipo: 1,
                IdExteno: aptitudId,
                Estado: status
            }
            //alert("estado:" + model.Estado);
            comunDetailsService.LikesLinked_UpdateStadoOrCreate(model).then(
                function (result) {
                    toastr.info("Reordenando por cantidad de validaciones", "Aptitudes");
                    $scope.loadList();

                },
                function (error) {
                    $scope.validando = false;
                    toastr.error("No fue posible atender la solicitud");
                    setTimeout(function () {
                        $scope.validando = false;
                    }, 3200);
                }
            );
        }

        comunDetailsService.PIExterno_GetByPersona(clavePersona).then(
            function (result) {



                $scope.PIExterno_GetByPersonaINEEL = $filter('filter')(result.data, { espropiedadInst: true, completo: true });

                $scope.PIExterno_GetByPersonaINVEST = $filter('filter')(result.data, { espropiedadInst: false, estadoFlujo: 3 });
                $scope.loading = false;

                //debugger;
            },
            function (err) {
                $scope.PIExterno_GetByPersona = [];
                toastr.error("No se han podido cargar los registros de propiedad industrial.");
            }
        );
    }


})();