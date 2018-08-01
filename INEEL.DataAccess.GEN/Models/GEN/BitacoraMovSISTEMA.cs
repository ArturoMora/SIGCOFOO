using INEEL.DataAccess.GEN.Util;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    public class BitacoraMovSISTEMA
    {
        [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        public object _id { get; set; } //MongoDb uses this field as identity.

       // [Display(Name = "Fecha del movimiento")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
       // [DisplayFormat(DataFormatString = "{0:dd/MMM/yyyy hh:mm:ss.ff}")]
        public DateTime fechaMovimiento { get; set; }

        //Se refiere al username (se utiliza autorID) para homologar todo en español
       // [Display(Name = "Clave del autor")]
        public string cveAutor { get; set; }

       // [Display(Name = "Nombre del autor")]
        public string nombreAutor { get; set; }

       // [Display(Name = "Clave del tipo de movimiento")]
        public string cveTipoMovimiento { get; set; }
       // [Display(Name = "Tipo de movimiento")]
        public string tipoMovimiento { get; set; }

       // [Display(Name = "Clave del elemento afectado")]
        public string cveElemento { get; set; }

       // [Display(Name = "Elemento afectado")]
        public string elemento { get; set; }

       // [Display(Name = "Justificación")]
        public string justificacion { get; set; }
       // [Display(Name = "Movimientos")]
        public List<string> detallesMovimiento { get; set; }
        public BitacoraMovSISTEMA()
        {
            try
            {
                this.fechaMovimiento = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Local);

                //if (HttpContext.Current.User.Identity.IsAuthenticated)
                //{

                this.cveAutor=String.IsNullOrEmpty(this.cveAutor) ? "" : this.cveAutor; //HttpContext.Current.User.Identity.Name;
                this.nombreAutor= String.IsNullOrEmpty(this.nombreAutor) ? "" : this.nombreAutor;

                //}
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        public  BitacoraMovSISTEMA(List<string> cambios) : this()
        {
            try
            {
                this.cveAutor = SimpleSessionPersister.PersonaId; //HttpContext.Current.User.Identity.Name;
                this.nombreAutor = SimpleSessionPersister.nombreUsuario;
            }
            catch (Exception e)
            {

            }
            if (cambios.Count > 0)
                this.detallesMovimiento = cambios;

            if (this.justificacion == null)
            {
                this.justificacion = "";
            }
        }

        public  BitacoraMovSISTEMA(List<string> cambios, Personas usuario) : this(cambios)
        {
            if (usuario != null)
            {
                this.cveAutor = usuario.ClavePersona;
                this.nombreAutor = usuario.ClavePersona; //SimpleSessionPersister.nombreUsuario;
            }
        }

        public  BitacoraMovSISTEMA(List<string> cambios, string justificacion) : this(cambios)
        {
            if (justificacion != null)
                this.justificacion = justificacion;
            else
                this.justificacion = "";
        }
    }
}