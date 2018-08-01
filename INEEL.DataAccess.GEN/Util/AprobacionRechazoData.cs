using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Util
{
    public class AprobacionRechazoData
    {
        public long AprobacionRechazoDataId { get; set; }
        public String IdElemento { get; set; }
        public String ClavePersonaLogeada { get; set; }        
        public bool Aprobacion { get; set; }
        public bool Rechazo { get; set; }
        public String JustificacionOcomentarios { get; set; }

        public String ClasificacionSignatura { get; set; }
        public String NumInforme { get; set; }
        public String NumInventario { get; set; }

    }
}
