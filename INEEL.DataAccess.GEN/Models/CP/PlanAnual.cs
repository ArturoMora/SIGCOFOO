using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.tab_PlanAnual")]
    public class PlanAnual
    {
        public PlanAnual() { }

        [Key]
        public int PlanId { get; set; }
        public string Nombre { get; set; }
        public int AnioCorrespondiente { get; set; }

        [ForeignKey("LineaDesarrolloTecnologico")]
        public int? idLineaInv { get; set; } 
        public virtual LineaDesarrolloTecnologico LineaDesarrolloTecnologico { get; set; }

        public DateTime FechaRegistro { get; set; }
        public string PalabrasClave { get; set; }

        [ForeignKey("Adjunto")]
        public long? AdjuntoId { get; set; }
        public virtual Adjunto Adjunto { get; set; }
        public Boolean TipoAcceso { get; set; }
        public string Estado { get; set; }

        [ForeignKey("Comunidad")]
        public int idCP { get; set; }
        public virtual Comunidad Comunidad { get; set; }

        [NotMapped]
        public ICollection<Autores> autores { get; set; }
        [NotMapped]
        public ICollection<Personas> personas { get; set; }
        [NotMapped]
        public string[] claveAutores { get; set; }
        [NotMapped]
        public string nombrePersona { get; set; }
        [NotMapped]
        public string nombreComunidad { get; set; }
        [NotMapped]
        public DateTime fechaInicioComparacion { get; set; }
        [NotMapped]
        public DateTime fechaFinalComparacion { get; set; }
        [NotMapped]
        public string busquedaFecha { get; set; }

    }
}
