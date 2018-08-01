using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.GEN.Models.CP
{
    [Table("CP.tab_Documento")]
    public class Documento
    {
        public Documento() { }

        public int DocumentoId { get; set; }

        [ForeignKey("Miembros")]
        public int? idMiembroCP { get; set; }
        public virtual Miembros Miembros { get; set; }

        [ForeignKey("comunidad")]
        public int idComunidadCP { get; set; }
        public virtual Comunidad comunidad { get; set; }

        [ForeignKey("TipoDocumento")]
        public int idTipoDocumento { get; set; }
        public virtual TipoDocumento TipoDocumento { get; set; }

        [ForeignKey("Adjunto")]
        public long idAdjunto { get; set; }
        public virtual Adjunto Adjunto { get; set; }
        public string PalabraClave { get; set; }
        public Boolean TipoAcceso { get; set; }
        public DateTime FechaRegistro { get; set; }
        public string Estado { get; set; }
        public string idPersona { get; set; }

        [NotMapped]
        public string nombrePersona { get; set; }

        [StringLength(255)]
        public string nombreDocumento { get; set; }

    }
}
