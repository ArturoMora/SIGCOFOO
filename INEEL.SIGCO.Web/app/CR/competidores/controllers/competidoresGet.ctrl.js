(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("CompetidoresGetCtrl", [
            "$scope",
            "CompetidoresCRService",
            "LineasDesarrolloTecnologicoCRService",
            "$state",
            "$uibModal",
            "MenuService",
            "DTOptionsBuilder",
            CompetidoresGetCtrl
        ]);

    function CompetidoresGetCtrl($scope, CompetidoresCRService, LineasDesarrolloTecnologicoCRService, $state, $uibModal, MenuService, DTOptionsBuilder) {
        $scope.idRol = MenuService.getRolId();
        $scope.comp = {};
        $scope.expProf = {};
        $scope.busqueda = false;
        $scope.limpia = false;

        //Get segmentos de competidores
        CompetidoresCRService.GetSegmentosCompetidores().then(function (res) {
            $scope.segmentos = res.data;
        }, function (error) {
            toastr.error("No se han podido cargar los segmentos de competidores");
            console.log(error);
        });

        //Get empresas competidoras
        CompetidoresCRService.GetEmpresasCompetidoras().then(function (res) {
            $scope.empresas = res.data;
        }, function (error) {
            toastr.error("No se han podido cargar los competidores");
            console.log(error);
        });


        //Get productos de competidores
        CompetidoresCRService.GetProductosCompetidores().then(function (res) {
            $scope.productos = res.data;
        }, function (error) {
            toastr.error("No se han podido cargar los productos de competidores");
            console.log(error);
        });


        //Get servicios de competidores
        CompetidoresCRService.GetServiciosCompetidores().then(function (res) {
            $scope.servicios = res.data;
        }, function (error) {
            toastr.error("No se han podido cargar los servicios de competidores");
            console.log(error);
        });

        LineasDesarrolloTecnologicoCRService.getLineasDesarrolloTecnologico().then(function(res){
            var linea= {"nomLinDesTec": 'No definido',
                        "lineaDesarrolloTecnologicoId": 0};

            $scope.lineas= res.data;
            $scope.lineas.push(linea);
        },function(err){
            toastr.error("No se han podido cargar las líneas de investigación");
            console.log(err);
        });

        //Obtener datos gr�fica
        CompetidoresCRService.getCompetidoresPorLinea().then(
            function (result) {
                $scope.competidoresporlinea = result.data;
                setValuesForGraph();
            },
            function (err) {
                toastr.error("No se han podido cargar los registros");
                console.log(err);
            }
        );

        $scope.buscar = function () {
            CompetidoresCRService.GetConsultaParametrizadaCompetidores($scope.comp).then(function (res) {
                $scope.competidores = res.data;
                $scope.busqueda = true;
            }, function (error) {
                toastr.error("No se han podido cargar los registros de competidores");
                console.log(error);
            });
        }

        //Se recuperan los datos de la previa busqueda ingresada por el usuario
        $scope.comp = MenuService.getVariable('consultaCompetidores');
        if ($scope.comp == null) {
            $scope.comp = {};
            $scope.paramsDT = {};
            $scope.paramsDT.displayStart = 0;
        } else {
            $scope.paramsDT = JSON.parse(localStorage.getItem('CRcompetidoresGet' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }
            $scope.buscar();
            MenuService.deleteVariable('consultaCompetidores');
        }

        $scope.reset = function () {
            $scope.comp = {};
            $scope.busqueda = false;
            $scope.limpia = true;
        }

        //guardamos los parametros de busqueda del usuario antes de ir a editar el registro
        $scope.editarRegistro = function (id) {
            MenuService.setVariable('consultaCompetidores', $scope.comp);
            $state.go('competidorEdit', { id: id });
        }

        //guardamos los parametros de busqueda del usuario antes de visualizar el detalle del registro
        $scope.detalleRegistro = function (id) {
            MenuService.setVariable('consultaCompetidores', $scope.comp);
            $state.go('competidorDetails', { id: id });

        }

        //Guardar estado
        $scope.saveEstado = function (competidor) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (competidor.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        CompetidoresCRService.UpdateEstado(competidor).then(
                            function (result) {
                                toastr.success(result.data);
                            },
                            function (err) {
                                $scope.cancel();
                            }
                        );
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.competidores.indexOf(competidor));
                        $scope.competidores[idx].estado = !$scope.competidores[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

        $scope.preguntaEliminar = function (competidor) {
            
            $scope.descripcionRow = competidor.nombreEmpresa;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {
                        $scope.delete(competidor, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.delete = function (competidor, $uibModalInstance) {
            CompetidoresCRService.deleteCompetidor(competidor.competidorId).then(
                function (result) {
                    var idx = ($scope.competidores.indexOf(competidor));
                    $scope.competidores.splice(idx, 1);

                    toastr.success(result.data);
                    $uibModalInstance.dismiss('close');

                },
                function (err) {
                    toastr.error(err.data.message);
                })
        };

        //Se crean los labels y parametros para la grafica
        function setValuesForGraph() {
            var labels = [];
            var datos = [];

            angular.forEach($scope.competidoresporlinea, function (value, key) {
                labels.push(value.competidorLinea);
                datos.push(value.numero);
            });

            $scope.expProf.labels = labels;
            $scope.expProf.datos = { data: datos, type: "bar", name: "No. competidores" };
            //automaticamente se crea la gr�fica, dada la directiva 'echart-graph' en templateUrl
        }

        //Opciones de inicializacion en las tablas
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart);

        //Por cada accion del Datatable se ejecuta este callback
        function stateSaveCallback(settings, data) {
            var stado = $('#CRcompetidoresGet').DataTable().state();
            localStorage.setItem('CRcompetidoresGet' + window.location.pathname, JSON.stringify(stado))
        }

        //En conjunto con el callback anterior se guarda y recupera el state del datatatable
        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null && $scope.limpia) { //Esta condicion es la que permite limpiar completamente el estado del paginado, otras opciones no funcionaron
                $scope.paramsDT = {};
                $scope.paramsDT.displayStart = 0;
                $scope.limpia = false;
                return $scope.paramsDT;
            }
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('CRcompetidoresGet' + window.location.pathname))
            }

        }

        function removeAccents(data) {
            return data
                .replace(/έ/g, 'ε')
                .replace(/[ύϋΰ]/g, 'υ')
                .replace(/ό/g, 'ο')
                .replace(/ώ/g, 'ω')
                .replace(/ά/g, 'α')
                .replace(/[ίϊΐ]/g, 'ι')
                .replace(/ή/g, 'η')
                .replace(/\n/g, ' ')
                .replace(/á/g, 'a')
                .replace(/é/g, 'e')
                .replace(/í/g, 'i')
                .replace(/ó/g, 'o')
                .replace(/ú/g, 'u')
                .replace(/ê/g, 'e')
                .replace(/î/g, 'i')
                .replace(/ô/g, 'o')
                .replace(/è/g, 'e')
                .replace(/ï/g, 'i')
                .replace(/ü/g, 'u')
                .replace(/ã/g, 'a')
                .replace(/õ/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/ì/g, 'i');
        }


        var searchType = jQuery.fn.DataTable.ext.type.search;

        searchType.string = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data) :
                    data;
        };

        searchType.html = function (data) {
            return !data ?
                '' :
                typeof data === 'string' ?
                    removeAccents(data.replace(/<.*?>/g, '')) :
                    data;
        };

    }


})();