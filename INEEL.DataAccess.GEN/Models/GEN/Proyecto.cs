using INEEL.DataAccess.CR.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Migrations;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.Proyectos")]
    public class Proyecto
    {
        [Key]
        [StringLength(10)]
        public string ProyectoId { get; set; }

        
        public string Nombre { get; set; }

        [StringLength(10)]
        public string NumjefeProyecto { get; set; }

        [StringLength(200)]
        public string NombreJefeProyecto { get; set; }

        public DateTime FechaInicio { get; set; }

        public DateTime FechaFin { get; set; }

        /// <summary>
        /// Tipicamente la gerencia </summary>
        [StringLength(10)]
        [Required]
        public string UnidadOrganizacionalId { get; set; }

        [StringLength(10)]
        public string SubPrograma { get; set; }

        [NotMapped]
        public string subprogramaProyecto { get; set; }

        public bool Estado { get; set; }

        [StringLength(20)]
        public string EstadoProyecto { get; set; }

        public float? Costo { get; set; }

        [StringLength(10)]
        public string Origen { get; set; }

        [ForeignKey("Empresa")]
        public int? EmpresaId { get; set; }
        public Empresa Empresa { get; set; }

        /// <summary>
        /// NotMapped, cuando se requiera directamente el nombre de la empresa </summary>
        [NotMapped]
        public String EmpresaName { get; set; }

        [ForeignKey("UnidadOrganizacionalEmpresas")]
        [StringLength(20)]
        public string ClaveUnidadEmpresa { get; set; }
        public UnidadOrganizacionalEmpresas UnidadOrganizacionalEmpresas { get; set; }

        [ForeignKey("Contacto")]
        public int? ContactoId { get; set; }
        public Contacto Contacto { get; set; }

        /// <summary>
        /// NotMapped, Bandera </summary>
        [NotMapped]
        public int Bandera { get; set; }

        /// <summary>
        /// NotMapped, UnidadOrganizacional </summary>
        [NotMapped]
        public UnidadOrganizacional UnidadOrganizacional { get; set; }

        public decimal? FacturacionPlaneada { get; set; }
        public decimal? FacturacionReal { get; set; }

        [StringLength(50)]
        public string TipoProyecto { get; set; }

        [NotMapped]
        public string subprogramasProyecto { get; set; }


        //Columna agregada el 10 oct
        public decimal?  egresos { get; set; }

        /// <summary>
        /// NotMapped, Bandera </summary>
        [NotMapped]
        public int ProgramasActivos { get; set; }

        [NotMapped]
        public string NombreEmpresa { get; set; }

        [NotMapped]
        public string NombreUnidad { get; set; }

        [NotMapped]
        public string NombreUnidadEmpresa{get;set;}

        [NotMapped]
        public int claveEmpresa { get; set; }
    }
}
