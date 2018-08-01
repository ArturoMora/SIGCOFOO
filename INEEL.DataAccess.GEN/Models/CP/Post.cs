using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.tab_Post")]
    public class Post
    {
        public Post() { }
        [Key]
        public int PostId { get; set; }
        public string Tema { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaRegistro { get; set; }

        [ForeignKey("Miembros")]
        public int? idMiembroCP { get; set; }
        public virtual Miembros Miembros { get; set; }

        [ForeignKey("Comunidad")]
        public int idComunidad { get; set; }
        public virtual Comunidad Comunidad { get; set; }

        [ForeignKey("Adjunto")]
        public long? adjuntoId { get; set; }
        public virtual Adjunto Adjunto { get; set; }

        public virtual ICollection<Comentarios> Comentarios { get; set; }

        public Boolean publico { get; set; }
        public Boolean accesoGeneral { get; set; }

        public string idPersona { get; set; }

        [NotMapped]
        public int ultimoPost { get; set; }
        [NotMapped]
        public string adjunto64 { get; set; }
    }
}
