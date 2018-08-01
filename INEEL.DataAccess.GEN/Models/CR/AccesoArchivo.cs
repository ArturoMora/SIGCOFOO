using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CR
{
    public class AccesoArchivo
    {
        public string clavePersonaSolicitante { get; set; }
        public int tipoInformacionId { get; set; }
        public string informacionOCId { get; set; }
        public string moduloId { get; set; }
        public string tipoArchivo { get; set; }
    }
}
