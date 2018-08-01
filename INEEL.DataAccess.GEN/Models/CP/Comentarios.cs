using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.tab_Comentarios")]
    public class Comentarios
    {
        public Comentarios() { }

        [Key]
        public int ComentarioId { get; set; }
        public string Comentario { get; set; }

        [ForeignKey("Miembros")]
        public int? idMiembroCP { get; set; }
        public virtual Miembros Miembros { get; set; }
        
        [ForeignKey("Post")]
        public int PostId { get; set; }
        public virtual Post Post { get; set; }
        public DateTime FechaRegistro { get; set; }

        public string idPersona { get; set; }
        [NotMapped]
        public string adjunto64 { get; set; }
    }
}
