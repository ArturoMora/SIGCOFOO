using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.cat_TipoPersona")]
    public class TipoPersonal
    {
        [Key]
        public string TipoPersonaId { get; set; }

        [StringLength(100)]
        public string Descripcion { get; set; }

        public int Estado { get; set; }
        public DateTime FechaEfectiva { get; set; }

    }
}
