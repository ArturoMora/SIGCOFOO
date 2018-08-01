using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    public class MovimientosPersonal
    {
        /***Propiedades que sirven para mapear los resultados de un SP a entity framework***/
        public int id { get; set; }
        public string clave { get; set; }
        public string nombre { get; set; }
        public DateTime fecha { get; set; }
        public string claveDepartamento { get; set; }
        public string nombreDepartamento { get; set; }
        public string claveCategoria { get; set; }
        public string claveNomina { get; set; }
        public string accionHR { get; set; }
        public string motivoHR { get; set; }
        public string estado { get; set; }
        

        /***Propiedades utilizadas como parametros de busqueda***/
        public DateTime fechaInicio { get; set; }
        public DateTime fechaTermino { get; set; }
    }
}
