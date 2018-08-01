using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_DetalleEvaluacionConductuales")]
    public class DetalleEvaluacionCompetenciasConductuales
    {

        [Key]
        public int DetalleId { get; set; }

        public int claveEvaluacion { get; set; }

        [ForeignKey("matriz")]
        public int MatrizId { get; set; }
        public MatrizCompetencias matriz { get; set; }

        public string justificacion { get; set; }

        public int valorReal { get; set; }
    }
}
