using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CH
{
    public class BusquedaNivel
    {
        public  int idNivel { get; set; }
        public int idCompetencia { get; set; }
        public string periodo { get; set; }
        public int idCategoria { get; set; }
        public string claveUnidad { get; set; }
        public string claveEmpleado { get; set; }
        public int claveEvaluacion { get; set; }
        public int matrizId { get; set; }
        public int nivelId { get; set; }

        public int periodoId { get; set; }
        public int areaId { get; set; }

        public int id { get; set; }
       
    }
}
