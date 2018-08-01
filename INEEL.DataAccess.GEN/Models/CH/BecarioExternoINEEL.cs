using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_BecarioExternoINEEL")]
    public class BecarioExternoINEEL
    {   
        //Por default los campos de tipo int son requeridos, por eso no agregamos la dataannotation de [Required]
        [Key]
        public int BecarioId { get; set; }

        public DateTime? FechaValidacion { get; set; }  //Puede que primero se cree el registro y posteriormente se valide, por la incertidumbre del cambio la dejamos opcional
        public DateTime FechaInicio { get; set; }
        public DateTime FechaTermino { get; set; }

        [ForeignKey("EstadoFlujo")]
        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }

        [ForeignKey("TipoBeca")]
        public int TipoBecaId { get; set; }
        public TipoBeca TipoBeca { get; set; }

        [ForeignKey("Proyecto")]
        [StringLength(10)]
        public string ProyectoId { get; set; }
        public Proyecto Proyecto { get; set; }

        public string TituloEstancia { get; set; }
        public string Descripcion { get; set; }
        public string ClaveAsesor { get; set; }
        public string NombreAsesor { get; set; }
        public string ClaveBecario { get; set; }
        public string NombreBecario { get; set; }

        [ForeignKey("Adjunto")]
        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        public string ClaveUnidad { get; set; }

        [ForeignKey("Institucion")]
        public int InstitucionId { get; set; }
        public Institucion Institucion { get; set; }

        public Boolean PersonalIneel { get; set; }
        public string ClavePersona { get; set; }
        public string Notas { get; set; }

        [NotMapped]
        public UnidadOrganizacional Gerencia { get; set; }

        [NotMapped]
        public Personas Persona { get; set; }

        [NotMapped]
        public string NombreGerencia { get; set; }
    }
}
