
using INEEL.DataAccess.GEN.Models.CR;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_OportunidadNegocios")]
    public class OportunidadNegocio
    {
        public OportunidadNegocio() { }

        [Key]
        public int OportunidadNegocioId { get; set; }

        [Required]
        [StringLength(250)]
        public string NombreOportunidad { get; set; }

        public DateTime? FechaMaximaAtencion { get; set; }

        [ForeignKey("TipoEvento")]
        public int? TipoEventoONId { get; set; }
        public TipoEventoON TipoEvento { get; set; }

        [ForeignKey("Evento")]
        public int? EventoId { get; set; }
        public Eventos Evento { get; set; }

        [ForeignKey("Contacto")]
        public int? ContactoId { get; set; }
        public Contacto Contacto { get; set; }

        [ForeignKey("Empresa")]
        public int? empresaId { get; set; }
        public Empresa Empresa { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        [ForeignKey("EstadoFlujoON")]
        public int? EstadoFlujoONId { get; set; }
        public EstadoFlujoON EstadoFlujoON { get; set; }

        [ForeignKey("EstadoON")]
        public int? EstadoONId { get; set; }
        public EstadoON EstadoON { get; set; }

        public DateTime FechaRegistro { get; set; }

        public DateTime? FechaReactivacion { get; set; }

        [StringLength(100)]
        public string NoIniciativa { get; set; }

        [StringLength(100)]
        public string NoPropuesta { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        [StringLength(250)]
        public string ClaveEmpleado { get; set; }

        [StringLength(250)]
        public string MedioComunicacion { get; set; }

        [StringLength(250)]
        public string DescripcionMedioContacto { get; set; }

        [StringLength(250)]
        public string Descripcion { get; set; }

        public bool Notificar { get; set; }

        [StringLength(10)]
        public string Especialista { get; set; }

        [StringLength(10)]
        public string Responsable { get; set; }

        [StringLength(10)]
        public string Investigador { get; set; }

        [Column(TypeName = "varchar(MAX)")]
        public string ComentariosEspecialista { get; set; }

        [Column(TypeName = "varchar(MAX)")]
        public string ComentariosAdministrador { get; set; }

        [Column(TypeName = "varchar(MAX)")]
        public string ComentariosResponsable { get; set; }

        [Column(TypeName = "varchar(MAX)")]
        public string ComentariosInvestigador { get; set; }

        [Column(TypeName = "varchar(MAX)")]
        public string TituloPropuesta { get; set; }

        [Column(TypeName = "varchar(MAX)")]
        public string PorQueSuspende { get; set; }

        [Column(TypeName = "varchar(MAX)")]
        public string PorQueCancela { get; set; }

        [NotMapped]
        public string[] AdjuntosDelete { get; set; }

        [NotMapped]
        public string Comentarios { get; set; }

        [NotMapped]
        public string NombreEspecialista { get; set; }

        [NotMapped]
        public string NombreInvestigador { get; set; }

        [StringLength(10)]
        public string ClaveUnidad { get; set; }

        public ICollection<AdjuntoPorOportunidad> AdjuntoPorOportunidad { get; set; }

        [NotMapped]
        public Boolean AsignarGerente { get; set; }

        [NotMapped]
        public string NombreUnidad {get;set;}

    }
}

