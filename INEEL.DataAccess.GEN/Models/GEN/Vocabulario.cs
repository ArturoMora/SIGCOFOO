using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    [Table("GEN.Vocabulario")]
    public class Vocabulario
    {
        public Vocabulario()
        {
            Disponible = true;
        }
        public Vocabulario(string word)
        {
            this.VocabularioId = word;
            this.Disponible = true;
        }
        public Vocabulario(string word, Boolean disponible)
        {
            this.VocabularioId = word;
            this.Disponible = disponible;
        }
        [Key]
        [MaxLength(15)]
        public string VocabularioId { get; set; }
        public Boolean Disponible { get; set; }

    }
}
