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
    [Table("CP.tab_Comunidades")]
    public class Comunidad
    {
        public Comunidad() { }

        [Key]
        public int ComunidadId { get; set; }
        public string Descripcion { get; set; }
        public string Mision { get; set; }

        [ForeignKey("Adjunto")]
        public long? idAjunto { get; set; }
        public  Adjunto Adjunto { get; set; }
        public DateTime? FechaAlta { get; set; }
        public DateTime FechaRegistro { get; set; }
        public Boolean TipoAcceso { get; set; }
        public Boolean Estado { get; set; }

        [ForeignKey("CategoriaCP")]
        public int idCategoria { get; set; }
        public virtual CategoriaCP CategoriaCP { get; set; }


        [NotMapped]
        public string Adjunto64 { get; set; }


        [NotMapped]
        public string claveLider { get; set; }

        [NotMapped]
        public string nombreLider { get; set; }

        [NotMapped]
        public int claveRolLider { get; set; }

        [NotMapped]
        public string claveSecretario { get; set; }

        [NotMapped]
        public string nombreSecretario { get; set; }

        [NotMapped]
        public int claveRolSecretario { get; set; }


        
        public virtual ICollection<Noticia> Noticias { get; set; }
        
        public virtual ICollection<Metas> Metas { get; set; }
    }
}
