using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.tab_MovimientoPuesto")]
    public class MovimientoPuesto
    {
        public int Id { get; set; }
        public string ClavePersona { get; set; }
        public DateTime Fecha { get; set; }
        public string Puesto { get; set; }
    }
}
