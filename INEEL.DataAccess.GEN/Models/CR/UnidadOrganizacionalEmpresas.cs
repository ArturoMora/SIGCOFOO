using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.UnidadOrganizacionalEmpresas")]
    public class UnidadOrganizacionalEmpresas
    {
        //[Key, Column(Order = 0)]
        [Key]
        [StringLength(150)]
        public string ClaveUnidad { get; set; }
        [StringLength(300)]
        public string NombreUnidad { get; set; }
        //[Key, Column(Order = 1)]
        public DateTime FechaEfectiva { get; set; }
        public string padre { get; set; }
        public int Estado { get; set; }
        #region detalles

        [StringLength(100)]

        public string NombreTitular { get; set; }

        [StringLength(100)]
        public string Puesto { get; set; }

        [StringLength(50)]
        public string Correo { get; set; }

        [StringLength(30)]
        public string Telefono { get; set; }

        [StringLength(10)]
        public string Ext { get; set; }

        [StringLength(30)]
        public string Celular { get; set; }
        [StringLength(250)]
        public string Descripcion { get; set; }

        [StringLength(250)]
        public string Edo { get; set; }

        [StringLength(250)]
        public string Munipio { get; set; }

        [StringLength(250)]
        public string Colonia { get; set; }

        [StringLength(250)]
        public string Calle { get; set; }

        [StringLength(10)]
        public string CP { get; set; }

        [ForeignKey("Paises")]
        public int? PaisId { get; set; }
        public Paises Paises { get; set; }

        [ForeignKey("Estados")]
        public int? EstadoId { get; set; }
        public Estados Estados { get; set; }

        [ForeignKey("Municipios")]
        public int? MunicipioId { get; set; }
        public Municipios Municipios { get; set; }

        #endregion detalles
        [ForeignKey("Empresa")]
        public int EmpresaId { get; set; }
        public Empresa Empresa { get; set; }

        [ForeignKey("Adjunto")]
        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        public int? ContactoId { get; set; }

        [NotMapped]
        public Contacto contacto { get; set; }

        public UnidadOrganizacionalEmpresas()
        {
            this.Children = new List<UnidadOrganizacionalEmpresas>();
        }
        [NotMapped]
        public UnidadOrganizacional ClaveUnidadPadre { get; set; }
        [NotMapped]
        public virtual List<UnidadOrganizacionalEmpresas> Children { get; set; }
        [NotMapped]
        public virtual ICollection<UnidadOrganizacionalEmpresas> nodes
        {
            get { return this.Children; }

        }
        [NotMapped]
        public string id
        {
            get { return this.ClaveUnidad; }

        }

        public Boolean CampoAgrupador { get; set; }

        [NotMapped]
        public string title
        {
            get { return this.NombreUnidad; }

        }
        #region atributos para la actualizacion de migas de pan
        //Importante para la actualizacion de migas de pan
        [NotMapped]
        public string oldValueUnidad { get; set; }

        [NotMapped]
        public string newValueUnidad { get; set; }

        [NotMapped]
        public Boolean oldValueCampoAgrupador { get; set; }

        [NotMapped]
        public string nombrePadre { get; set; }

        [NotMapped]
        public string comentarios { get; set; }

        #endregion 


        [NotMapped]
        public int? oldValueTitular { get; set; }

        [StringLength(100)]
        public string ClaveEmpresa { get; set; }

        [NotMapped]
        public int nuevo { get; set; }

        [NotMapped]
        public string autor { get; set; }

        [NotMapped]
        public string PatronClave  //Recupera el patron de las claves de empresa, es decir, de PEMEX548 se obtiene solo PEMEX
        {
            get
            {
                var patron = "";
                if (!string.IsNullOrEmpty(this.ClaveUnidad))
                {
                    foreach (var c in this.ClaveUnidad)
                    {
                        if (Char.IsLetter(c))
                        {
                            patron += c;
                        }
                    }
                }

                return patron;
            }
            set
            {
                return;
            }
        }

            

    }
    public class ComparerIdOrClave : IEqualityComparer<UnidadOrganizacionalEmpresas>
    {
        #region IEqualityComparer
        public bool Equals(UnidadOrganizacionalEmpresas x, UnidadOrganizacionalEmpresas y)
        {
            return x.ClaveUnidad.Equals(y.ClaveUnidad);
        }

        public int GetHashCode(UnidadOrganizacionalEmpresas obj)
        {
            return obj.ClaveUnidad.GetHashCode();
        }
        #endregion

    }

    public class UnidadOrganizacionalEmpresasExposed
    {

        public string ClaveUnidad { get; set; }

        public string NombreUnidad { get; set; }

        public DateTime FechaEfectiva { get; set; }
        public string padre { get; set; }

        public int EstadoRegistro { get; set; }

        public string NombreTitular { get; set; }

        public string Telefono { get; set; }





        public string PaisNombre { get; set; }
        public int? PaisId { get; set; }

        public string EstadoNombre { get; set; }
        public int? EstadoId { get; set; }

        public string MunicipioNombre { get; set; }
        public int? MunipioId { get; set; }


        public string Colonia { get; set; }


        public string Calle { get; set; }


        public string CP { get; set; }


        public int EmpresaId { get; set; }

        public String Direccion { get {
                List<String> elemens = new List<String>();
                elemens.Add(this.Calle);
                elemens.Add(this.Colonia);
                elemens.Add(this.MunicipioNombre);
                elemens.Add(this.EstadoNombre);
                elemens.Add(this.CP);
                elemens.Add(this.PaisNombre);
                return string.Join(",", elemens.ToArray()); ;
            } }

    }
}