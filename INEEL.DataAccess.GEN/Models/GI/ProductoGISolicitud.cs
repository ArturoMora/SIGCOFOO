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
    [Table("GI.tab_ProductoGISolicitud")]
    public class ProductoGISolicitud
    {
        [Key]
        public int Id { get; set; }
        public int ProductoId { get; set; }
        public ProductoGI ProductoGI { get; set; }
        
        public string ComentariosSolicitante { get; set; }
        public string ComentariosComite { get; set; }

        public string Innovacion { get; set; }
        public string Superior { get; set; }
        public string Fase { get; set; }
        public DateTime FechaRegistro { get; set; }
        public ICollection<ProductoGISolicitudArchivosInnovacion> ProductoGISolicitudArchivosInnovacion { get; set; }
        public ICollection<ProductoGISolicitudArchivosSuperior> ProductoGISolicitudArchivosSuperior { get; set; }
        public ICollection<ProductoGISolicitudArchivosFase> ProductoGISolicitudArchivosFase { get; set; }
        
    }
}
