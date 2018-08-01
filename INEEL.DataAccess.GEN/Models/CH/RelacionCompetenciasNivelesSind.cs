using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.cat_RelacionCompetenciasNivelSind")]
    public class RelacionCompetenciasNivelesSind
    {
        [Key]
        public int id { get; set; }

        [ForeignKey ("competenciasSind")]
        public int idCompetencia { get; set; }
        public CompetenciasSind competenciasSind {get; set;} 

        [ForeignKey ("niveles")]
        public int idNivel { get; set; }
        public NivelesCompetencias niveles { get; set; }

        [ForeignKey("periodos")]
        public int? idPeriodo { get; set; }
        public PeriodoEvaluacion periodos { get; set; }

        [ForeignKey("relacioncomportamiento")]
        public int idRelacionComportamiento { get; set; }
        public RelacionNivelesComportamientoSind relacioncomportamiento { get; set; }

        public int? estado { get; set; }

    }
}
