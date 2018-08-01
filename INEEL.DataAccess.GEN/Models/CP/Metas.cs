using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.tab_Metas")]
    public class Metas
    {
        public Metas() { }
        [Key]
        public int Metaid { get; set; }

        [ForeignKey("Comunidad")]
        public int idCP { get; set; }
        public virtual Comunidad Comunidad { get; set; }
        public string Meta { get; set; }
        public DateTime FechaRegistro { get; set; }
        public string EstadoMeta { get; set; }
    }
}
