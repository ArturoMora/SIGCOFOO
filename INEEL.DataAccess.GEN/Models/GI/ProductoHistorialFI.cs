using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_ProductoHistorialFI")]
    public class ProductoHistorialFI
    {
        public int Id { get; set; }

        [ForeignKey("ProductoGI")]
        public int ProductoId { get; set; }
        public ProductoGI ProductoGI { get; set; }

        public int SolicitudId { get; set; }

        public string ComentarioGerencia { get; set; }
        public string EvaluacionGerencia { get; set; }
        public DateTime? FechaEvaluacionGerencia { get; set; }

        public string ComentarioPreliminar { get; set; }
        public string EvaluacionPreliminar { get; set; }
        public DateTime? FechaEvaluacionPreliminar { get; set; }

        public string ComentarioFinal { get; set; }
        public string EvaluacionFinal { get; set; }
        public DateTime? FechaEvaluacionFinal { get; set; }

        [NotMapped]
        public string etapaEvaluacion{get;set;}


    }
}
