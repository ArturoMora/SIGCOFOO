using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Util
{
    public class PersonaSuscripciones
    {
        public PersonaSuscripciones(Personas Persona, List<OCSuscripciones> OCSuscripcion)
        {
            this.Persona = Persona;
            this.OCSuscripcion = OCSuscripcion;
        }
        public Personas Persona { get; set; }
        public List<OCSuscripciones> OCSuscripcion { get; set; }
    }
}
