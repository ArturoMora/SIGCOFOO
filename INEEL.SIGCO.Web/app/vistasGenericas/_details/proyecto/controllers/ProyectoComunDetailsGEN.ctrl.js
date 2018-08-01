(function () {
    "use strict";

    angular
    .module("ineel.controllers")
    .controller("ProyectoComunDetailsGEN", [
        "$scope",
        "$stateParams",
        'ComunServiceProyectos',
        "DTOptionsBuilder",
        ProyectoComunDetailsGEN
    ]);

    function ProyectoComunDetailsGEN($scope, $stateParams, ComunServiceProyectos, DTOptionsBuilder) {
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rtp').withDisplayLength(-1);
       
        ComunServiceProyectos.GetDatosProyectoForModal($stateParams.id).then(function(res) {
            $scope.proyecto = res.data;
            if ($scope.proyecto.empresaId != null) {
                $scope.getEmpresa($scope.proyecto.empresaId);
            }
            //carga todo lo demas del proyecto
            $scope.getLeccionesProyecto($scope.proyecto.proyectoId);
            $scope.getInsumosPublicosProyecto($scope.proyecto.proyectoId);
            $scope.getPersonalePorProyecto($scope.proyecto.proyectoId);
            $scope.getPublicacionesPorProyecto($scope.proyecto.proyectoId);
            $scope.getPonenciasPorProyecto($scope.proyecto.proyectoId);
            $scope.getDerechosAutorPorProyecto($scope.proyecto.proyectoId);
            $scope.getPropiedadIndustrialPorProyecto($scope.proyecto.proyectoId);
            $scope.getProductosInnovadoresPorProyecto($scope.proyecto.proyectoId);
            $scope.getFondos($scope.proyecto.proyectoId);
        },function(err) {
            toastr.error("Error al cargar los datos del proyecto");
            console.log(err);
        });

        $scope.getEmpresa=function(id) {
            ComunServiceProyectos.GetEmpresaWithImagen(id).then(function(res) {
                $scope.empresa = res.data;
            },function(err) {
                toastr.error("Error al cargar los datos de la empresa asociada");
                console.log(err);
            });
        }

        $scope.getFondos=function(id){
            ComunServiceProyectos.GetFondosByProyecto(id).then(function(res) {
                $scope.fondos = res.data;
            },function(err) {
                toastr.error("Error al cargar los fondos asociados");
                console.log(err);
            });
        }

        $scope.getLeccionesProyecto=function(id) {
            ComunServiceProyectos.GetLASinProyecto(id)
                .then(function(res) {
                        $scope.lecciones = res.data;
                    },
                    function(err) {
                        toastr.error("Error al cargar las lecciones aprendidas del proyecto");
                        console.log(err);
                    });
        }

        $scope.getInsumosPublicosProyecto=function(id) {
            ComunServiceProyectos.GetInsumosPublicosPorProyecto(id).then(
                function(res) {
                    $scope.insumos = res.data;
                },function(err) {
                    toastr.error("Error al cargar los insumos del proyecto");
                    console.log(err);
                });

        }

        $scope.getPersonalePorProyecto=function(id) {
            ComunServiceProyectos.GetPersonasPorProyecto(id).then(function (res) {
                $scope.personal = res.data;
            },function(err) {
                toastr.error("Error al cargar el personal del proyecto");
                console.log(err);
            });
        }

        $scope.getPublicacionesPorProyecto=function(id) {
            ComunServiceProyectos.GetPublicacionsByProyecto(id).then(function(res) {
                $scope.publicaciones = res.data;
            },function(err) {
                toastr.error("Error al cargar las publicaciones relacionadas al proyecto");
                console.log(err);
            });
        }

        $scope.getPonenciasPorProyecto = function (id) {
            ComunServiceProyectos.GetPonenciasByProyecto(id).then(function (res) {
                $scope.ponencias = res.data;
            }, function (err) {
                toastr.error("Error al cargar las ponencias relacionadas al proyecto");
                console.log(err);
            })
        }

        $scope.getDerechosAutorPorProyecto = function (id) {
            ComunServiceProyectos.GetDerechosAutorByProyecto(id).then(function (res) {
                $scope.derechos = res.data;
            }, function (err) {
                toastr.error("Error al cargar los derechos de autor relacionados al proyecto");
                console.log(err);
            })
        }

        $scope.getPropiedadIndustrialPorProyecto = function (id) {
            ComunServiceProyectos.GetPropiedadIndustrialByProyecto(id).then(function (res) {
                $scope.pindustrial = res.data;
            }, function (err) {
                toastr.error("Error al cargar la propiedad industrial relacionada al proyecto");
                console.log(err);
            })
        }

        $scope.getProductosInnovadoresPorProyecto = function (id) {
            ComunServiceProyectos.getProductosInnovadores(id).then(function (res) {
                $scope.productos = res.data;
            }, function (err) {
                toastr.error("Error al cargar productos innovadores relacionados al proyecto");
                console.log(err);
            })
        }
    }
})();