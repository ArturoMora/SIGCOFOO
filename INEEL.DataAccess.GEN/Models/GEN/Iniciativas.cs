using INEEL.DataAccess.CR.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{

    [Table("GEN.Iniciativas")]
    public class Iniciativas
    {
        [Key]
        [StringLength(10)]
        public string FolioId { get; set; }


        [StringLength(200)]
        public string Titulo { get; set; }


        // Numero de empleado que propone la iniciativa
        [StringLength(10)]
        public string ClaveEmpIniciativa { get; set; }

        public DateTime Fecha { get; set; }


        /// <summary>
        /// Tipicamente la gerencia </summary>
        [StringLength(10)]
        public string UnidadOrganizacionalId { get; set; }
        [NotMapped]
        public UnidadOrganizacional UnidadOrganizacional { get; set; }

        [StringLength(10)]
        public string SubPrograma { get; set; }

        public bool Estado { get; set; }

        [StringLength(20)]
        public string EstadoIniciativa { get; set; }

        [StringLength(10)]
        public string Origen { get; set; }

        //public float Costo { get; set; }
        [DataType("decimal(12 ,2")]
        public decimal? Costos { get; set; }

        [ForeignKey("Empresa")]
        public int? EmpresaId { get; set; }
        public Empresa Empresa { get; set; }

        [ForeignKey("UnidadOrganizacionalEmpresas")]
        [StringLength(20)]
        public string ClaveUnidadEmpresa { get; set; }
        public UnidadOrganizacionalEmpresas UnidadOrganizacionalEmpresas { get; set; }

        [ForeignKey("Contacto")]
        public int? ContactoId { get; set; }
        public Contacto Contacto { get; set; }
    }
}
