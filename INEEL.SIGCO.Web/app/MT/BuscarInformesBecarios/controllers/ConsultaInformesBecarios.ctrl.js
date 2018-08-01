
(function () {
    "use strict";
    angular
        .module("ineelMT")
        .controller("ConsultaInformesBecariosCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "MenuService",
         ConsultaInformesBecariosCtrl]);

    function ConsultaInformesBecariosCtrl(AuthService, $scope, $state, MenuService) {

        $scope.authentication = AuthService.authentication;
        $scope.cargaTerminada=false;
        $scope.selectedInforme=0;
        //Este controlador solo sirve como controlador papa
                    
        //Tipo de Informes de becario
        $scope.Informes = [
            {
                "informeId": 1,
                "descripcion": "Becario interno",
                "html": "app/MT/BuscarInformesBecarios/ConsultaBecariosInternosGet.html"
            },
            {
                "informeId": 2,
                "descripcion": "Becario dirigido",
                "html":"app/MT/BuscarInformesBecarios/ConsultaBecariosExternosGet.html"
            }
        ];

        $scope.now=new Date();
        //Cambiar de opcion navegada
        $scope.cambiaOpcion=function(opcion){
            if(opcion!=0){
                opcion==1? $scope.html='app/MT/BuscarInformesBecarios/ConsultaBecariosInternosGet.html' : $scope.html='app/MT/BuscarInformesBecarios/ConsultaBecariosExternosGet.html'
                MenuService.setVariable("opcionBusqueda", opcion);
                $scope.cargaTerminada=true;
            }
            
        }

        var opcionRecuperada=MenuService.getVariable("opcionBusqueda");
        if(opcionRecuperada!=null){
            $scope.selectedInforme=opcionRecuperada;
            $scope.cambiaOpcion(opcionRecuperada);

        }else{
            $scope.selectedInforme=1;
            MenuService.setVariable("opcionBusqueda",$scope.selectedInforme);
            $scope.html='app/MT/BuscarInformesBecarios/ConsultaBecariosInternosGet.html';
            $scope.cargaTerminada=true;
        }


        

        

    }
})();