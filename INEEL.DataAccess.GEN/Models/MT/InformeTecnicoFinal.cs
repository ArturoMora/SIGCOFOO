using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.MT.ITF;
using INEEL.DataAccess.MT.Models.ITF;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.MT.Models
{
    [Table("MT.InformeTecnicoFinal")]
    public class InformeTecnicoFinal
    {
        /// <summary>
        /// <para>ProyectoId +"-"+ consecutivo, para la version 3 </para>
        /// <para>idSigco2 +"-"+ ProyectoId +"-"+ idInformeRIIE para los historiocos (de v2)</para>
        /// </summary>
        [Key]
        [StringLength(25)]
        [Required]
        public String InformeTecnicoFinalId { get; set; }

        [MaxLength(100)]
        public String ClasificacionSignatura { get; set; }
        //[MaxLength(50)]
        //public String numeroInforme { get; set; }
        [Column(TypeName = "varchar(MAX)")]
        public String Titulo { get; set; }

        [ForeignKey("EstadoITFFlujo")]
        public int EstadoITFFlujoId { get; set; }
        public EstadoITFFlujo EstadoITFFlujo { get; set; }

        [ForeignKey("Proyecto")]
        [StringLength(10)]
        [Required]
        public string ProyectoId { get; set; }
        public Proyecto Proyecto { get; set; }

        [ForeignKey("ITFgeneral")]
        public String ITFgeneralId { get; set; }
        public ITFgeneral ITFgeneral { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }
                
        [ForeignKey("ResultadosE")]
        public int? ResultadosEId { get; set; }
        public ResultadosE ResultadosE { get; set; }
        [ForeignKey("SatisCte")]
        public int? SatisCteId { get; set; }
        public SatisCte SatisCte { get; set; }
        [ForeignKey("Resultados")]
        public int? ResultadosId { get; set; }
        public Resultados Resultados { get; set; }
        [ForeignKey("ProyFuturo")]
        public int? ProyFuturoId { get; set; }
        public ProyFuturo ProyFuturo { get; set; }             

        [ForeignKey("LAcap")]
        public int? LAcapId { get; set; }
        public LAcap LAcap { get; set; }
        [ForeignKey("LActe")]
        public int? LActeId { get; set; }
        public LActe LActe { get; set; }
        [ForeignKey("LAproy")]
        public int? LAproyId { get; set; }
        public LAproy LAproy { get; set; }

        public ICollection<AutorITF> AutoresITF { get; set; }

        public ICollection<Insumos> listaInsumos { get; set; }
        
        public ICollection<Evaluaciones> Evaluaciones { get; set; }
        /// <summary>
        /// id historico del sigco etapa2
        /// </summary>
        public int? idSigco2 { get; set; }
        /// <summary>
        /// idInforme historico que se le asigna en RIIE
        /// </summary>
        public int? idInformeRIIE { get; set; }
        public bool? ultraConfidencial { get; set; }

        /// <summary>
        /// FechaAutorizacion del gerente o quivalente, en esta fecha se actualiza la unidad organizacional de ser necesario
        /// </summary>
        public DateTime? FechaAutorizacion { get; set; }
        /// <summary>
        /// FechaPublicacion por el Admin de MT
        /// </summary>
        public DateTime? FechaPublicacion { get; set; }
        /// <summary>
        /// ClaveUnidadOrganizacional al momento de FechaAutorizacion
        /// </summary>
        public string ClaveUnidadOrganizacional { get; set; }
        public string ClaveUnidadPadre { get; set; }
        [NotMapped]
        public string NombreUnidadOrganizacional { get; set; }
        [NotMapped]
        public string NombreUnidadPadre { get; set; }

        public int? AnioElaboracion { get; set; }

        [MaxLength(50)]
        public string NumInforme { get; set; }
        [MaxLength(50)]
        public string NumInventario { get; set; }
        
        //eliminación logica: true 
        public Boolean? Eliminado { get; set; }
    }
}
