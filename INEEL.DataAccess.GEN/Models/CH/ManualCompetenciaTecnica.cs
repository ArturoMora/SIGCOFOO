using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_ManualCompetenciaTecnica")]
    public class ManualCompetenciaTecnica
    {
        [Key]
        public int ManualCompetenciaTecnicaId { get; set; }

        public int PeriodoEvaluaionId { get; set; }
        public PeriodoEvaluacion PeriodoEvaluacion { get; set; }
        public int AccesoPublico { get; set; }
        public float Version { get; set; }
        public string Comentario { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }
    }
}