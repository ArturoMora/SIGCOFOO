using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.tab_ComentariosLCP")]
    public class ComentariosLCP
    {
        public ComentariosLCP() { }

        [Key]
        public int ComentarioId { get; set; }

        [ForeignKey("Lineamientos")]
        public int idLineamiento { get; set; }
        public virtual Lineamientos Lineamientos { get; set; }

        public string Comentario { get; set; }

        [ForeignKey("Miembros")]
        public int idMiembro { get; set; }
        public virtual Miembros Miembros { get; set; }

        public DateTime FechaRegistro { get; set; }
    }
}
