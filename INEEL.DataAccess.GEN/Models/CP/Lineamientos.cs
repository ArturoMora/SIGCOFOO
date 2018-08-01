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
    [Table("CP.tab_Lineamientos")]
    public class Lineamientos
    {
        public Lineamientos() { }

        [Key]
        public int LineamientoId { get; set; }
        public string Nombre { get; set; }
        public DateTime FechaRegistro { get; set; }

        [ForeignKey("Adjunto")]
        public long? AdjuntoId { get; set; }
        public virtual Adjunto Adjunto { get; set; }
        public string NombreAdjunto { get; set; }

        [ForeignKey("TipoLineamiento")]
        public int IdTipoLineamiento { get; set; }
        public virtual TipoLineamiento TipoLineamiento { get; set; }




    }
}
