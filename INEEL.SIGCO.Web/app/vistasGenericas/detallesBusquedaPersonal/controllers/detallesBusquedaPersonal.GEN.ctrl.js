(function () {
    "use strict";

    angular
    .module("ineel.services")
    .controller("DetallesBusquedaPersonalGENCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$uibModalInstance",
        "ComunServiceDetallesPersonal",
        DetallesBusquedaPersonalGENCtrl
    ]);

    function DetallesBusquedaPersonalGENCtrl(AuthService,  $scope, $state, $uibModalInstance,  ComunServiceDetallesPersonal) {

        $scope.authentication = AuthService.authentication;
        $scope.dtInstance = {};
        $scope.url="";
        $scope.tituloModal="";

        //Carga la tabla inicial dependendiendo del tipo de OC
        $scope.cargarDetalleRegistros=function(){
            var registro={
                'FieldD': $scope.parametro.listaId.replace(/ /g, "")
            };
            switch($scope.parametro.tipoOC){
                case 'PONENCIAS':
                    $scope.tituloModal="Ponencias";
                    $scope.url='indexMT.html#/BuscarPonenciasDetails/';
                    ComunServiceDetallesPersonal.GetPonencias(registro).then(
                        function(res){
                            $scope.registros=res.data;
                        },function(err){
                            toastr.error("Error al cargar los registros de ponencias");
                            console.log(err);
                        }
                    );
                break;
                case 'PUBLICACIONES':
                $scope.tituloModal="Publicaciones";
                $scope.url='indexMT.html#/BuscarArticulosDetails/';
                    ComunServiceDetallesPersonal.GetPublicaciones(registro).then(
                        function(res){
                            $scope.registros=res.data;
                        },function(err){
                            toastr.error("Error al cargar los registros de publicaciones");
                            console.log(err);
                        }
                    );
                break;
                case 'CURSOS':
                $scope.tituloModal="Cursos";
                $scope.url='indexMT.html#/BuscarCursosDetails/';
                    ComunServiceDetallesPersonal.GetCursos(registro).then(
                        function(res){
                            $scope.registros=res.data;
                        },function(err){
                            toastr.error("Error al cargar los registros de cursos");
                            console.log(err);
                        }
                    );
                break;
                case 'PROYECTOS':
                $scope.tituloModal="Proyectos";
                $scope.url='indexMT.html#/detalleProyecto/';
                    ComunServiceDetallesPersonal.GetProyectos(registro).then(
                        function(res){
                            $scope.registros=res.data;
                        },function(err){
                            toastr.error("Error al cargar los registros de proyectos");
                            console.log(err);
                        }
                    );
                break;
                case 'DERECHOS-AUTOR':
                $scope.tituloModal="Derechos de autor";
                $scope.url='indexPI.html#/detallesdaexterno/'; 
                    ComunServiceDetallesPersonal.GetDerechosAutor(registro).then(
                        function(res){
                            $scope.registros=res.data;
                        },function(err){
                            toastr.error("Error al cargar los registros de derechos de autor");
                            console.log(err);
                        }
                    );
                break;
                case 'PROPIEDAD-INDUSTRIAL':
                $scope.tituloModal="Propiedad industrial";
                $scope.url='indexPI.html#/propiedadindustrialdetalle/'; 
                    ComunServiceDetallesPersonal.GetPropiedadIndustrial(registro).then(
                        function(res){
                            $scope.registros=res.data;
                        },function(err){
                            toastr.error("Error al cargar los registros de propiedad industrial");
                            console.log(err);
                        }
                    );
                break;
                case 'FORMACION-ACADEMICA':
                $scope.tituloModal="Formación académica";
                $scope.url='IndexCH.html#/detalleformacion/';  
                    ComunServiceDetallesPersonal.GetFormacionAcademica(registro).then(
                        function(res){
                            $scope.registros=res.data;
                        },function(err){
                            toastr.error("Error al cargar los registros de formacion academica");
                            console.log(err);
                        }
                    );
                break;
            }
        }

        $scope.cargarDetalleRegistros();


        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    }
})();