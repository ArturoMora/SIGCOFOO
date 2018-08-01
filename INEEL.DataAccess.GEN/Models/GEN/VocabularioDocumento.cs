using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.VocabularioDocumento")]
    public class VocabularioDocumento
    {
        
        [MaxLength(15)]
        [Key, Column(Order = 0)]
        public string VocabularioId { get; set; }
        [Key, Column(Order = 1)]
        public long AdjuntoId { get; set; }
        public Boolean Disponible { get; set; }

        public VocabularioDocumento()
        {
            Disponible = true;
        }
        public VocabularioDocumento(string VocabularioId, long AdjuntoId)
        {
            this.VocabularioId = VocabularioId;
            this.AdjuntoId = AdjuntoId;
            this.Disponible = true;

        }
        public VocabularioDocumento(string VocabularioId, long AdjuntoId, Boolean disponible)
        {
            this.VocabularioId = VocabularioId;
            this.AdjuntoId = AdjuntoId;
            this.Disponible = disponible;
        }
    }
    public class ComparerDocumentoVocabularioId : IEqualityComparer<VocabularioDocumento>
        {
            #region IEqualityComparer<Personas> Members
            public bool Equals(VocabularioDocumento x, VocabularioDocumento y)
            {
                return x.VocabularioId.Equals(y.VocabularioId);
            }

            public int GetHashCode(VocabularioDocumento obj)
            {
                return obj.VocabularioId.GetHashCode();
            }
            #endregion

        }

    
}
