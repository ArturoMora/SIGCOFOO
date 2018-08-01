
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using INEEL.DataAccess.GEN.Models.CR;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.cat_Contactos")]
    public class Contacto
    {
        public Contacto(){}

        [Key]
        public int ContactoId {get;set;}

        [StringLength(200)]
        public string NombreContacto {get;set;}

        [StringLength(200)]
        public string ApellidoPaterno {get;set;}

        [StringLength(200)]
        public string ApellidoMaterno {get;set;}

        [ForeignKey("Adjunto")]
        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        [StringLength(31)]
        public string Telefono { get; set; }

        [StringLength(30)]
        public string Celular { get; set; }

        [StringLength(10)]
        public string Extension { get; set; }

        [StringLength(151)]
        public string Correo {get;set;}

        [StringLength(200)]
        public string Direccion {get;set;}
        
        [StringLength(200)]
        public string RedFacebook { get; set; }

        [StringLength(200)]
        public string RedTwitter{ get; set; }

        [StringLength(200)]
        public string RedLinkedin { get; set; }

        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [ForeignKey("UnidadOrganizacionalEmpresas")]
        public string ClaveUnidad { get; set; }
        public UnidadOrganizacionalEmpresas UnidadOrganizacionalEmpresas { get; set; }

        [Required]
        [ForeignKey("Empresa")]
        public int EmpresaId { get; set; }
        public Empresa Empresa { get; set; }

        [ForeignKey("Paises")]
        public int? PaisId { get; set; }
        public Paises Paises { get; set; }

        [ForeignKey("Estados")]
        public int? EstadoId { get; set; }
        public Estados Estados { get; set; }

        [ForeignKey("Municipios")]
        public int? MunicipioId { get; set; }
        public Municipios Municipios { get; set; }

        [StringLength(200)]
        public string Edo { get; set; }

        [StringLength(200)]
        public string Munipio { get; set; }

        [StringLength(200)]
        public string Localidad { get; set; }

        [StringLength(200)]
        public string Colonia { get; set; }

        [StringLength(200)]
        public string Calle { get; set; }

        [StringLength(10)]
        public string CP { get; set; }

        [StringLength(200)]
        public string Puesto { get; set; }

        [StringLength(200)]
        public string EstadoContacto { get; set; }

        public int? PaisOrigenId { get; set; }
        [NotMapped]
        public Paises PaisOrigen { get; set; }

        [NotMapped]
        public string Adjunto64 { get; set; }

        [NotMapped]
        public string NombreCompleto
        {
            get
            {
                return this.NombreContacto + " " + this.ApellidoPaterno + " " + this.ApellidoMaterno;
            }
        }

        [NotMapped]
        public List<string> empresas { get; set; }

        public ICollection<ContactoPerfil> ContactoPerfil { get; set; }

        public ICollection<ContactoPuestoHistorico> ContactoPuestoHistorico { get; set; }

        [ForeignKey("TituloPersona")]
        public int? TituloId { get; set; }
        public TituloPersona TituloPersona { get; set; }
    }

    public class ContactoExposed
    {

        public int ContactoId { get; set; }
        public string Telefono { get; set; }
        public string Celular { get; set; }
        public string Extension { get; set; }
        public string Correo { get; set; }
        public string Direccion { get; set; }
        public string ClaveUnidad { get; set; }
        public int EmpresaId { get; set; }
        public string Puesto { get; set; }
        public string NombreCompleto {get;set;}

    }

}