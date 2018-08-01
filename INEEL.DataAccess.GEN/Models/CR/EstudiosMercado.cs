using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Models.CR
{
    [Table("CR.tab_EstudiosMercado")]
    public class EstudiosMercado
    {
        public int EstudiosMercadoId { get; set; }

        public string Tema { get; set; }

        public DateTime Fecha { get; set; }

        public string ProyectoId { get; set; }

        [NotMapped]
        public Proyecto Proyecto { get; set; }

        [StringLength(10)]
        public string ClaveUnidad { get; set; }

        [NotMapped]
        public UnidadOrganizacional UnidadOrganizacional { get; set; }

        public string Acceso { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        [NotMapped]
        public string  Autores { get; set; }

        public string proposito { get; set; }
        [NotMapped]
        public ICollection<Adjunto> listaAdjuntos { get; set; }

        [NotMapped]
        public ICollection<AdjuntosEstudiosMercado> adjuntosEstudioMercado { get; set; }

        [NotMapped]
        public DateTime fechaInicioComparacion { get; set; }

        [NotMapped]
        public DateTime fechaFinalComparacion { get; set; }
        [NotMapped]
        public string busquedaFecha { get; set; }

        [NotMapped]
        public Personas listaAutores { get; set; }

    }
}
