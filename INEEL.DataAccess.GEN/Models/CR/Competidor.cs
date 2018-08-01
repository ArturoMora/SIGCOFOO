using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_Competidor")]
    public class Competidor
    {
        public Competidor() { }

        [Key]
        public int CompetidorId { get; set; }

        public int Clave { get; set; }

        [StringLength(20)]
        public string TipoCompetidor { get; set; }

        [StringLength(20)]
        public string TipoAccesoVTC { get; set; }

        public string TipoAccesoTarifas { get; set; }

        [StringLength(20)]
        public string PosicionamientoTec { get; set; }

        [StringLength(300)]
        public string Descripcion { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [Required]
        [StringLength(250)]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [Required]
        [ForeignKey("Empresa")]
        public int EmpresaId { get; set; }
        public Empresa Empresa { get; set; }

        [ForeignKey("LineaDesarrolloTecnologico")]
        public int? LineaDesarrolloTecnologicoId { get; set; }
        public LineaDesarrolloTecnologico LineaDesarrolloTecnologico { get; set; }

        [ForeignKey("SegmentoMercado")]
        public int? SegmentoMercadoId { get; set; }
        public SegmentoMercado SegmentoMercado { get; set; }

        [ForeignKey("TamanoEmpresa")]
        public int? TamanoEmpresaId { get; set; }
        public TamanoEmpresa TamanoEmpresa { get; set; }

        ////Llave compuesta de unidad organizacional
        //[ForeignKey("UnidadOrganizacional"), Column(Order = 0)]
        //[StringLength(10)]
        public string ClaveUnidad { get; set; }
        ////Segunda parte de llave compuesta unidad organizacional
        //[ForeignKey("UnidadOrganizacional"), Column(Order = 1)]
        //public DateTime FechaEfectiva { get; set; }
        [NotMapped]
        public UnidadOrganizacional UnidadOrganizacional { get; set; }


        public ICollection<ServicioPorCompetidor> ServicioPorCompetidor { get; set; }
        public ICollection<ProductoPorCompetidor> ProductoPorCompetidor { get; set; }
        public ICollection<AdjuntoPorCompetidor> AdjuntoPorCompetidor { get; set; }

        [NotMapped]
        public int[] ServicioId { get; set; }

        [NotMapped]
        public int[] ProductoId { get; set; }

        [NotMapped]
        public int idServicio { get; set; }

        [NotMapped]
        public int idProducto { get; set; }

        [NotMapped]
        public int[] ServicioAntDel { get; set; }

        [NotMapped]
        public int[] ProductoAntDel { get; set; }

        [NotMapped]
        public List<AdjuntosParam>  AdjuntosParam { get; set; }

        [NotMapped]
        public List<ParamCompetidor> ParamCompetidor { get; set; }

        [NotMapped]
        public int vtcAdjuntoCompAntDel { get; set; }

        [NotMapped]
        public int vtcAdjuntoIdAntDel { get; set; }

        [NotMapped]
        public int tarAdjuntoCompAntDel { get; set; }

        [NotMapped]
        public int tarAdjuntoIdAntDel { get; set; }
        [NotMapped]
        public ICollection<Adjunto> listaAdjuntos { get; set; }
    }

    public class AdjuntosParam
    {
        public string adjuntosNuevosRuta { get; set; }
        public string adjuntosNuevosNombre { get; set; }
        public string tipo { get; set; }
        
    }

    public class ParamCompetidor
    {
        public int Serv { get; set; }
        public int Competidor { get; set; }
        public int Prod { get; set; }
    }
}