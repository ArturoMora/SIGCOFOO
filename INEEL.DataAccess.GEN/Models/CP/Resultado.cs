using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.tab_Resultados")]
    public class Resultado
    {
        [Key]
        public int ResultadoId { get; set; }

        [ForeignKey("Metas")]
        public int idMeta { get; set; }
        public virtual Metas Metas { get; set; }
        public string ResultadoEsperado { get; set; }
        public DateTime? FechaEsperada { get; set; }
        public virtual ICollection<Metas> ListaMetas { get; set; }
        public virtual ICollection<Avance> Avance { get; set; }

    }
}
