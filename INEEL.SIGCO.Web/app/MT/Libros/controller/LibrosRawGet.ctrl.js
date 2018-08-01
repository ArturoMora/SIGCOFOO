(function () {
    "use strict";
    angular
       .module("ineelMT")
                .filter('getAutores', function (DescargasService) {
                    return function (autores) {
                        if (autores == undefined || autores == null || autores.length < 1) {
                            return null;
                        }
                        var result = "";
                        for (var i = 0; i < autores.length-1; i++) {
                            result = result.concat(autores[i].autor, ";");
                        }
                        result = result.concat(autores[i].autor);
                        return result;
                    };
                })

                .filter('getDescriptores', function (DescargasService) {
                            return function (x) {
                                if (x == undefined || x == null || x.length < 1) {
                                    return null;
                                }
                                var result = "";
                                for (var i = 0; i < x.length - 1; i++) {
                                    result = result.concat(x[i].descriptor, "      ");
                                }
                                result = result.concat(x[i].descriptor);
                                return result;
                            };
                })

                .filter('getInventarios', function (DescargasService) {
                                   return function (x) {
                                        
                                        if (x == undefined || x == null || x.length < 1) {
                                            return null;
                                        }
                                        var result = "";
                                        var i = 0;
                                        
                                        for (var i = 0; i < x.length - 1; i++) {
                                            result = result.concat(x[i].noInventario, ", ");
                                        }
                                       
                                        result = result.concat(x[i].noInventario);
                                        return result;
                                   };

                })

       .controller("LibrosRawGet", ["AuthService", "$scope", "$timeout","$rootScope", "globalGet","$http", "$filter", LibrosRawGet]);

    function LibrosRawGet(AuthService, $scope, $timeout, $rootScope, globalGet, $http, $filter) {


        $scope.visible = true;
        /* Servicio dentro del controlador para no replicar varios archivos de acuerdo al modulo */
        var API = globalGet.get("api");
        var service = {};


        $scope.OPCIONES = [
            {
               "descripcion": "LIBRO"
            },
            {
                "descripcion": "TESIS"
            },
            {
              "descripcion": "MEMORIA DE CONFERENCIA"
            },
            {
               "descripcion": "LIBRO DE CONSULTA"
            },
            

        ];



        service.importarLibros = function () {
            var endPoint = API + "Libros/getUrl";
            var url = "http://b-dig.iie.org.mx/cgi-bin/WWWISIS/wwwisis.exe/%5bin=libMT2.in%5d/"
            var body = { cadena: url };
            var x = $http.post(endPoint, body);

            return x;
        }

        /* Fin de Servicio dentro del controlador para no replicar varios archivos de acuerdo al modulo */

        //Obtener los servicios de autenticacion
        $scope.loading = true;
        $scope.authentication = AuthService.authentication;
        $rootScope.idG = "";


        $scope.setId = function (id) {
            //alert(id);
            $rootScope.idG = id;
        }
        

        //obtener registros
        $scope.registros = [];
        

        service.importarLibros().then(
               function (result) {
                   $scope.registros = result.data;
                   var timeout = window.setTimeout(datata, 250);

               },
               function (error) {
                   toastr.error("error al actualizar");
                   console.log(error);
               }
           );


      

            var table = {};
            function datata() {
                // DataTable
                table = $('#datatableSis').DataTable();
                // Apply the search
                table.columns().every(function (x) {
                    var that = this;
                    //console.log(this.footer());
                    $('#s' + x).on('keyup change', function () {
                        if (that.search() !== this.value) {
                            that
                                .search(jQuery.fn.DataTable.ext.type.search.string(this.value))
                                .draw();
                        }
                        $('#datatableSis > tbody').highlight(this.value);
                    });
                });
            };

        
        

            $scope.seleccion = function () {
                // $scope.busq.tipoMaterial = busq.tipoMaterial.descripcion;
                table = $('#datatableSis').DataTable();
                table.search(jQuery.fn.DataTable.ext.type.search.string($scope.busq.tipoMaterial.descripcion))
                                .draw();
            }

        
        $scope.reset = function () {
            $scope.busq = {};
            table.columns().every(function (x) {
                var that = this;
                $('.frmSearch').each(function () {if (true) {that.search("").draw();}});
            });
            $("#datatableSis").DataTable().search("").draw();
        };
    }
})();