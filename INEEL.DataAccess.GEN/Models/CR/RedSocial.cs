using INEEL.DataAccess.CR.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.cat_RedSocial")]
    public class RedSocial
    {
        public int RedSocialID {get;set;}
        public string NombreRedSocial {get;set;}
        public int ContactoID {get;set;}
    }
}
