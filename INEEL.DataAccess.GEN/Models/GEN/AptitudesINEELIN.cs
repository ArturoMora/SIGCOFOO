using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    public class AptitudesINEELIN
    {
        public long AptitudesEmpleadoId { get; set; }
        public int AptitudId { get; set; }
        public string ClaveEmpleado { get; set; }
        public string NombreAptitud { get; set; }
        public int votos { get; set; }
        public string ClaveAprobador { get; set; }
        public string NombreAprobador { get; set; }
        public long? AdjuntoId { get; set; }
        public string RutaCompleta { get; set; }
        public string nombreArchivo { get; set; }
        public int aprobadoVisitante { get; set; }
    }
}
