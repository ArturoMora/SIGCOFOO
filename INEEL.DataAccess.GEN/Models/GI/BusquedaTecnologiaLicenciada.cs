using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    public class BusquedaTecnologiaLicenciada
    {
        public int TecnologiaLicenciadaId { get; set; }
        public string Numero { get; set; }
        //public string foo { get; set; }
        public string NombreTecnologiaLic { get; set; }
        public int EstadoLicenciamientoId { get; set; }
        public string EstadoLicenciamiento { get; set; }
        public string NombreReceptor { get; set; }
        public List<string> TipoPi { get; set; }
        public List<string> GerenciasNombre { get; set; }
    }
}
