using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.tab_Autores")]
    public class Autores
    {
        public Autores() { }
        [Key]
        public int AutorId { get; set; }

        [ForeignKey("ListaOC")]
        public int idOC { get; set; }
        public virtual ListaOC ListaOC { get; set; }

        public string clave { get; set; }

        public int ContenidoId { get; set; }

        public DateTime FechaRegistro { get; set; }

        [NotMapped]
        public string nombrePersona { get; set; }
    }
}
