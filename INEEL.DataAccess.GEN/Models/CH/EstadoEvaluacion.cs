using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.cat_EstadoEvaluacion")]
    public class EstadoEvaluacion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EstadoEvaluacionId { get; set; }

        [StringLength(100)]
        public string Descripcion { get; set; }

        public int Estado { get; set; }


    }
}
