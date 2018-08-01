using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.Adjunto")]
    public class Adjunto
    {
        public long AdjuntoId { get; set; }
        [Required]        
        public string RutaCompleta { get; set; }
        
        public string nombre { get; set; }
        [ForeignKey("Modulo")]
        public string ModuloId { get; set; }
        public Modulo Modulo { get; set; }
    }
}
