using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.CH.Models;

namespace INEEL.DataAccess.GEN.Models.CR
{
    [Table("CR.tab_PaisesPorConvocatoria")]
    public class PaisesPorConvocatoria
    {
        public int PaisesPorConvocatoriaID { get; set; }
        public int ConvocatoriaId { get; set; }
        public Convocatoria Convocatorias { get; set; }
        public int PaisID { get; set; }
        public Pais Pais { get; set; }

    }
}
