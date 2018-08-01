using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.tab_MovimientoCategoria")]
    public class MovimientoCategoria
    {
        public int Id {get;set;}
        public string ClavePersona { get; set; }
        public DateTime Fecha { get; set; }
        public string CategoriaReal { get; set; }
        public string CategoriaAsignada { get; set; }
    }
}
