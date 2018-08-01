using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.tab_SitioInteres")]
    public class SitioInteres
    {
        public SitioInteres() { }

        [Key]
        public int SitioId { get; set; }
        //[StringLength(250)]
        public string Titulo { get; set; }
        //[StringLength(300)]
        public string Descripcion { get; set; }
        //[StringLength(300)]
        public string Liga { get; set; }
        public DateTime? FechaRegistro { get; set; }

        [ForeignKey("Miembros")]
        public int? idMiembroCP { get; set; }
        public virtual Miembros Miembros { get; set; }

        [ForeignKey("CategoriaSitio")]
        public int idCategoria { get; set; }
        public virtual CategoriaSitio CategoriaSitio { get; set; }

        public string idPersona { get; set; }

        [ForeignKey("Comunidad")]
        public int idCP { get; set; }
        public virtual Comunidad Comunidad { get; set; }
    }
}
