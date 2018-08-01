using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.PI
{

    [Table("PI.cat_EstadoDelProcesoPI")]
    public class EstadoDelProceso
    {
        [Key]
        public int EstadoDelProcesoId { get; set; }

        public string Descripcion { get; set; }

        public string DescripcionCorta { get; set; }

        public Boolean Estado { get; set; }
    }
}
