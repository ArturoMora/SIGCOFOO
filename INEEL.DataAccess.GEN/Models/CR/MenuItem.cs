﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.MenuItem")]
    public class MenuItem
    {
        public int MenuItemId { get; set; }
        [StringLength(50)]
        public string MenuText { get; set; }
        [StringLength(255)]
        public string LinkUrl { get; set; }
        public int? MenuOrder { get; set; }
        public int? ParentMenuItemId { get; set; }
        public virtual MenuItem Parent { get; set; }
        public virtual ICollection<MenuItem> Children { get; set; }
        public int MenuId { get; set; }
        public virtual Menu Menu { get; set; }
    }
}
