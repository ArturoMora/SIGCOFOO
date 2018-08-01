using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_Producto")]
    public class ProductoGI
    {
        [Key]
        public int ProductoId { get; set; }

        [ForeignKey("Proyecto")]
        [StringLength(10)]
        public String ProyectoId { get; set; }
        public Proyecto Proyecto { get; set; }
        [StringLength(10)]
        public string UnidadOrganizacionalId { get; set; }
        public String NombreTecnico { get; set; }
        public ICollection<ProductoAutores> ProductoAutores { get; set; }
        public ICollection<ProductoGIEvaluadores> ProductoGIEvaluadores { get; set; }
        public String NombreComercial { get; set; }
        public String Necesidades { get; set; }
        public int SegmentoMercadoId { get; set; }
        public SegmentoMercado SegmentoMercado { get; set; }
        public String Descripcion { get; set; }

        [ForeignKey("FactorInnovacion")]
        public int FactorInnovacionId { get; set; }
        public FactorInnovacion FactorInnovacion { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public string ClavePersona { get; set; }
        [ForeignKey("EstadoFlujo")]
        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }
        [ForeignKey("TipoAccesoGI")]
        public int TipoAcceso { get; set; }
        public TipoAccesoGI TipoAccesoGI { get; set; }
        public DateTime? FechaValidacion { get; set; }
        [NotMapped]
        public UnidadOrganizacional Unidad { get; set; }

        [ForeignKey("ComiteFlujo")]
        public int? EstadoFlujoComite { get; set; }
        public EstadoFlujo ComiteFlujo { get; set; }

        public Boolean? VoBoDuenio { get; set; }
        [NotMapped]
        public String Movimiento { get; set; }
        [NotMapped]
        public String Evaluador { get; set; }
        [NotMapped]
        public String Autor { get; set; }
        [NotMapped]
        public String JefeProyecto { get; set; }
        [NotMapped]
        public String ClaveFactorInnovacion { get; set; }
        [NotMapped]
        public int Periodo { get; set; }
    }
}
