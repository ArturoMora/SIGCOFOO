using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.MT;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using INEEL.DataAccess.PI.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT
{
    [Table("MT.SoftwarePersonal")]
    public class SoftwarePersonal
    {
        public int SoftwarePersonalId { get; set; }
                           
        [ForeignKey("Proyecto")]
        [StringLength(10)]
        //[Required]
        public string ProyectoId { get; set; }
        public Proyecto Proyecto { get; set; }

        [Required]
        [Column(TypeName = "varchar(MAX)")]
        public string Nombre { get; set; }

        //[Required]
        public float? NumeroVersion { get; set; }

        //[Required]
        public int? AnioVersion { get; set; }

        //[Required]
        [Column(TypeName = "varchar(MAX)")]
        public string DescripcionFuncional { get; set; }

        //[Required]
        [Column(TypeName = "varchar(MAX)")]
        public string PlataformaDesarrollo { get; set; }

        //TODO: FK -OK
        //[Required]
        [ForeignKey("TipoSoftware")]
        public int? TipoSoftwareId { get; set; }
        public TipoSoftware TipoSoftware { get; set; }

        public ICollection<AutorSoftware> Autores { get; set; }


        [Column(TypeName = "varchar(MAX)")]
        public String DerechoAutor { get; set; }

        //[Required]
        [Column(TypeName = "varchar(MAX)")]
        public String Comentarios { get; set; }

        //TODO: FK adjunto -OK
        //[Required]
        [ForeignKey("AdjuntoManualTecnico")]
        public long? ManualTecnico { get; set; }
        public Adjunto AdjuntoManualTecnico { get; set; }

        ////TODO: FK adjunto -OK
        //[Required]
        [ForeignKey("AdjuntoManualUsuario")]
        public long? ManualUsuario { get; set; }
        public Adjunto AdjuntoManualUsuario { get; set; }

        ////TODO: FK adjunto -OK
        //[Required]
        [ForeignKey("AdjuntoCodigoFuente")]
        public long? CodigoFuente { get; set; }
        public Adjunto AdjuntoCodigoFuente { get; set; }

        [ForeignKey("TipoAccesoCat")]
        public int TipoAcceso { get; set; }
        public TipoAcceso TipoAccesoCat { get; set; }


        //[Required]
        public Boolean Estado { get; set; }

        public string GerenciaClave { get; set; }
        //campos para flujo de validación
        public string ClavePersona { get; set; }

        public DateTime? FechaValidacion { get; set; }

        public int? EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }

        [ForeignKey("DerechosAutor")]
        public int? DerechosAutorId { get; set; }
        public DerechosAutor DerechosAutor { get; set; }


        [NotMapped]
        public string NombreUnidadOrganizacional { get; set; }
    }
}

