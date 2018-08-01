using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CH
{
    public class AuxilarDatosConductuales
    {
               
        public int claveEvaluacion { get; set; }
              
        public int MatrizId { get; set; }
        
        public string competencia { get; set; }

        public string nivel { get; set; }

        public string comportamiento { get; set; }

        public string justificacion { get; set; }

        public int valorReal { get; set; }
        
    }
}
