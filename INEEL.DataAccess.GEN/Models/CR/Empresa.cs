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
    [Table("CR.cat_Empresas")]
    public class Empresa
    {
        public Empresa() { }

        [Key]
        public int EmpresaId { get; set; }

        [StringLength(250)]
        public string NombreEmpresa { get; set; }

        [StringLength(250)]
        public string NombreTitular { get; set; }

        [StringLength(100)]
        public string Puesto { get; set; }

        [StringLength(50)]
        public string Correo { get; set; }

        [StringLength(15)]
        public string Telefono { get; set; }

        [StringLength(100)]
        public string Ext { get; set; }

        [StringLength(15)]
        public string Celular { get; set; }

        [StringLength(50)]
        public string SitioWeb { get; set; }

        [ForeignKey("Adjunto")]
        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        public int? ContactoId { get; set; }

        [NotMapped]
        public Contacto contacto { get; set; }

        [StringLength(250)]
        public string Descripcion { get; set; }

        [StringLength(250)]
        public string Edo { get; set; }

        [StringLength(250)]
        public string Munipio { get; set; }

        [StringLength(200)]
        public string Localidad { get; set; }

        [StringLength(200)]
        public string LocalidadRS { get; set; }

        [StringLength(250)]
        public string Colonia { get; set; }

        [StringLength(250)]
        public string Calle { get; set; }

        [StringLength(10)]
        public string CP { get; set; }

        [StringLength(250)]
        public string RFC { get; set; }

        [StringLength(250)]
        public string RazonSocial { get; set; }

        [StringLength(250)]
        public string EdoR { get; set; }

        [StringLength(250)]
        public string MunicipioR { get; set; }

        [StringLength(250)]
        public string ColoniaR { get; set; }

        [StringLength(250)]
        public string CalleR { get; set; }

        [StringLength(10)]
        public string CPR { get; set; } //CODIGO POSTAL RZ

        public int Nivel { get; set; }

        [StringLength(200)]
        public string EstadoEmpresa { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [NotMapped]
        public string Adjunto64 { get; set; }

        [ForeignKey("Paises")]
        public int? PaisId { get; set; }
        public Paises Paises { get; set; }

        [ForeignKey("Estados")]
        public int? EstadoId { get; set; }
        public Estados Estados { get; set; }

        [ForeignKey("Municipios")]
        public int? MunicipioId { get; set; }
        public Municipios Municipios { get; set; }

        [ForeignKey("PaisesRS")]
        public int? PaisIdRS { get; set; }
        public Paises PaisesRS { get; set; }

        [ForeignKey("EstadosRS")]
        public int? EstadoIdRS { get; set; }
        public Estados EstadosRS { get; set; }

        [ForeignKey("MunicipiosRS")]
        public int? MunicipioIdRS { get; set; }
        public Municipios MunicipiosRS { get; set; }

        [ForeignKey("TipoOrganizacion")]
        public int? TipoOrganizacionId { get; set; }
        public TipoOrganizacion TipoOrganizacion { get; set; }

        [StringLength(100)]
        public string ClaveEmpresa { get; set; }
        [NotMapped]
        public List<UnidadOrganizacionalEmpresasExposed> unidadesExposed { get; set; }

        [NotMapped]
        public Boolean ContactoTitular { get; set; }
    }
}
