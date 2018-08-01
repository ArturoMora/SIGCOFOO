using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.GI;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_Propuesta")]
    public class Propuesta
    {       
        [Key]
        public int Id { get; set; }


        public String PropuestaId { get; set; }

        public int? IdeaInnovadoraId { get; set; }
        public IdeaInnovadora IdeaInnovadora { get; set; }
        public Boolean PropuestaInterna { get; set; }

        public String NombreTecnico { get; set; }
        public String ProductoServicio { get; set; }
        public String ClaveProponentePrincipal { get; set; }
        [NotMapped]
        public String NombreProponentePrincipal { get; set; }
        [ForeignKey("Empresa")]
        public int? EmpresaPromotorClave { get; set; } //empresa (Instituto o Cliente)
        public Empresa Empresa { get; set; }

        [NotMapped]
        public String EmpresaPromotorNombre { get; set; }

        [StringLength(10)]
        public String UnidadOrganizacionalId { get; set; }
        public String NombreUnidadOrganizacional { get; set; }
        public int SegmentoMercadoId { get; set; }
        public SegmentoMercado SegmentoMercado { get; set; }

        public DateTime? FechaRegistro { get; set; }
        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        public string ClavePersona { get; set; }
        public DateTime? FechaValidacion { get; set; }

        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }
        [ForeignKey("TipoAccesoGI")]
        public int TipoAcceso { get; set; }
        public TipoAccesoGI TipoAccesoGI { get; set; }

        [NotMapped]
        public string propuestaIdAux { get; set; }
        [NotMapped]
        public string SegmentoMercadoNombre { get; set; }

        public Boolean Vigente { get; set; }
        public String Comentarios { get; set; }
        public int Prioridad { get; set; }

        public int? fondo { get; set; }

        [NotMapped]
        public DateTime fechaInicioComparacion { get; set; }
        [NotMapped]
        public DateTime fechaFinalComparacion { get; set; }
        [NotMapped]
        public string busquedaFecha { get; set; }
        
    }
}
