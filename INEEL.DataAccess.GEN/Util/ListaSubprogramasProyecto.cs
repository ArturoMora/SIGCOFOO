using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Util
{
    public static class ListaSubprogramasProyecto
    {
        //Lista de todos los subprogramas de proyectos con los que cuenta el ineel, se usan para el modal generico de busqueda de proyectos
        public static string subprogramas = "0,1,52,53,54,55,56,6,60,61,62,63,64,65,66,67,68,69,71,72,73,81,82,83,86,87,91,92,93,94,95,96,97,98";
        
        //Lista de todos los subprogramas de proyectos de venta en el ineel [Para uso de modulo de CR]
        public static string subprogramasVentas = "61,63,64,65,67,68";
    }
}
