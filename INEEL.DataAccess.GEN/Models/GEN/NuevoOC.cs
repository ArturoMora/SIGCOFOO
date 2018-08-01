using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.NuevoOC")]
    public class NuevoOC
    {
        public long NuevoOCId { get; set; }

        [Required]
        public string descripcion { get; set; }

        [StringLength(3)]
        [Required]
        [ForeignKey("Modulo")]
        public string ModuloId { get; set; }
        public Modulo Modulo { get; set; }

        /// <summary>
        /// FK del objeto Ocs en la tabla GEN.cat_Ocs (agregar OC a la BD de ser necesario)   </summary>
        [MaxLength(100)]
        [Required]
        [ForeignKey("Ocs")]
        public String OcsId { get; set; }
        public Ocs Ocs { get; set; }

        /// <summary>
        /// DateTime.Now cuando se utiliza el constructor de 3 argumentos: FECHA ACTUAL </summary>
        [Required]
        public DateTime FechaRegistro { get; set; }
        /// <summary>
        /// TRUE cuando se utiliza el constructor de 3 argumentos: POR DEFAULT ES (NUEVO OC) </summary>
        [Required]
        public Boolean nuevo { get; set; }
        /// <summary>
        /// liga para ir a detalles </summary>
        public String liga { get; set; }
        public NuevoOC(string ModuloId, String OcsId, string descripcion, string ligaDetalles)
        {
            this.FechaRegistro = DateTime.Now;
            this.nuevo = true;
            this.ModuloId = ModuloId;
            this.OcsId = OcsId;
            this.descripcion = descripcion;
            this.liga = ligaDetalles;
        }
        public NuevoOC(string ModuloId, String OcsId, string descripcion, string ligaDetalles, string IdExterno)
        {
            this.FechaRegistro = DateTime.Now;
            this.nuevo = true;
            this.ModuloId = ModuloId;
            this.OcsId = OcsId;
            this.descripcion = descripcion;
            this.liga = ligaDetalles;
            this.IdExterno = IdExterno;
        }
        public NuevoOC() {
            this.FechaRegistro = DateTime.Now;
            this.nuevo = true;
        }

        public string IdExterno { get; set; }
    }
}
