using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.tab_AvanceMiembros")]
    public class AvanceMiembros
    {
        public AvanceMiembros() { }
        [Key]
        public int AvanceMiembroId { get; set; }

        [ForeignKey("Avance")]
        public int AvanceId { get; set; }
        public virtual Avance Avance { get; set; }

        [ForeignKey("Miembros")]
        public int idMiembro { get; set; }
        public virtual Miembros Miembros { get; set; }
        public string Participacion { get; set; }
        public DateTime FechaRegistro { get; set; }
    }
}
