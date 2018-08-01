using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.tab_Noticia")]
    public class Noticia
    {
        [Key]
        public int NoticiaId { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaRegistro { get; set; }
        public Boolean Estado { get; set; }

        [ForeignKey("Comunidad")]
        public int idComunidad { get; set; }
        public virtual Comunidad Comunidad { get; set; }
    }
}
