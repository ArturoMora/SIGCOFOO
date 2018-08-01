using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.cat_Personas")]
    public class Personas
    {
        // ID - Indice de la tabla personal
        [Key, Column(Order = 0)]
        [StringLength(10)]
        public string ClavePersona { get; set; }

        //Registro unico de persona (CURP/ID SEGURO/ETC)
        [StringLength(20)]
        [Key, Column(Order = 1)]
        public string RUPersona { get; set; }

        [Key, Column(Order = 2)]
        public DateTime FechaEfectiva { get; set; }

        [StringLength(100)]
        public string Nombre { get; set; }

        [StringLength(100)]
        public string ApellidoMaterno { get; set; }

        [StringLength(100)]
        public string ApellidoPaterno { get; set; }

        [StringLength(100)]
        public string Correo { get; set; }

        public float ExperienciaPrevia { get; set; }

        [ForeignKey("Categoria")]
        public string CategoriaId { get; set; }
        public Categoria Categoria { get; set; }

        [ForeignKey("TipoPersonal")]
        public string TipoPersonalId { get; set; }
        public TipoPersonal TipoPersonal { get; set; }

        //[ForeignKey("UnidadOrganizacional")]
        public string ClaveUnidad { get; set; }
        [NotMapped]
        public UnidadOrganizacional UnidadOrganizacional { get; set; }

        [NotMapped]
        public string nombreUnidad { get; set; }


        //[ForeignKey("UbicacionAreas")]
        //public int? UbicacionAreaId { get; set; }
        //public virtual UbicacionAreas UbicacionAreas { get; set; }

        [ForeignKey("Plaza")]
        public int PlazaId { get; set; }
        public Plaza Plaza { get; set; }

        [ForeignKey("TipoContrato")]
        public string TipoContratoId { get; set; }
        public TipoContrato TipoContrato { get; set; }

        [StringLength(20)]
        public string OrigenDatos { get; set; }
        //[StringLength(200)]
        //public string Localizacion { get; set; }
        [StringLength(20)]
        public string plazaTrabajo { get; set; }        

        public int Estado { get; set; }// 0 no activo, 1 activo

        public DateTime FechaIngreso { get; set; } 
        public DateTime FechaNacimiento { get; set; }

        public DateTime? ultimaActualizacion { get; set; }
         
        [NotMapped]
        public string Clasificacion { get; set; }
        [NotMapped]
        public string Puesto { get; set; }

        public virtual string NombreCompleto
        {
            get
            {
                if (this.Nombre == null)
                    this.Nombre = "";
                if (this.ApellidoPaterno == null)
                    this.ApellidoPaterno = "";
                if (this.ApellidoMaterno == null)
                    this.ApellidoMaterno = "";
                return String.Concat(this.Nombre.Trim(), " ", this.ApellidoPaterno.Trim(), " ", this.ApellidoMaterno.Trim());                
                // return this.Nombre + " " + this.ApellidoPaterno + " " + this.ApellidoMaterno;
            }
        }

        [NotMapped]
        public virtual ICollection<RolPersona> Roles { get; set; }
        [NotMapped]
        public virtual ICollection<AccesoSistema> AccesoSistema { get; set; }

        [StringLength(5)]
        public string sexo { get; set; }        

        [NotMapped]
        public string Adjunto64 { get; set; }
        [NotMapped]
        public decimal Antiguedad
        {
            get
            {
                TimeSpan dif;

                if (this.Estado == 0)
                {
                    dif = this.FechaEfectiva - this.FechaIngreso;
                }
                else {
                    DateTime Hoy = DateTime.Today;
                    dif = Hoy - this.FechaIngreso;
                }
                
                decimal ret = decimal.Round(Convert.ToDecimal(dif.TotalDays / 365.25), 2);
                return ret;
            }
            set {
                return;    
            }
        }
        [NotMapped]
        public DetallePersona DetallePersona { get; set; }

        [NotMapped]
        public Boolean esPersonaActiva { get; set; }
    }

    public class ComparerPersonasId : IEqualityComparer<Personas>
    {
        #region IEqualityComparer<Personas> Members
        public bool Equals(Personas x, Personas y)
        {
            return x.ClavePersona.Equals(y.ClavePersona);
        }

        public int GetHashCode(Personas obj)
        {
            return obj.ClavePersona.GetHashCode();
        }
        #endregion

    }
}