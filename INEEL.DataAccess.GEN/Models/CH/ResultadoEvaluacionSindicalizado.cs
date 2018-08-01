using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CH
{
    public class ResultadoEvaluacionSindicalizado
    {

        public ListadoEmpleadosSind idEmpleado { get; set; }
        public EvaluacionEmpleadosSind RegistroEvaluacion { get; set; }
        public IEnumerable<RegistroEvaluacionesSind> Competencias { get; set; }
    }
}
